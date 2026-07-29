import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Lightbulb, ArrowRight, TrendingUp, Package, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function InsightsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  const products = await prisma.product.findMany({
    where: { userId },
    include: {
      adLinks: {
        include: {
          ad: {
            include: { metrics: true }
          }
        }
      }
    }
  })

  // 1. Calcular Vendas Totais para cada produto
  const productStats = products.map(p => {
    let totalPurchases = 0
    p.adLinks.forEach(link => {
      link.ad.metrics.forEach(m => {
        totalPurchases += m.purchases
      })
    })
    return { ...p, totalPurchases }
  })

  if (productStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed rounded-lg bg-secondary/10">
        <p className="text-muted-foreground">Nenhum dado para analisar. Gere os dados de teste na Visão Geral.</p>
      </div>
    )
  }

  // Lógica Mock de IA:
  // Produto "Campeão": Maior número de vendas.
  // Produto "Estagnado": Maior estoque, mas poucas vendas.
  const championProduct = [...productStats].sort((a, b) => b.totalPurchases - a.totalPurchases)[0]
  const highStockProduct = [...productStats].sort((a, b) => b.stock - a.stock)[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Motor de Insights (IA)</h2>
          <p className="text-muted-foreground text-sm">Oportunidades de lucro descobertas nos seus dados.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/50 shadow-md shadow-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Oportunidade de Upsell (Kit)
            </CardTitle>
            <CardDescription>
              Aproveite o tráfego do seu melhor produto para desovar estoque parado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-secondary/30 p-4 rounded-lg border border-border">
              <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">Alta Conversão</span>
                <p className="font-bold mt-2">{championProduct?.name}</p>
                <p className="text-sm text-muted-foreground">Vendas: {championProduct?.totalPurchases}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-background border border-border text-xs font-bold md:hidden">
                +
              </div>
              <div className="flex-1 text-center md:text-right">
                <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">Alto Estoque</span>
                <p className="font-bold mt-2">{highStockProduct?.name}</p>
                <p className="text-sm text-muted-foreground">Estoque: {highStockProduct?.stock}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-sm">Ação Recomendada:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crie uma oferta na loja vendendo o <strong>{championProduct?.name}</strong> e ofereça o <strong>{highStockProduct?.name}</strong> com 30% de desconto no checkout (Order Bump). Isso aumentará seu Ticket Médio sem aumentar o CPA.
              </p>
            </div>
            <Button className="w-full">
              Criar Campanha Deste Kit
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Dica de Escala
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                O produto <strong>{championProduct?.name}</strong> possui o menor Custo por Compra (CPA) da conta. Recomendamos aumentar o orçamento diário das campanhas dele em 20% a cada 2 dias enquanto o ROAS se mantiver acima de 2.0x.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-yellow-500" />
                Alerta de Capital Congelado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Você possui {highStockProduct?.stock} unidades de <strong>{highStockProduct?.name}</strong>. Considere criar uma campanha de remarketing agressiva ou oferecê-lo como brinde em compras acima de R$ 300,00 para girar o caixa.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
