// frontend/tests/integration/Users.error.int.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import Users from '../../src/components/Users'
import { server, apiGet } from '../setup'
import { HttpResponse } from 'msw'

describe('Users integration - falhas da API', () => {
  it('mostra mensagem de erro quando a API falha', async () => {
    server.use(apiGet('/users', () => HttpResponse.error()))

    render(<Users />)

    await waitFor(() => {
      // Ajuste o texto abaixo para o que seu componente exibe ao falhar
      expect(screen.getByText(/Erro ao carregar usuários/i)).toBeInTheDocument()
    })
  })
})
