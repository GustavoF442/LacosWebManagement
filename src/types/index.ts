export interface Usuaria {
  id: string;
  nome: string;
  email: string;
  data_nascimento: string | null;
  fase_da_vida: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Conteudo {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  fase_da_vida: string;
  o_que_e_normal: string;
  sinais_de_alerta: string;
  quando_procurar_ubs: string;
  o_que_fazer_em_casa: string;
  publicado: boolean;
  created_at: string;
  updated_at: string;
}

export interface CicloMenstrual {
  id: string;
  usuaria_id: string;
  data_inicio: string;
  data_fim: string | null;
  duracao: number | null;
  created_at: string;
}

export interface Sintoma {
  id: string;
  usuaria_id: string;
  tipo: string;
  intensidade: number;
  data: string;
  created_at: string;
}

export interface Lembrete {
  id: string;
  usuaria_id: string;
  titulo: string;
  descricao: string;
  data_hora: string;
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
