"use client"

import { useState } from "react"
import { createProduct } from "@/app/actions/inventory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Loader2 } from "lucide-react"

export function CreateProductDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    try {
      await createProduct(formData)
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao criar o produto.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Novo Produto
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold">Adicionar Produto</h2>
              <p className="text-sm text-muted-foreground">Cadastre um novo item no seu inventário.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Produto</label>
                <Input name="name" required placeholder="Ex: Anel de Ouro 18k" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU (Código único)</label>
                <Input name="sku" required placeholder="Ex: ANEL-OURO-001" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preço (R$)</label>
                  <Input name="price" type="number" step="0.01" required placeholder="199.90" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custo (R$)</label>
                  <Input name="cost" type="number" step="0.01" placeholder="45.00" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estoque Inicial (Unidades)</label>
                <Input name="stock" type="number" required placeholder="50" min="0" />
              </div>

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Produto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
