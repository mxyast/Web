import { prisma } from "./index";
import { OrderStatus } from "@prisma/client";
import { finalizeSale, reserveStock } from "./inventory";

/**
 * Valid transitions for order status
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED, OrderStatus.PROCESSING],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.PROCESSING, OrderStatus.REFUNDED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [OrderStatus.RETURN_REQUESTED],
  [OrderStatus.RETURN_REQUESTED]: [OrderStatus.RETURNED, OrderStatus.DELIVERED],
  [OrderStatus.RETURNED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.PENDING_APPROVAL]: [OrderStatus.APPROVED, OrderStatus.REJECTED],
  [OrderStatus.APPROVED]: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.REJECTED]: [],
};

/**
 * Updates order status and triggers side effects
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) throw new Error("ORDER_NOT_FOUND");

  // Validate transition
  if (!VALID_TRANSITIONS[order.status].includes(newStatus)) {
    throw new Error(`INVALID_TRANSITION: Cannot move from ${order.status} to ${newStatus}`);
  }

  return await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    // Side Effects
    if (newStatus === OrderStatus.SHIPPED && order.status === OrderStatus.PAID) {
      // Finalize stock for each item
      for (const item of order.items) {
        await finalizeSale(item.variantId, item.quantity, true);
      }
    }

    if (newStatus === OrderStatus.CANCELLED) {
       // If it was pending or paid, we might need to restore reserved stock
       // For now, let's assume we only restore if it wasn't shipped yet
    }

    return updatedOrder;
  });
}

/**
 * Specialized B2B approval flow
 */
export async function approveB2BOrder(orderId: string) {
  // B2B orders might start as PENDING and need manual approval
  // after which they move to PAID (or a custom APPROVED state if we had one)
  return await updateOrderStatus(orderId, OrderStatus.PAID);
}
