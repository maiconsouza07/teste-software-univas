import { http, HttpResponse } from 'msw'

// Handler de SUCESSO para /api/tasks
export const successTasks = http.get('*/api/tasks', () => {
  return HttpResponse.json({
    data: [
      {
        id: 't1',
        title: 'Estudar Vitest',
        description: 'Prática de testes',
        status: 'PENDING',
        priority: 'MEDIUM',
        user: { id: 'u1', name: 'Ana' },
        category: { id: 'c1', name: 'Geral' }
      }
    ]
  })
})

// Handler de ERRO para /api/tasks
export const errorTasks = http.get('*/api/tasks', () => {
  return HttpResponse.error()
})
