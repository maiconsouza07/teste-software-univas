// backend/tests/integration/testDb.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

/**
 * Limpa as tabelas na ordem correta para respeitar FKs.
 */
export async function resetDb() {
  // Apaga filhos primeiro
  await prisma.task.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
}

/**
 * Cria um usuário e uma categoria válidos para usar nos testes de Task.
 * Usa valores únicos para não colidir com constraints (unique).
 */
export async function seedMinimal() {
  const uniq = Date.now()

  const user = await prisma.user.create({
    data: { name: 'Usuário Teste', email: `user_${uniq}@ex.com` }
  })

  const category = await prisma.category.create({
    data: { name: `Geral_${uniq}`, description: 'Categoria para testes' }
  })

  return { user, category }
}
