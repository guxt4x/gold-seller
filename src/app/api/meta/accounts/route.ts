import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { metaToken: true }
    })

    if (!user || !user.metaToken) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 404 })
    }

    // Buscar as contas de anúncios vinculadas ao usuário
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id,account_status&access_token=${user.metaToken}`
    )
    
    const data = await response.json()

    if (data.error) {
      // Se o token for inválido/expirado, limpamos no banco
      if (data.error.code === 190) {
        await prisma.user.update({
          where: { id: userId },
          data: { metaToken: null, metaAccountId: null }
        })
        return NextResponse.json({ error: "Token expirado" }, { status: 401 })
      }
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    return NextResponse.json({ accounts: data.data || [] })
  } catch (error) {
    console.error("Erro ao buscar contas de anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ error: "Account ID é obrigatório" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { metaAccountId: accountId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar conta de anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
