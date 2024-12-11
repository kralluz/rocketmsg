import prisma from "./index";

export async function createContact(
  name: string,
  telephone: string,
  email: string
) {
  try {
    // Ao criar um novo contato, já incluímos os relacionamentos (phones e emails)
    const newContact = await prisma.contact.create({
      data: {
        name: name,
        phones: {
          create: {
            phone: telephone,
          },
        },
        emails: {
          create: {
            email: email,
          },
        },
      },
      include: {
        phones: true,
        emails: true,
      },
    });

    return newContact;
  } catch (error) {
    throw new Error("repoErro ao criar contato.");
  }
}

export async function getAllContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        phones: true,
        emails: true,
      },
    });
    if (!contacts || contacts.length === 0) {
      throw new Error("Nenhum contato encontrado.");
    }
    return contacts;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar contatos:", error.message);
      throw new Error(`Erro ao buscar contatos: ${error.message}`);
    } else {
      console.error("Erro desconhecido ao buscar contatos:", error);
      throw new Error("Erro desconhecido ao buscar contatos.");
    }
  }
}

export async function getContactById(contactId: number) {
  if (!contactId) {
    throw new Error("ID do contato é obrigatório.");
  }

  const contact = await prisma.contact.findUnique({
    where: { id: contactId, deletedAt: null },
    include: {
      phones: {
        where: { deletedAt: null },
      },
      emails: {
        where: { deletedAt: null },
      },
    },
  });

  if (!contact) {
    throw new Error("Contato não encontrado.");
  }

  return contact;
}

export async function updateContact(
  contactId: number,
  data: {
    name?: string;
    tags?: string;
  }
) {
  if (!contactId) {
    throw new Error("ID do contato é obrigatório.");
  }

  const existingContact = await prisma.contact.findUnique({
    where: { id: contactId, deletedAt: null },
  });

  if (!existingContact) {
    throw new Error("Contato não encontrado ou já deletado.");
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new Error("O nome do contato não pode ser vazio.");
  }

  if (data.tags !== undefined && data.tags.trim() === "") {
    throw new Error("O campo tags não pode ser vazio.");
  }

  return prisma.contact.update({
    where: { id: contactId },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.tags !== undefined ? { tags: data.tags.trim() } : {}),
    },
    include: {
      phones: {
        where: { deletedAt: null },
      },
      emails: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function deleteContact(contactId: number): Promise<boolean> {
  if (!contactId) {
    throw new Error("ID do contato é obrigatório.");
  }

  const existingContact = await prisma.contact.findUnique({
    where: { id: contactId, deletedAt: null },
  });

  if (!existingContact) {
    throw new Error("Contato não encontrado ou já deletado.");
  }

  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  } catch {
    return false;
  }
}
