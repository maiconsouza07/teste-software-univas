import { render, screen, waitFor } from '@testing-library/react'
import Tasks from '../../src/components/Tasks'
import { server, apiGet } from '../setup'
import { HttpResponse } from 'msw'

describe('Tasks integration - falhas da API', () => {
  it('mostra mensagem de erro quando a API falha', async () => {
    server.use(apiGet('/tasks', () => HttpResponse.error()))

    render(<Tasks />)

    await waitFor(() => {
      // Ajuste o texto conforme seu componente
      expect(screen.getByText(/Erro ao carregar tarefas/i)).toBeInTheDocument()
    })
  })
})
