// frontend/tests/setup.ts
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// helper: rotas locais da API (usa wildcard pro host)
export const apiGet = (path: string, resolver: Parameters<typeof http.get>[1]) =>
  http.get(`*/api${path}`, resolver)

// helper: responder JSON
export const json = (body: any, init?: ResponseInit) => HttpResponse.json(body, init)
