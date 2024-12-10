import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../db/templateRepository";

export async function createNewTemplate(
  name: string,
  body: string,
  placeholders?: string
) {
  if (!name || name.trim() === "") {
    throw new Error("O nome do template é obrigatório.");
  }

  if (!body || body.trim() === "") {
    throw new Error("O corpo do template é obrigatório.");
  }

  if (body.length > 2000) {
    throw new Error(
      "O corpo do template é muito longo. Limite de 2000 caracteres."
    );
  }

  if (placeholders !== undefined && placeholders.trim() === "") {
    throw new Error("O campo placeholders não pode ser uma string vazia.");
  }

  return createTemplate(
    name.trim(),
    body.trim(),
    placeholders ? placeholders.trim() : undefined
  );
}

export async function getTemplatesList() {
  const templates = await getAllTemplates();
  return templates;
}

export async function getTemplateDetails(templateId: number) {
  if (!templateId || templateId <= 0) {
    throw new Error("ID do template inválido.");
  }

  const template = await getTemplateById(templateId);
  if (!template) {
    throw new Error(
      `Template com ID ${templateId} não encontrado ou já deletado.`
    );
  }
  return template;
}

export async function modifyTemplate(
  templateId: number,
  data: { name?: string; body?: string; placeholders?: string }
) {
  if (!templateId || templateId <= 0) {
    throw new Error("ID do template inválido para atualização.");
  }

  if (data.body && data.body.length > 2000) {
    throw new Error(
      "O corpo do template é muito longo. Limite de 2000 caracteres."
    );
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new Error("O nome do template não pode ser vazio.");
  }

  if (data.body !== undefined && data.body.trim() === "") {
    throw new Error("O corpo do template não pode ser vazio.");
  }

  if (data.placeholders !== undefined && data.placeholders.trim() === "") {
    throw new Error("O campo placeholders não pode ser vazio.");
  }

  const updated = await updateTemplate(templateId, {
    ...(data.name ? { name: data.name.trim() } : {}),
    ...(data.body ? { body: data.body.trim() } : {}),
    ...(data.placeholders ? { placeholders: data.placeholders.trim() } : {}),
  });

  if (!updated) {
    throw new Error(
      `Não foi possível atualizar o template com ID ${templateId}. Verifique se ele existe e não está deletado.`
    );
  }

  return updated;
}

export async function removeTemplate(templateId: number): Promise<boolean> {
  if (!templateId || templateId <= 0) {
    throw new Error("ID do template inválido para exclusão.");
  }

  const deleted = await deleteTemplate(templateId);
  if (!deleted) {
    throw new Error(`Falha ao deletar o template com ID ${templateId}.`);
  }

  return deleted;
}
