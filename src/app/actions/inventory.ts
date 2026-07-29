"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function createProduct(formData: FormData) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Não autorizado")
  }

  const name = formData.get("name") as string
  const sku = formData.get("sku") as string
  const price = parseFloat(formData.get("price") as string)
  const cost = parseFloat(formData.get("cost") as string)
  const stock = parseInt(formData.get("stock") as string, 10)

  if (!name || !sku || isNaN(price) || isNaN(stock)) {
    throw new Error("Campos inválidos")
  }

  // Verifica se o SKU já existe para este usuário
  const existingSku = await prisma.product.findUnique({
    where: { sku }
  })
  
  // Como SKU é único por banco, se existir, não podemos criar
  if (existingSku) {
    throw new Error("Este SKU já está cadastrado.")
  }

  await prisma.product.create({
    data: {
      userId,
      name,
      sku,
      price,
      cost: isNaN(cost) ? null : cost,
      stock,
    }
  })

  revalidatePath("/dashboard/inventory")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateStock(productId: string, newStock: number) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Não autorizado")
  }

  // Verificar se o produto pertence ao usuário
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product || product.userId !== userId) {
    throw new Error("Produto não encontrado ou acesso negado.")
  }

  await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock }
  })

  revalidatePath("/dashboard/inventory")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteProduct(productId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Não autorizado")
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product || product.userId !== userId) {
    throw new Error("Produto não encontrado ou acesso negado.")
  }

  await prisma.product.delete({
    where: { id: productId }
  })

  revalidatePath("/dashboard/inventory")
  revalidatePath("/dashboard")
  return { success: true }
}
