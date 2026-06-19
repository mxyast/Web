"use server";

import { prisma } from "@eticaret/database";
import { Platform, OrderStatus, PaymentMethod } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";

export interface AddressInput {
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  addressLine: string;
  zipCode?: string;
}

export interface CreateB2BOrderInput {
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  discountTier?: string;
  totalAmount: number;
  billingAddressId: string;
  shippingAddressId: string;
  newBillingAddress?: AddressInput;
  newShippingAddress?: AddressInput;
  notes?: string;
  items: {
    variantId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxAmount: number;
  }[];
  payment?: {
    method: PaymentMethod;
    amount: number;
    status: string;
    installments?: number;
  };
}

/**
 * Searches for dealers (users with DEALER role) by name or email
 */
export async function searchDealersAction(query: string) {
  await checkAdminAccess();
  if (!query || query.length < 2) return [];

  return await prisma.user.findMany({
    where: {
      role: "DEALER",
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } }
      ]
    },
    include: {
      b2bProfile: true,
      addresses: true
    },
    take: 10
  });
}

/**
 * Searches B2B products and variants, calculating B2B available stock
 * and returning variant details including prices.
 */
export async function searchB2BProductsAction(query: string) {
  await checkAdminAccess();
  if (!query || query.length < 2) return [];

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isB2B: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { variants: { some: { sku: { contains: query, mode: "insensitive" } } } }
      ]
    },
    include: {
      brand: true,
      category: true,
      variants: {
        where: { isActive: true },
        include: {
          price: true,
          inventory: true
        }
      }
    },
    take: 10
  });

  // Calculate and attach net B2B available stock for each variant using Smart Stock Shield rules
  const formattedProducts = products.map((product) => {
    const formattedVariants = product.variants.map((variant) => {
      let b2bAvailableStock = 0;
      if (variant.inventory) {
        const { totalStock, reservedQty, b2cReserveRatio } = variant.inventory;
        const b2cReserved = Math.ceil(totalStock * (b2cReserveRatio / 100));
        b2bAvailableStock = Math.max(0, totalStock - reservedQty - b2cReserved);
      }

      return {
        ...variant,
        b2bAvailableStock
      };
    });

    return {
      ...product,
      variants: formattedVariants
    };
  });

  return formattedProducts;
}

/**
 * Validates B2B rules and creates a B2B order inside a Prisma Transaction
 */
export async function createB2BOrderAction(data: CreateB2BOrderInput) {
  await checkAdminAccess();
  if (!data.userId || data.items.length === 0) {
    throw new Error("Geçersiz sipariş verileri.");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Resolve or Create addresses
    let billingAddressId = data.billingAddressId;
    if (billingAddressId === "new" && data.newBillingAddress) {
      const newBilling = await tx.address.create({
        data: {
          userId: data.userId,
          type: "BILLING",
          ...data.newBillingAddress
        }
      });
      billingAddressId = newBilling.id;
    }

    let shippingAddressId = data.shippingAddressId;
    if (shippingAddressId === "new" && data.newShippingAddress) {
      const newShipping = await tx.address.create({
        data: {
          userId: data.userId,
          type: "SHIPPING",
          ...data.newShippingAddress
        }
      });
      shippingAddressId = newShipping.id;
    }

    if (!billingAddressId || billingAddressId === "new" || !shippingAddressId || shippingAddressId === "new") {
      throw new Error("Lütfen geçerli bir fatura ve teslimat adresi seçin veya ekleyin.");
    }

    // 2. Validate and Reserve Stock (Smart Stock Shield)
    for (const item of data.items) {
      const inventory = await tx.inventory.findUnique({
        where: { variantId: item.variantId }
      });

      if (!inventory) {
        throw new Error(`Envanter kaydı bulunamadı: ${item.variantId}`);
      }

      const { totalStock, reservedQty, b2cReserveRatio } = inventory;
      const b2cReserved = Math.ceil(totalStock * (b2cReserveRatio / 100));
      const b2bAvailable = totalStock - reservedQty - b2cReserved;

      if (b2bAvailable < item.quantity) {
        throw new Error(
          `Yetersiz B2B stoku. Talep edilen: ${item.quantity}, Korumalı B2B Stoğu: ${b2bAvailable}. B2C rezervasyon oranı: %${b2cReserveRatio}.`
        );
      }

      // Reserve stock
      await tx.inventory.update({
        where: { variantId: item.variantId },
        data: {
          reservedQty: {
            increment: item.quantity
          }
        }
      });
    }

    // 3. Create the Order
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        platform: Platform.TOPTANBOX,
        status: data.status,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount,
        discountTier: data.discountTier || null,
        totalAmount: data.totalAmount,
        billingAddressId,
        shippingAddressId,
        notes: data.notes || null,
        items: {
          create: data.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            taxAmount: item.taxAmount
          }))
        }
      }
    });

    // 4. Create Payment if provided
    if (data.payment) {
      await tx.payment.create({
        data: {
          orderId: order.id,
          method: data.payment.method,
          amount: data.payment.amount,
          status: data.payment.status,
          installments: data.payment.installments || 1
        }
      });

      // B2B-specific Cari Hesap bakiye düşümü (Cari hesap seçilirse bakiyeyi güncelle)
      if (data.payment.method === PaymentMethod.CARI_HESAP) {
        const dealerProfile = await tx.b2BProfile.findUnique({
          where: { userId: data.userId }
        });

        if (dealerProfile) {
          // Verify credit limit or balance bounds if needed
          const currentBalance = Number(dealerProfile.balance);
          const limit = Number(dealerProfile.creditLimit);
          const requiredAmount = Number(data.payment.amount);

          if (currentBalance + limit < requiredAmount) {
            throw new Error(
              `Yetersiz Cari limit. Cari bakiye: ${currentBalance} TL, Kredi Limiti: ${limit} TL. Sipariş tutarı: ${requiredAmount} TL.`
            );
          }

          await tx.b2BProfile.update({
            where: { userId: data.userId },
            data: {
              balance: {
                increment: requiredAmount // Borç olarak bakiye artışı
              }
            }
          });
        }
      }
    }

    // Revalidate order list
    revalidatePath("/orders");
    return { success: true, orderId: order.id };
  });
}

/**
 * Fetches active B2B discount tiers for dynamic client-side calculations
 */
export async function getB2BDiscountTiersAction() {
  await checkAdminAccess();
  return await prisma.cartDiscountTier.findMany({
    where: { platform: Platform.TOPTANBOX, isActive: true },
    orderBy: { minAmount: "asc" }
  });
}

/**
 * Fetches the last 10 orders for a specific dealer (User)
 */
export async function getDealerLastOrdersAction(userId: string) {
  await checkAdminAccess();
  return await prisma.order.findMany({
    where: {
      userId,
      platform: Platform.TOPTANBOX
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10,
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });
}
