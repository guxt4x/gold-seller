import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Package } from "lucide-react"
import { CreateProductDialog } from "@/components/dashboard/inventory/create-product-dialog"
import { InventoryRowActions } from "@/components/dashboard/inventory/inventory-row-actions"

export default async function InventoryPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Gestão de Estoque</h2>
            <p className="text-muted-foreground text-sm">Seus produtos e métricas de velocidade de vendas.</p>
          </div>
        </div>
        <CreateProductDialog />
      </div>

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Produto / SKU</th>
              <th className="px-6 py-4 font-medium">Estoque Atual</th>
              <th className="px-6 py-4 font-medium">Vendas (Mock)</th>
              <th className="px-6 py-4 font-medium">Dias Restantes (Estimativa)</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map(product => {
              // Calcular vendas totais (baseado nas compras do Meta Ads para simplificar no mock)
              let totalSales = 0
              product.adLinks.forEach(link => {
                link.ad.metrics.forEach(m => {
                  totalSales += m.purchases
                })
              })

              // Velocidade de vendas (MOCK: assume que totalSales foram nos últimos 7 dias)
              const dailyVelocity = totalSales > 0 ? totalSales / 7 : 0
              const daysLeft = dailyVelocity > 0 ? Math.floor(product.stock / dailyVelocity) : 999

              let statusText = "Saudável"
              let statusClass = "text-green-500 bg-green-500/10"
              
              if (product.stock === 0) {
                statusText = "Esgotado"
                statusClass = "text-destructive bg-destructive/10"
              } else if (daysLeft < 10) {
                statusText = "Crítico"
                statusClass = "text-red-500 bg-red-500/10"
              } else if (daysLeft < 30) {
                statusText = "Atenção"
                statusClass = "text-yellow-500 bg-yellow-500/10"
              }

              return (
                <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{product.stock} un.</td>
                  <td className="px-6 py-4">{totalSales} un.</td>
                  <td className="px-6 py-4">
                    {daysLeft === 999 ? "N/A" : `${daysLeft} dias`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClass}`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end">
                    <InventoryRowActions 
                      productId={product.id} 
                      currentStock={product.stock} 
                      productName={product.name} 
                    />
                  </td>
                </tr>
              )
            })}
            
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  Nenhum produto cadastrado. Clique no botão "Novo Produto" acima para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
