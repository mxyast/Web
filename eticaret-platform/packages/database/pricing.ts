import { User, Price, B2BProfile } from "@prisma/client";

/**
 * Returns the correct price for a user based on their role and B2B profile.
 * If user is a dealer, it returns the price from their assigned list (A-D).
 * Otherwise, returns retailPrice.
 */
export function getProductPriceForUser(
  price: Price,
  user: (User & { b2bProfile?: B2BProfile | null }) | null
) {
  if (!user || user.role === "CUSTOMER") {
    return price.retailPrice;
  }

  if (user.role === "DEALER" || user.role === "ADMIN") {
    const list = user.b2bProfile?.priceList || "LIST_A";
    
    switch (list) {
      case "LIST_A": return price.listA;
      case "LIST_B": return price.listB;
      case "LIST_C": return price.listC;
      case "LIST_D": return price.listD;
      default: return price.listA;
    }
  }

  return price.retailPrice;
}

/**
 * Calculates discount based on total amount for ToptanBox
 */
export function calculateBulkDiscount(amount: number, tiers: { minAmount: number, discountPercent: number }[]) {
  const sortedTiers = [...tiers].sort((a, b) => b.minAmount - a.minAmount);
  const applicableTier = sortedTiers.find(t => amount >= t.minAmount);
  
  if (!applicableTier) return 0;
  
  return (amount * applicableTier.discountPercent) / 100;
}
