import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import { UserListClient } from "./UserListClient";

export const revalidate = 0;

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const requests = await prisma.userActionRequest.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const roles = await prisma.roleDefinition.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return (
    <>
      <Header title="Kullanıcı & Rol Yönetimi" />

      <main className="flex-1 overflow-y-auto bg-[var(--color-admin-bg)] p-6 space-y-6">
        <UserListClient initialUsers={users} initialRequests={requests} roles={roles} />
      </main>
    </>
  );
}
