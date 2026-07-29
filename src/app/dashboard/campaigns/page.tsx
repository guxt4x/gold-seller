import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Megaphone, TrendingUp, TrendingDown } from "lucide-react"

export default async function CampaignsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    include: {
      ads: {
        include: { metrics: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Megaphone className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meta Ads</h2>
          <p className="text-muted-foreground text-sm">Performance das suas campanhas em tempo real.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {campaigns.map(campaign => {
          let totalSpend = 0
          let totalRevenue = 0
          let totalPurchases = 0

          campaign.ads.forEach(ad => {
            ad.metrics.forEach(m => {
              totalSpend += Number(m.spend)
              totalRevenue += Number(m.revenue)
              totalPurchases += m.purchases
            })
          })

          const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : "0.00"
          const cpa = totalPurchases > 0 ? (totalSpend / totalPurchases).toFixed(2) : "0.00"
          const isProfitable = Number(roas) >= 2.0 // Exemplo de meta de ROAS

          return (
            <div key={campaign.id} className="border border-border rounded-lg bg-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground line-clamp-1" title={campaign.name}>
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`h-2 w-2 rounded-full ${campaign.status === "ACTIVE" ? "bg-green-500" : "bg-muted-foreground"}`} />
                      <span className="text-xs text-muted-foreground">{campaign.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Orçamento Diário</p>
                    <p className="font-semibold text-sm">R$ {Number(campaign.dailyBudget).toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Gasto</p>
                    <p className="font-medium">R$ {totalSpend.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Faturamento</p>
                    <p className="font-medium text-green-500">R$ {totalRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vendas</p>
                    <p className="font-medium">{totalPurchases}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">CPA (Custo por Compra)</span>
                  <span className="font-bold text-sm">R$ {cpa}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">ROAS</span>
                  <div className={`flex items-center gap-1 font-bold text-lg ${isProfitable ? "text-primary" : "text-yellow-500"}`}>
                    {isProfitable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {roas}x
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {campaigns.length === 0 && (
          <div className="col-span-2 p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
            Nenhuma campanha conectada. Vá até a Visão Geral e clique em "Gerar Dados de Teste".
          </div>
        )}
      </div>
    </div>
  )
}
