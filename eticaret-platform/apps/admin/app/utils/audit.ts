import { prisma } from "@eticaret/database";
import { headers } from "next/headers";
import { auth } from "../../auth";

export async function logAdminAction(
  action: string,
  entity: string | null,
  entityId: string | null,
  description: string
) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || null;
    const userAgent = headersList.get("user-agent") || null;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        description,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
