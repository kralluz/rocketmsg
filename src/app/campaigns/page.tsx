import Link from "next/link";

export default function CampanhasPage() {
  return (
    <div>
      <h1>Campanhas</h1>
      <p>
        Aqui você poderá criar campanhas, ver o histórico e gerenciar envios.
      </p>
      <p>
        <Link href="/">Voltar para Home</Link>
      </p>
    </div>
  );
}
