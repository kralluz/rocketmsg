import { getAllContacts } from "@/db/contactRepository";
import { createNewContact } from "@/services/contactService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email } = body;
  if (!name || !phone || !email) {
    console.log("Campos ausentes:", { name, phone, email });
    return NextResponse.json(
      { error: "Nome, telefone e email são obrigatórios" },
      { status: 400 }
    );
  }
  try {
    console.log(body);
    const newContact = await createNewContact(name, phone, email);
    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar contato:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const contacts = await getAllContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contatos" },
      { status: 500 }
    );
  }
}
