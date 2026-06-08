export interface Usuaria {
  id: string;
  nome: string;
  email: string;
  idade: number | null;
  fase_da_vida: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conteudo {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  fase_da_vida: string;
  o_que_e_normal: string;
  sinais_alerta: string;
  quando_procurar_ubs: string;
  o_que_fazer_em_casa: string;
  created_at: string;
}

export interface CicloMenstrual {
  id: string;
  usuario_id: string;
  data_inicio: string;
  data_fim: string | null;
  intensidade: string | null;
  observacoes: string | null;
  created_at: string;
}

export interface Sintoma {
  id: string;
  usuario_id: string;
  tipo: string;
  intensidade: string | null;
  data: string;
  descricao: string | null;
  created_at: string;
}

export interface Lembrete {
  id: string;
  usuario_id: string;
  tipo: string;
  data: string;
  ativo: boolean;
  created_at: string;
}

export interface ConfiguracaoSite {
  id: string;
  chave: string;
  valor: string;
  updated_at: string;
}

export const CATEGORIAS = [
  "Ciclo Menstrual",
  "Gravidez",
  "Saúde Sexual",
  "Saúde Mental",
  "Nutrição",
  "Exercícios",
  "Higiene",
  "Prevenção",
  "Menopausa",
  "Outros",
] as const;

export const FASES_DA_VIDA = [
  "Adolescência",
  "Adulta",
  "Gestante",
  "Pós-parto",
  "Menopausa",
  "Todas",
] as const;
