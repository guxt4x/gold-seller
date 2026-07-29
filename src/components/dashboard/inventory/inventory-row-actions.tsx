"use client"

import { useState } from "react"
import { updateStock, deleteProduct } from "@/app/actions/inventory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, Loader2, X, Check } from "lucide-react"

export function InventoryRowActions({ productId, currentStock, productName }: { productId: string, currentStock: number, productName: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [stockValue, setStockValue] = useState(currentStock.toString())
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    const val = parseInt(stockValue, 10)
    if (isNaN(val) || val < 0) return

    setLoading(true)
    try {
      await updateStock(productId, val)
      setIsEditing(false)
    } catch (err) {
      alert("Erro ao atualizar estoque.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir "${productName}" permanentemente?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteProduct(productId)
    } catch (err) {
      alert("Erro ao excluir produto.")
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input 
          type="number" 
          value={stockValue} 
          onChange={(e) => setStockValue(e.target.value)} 
          className="w-20 h-8 text-sm"
          min="0"
          autoFocus
        />
        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={handleUpdate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => setIsEditing(false)} disabled={loading}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsEditing(true)}>
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
