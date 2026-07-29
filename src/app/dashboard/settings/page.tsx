import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Suspense } from "react"
import { SettingsClient } from "./settings-client"

export default async function SettingsPage() {
  const session = await auth()

  let dbUser = null
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { metaToken: true, metaAccountId: true }
    })
  }

  return (
    <Suspense fallback={<div>Carregando configurações...</div>}>
      <SettingsClient session={session} dbUser={dbUser} />
    </Suspense>
  )
}
