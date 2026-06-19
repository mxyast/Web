import React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { prisma } from "@eticaret/database";
import { ProfileClient } from "./components/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Fetch complete user details from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    }
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32">
        <div className="container mx-auto px-4 max-w-5xl">
           <ProfileClient user={user} />
        </div>
      </main>
    </>
  );
}
