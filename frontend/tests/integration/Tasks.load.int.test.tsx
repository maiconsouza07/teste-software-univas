import { render, screen, waitFor } from '@testing-library/react'
import Tasks from '../../src/components/Tasks' // componente que lista tarefas
import { server, apiGet, json } from '../setup'

describe('Tasks integration - carga de lista', () => {
  it('renderiza tarefas retornadas pela API', async () => {
    server.use(
      apiGet('/tasks', (_req) =>
        json({
          data: [
            {
              id: 't1',
              title: 'Estudar Vitest',
              description: 'Prática',
              status: 'PENDING',
              priority: 'MEDIUM',
              user: { id: 'u1', name: 'Ana' },
              category: { id: 'c1', name: 'Geral' },
              createdAt: new Date().toISOString(),
            },
          ],
        })
      )
    )

    render(<Tasks />)

    await waitFor(() => {
      expect(screen.getByText('Estudar Vitest')).toBeInTheDocument()
      expect(screen.getByText(/Ana/)).toBeInTheDocument()
    })
  })
})
