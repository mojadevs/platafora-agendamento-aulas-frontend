"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./home.module.css";

interface Municipio {
  id: number;
  nome: string;
}

const slides = [
  {
    image: "/img-Jdrive-aluno.png",
    title: "Aprenda a dirigir com quem é qualificado",
    description:
      "Encontre instrutores de direção licenciados pelo DETRAN e agende suas aulas com segurança, praticidade e confiança.",
    buttonText: "Saiba mais",
    buttonLink: "#saiba-mais",
  },
  {
    image: "/img-Jdrive-instrutor.jpg",
    title: "Transforme seu conhecimento em renda",
    description:
      "Cadastre-se como instrutor, encontre alunos perto de você e aumente sua renda com liberdade e segurança.",
    buttonText: "Seja um instrutor",
    buttonLink: "/instrutor/cadastro",
  },
];

export default function Home() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [municipioSelecionado, setMunicipioSelecionado] = useState("");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!estadoSelecionado) {
      setMunicipios([]);
      setMunicipioSelecionado("");
      return;
    }

    setLoading(true);
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios?orderBy=nome`
    )
      .then((res) => res.json())
      .then((data) => {
        setMunicipios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [estadoSelecionado]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (estadoSelecionado) params.append("estado", estadoSelecionado);
    if (municipioSelecionado) params.append("municipio", municipioSelecionado);
    
    router.push(`/marketplace?${params.toString()}`);
  };

  if (!mounted) return null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.search}>
          <h2 className={styles.searchTitle}>Encontre um instrutor</h2>

          <select
            value={estadoSelecionado}
            onChange={(e) => setEstadoSelecionado(e.target.value)}
            className={styles.select}
          >
            <option value="">Selecione o estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>

          <select
            value={municipioSelecionado}
            onChange={(e) => setMunicipioSelecionado(e.target.value)}
            disabled={!estadoSelecionado || loading}
            className={styles.select}
          >
            <option value="">
              {loading
                ? "Carregando municípios..."
                : "Selecione o município"}
            </option>

            {municipios.map((m) => (
              <option key={m.id} value={m.nome}>
                {m.nome}
              </option>
            ))}
          </select>

          <button className={styles.button} onClick={handleSearch}>
            Buscar
          </button>
        </div>

        <div className={styles.slider}>
          <div
            className={styles.slides}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className={styles.slide}>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className={styles.image}
                  priority={index === 0}
                />
                <div className={styles.overlay} />
              </div>
            ))}
          </div>

          <div className={styles.content}>
            <h1 className={styles.title}>{slides[current].title}</h1>
            <p className={styles.description}>
              {slides[current].description}
            </p>

            <a href={slides[current].buttonLink} className={styles.buttonSlide}>
              {slides[current].buttonText}
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.divider} />
      
      <div id="saiba-mais" className={styles.saibaMais}>
        <div className={styles.saibaMaisGrid}>
          <div className={styles.saibaCard}>
            <div className={styles.saibaIcon}>🛡️</div>
            <h3>Instrutores verificados</h3>
            <p>
              Todos os instrutores são licenciados e passam por verificação para
              garantir segurança, confiança e qualidade.
            </p>
          </div>

          <div className={styles.saibaCard}>
            <div className={styles.saibaIcon}>📍</div>
            <h3>Encontre perto de você</h3>
            <p>
              Busque instrutores por estado e cidade, facilitando o agendamento
              de aulas na sua região.
            </p>
          </div>

          <div className={styles.saibaCard}>
            <div className={styles.saibaIcon}>⚙️</div>
            <h3>Aulas personalizadas</h3>
            <p>
              Escolha o instrutor ideal pra você! combine horários e tenha aulas alinhadas
              ao seu nível e objetivo.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}