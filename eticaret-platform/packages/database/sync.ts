import { prisma } from "./index";
import { adjustTotalStock } from "./inventory";

/**
 * Simulates syncing stock from an external ERP or Warehouse Management System
 */
export async function syncInventoryFromExternal() {
  console.log("Starting external inventory sync...");
  
  // Fetch all variants
  const variants = await prisma.variant.findMany({
    select: { id: true, sku: true }
  });

  const results = {
    updated: 0,
    errors: 0
  };

  for (const variant of variants) {
    try {
      // Mock: Randomly decide a new stock level for simulation
      // In reality, this would be an API call: fetch(`https://erp.com/api/stock/${variant.sku}`)
      const mockExternalStock = Math.floor(Math.random() * 1000) + 10;
      
      const inventory = await prisma.inventory.findUnique({
        where: { variantId: variant.id }
      });

      if (inventory) {
        const difference = mockExternalStock - inventory.totalStock;
        if (difference !== 0) {
          await adjustTotalStock(variant.id, difference);
          results.updated++;
        }
      } else {
        // Create inventory record if it doesn't exist
        await prisma.inventory.create({
          data: {
            variantId: variant.id,
            totalStock: mockExternalStock,
            b2cReserveRatio: 20
          }
        });
        results.updated++;
      }
    } catch (error) {
      console.error(`Error syncing SKU ${variant.sku}:`, error);
      results.errors++;
    }
  }

  console.log(`Sync completed. Updated: ${results.updated}, Errors: ${results.errors}`);
  return results;
}
