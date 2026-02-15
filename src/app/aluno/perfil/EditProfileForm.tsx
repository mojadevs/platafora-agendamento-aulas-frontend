"use client";

import { useState, useEffect } from "react";
import { updateAluno } from "@/app/actions/aluno";
import styles from "./perfil.module.css";

interface Municipio {
  id: number;
  nome: string;
}

export default function EditProfileForm({ aluno }: { aluno: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [formData, setFormData] = useState({
    nome: aluno?.nome || "",
    telefone: aluno?.telefone || "",
    estado: aluno?.estado || "",
    municipio: aluno?.municipio || "",
    ativo: aluno?.ativo ?? true
  });

  useEffect(() => {
    if (!formData.estado || !isEditing) {
      setMunicipios([]);
      return;
    }

    setLoadingMunicipios(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios?orderBy=nome`)
      .then((res) => res.json())
      .then((data) => {
        setMunicipios(data);
        setLoadingMunicipios(false);
      })
      .catch(() => setLoadingMunicipios(false));
  }, [formData.estado, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateAluno(aluno.id.toString(), formData);
    if (result.success) {
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    }
  };

  if (!aluno) return null;

  return (
    <div className={styles.cardContent}>
      <header className={styles.header}>
        <div className={styles.avatar}>{aluno.nome?.charAt(0).toUpperCase()}</div>
        <h1 className={styles.title}>{aluno.nome}</h1>
        <p className={styles.emailText}>{aluno.email}</p>
        <span className={styles.roleTag}>ALUNO</span>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.infoGrid}>
          {/* Nome */}
          <div className={styles.infoItem + " " + styles.fullWidth}>
            <span className={styles.label}>Nome Completo</span>
            {isEditing ? (
              <input 
                className={styles.input} 
                value={formData.nome} 
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            ) : (
              <div className={styles.value}>{aluno.nome}</div>
            )}
          </div>

          {/* Telefone */}
          <div className={styles.infoItem}>
            <span className={styles.label}>Telefone</span>
            {isEditing ? (
              <input 
                className={styles.input} 
                value={formData.telefone} 
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              />
            ) : (
              <div className={styles.value}>{aluno.telefone || "Não informado"}</div>
            )}
          </div>

          {/* Estado - SELECT DINÂMICO */}
          <div className={styles.infoItem}>
            <span className={styles.label}>Estado</span>
            {isEditing ? (
              <select 
                className={styles.select} 
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value, municipio: ""})}
              >
                <option value="">Selecione</option>
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
            ) : (
              <div className={styles.value}>{aluno.estado || "Não informado"}</div>
            )}
          </div>

          {/* Município - SELECT DINÂMICO DEPENDENTE */}
          <div className={styles.infoItem + " " + styles.fullWidth}>
            <span className={styles.label}>Município</span>
            {isEditing ? (
              <select 
                className={styles.select}
                value={formData.municipio}
                onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                disabled={!formData.estado || loadingMunicipios}
              >
                <option value="">
                  {loadingMunicipios ? "Carregando..." : "Selecione o município"}
                </option>
                {municipios.map((m) => (
                  <option key={m.id} value={m.nome}>{m.nome}</option>
                ))}
              </select>
            ) : (
              <div className={styles.value}>{formData.municipio || "Não informado"}</div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button type="submit" className={styles.saveButton}>Salvar Alterações</button>
              <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancelar</button>
            </>
          ) : null}
        </div>
      </form>
      {!isEditing && (
        <button 
          type="button" 
          onClick={() => setIsEditing(true)} 
          className={styles.editButton}
        >
          Editar Perfil
        </button>
      )}
    </div>
  );
}