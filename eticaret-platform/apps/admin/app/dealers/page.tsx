import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import { DealersClient } from "./DealersClient";

export default async function DealersPage() {
  // Veritabanından (PostgreSQL) güncel B2B bayileri çekilir
  const dealers = await prisma.user.findMany({
    where: { role: "DEALER" },
    include: { b2bProfile: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <Header title="Bayi Yönetimi" />
      
      <main className="flex-1 overflow-y-auto p-8">
         {/* İstemci bileşenine güncel veriler aktarılır */}
         <DealersClient initialDealers={dealers} />
      </main>
    </>
  );
}
