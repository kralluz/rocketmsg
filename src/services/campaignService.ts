import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../db/campaignRepository";

import { getTemplateById } from "../db/templateRepository";

export async function createNewCampaign(
  name: string,
  templateId: number,
  scheduledAt?: Date
) {
  if (!name || name.trim() === "") {
    throw new Error("O nome da campanha é obrigatório.");
  }

  if (!templateId || templateId <= 0) {
    throw new Error("ID do template inválido.");
  }

  const template = await getTemplateById(templateId);
  if (!template) {
    throw new Error(
      `Template com ID ${templateId} não encontrado ou deletado.`
    );
  }

  if (scheduledAt && isNaN(Date.parse(scheduledAt.toString()))) {
    throw new Error("Data de agendamento inválida.");
  }

  return createCampaign(name.trim(), templateId, scheduledAt);
}

export async function getCampaignsList() {
  const campaigns = await getAllCampaigns();
  return campaigns;
}

export async function getCampaignDetails(campaignId: number) {
  if (!campaignId || campaignId <= 0) {
    throw new Error("ID da campanha inválido.");
  }

  const campaign = await getCampaignById(campaignId);
  if (!campaign) {
    throw new Error(
      `Campanha com ID ${campaignId} não encontrada ou já deletada.`
    );
  }

  return campaign;
}

export async function modifyCampaign(
  campaignId: number,
  data: { name?: string; scheduledAt?: Date; status?: string }
) {
  if (!campaignId || campaignId <= 0) {
    throw new Error("ID da campanha inválido para atualização.");
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new Error("O nome da campanha não pode ser vazio.");
  }

  if (
    data.scheduledAt !== undefined &&
    isNaN(Date.parse(data.scheduledAt.toString()))
  ) {
    throw new Error("Data de agendamento inválida.");
  }

  if (data.status !== undefined && data.status.trim() === "") {
    throw new Error("O status da campanha não pode ser vazio.");
  }

  const updated = await updateCampaign(campaignId, {
    ...(data.name ? { name: data.name.trim() } : {}),
    ...(data.scheduledAt ? { scheduledAt: data.scheduledAt } : {}),
    ...(data.status ? { status: data.status.trim() } : {}),
  });

  if (!updated) {
    throw new Error(
      `Não foi possível atualizar a campanha com ID ${campaignId}. Verifique se ela existe e não está deletada.`
    );
  }

  return updated;
}

export async function removeCampaign(campaignId: number): Promise<boolean> {
  if (!campaignId || campaignId <= 0) {
    throw new Error("ID da campanha inválido para exclusão.");
  }

  const deleted = await deleteCampaign(campaignId);
  if (!deleted) {
    throw new Error(`Falha ao deletar a campanha com ID ${campaignId}.`);
  }

  return deleted;
}
