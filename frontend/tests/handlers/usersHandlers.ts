import { http, HttpResponse } from 'msw'

// Handler de SUCESSO para /api/users
export const successUsers = http.get('*/api/users', () => {
  return HttpResponse.json({
    data: [
      { id: '1', name: 'Ana', email: 'ana@ex.com', tasks: [] },
      { id: '2', name: 'Bruno', email: 'bruno@ex.com', tasks: [] }
    ]
  })
})

// Handler de ERRO para /api/users
export const errorUsers = http.get('*/api/users', () => {
  return HttpResponse.error()
})
