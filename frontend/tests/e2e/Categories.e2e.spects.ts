import { test, expect } from '@playwright/test';

test.describe('Usuários e Categorias', () => {

  // --------------------------- TESTES DE USUÁRIOS ---------------------------

  test('cria usuário e aparece na lista', async ({ page }) => {
    await page.goto('/users');
    const uniqueEmail = `aluno.${Date.now()}@ex.com`;
    
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click();
    await page.getByLabel('Nome:').fill('Aluno E2E');
    await page.getByLabel('Email:').fill(uniqueEmail);
    await page.getByRole('button', { name: /Criar/i }).click();

    // Aguarda recarga da lista e verifica se o email aparece
    await expect(page.getByText(uniqueEmail)).toBeVisible();
  });

  test('atualiza usuário e exibe dados atualizados', async ({ page }) => {
    await page.goto('/users');

    const originalEmail = `aluno.edit.${Date.now()}@ex.com`;
    const updatedEmail = `aluno.edit.${Date.now()}.upd@ex.com`;

    await page.getByRole('button', { name: /Adicionar Usuário/i }).click();
    await page.getByLabel('Nome:').fill('Aluno E2E Edit');
    await page.getByLabel('Email:').fill(originalEmail);
    await page.getByRole('button', { name: /Criar/i }).click();

    // Acha a linha do usuário recém-criado e edita
    const row = page.getByRole('row', { name: originalEmail });
    await row.getByRole('button', { name: /Editar/i }).click();
    await page.getByLabel('Nome:').fill('Aluno E2E Atualizado');
    await page.getByLabel('Email:').fill(updatedEmail);
    await page.getByRole('button', { name: /Salvar/i }).click();

    // Verifica se o email atualizado está visível
    await expect(page.getByText(updatedEmail)).toBeVisible();
    await expect(page.getByText(originalEmail)).not.toBeVisible();
  });

  test('exclui usuário e remove da lista', async ({ page }) => {
    await page.goto('/users');

    const emailToDelete = `aluno.delete.${Date.now()}@ex.com`;

    await page.getByRole('button', { name: /Adicionar Usuário/i }).click();
    await page.getByLabel('Nome:').fill('Aluno E2E Delete');
    await page.getByLabel('Email:').fill(emailToDelete);
    await page.getByRole('button', { name: /Criar/i }).click();

    // Exclui o usuário
    const row = page.getByRole('row', { name: emailToDelete });
    await row.getByRole('button', { name: /Excluir/i }).click();

    // Verifica se o email foi removido
    await expect(page.getByText(emailToDelete)).not.toBeVisible();
  });

  // --------------------------- TESTES DE CATEGORIAS ---------------------------

  test('cria categoria e aparece na lista', async ({ page }) => {
    await page.goto('/categories');
    const uniqueCategory = `Categoria ${Date.now()}`;

    await page.getByRole('button', { name: /Adicionar Categoria/i }).click();
    await page.getByLabel('Nome da Categoria:').fill(uniqueCategory);
    await page.getByRole('button', { name: /Criar/i }).click();

    // Verifica se a categoria foi criada
    await expect(page.getByText(uniqueCategory)).toBeVisible();
  });

  test('atualiza categoria e exibe dados atualizados', async ({ page }) => {
    await page.goto('/categories');

    const originalCategory = `Categoria Original ${Date.now()}`;
    const updatedCategory = `Categoria Atualizada ${Date.now()}`;

    // Cria uma categoria
    await page.getByRole('button', { name: /Adicionar Categoria/i }).click();
    await page.getByLabel('Nome da Categoria:').fill(originalCategory);
    await page.getByRole('button', { name: /Criar/i }).click();

    // Atualiza a categoria
    const row = page.getByRole('row', { name: originalCategory });
    await row.getByRole('button', { name: /Editar/i }).click();
    await page.getByLabel('Nome da Categoria:').fill(updatedCategory);
    await page.getByRole('button', { name: /Salvar/i }).click();

    // Verifica a atualização
    await expect(page.getByText(updatedCategory)).toBeVisible();
    await expect(page.getByText(originalCategory)).not.toBeVisible();
  });

  test('exclui categoria e remove da lista', async ({ page }) => {
    await page.goto('/categories');

    const categoryToDelete = `Categoria Delete ${Date.now()}`;

    // Cria uma categoria
    await page.getByRole('button', { name: /Adicionar Categoria/i }).click();
    await page.getByLabel('Nome da Categoria:').fill(categoryToDelete);
    await page.getByRole('button', { name: /Criar/i }).click();

    // Exclui a categoria
    const row = page.getByRole('row', { name: categoryToDelete });
    await row.getByRole('button', { name: /Excluir/i }).click();

    // Verifica que a categoria não está mais na lista
    await expect(page.getByText(categoryToDelete)).not.toBeVisible();
  });

});
