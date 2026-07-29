import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/dashboard/settings?meta_error=true", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings", request.url))
  }

  const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "1361586715477884"
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET
  // O redirect_uri deve bater exatamente com o configurado no App do Facebook e enviado no request inicial
  const redirectUri = `${request.nextUrl.origin}/api/meta/callback`

  if (!clientSecret) {
    console.error("FACEBOOK_CLIENT_SECRET não configurado.")
    return NextResponse.redirect(new URL("/dashboard/settings?meta_error=missing_secret", request.url))
  }

  try {
    // 1. Trocar o Authorization Code por um Access Token curto
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`
    )
    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error("Erro ao pegar token Meta:", tokenData.error)
      return NextResponse.redirect(new URL("/dashboard/settings?meta_error=true", request.url))
    }

    const shortLivedToken = tokenData.access_token

    // 2. Trocar o token curto por um token longo (Long-Lived Access Token) que dura 60 dias
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedToken}`
    )
    const longLivedData = await longLivedResponse.json()
    const finalToken = longLivedData.access_token || shortLivedToken

    // 3. Salvar o token no banco de dados
    await prisma.user.update({
      where: { id: userId },
      data: { metaToken: finalToken }
    })

    return NextResponse.redirect(new URL("/dashboard/settings?meta_success=true", request.url))
  } catch (error) {
    console.error("Exceção na rota de callback do Meta:", error)
    return NextResponse.redirect(new URL("/dashboard/settings?meta_error=true", request.url))
  }
}
