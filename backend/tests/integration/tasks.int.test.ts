import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb, seedMinimal } from './testDb'

describe('Tasks API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })
  beforeEach(async () => {
    await resetDb()
  })

  it('POST /api/tasks cria tarefa válida (com user e category existentes)', async () => {
    const { user, category } = await seedMinimal()
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Nova tarefa',
        description: 'Teste',
        userId: user.id,
        categoryId: category.id
      })
    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({ title: 'Nova tarefa' })
    expect(res.body.data.user.id).toBe(user.id)
    expect(res.body.data.category.id).toBe(category.id)
  })

  it('GET /api/tasks lista tarefas', async () => {
    const { user, category } = await seedMinimal()
    await prisma.task.create({
      data: { title: 'Tarefa 1', userId: user.id, categoryId: category.id }
    })
    const res = await request(app).get('/api/tasks')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.count).toBeGreaterThan(0)
  })

  it('GET /api/tasks/:id retorna tarefa por id', async () => {
    const { user, category } = await seedMinimal()
    const t = await prisma.task.create({
      data: { title: 'Tarefa única', userId: user.id, categoryId: category.id }
    })
    const res = await request(app).get(`/api/tasks/${t.id}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ id: t.id, title: 'Tarefa única' })
  })

  it('PUT /api/tasks/:id atualiza tarefa', async () => {
    const { user, category } = await seedMinimal()
    const t = await prisma.task.create({
      data: { title: 'Editar', userId: user.id, categoryId: category.id }
    })
    const res = await request(app)
      .put(`/api/tasks/${t.id}`)
      .send({ title: 'Editada', priority: 'HIGH' })
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ id: t.id, title: 'Editada', priority: 'HIGH' })
  })

  it('DELETE /api/tasks/:id remove tarefa', async () => {
    const { user, category } = await seedMinimal()
    const t = await prisma.task.create({
      data: { title: 'Apagar', userId: user.id, categoryId: category.id }
    })
    const res = await request(app).delete(`/api/tasks/${t.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ success: true })
    const count = await prisma.task.count({ where: { id: t.id } })
    expect(count).toBe(0)
  })
})
