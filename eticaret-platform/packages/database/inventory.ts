import { prisma } from "./index";

/**
 * Calculates the available stock for a B2B (wholesale) platform
 * formula: Total_Stock - Reserved_Qty - (Total_Stock * (b2c_reserve_ratio / 100))
 */
export async function getB2BAvailableStock(variantId: string) {
  const inventory = await prisma.inventory.findUnique({
    where: { variantId },
  });

  if (!inventory) return 0;

  const { totalStock, reservedQty, b2cReserveRatio } = inventory;
  
  const b2cReserved = Math.ceil(totalStock * (b2cReserveRatio / 100));
  const available = totalStock - reservedQty - b2cReserved;

  return Math.max(0, available);
}

/**
 * Calculates the available stock for a B2C (retail) platform
 * formula: Reserved_for_B2C - (Any B2C specific orders pending if tracked separately)
 * For simplicity, we assume B2C has its own reserved pool.
 */
export async function getB2CAvailableStock(variantId: string) {
  const inventory = await prisma.inventory.findUnique({
    where: { variantId },
  });

  if (!inventory) return 0;

  const { totalStock, b2cReserveRatio } = inventory;
  const b2cReserved = Math.ceil(totalStock * (b2cReserveRatio / 100));

  // In a more complex system, we would track B2C reserved orders separately
  return Math.max(0, b2cReserved);
}

/**
 * Adjusts total stock (e.g., after new shipment or manual correction)
 */
export async function adjustTotalStock(variantId: string, amount: number) {
  return await prisma.inventory.update({
    where: { variantId },
    data: {
      totalStock: {
        increment: amount,
      },
    },
  });
}

/**
 * Reserves stock for a pending order
 */
export async function reserveStock(variantId: string, quantity: number) {
  // Check if enough stock exists before reserving
  const inventory = await prisma.inventory.findUnique({ where: { variantId } });
  if (!inventory || inventory.totalStock - inventory.reservedQty < quantity) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  return await prisma.inventory.update({
    where: { variantId },
    data: {
      reservedQty: {
        increment: quantity,
      },
    },
  });
}

/**
 * Finalizes a sale (reduces total stock and clears reservation)
 */
export async function finalizeSale(variantId: string, quantity: number, wasReserved: boolean = true) {
  return await prisma.inventory.update({
    where: { variantId },
    data: {
      totalStock: {
        decrement: quantity,
      },
      reservedQty: wasReserved ? {
        decrement: quantity,
      } : undefined,
    },
  });
}

