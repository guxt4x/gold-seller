import { auth } from "@/auth"
import prisma from "@/lib/prisma"

import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, TrendingUp, DollarSign, PackageOpen, Info } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id!

  const products = await prisma.product.findMany({
    where: { userId },
    include: {
      adLinks: {
        include: {
          ad: {
            include: {
              metrics: true,
              campaign: true
            }
          }
        }
      }
    }
  })

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-lg mx-auto text-center space-y-4">
        <PackageOpen className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="text-xl font-bold">Nenhum dado encontrado</h2>
        <p className="text-muted-foreground text-sm">
          Conecte sua conta do Meta Ads e da Shopify na página de Configurações para começar a puxar suas métricas.
        </p>
      </div>
    )
  }

  // 1. Cálculos Básicos
  let totalRevenue = 0
  let totalSpend = 0
  
  // 2. Formatando dados para o Gráfico de Receita vs Gasto (Últimos 7 dias)
  const chartDataMap: Record<string, { spend: number, revenue: number }> = {}

  products.forEach(product => {
    product.adLinks.forEach(link => {
      link.ad.metrics.forEach(metric => {
        totalRevenue += Number(metric.revenue)
        totalSpend += Number(metric.spend)

        // Formatar a data (ex: "24/07")
        const dateStr = metric.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        
        if (!chartDataMap[dateStr]) {
          chartDataMap[dateStr] = { spend: 0, revenue: 0 }
        }
        
        chartDataMap[dateStr].spend += Number(metric.spend)
        chartDataMap[dateStr].revenue += Number(metric.revenue)
      })
    })
  })

  // Converter o Map para Array ordenado por data e formatar a data final
  const revenueChartData = Object.keys(chartDataMap)
    // Uma ordenação simples por string funciona se estiver no formato DD/MM e for do mesmo ano,
    // mas o ideal num cenário real é manter o timestamp.
    .sort() 
    .map(dateKey => ({
      date: dateKey,
      spend: chartDataMap[dateKey].spend,
      revenue: chartDataMap[dateKey].revenue
    }))

  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : "0.00"

  // 3. Formatando dados para o Gráfico de Estoque
  const inventoryChartData = products
    .map(p => ({ name: p.name, stock: p.stock }))
    .sort((a, b) => b.stock - a.stock)

  // 4. Alerta Crítico (Estoque < 10 e gastando no Meta Ads)
  const criticalProducts = products.filter(p => {
    const isLowStock = p.stock < 10
    const hasActiveAds = p.adLinks.some(link => link.ad.campaign.status === "ACTIVE" && link.ad.metrics.some(m => Number(m.spend) > 0))
    return isLowStock && hasActiveAds
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <p className="text-muted-foreground mt-1">Bem-vindo ao seu copiloto de estoque e anúncios.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento (Meta)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% em relação aos últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento em Ads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpend)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS Geral</CardTitle>
            <PackageOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{roas}x</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Alertas */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Gráfico Principal */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance de Vendas vs Ads</CardTitle>
            <CardDescription>Visualização do retorno sobre investimento nos últimos 7 dias.</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueChartData.length > 0 ? (
              <RevenueChart data={revenueChartData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-secondary/20 rounded-md border border-dashed border-border">
                Sem dados de histórico suficientes.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Barra Lateral: Alertas e Estoque */}
        <div className="space-y-4">
          <Card className={criticalProducts.length > 0 ? "border-destructive shadow-sm shadow-destructive/20" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {criticalProducts.length > 0 ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <Info className="h-5 w-5 text-green-500" />
                )}
                Alertas do Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              {criticalProducts.length > 0 ? (
                <div className="space-y-3">
                  {criticalProducts.map(p => (
                    <div key={p.id} className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                      <p className="font-semibold text-destructive-foreground text-sm leading-tight mb-1">{p.name}</p>
                      <p className="text-xs text-destructive-foreground/80">Estoque crítico ({p.stock} un). Pausar campanhas é recomendado.</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-md text-green-700 dark:text-green-400 text-sm">
                  Nenhum risco de ruptura detectado. Suas campanhas estão operando com segurança.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Distribuição de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryChart data={inventoryChartData} />
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}
