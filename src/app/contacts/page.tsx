import Link from "next/link";

export default function ContatosPage() {
  return (
    <div>
      <h1>Contatos</h1>
      <p>Aqui teremos a listagem, busca avançada e CRUD de contatos.</p>
      <p>
        <Link href="/">Voltar para Home</Link>
      </p>
    </div>
  );
}
