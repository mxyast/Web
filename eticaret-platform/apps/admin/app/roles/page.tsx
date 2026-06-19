import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import { RoleManagerClient } from "./RoleManagerClient";

export const revalidate = 0;

export default async function RolesPage() {
  // Verify and seed default roles if not present
  let roles = await prisma.roleDefinition.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (roles.length === 0) {
    await prisma.roleDefinition.createMany({
      data: [
        {
          name: "ADMIN",
          description: "Tam yetkili sistem yöneticisi",
          permissions: ["ACCESS_ADMIN", "MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_USERS", "MANAGE_SETTINGS"],
        },
        {
          name: "CUSTOMER",
          description: "B2C perakende alışveriş müşterisi",
          permissions: [],
        },
        {
          name: "DEALER",
          description: "B2B toptan alım bayisi",
          permissions: [],
        },
      ],
    });

    roles = await prisma.roleDefinition.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  return (
    <>
      <Header title="Rol & Yetki Tanımlama" />

      <main className="flex-1 overflow-y-auto bg-[var(--color-admin-bg)] p-6">
        <RoleManagerClient initialRoles={roles} />
      </main>
    </>
  );
}
