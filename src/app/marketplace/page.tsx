import { fetchInstrutores } from "@/app/actions/instrutor";
import { cookies } from "next/headers";
import styles from "./marketplace.module.css";
import AgendarButton from "./AgendarButton"; // Certifique-se de que o nome do arquivo está correto

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; municipio?: string }>;
}) {
  // Busca dados no servidor
  const allInstrutores = await fetchInstrutores();
  const filters = await searchParams;
  const cookieStore = await cookies();
  
  // Pega o ID do aluno logado via cookie
  const alunoId = cookieStore.get("user_id")?.value;

  const instrutores = allInstrutores.filter((i) => {
    const matchEstado = filters.estado ? i.estado === filters.estado : true;
    const matchMunicipio = filters.municipio ? i.municipio === filters.municipio : true;
    return matchEstado && matchMunicipio;
  });

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <div>
            <h1 className={styles.welcomeTitle}>
              {filters.municipio ? `Instrutores em ${filters.municipio}` : "Marketplace de Instrutores"}
            </h1>
            <p className={styles.subtitle}>
              {instrutores.length} profissional(is) encontrado(s)
            </p>
          </div>
        </header>

        <div className={styles.grid}>
          {instrutores.length === 0 ? (
            <p className={styles.cardInfo}>Nenhum instrutor encontrado para esta busca.</p>
          ) : (
            instrutores.map((instrutor) => (
              <div key={instrutor.id} className={styles.card}>
                <h2 className={styles.cardTitle}>{instrutor.nome}</h2>
                
                <div className={styles.cardInfo}>
                  <span>📱</span> {instrutor.telefone || "Não informado"}
                </div>

                <div className={styles.cardInfo}>
                  <span>📍</span> {instrutor.municipio} - {instrutor.estado}
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.priceContainer}>
                    <span className={styles.priceValue}>
                      {formatMoney(instrutor.precoHora || 0)}
                    </span>
                    <span className={styles.priceSuffix}>/h</span>
                  </div>
                  
                  {/* Substituímos o Link pelo seu componente de agendamento */}
                  <AgendarButton 
                    instrutor={instrutor} 
                    alunoId={alunoId} 
                  />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}