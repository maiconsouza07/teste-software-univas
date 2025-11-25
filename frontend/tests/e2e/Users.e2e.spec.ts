

import { test, expect } from '@playwright/test'

test.describe('Usuários', () => {

  test('navega para Usuários e lista itens do backend', async ({ page }) => {
    await page.goto('/') // Dashboard
    await page.getByRole('link', { name: 'Usuários' }).click()

    // Título da seção
    await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()

    // Emails semeados (seed do backend)
    await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
    await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
  })

  test('cria usuário e aparece na lista', async ({ page }) => {
    await page.goto('/users')

    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()

    const uniqueEmail = `aluno.${Date.now()}@ex.com`

    await page.getByLabel('Nome:').fill('Aluno E2E')
    await page.getByLabel('Email:').fill(uniqueEmail)

    await page.getByRole('button', { name: /Criar/i }).click()

    // Aguarda recarga da lista
    await expect(page.getByText(uniqueEmail)).toBeVisible()
  })

  test('atualiza usuário existente e exibe dados atualizados', async ({ page }) => {
    await page.goto('/users')

    // Primeiro cria um usuário para garantir que exista um registro editável
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()

    const originalEmail = `aluno.edit.${Date.now()}@ex.com`
    const updatedEmail = `aluno.edit.${Date.now()}.upd@ex.com`

    await page.getByLabel('Nome:').fill('Aluno E2E Edit')
    await page.getByLabel('Email:').fill(originalEmail)
    await page.getByRole('button', { name: /Criar/i }).click()

    await expect(page.getByText(originalEmail)).toBeVisible()

    // Acha a linha do usuário recém-criado
    const row = page.getByRole('row', { name: originalEmail })

    // Clica no botão de editar da linha (ajuste o texto se na sua UI for "Editar Usuário", ícone, etc.)
    await row.getByRole('button', { name: /Editar/i }).click()

    // Atualiza os campos
    await page.getByLabel('Nome:').fill('Aluno E2E Editado')
    await page.getByLabel('Email:').fill(updatedEmail)

    // Salva a edição (ajuste o nome do botão se for "Salvar", "Atualizar", etc.)
    await page.getByRole('button', { name: /Salvar|Atualizar/i }).click()

    // Verifica se o novo email aparece
    await expect(page.getByText(updatedEmail)).toBeVisible()

    // Opcional: garante que o email antigo não aparece mais
    await expect(page.getByText(originalEmail)).not.toBeVisible()
  })

  test('exclui usuário e remove da lista', async ({ page }) => {
    await page.goto('/users')

    // Cria um usuário só para testar a exclusão
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()

    const emailToDelete = `aluno.delete.${Date.now()}@ex.com`

    await page.getByLabel('Nome:').fill('Aluno E2E Delete')
    await page.getByLabel('Email:').fill(emailToDelete)
    await page.getByRole('button', { name: /Criar/i }).click()

    await expect(page.getByText(emailToDelete)).toBeVisible()

    // Localiza a linha desse usuário
    const row = page.getByRole('row', { name: emailToDelete })

    // Clica no botão de excluir da linha
    await row.getByRole('button', { name: /Excluir|Remover|Deletar/i }).click()

    // Se a sua UI abre um modal de confirmação, descomente/ajuste algo assim:
    // await page.getByRole('button', { name: /Confirmar|Sim, excluir/i }).click()

    // Verifica que o email não está mais na lista
    await expect(page.getByText(emailToDelete)).not.toBeVisible()
  })

})
