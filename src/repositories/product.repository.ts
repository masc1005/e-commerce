import { eq } from 'drizzle-orm'
import { db } from '@/config/database/connection'
import { productsTable } from '@/config/database/schemas'
import type {
  CreateProductDTO,
  UpdateProductDTO,
  ProductResponseDTO,
} from '@/types/product/dto'

export class ProductRepository {
  async create(data: CreateProductDTO): Promise<ProductResponseDTO> {
    const [product] = await db
      .insert(productsTable)
      .values({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        stock: data.stock || 0,
      })
      .returning()

    return {
      ...product,
      price: parseFloat(product.price),
    }
  }

  async findById(id: string): Promise<ProductResponseDTO | null> {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))

    if (!product) return null

    return {
      ...product,
      price: parseFloat(product.price),
    }
  }

  async list(): Promise<ProductResponseDTO[]> {
    const products = await db.select().from(productsTable)

    return products.map((product) => ({
      ...product,
      price: parseFloat(product.price),
    }))
  }

  async update(
    id: string,
    data: UpdateProductDTO,
  ): Promise<ProductResponseDTO | null> {
    const updateData: any = { ...data, updatedAt: new Date() }

    if (data.price !== undefined) {
      updateData.price = data.price.toString()
    }

    const [product] = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning()

    if (!product) return null

    return {
      ...product,
      price: parseFloat(product.price),
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning()

    return result.length > 0
  }

  async exists(id: string): Promise<boolean> {
    const [product] = await db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(eq(productsTable.id, id))

    return !!product
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    await db
      .update(productsTable)
      .set({ stock: newStock })
      .where(eq(productsTable.id, id))
  }
}
