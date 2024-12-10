import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../db/contactRepository";

export async function createNewContact(
  name: string,
  telephone: string,
  email: string
) {
  return createContact(name, telephone, email);
}

export async function getContactsList() {
  // Apenas retorna os contatos não deletados
  const contacts = await getAllContacts();
  return contacts;
}

export async function getContactDetails(contactId: number) {
  if (!contactId || contactId <= 0) {
    throw new Error("ID do contato inválido.");
  }

  const contact = await getContactById(contactId);
  if (!contact) {
    throw new Error(
      `Contato com ID ${contactId} não foi encontrado ou já está deletado.`
    );
  }
  return contact;
}

export async function modifyContact(
  contactId: number,
  data: { name?: string; tags?: string }
) {
  if (!contactId || contactId <= 0) {
    throw new Error("ID do contato inválido para atualização.");
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new Error("O nome do contato não pode ser vazio.");
  }

  if (data.tags !== undefined && data.tags.trim() === "") {
    throw new Error("As tags não podem ser uma string vazia.");
  }

  const updated = await updateContact(contactId, {
    ...(data.name ? { name: data.name.trim() } : {}),
    ...(data.tags ? { tags: data.tags.trim() } : {}),
  });

  if (!updated) {
    throw new Error(
      `Não foi possível atualizar o contato com ID ${contactId}. Verifique se ele existe e não está deletado.`
    );
  }

  return updated;
}

export async function removeContact(contactId: number): Promise<boolean> {
  if (!contactId || contactId <= 0) {
    throw new Error("ID do contato inválido para exclusão.");
  }

  const deleted = await deleteContact(contactId);
  if (!deleted) {
    throw new Error(`Falha ao deletar o contato com ID ${contactId}.`);
  }

  return deleted;
}
