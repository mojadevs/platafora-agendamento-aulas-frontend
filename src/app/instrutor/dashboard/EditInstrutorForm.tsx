"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { updateInstrutor, Instrutor } from "@/app/actions/instrutor";
import styles from "./dashboard.module.css";

interface Municipio {
  id: number;
  nome: string;
}

export default function EditInstrutorForm({ instrutor }: { instrutor: Instrutor }) {
  const router = useRouter(); 
  const [isEditing, setIsEditing] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [formData, setFormData] = useState({
    nome: instrutor.nome || "",
    telefone: instrutor.telefone || "",
    precoHora: instrutor.precoHora || 0,
    estado: instrutor.estado || "",
    municipio: instrutor.municipio || "",
    ativo: instrutor.ativo ?? true
  });

  useEffect(() => {
    setFormData({
      nome: instrutor.nome,
      telefone: instrutor.telefone,
      precoHora: instrutor.precoHora,
      estado: instrutor.estado,
      municipio: instrutor.municipio,
      ativo: instrutor.ativo
    });
  }, [instrutor]);

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
    const payload = { 
      ...formData, 
      precoHora: Number(formData.precoHora) || 0 
    };
    
    const result = await updateInstrutor(instrutor.id, payload);
    
    if (result.success) {
      setIsEditing(false);
      router.refresh();
      alert("Perfil atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar. Verifique os dados.");
    }
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className={styles.cardContent}>
      <header className={styles.header}>
        <div className={styles.avatar}>{instrutor.nome?.charAt(0).toUpperCase()}</div>
        <div className={styles.headerInfo}>
            <h1 className={styles.title}>{instrutor.nome}</h1>
            <p className={styles.emailText}>{instrutor.email}</p>
        </div>
        <span className={styles.roleTag}>INSTRUTOR</span>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.infoGrid}>
        
          <div className={styles.infoItem + " " + styles.fullWidth}>
            <span className={styles.label}>Nome Completo</span>
            {isEditing ? (
              <input 
                className={styles.input} 
                value={formData.nome} 
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            ) : (
              <div className={styles.value}>{instrutor.nome}</div>
            )}
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Telefone</span>
            {isEditing ? (
              <input 
                className={styles.input} 
                value={formData.telefone} 
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              />
            ) : (
              <div className={styles.value}>{instrutor.telefone || "Não informado"}</div>
            )}
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Preço/Hora</span>
            {isEditing ? (
              <input 
                className={styles.input} 
                type="number"
                step="0.01"
                value={formData.precoHora} 
                onChange={(e) => setFormData({...formData, precoHora: Number(e.target.value)})}
              />
            ) : (
              <div className={styles.value}>{formatMoney(instrutor.precoHora || 0)}</div>
            )}
          </div>

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
              <div className={styles.value}>{instrutor.estado || "Não informado"}</div>
            )}
          </div>

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