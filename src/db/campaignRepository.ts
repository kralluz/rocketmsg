import prisma from "./index";

export async function createCampaign(
  name: string,
  templateId: number,
  scheduledAt?: Date
) {
  if (!name.trim()) {
    throw new Error("Nome da campanha é obrigatório");
  }
  const templateExists = await prisma.template.findUnique({
    where: { id: templateId },
  });
  if (!templateExists) {
    throw new Error("Template não encontrado");
  }
  if (scheduledAt && isNaN(Date.parse(scheduledAt.toString()))) {
    throw new Error("Data de agendamento inválida");
  }

  return prisma.campaign.create({
    data: {
      name,
      templateId,
      scheduledAt,
    },
  });
}

export async function getAllCampaigns() {
  return prisma.campaign.findMany({
    where: { deletedAt: null },
    include: {
      template: true,
      messages: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function getCampaignById(campaignId: number) {
  return prisma.campaign.findUnique({
    where: { id: campaignId, deletedAt: null },
    include: {
      template: true,
      messages: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function updateCampaign(
  campaignId: number,
  data: {
    name?: string;
    templateId?: number;
    scheduledAt?: Date;
    status?: string;
  }
) {
  if (!campaignId) {
    throw new Error("Id da Campanha não encontrada");
  }

  const existingCampaign = await prisma.campaign.findUnique({
    where: { id: campaignId, deletedAt: null },
  });

  if (!existingCampaign) {
    throw new Error("Campanha não encontrada");
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new Error("Nome da campanha é obrigatório");
  }

  if (data.templateId !== undefined) {
    const templateExists = await prisma.template.findUnique({
      where: { id: data.templateId, deletedAt: null },
    });

    if (!templateExists) {
      throw new Error("Template não encontrado");
    }
  }

  if (
    data.scheduledAt !== undefined &&
    isNaN(Date.parse(data.scheduledAt.toString()))
  ) {
    throw new Error("Data de agendamento inválida");
  }

  if (
    data.status !== undefined &&
    !["ativo", "inativo", "concluída"].includes(data.status)
  ) {
    throw new Error("Status inválido");
  }
  return prisma.campaign.update({
    where: { id: campaignId },
    data,
    include: {
      template: true,
      messages: true,
    },
  });
}

export async function deleteCampaign(campaignId: number): Promise<boolean> {
  try {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { deletedAt: new Date() },
    });
    return true;
  } catch (error: any) {
    return false;
  }
}
