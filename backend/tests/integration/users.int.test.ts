import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Users API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })
  beforeEach(async () => {
    await resetDb()
  })

  it('POST /api/users cria usuário válido', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Ana', email: 'ana@ex.com' })
    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({ name: 'Ana', email: 'ana@ex.com' })
  })

  it('GET /api/users lista usuários', async () => {
    await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.count).toBeGreaterThanOrEqual(1)
  })

  it('PUT /api/users/:id atualiza usuário', async () => {
    const u = await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
    const res = await request(app)
      .put(`/api/users/${u.id}`)
      .send({ name: 'Ana Maria' })
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ id: u.id, name: 'Ana Maria' })
  })

  it('DELETE /api/users/:id remove usuário', async () => {
    const u = await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
    const res = await request(app).delete(`/api/users/${u.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ success: true })
    const count = await prisma.user.count({ where: { id: u.id } })
    expect(count).toBe(0)
  })
})
