import prisma from "./index";

export async function createTemplate(
  name: string,
  body: string,
  placeholders?: string
) {
  if (!name.trim()) {
    throw new Error("Nome do template é obrigatório");
  }

  if (!body.trim()) {
    throw new Error("Corpo do template é obrigatório");
  }

  if (!placeholders) {
    placeholders = "";
  }

  return prisma.template.create({
    data: {
      name,
      body,
      placeholders,
    },
  });
}

export async function getAllTemplates() {
  return prisma.template.findMany({
    where: { deletedAt: null },
    include: {
      campaigns: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function getTemplateById(templateId: number) {
  if (!templateId) {
    throw new Error("Id do template não encontrado");
  }
  return prisma.template.findUnique({
    where: { id: templateId, deletedAt: null },
  });
}

export async function updateTemplate(
  templateId: number,
  data: {
    name?: string;
    body?: string;
    placeholders?: string;
  }
) {
  if (
    !templateId ||
    !(await prisma.template.findUnique({
      where: { id: templateId, deletedAt: null },
    }))
  ) {
    throw new Error(
      !templateId ? "Id do template não encontrado" : "Template não encontrado"
    );
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new Error("Nome do template é obrigatório");
  }
  if (data.body !== undefined && data.body.trim() === "") {
    throw new Error("Corpo do template é obrigatório");
  }
  if (data.placeholders !== undefined && data.placeholders.trim() === "") {
    throw new Error("Placeholders do template é obrigatório");
  }

  return prisma.template.update({
    where: { id: templateId },
    data,
  });
}

export async function deleteTemplate(templateId: number): Promise<boolean> {
  try {
    await prisma.template.update({
      where: { id: templateId },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  } catch (error: any) {
    return false;
  }
}
