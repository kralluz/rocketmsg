"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/useToast";
import withAuth from "@/components/withAuth";
import Link from "next/link";
import { CSSProperties } from "react";

const sendContact = async (contact: any, index: number) => {

  try {
    const response = await fetch("http://localhost:3000/api/contacts", {
      method: "POST",
      body: JSON.stringify(contact),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Erro ao enviar contato ${index + 1}:`, await response.text());
      return false;
    }

    const result = await response.json();
    console.log(`Contato ${index + 1} enviado com sucesso!`, result);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar contato ${index + 1}:`, error);
    return false;
  }
};

function HomePage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: any) => {
      const text = event.target.result;
      const rows = text
        .split("\n")
        .map((row: any) => row.trim())
        .filter((row: any) => row);
      const headers = rows
        .shift()
        .split(";")
        .map((header: any) => header.trim());

      const nomeIndex = headers.indexOf("Nome completo");
      const celularIndex = headers.indexOf("Celular");
      const emailIndex = headers.indexOf("Email");

      const parsedData = rows.map((row: any) => {
        const cols = row.split(";").map((col: any) => col.trim());
        return {
          name: cols[nomeIndex] || "-",
          phone: cols[celularIndex] || "-",
          email: cols[emailIndex] || "-",
        };
      });
      setData(parsedData);
      console.log(`Total de contatos carregados: ${parsedData.length}`);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleUpload = async () => {
    if (data.length === 0) return;
    setIsUploading(true);
    setProgressMessage("Iniciando o envio...");

    for (let i = 0; i < data.length; i++) {
      setProgressMessage(`Enviando contato ${i + 1} de ${data.length}...`);
      setCurrentIndex(i);
      const success = await sendContact(data[i], i);
      if (!success) {
        console.error("Falha no envio de contato. Parando processamento.");
        setProgressMessage(`Falha ao enviar o contato ${i + 1}.`);
        break;
      }
    }

    setProgressMessage("Processo finalizado!");
    setIsUploading(false);
    addToast("success", "Todos os contatos foram enviados!");
  };

  const progressPercentage =
    data.length > 0 ? Math.round(((currentIndex + 1) / data.length) * 100) : 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Rocket Msg</h1>
        <nav style={styles.nav}>
          <button style={styles.navButton}>
            <Link href="#" style={styles.link}>
              Home
            </Link>
          </button>
          <button style={styles.navButton}>
            <Link href="/contacts" style={styles.link}>
              Contatos
            </Link>
          </button>
        </nav>
      </header>
      <main style={styles.main}>
        <h1 style={styles.welcome}>Bem-vindo ao Rocket Msg!</h1>
        <button
          onClick={() => addToast("success", "Login efetuado com sucesso!")}
          style={styles.toastButton}
        >
          Exibir Toast de Sucesso
        </button>

        <div style={styles.uploadSection}>
          <h2 style={styles.sectionTitle}>Upload de CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={styles.fileInput}
          />

          {data.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <button
                onClick={handleUpload}
                style={{
                  ...styles.toastButton,
                  backgroundColor: "#2ecc71",
                }}
                disabled={isUploading}
              >
                {isUploading ? "Enviando..." : "Enviar Dados"}
              </button>
            </div>
          )}

          {isUploading && (
            <div style={styles.progressContainer}>
              <p>{progressMessage}</p>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>
              <p>{progressPercentage}%</p>
            </div>
          )}

          {data.length > 0 && (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Nome Completo</th>
                    <th style={styles.th}>Celular</th>
                    <th style={styles.th}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row: any, index) => {
                    return (
                      <tr
                        key={index}
                        style={
                          index % 2 === 0
                            ? styles.tableRowEven
                            : styles.tableRowOdd
                        }
                      >
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>{row.name}</td>
                        <td style={styles.td}>{row.telephone}</td>
                        <td style={styles.td}>{row.email}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "1rem",
    maxWidth: "1200px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    color: "#333",
  },
  nav: {
    display: "flex",
    gap: "1rem",
  },
  navButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    fontWeight: "500",
  },
  main: {
    paddingTop: "1rem",
  },
  welcome: {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#2c3e50",
  },
  toastButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "block",
    margin: "0.5rem auto 2rem",
    transition: "background-color 0.3s, transform 0.2s",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  uploadSection: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: "1.75rem",
    marginBottom: "1rem",
    color: "#34495e",
    textAlign: "center",
  },
  fileInput: {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    border: "2px dashed #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#fafafa",
    transition: "border-color 0.3s, background-color 0.3s",
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    padding: "1rem",
    backgroundColor: "#f7f9fc",
    borderBottom: "2px solid #e1e5ea",
    textAlign: "left",
    fontWeight: "600",
    color: "#2c3e50",
  },
  td: {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #e1e5ea",
    color: "#34495e",
  },
  tableRowEven: {
    backgroundColor: "#fdfdfd",
  },
  tableRowOdd: {
    backgroundColor: "#f7f9fc",
  },
  progressContainer: {
    marginTop: "1rem",
    textAlign: "center",
  },
  progressBarContainer: {
    width: "100%",
    backgroundColor: "#ccc",
    borderRadius: "8px",
    overflow: "hidden",
    height: "20px",
    margin: "0.5rem 0",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3498db",
    transition: "width 0.3s ease",
  },
};

export default withAuth(HomePage);
