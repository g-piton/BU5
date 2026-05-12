import type { CheckpointPhase } from "@prisma/client";

export const CHECKPOINT_PHASE_VALUES = [
  "DAYS_1_15",
  "DAYS_16_30",
  "DAYS_31_45",
  "DAYS_46_60",
  "DAYS_61_75",
  "DAYS_76_90",
] as const satisfies readonly CheckpointPhase[];

export const CHECKPOINT_PHASES = [
  {
    value: "DAYS_1_15",
    label: "Dias 1-15",
    focus: "Adaptação inicial, acessos e clareza de papel.",
    offsetStart: 0,
    offsetEnd: 14,
  },
  {
    value: "DAYS_16_30",
    label: "Dias 16-30",
    focus: "Integração, autonomia e primeiros feedbacks.",
    offsetStart: 15,
    offsetEnd: 29,
  },
  {
    value: "DAYS_31_45",
    label: "Dias 31-45",
    focus: "Performance e previsibilidade de entregas.",
    offsetStart: 30,
    offsetEnd: 44,
  },
  {
    value: "DAYS_46_60",
    label: "Dias 46-60",
    focus: "Evolução técnica, suporte e relacionamento.",
    offsetStart: 45,
    offsetEnd: 59,
  },
  {
    value: "DAYS_61_75",
    label: "Dias 61-75",
    focus: "Consistência, confiança e engajamento.",
    offsetStart: 60,
    offsetEnd: 74,
  },
  {
    value: "DAYS_76_90",
    label: "Dias 76-90",
    focus: "Permanência, maturidade e consolidação do onboarding.",
    offsetStart: 75,
    offsetEnd: 89,
  },
] as const;

export const RATING_OPTIONS = [
  { value: 1, label: "1", description: "Muito ruim" },
  { value: 2, label: "2", description: "Ruim" },
  { value: 3, label: "3", description: "Regular" },
  { value: 4, label: "4", description: "Bom" },
  { value: 5, label: "5", description: "Muito bom" },
] as const;

export const ONBOARDING_DIMENSIONS = [
  {
    name: "Pessoa & Cultura",
    objective: "Entender integração, clareza de expectativas e conforto psicológico.",
    riskAlert: "Isolamento, insegurança e falta de clareza de papel.",
  },
  {
    name: "Expectativas",
    objective: "Identificar desalinhamento de expectativas e risco de baixa entrega.",
    riskAlert: "Baixa confiança e impedimentos recorrentes não tratados.",
  },
  {
    name: "Cliente e Ambiente de Projeto",
    objective: "Antecipar riscos de insatisfação do cliente ou desalinhamento.",
    riskAlert: "Ruído de comunicação e desgaste precoce com o cliente.",
  },
  {
    name: "Suporte e Liderança",
    objective: "Avaliar se o colaborador está assistido adequadamente.",
    riskAlert: "Sensação de abandono e liderança ausente.",
  },
  {
    name: "Engajamento",
    objective: "Medir risco de desligamento ou desengajamento precoce.",
    riskAlert: "Desalinhamento de expectativas e discurso de saída.",
  },
  {
    name: "Infraestrutura",
    objective: "Eliminar rapidamente problemas básicos que geram frustração.",
    riskAlert: "Frustração operacional e queda de produtividade precoce.",
  },
  {
    name: "Aprendizado",
    objective: "Garantir evolução contínua e percepção de crescimento.",
    riskAlert: "Estagnação, falta de treinamento e perda de motivação.",
  },
  {
    name: "Gestor",
    objective: "Consolidar a visão da liderança sobre o onboarding.",
    riskAlert: "Riscos sem dono claro e plano de ação fraco.",
  },
] as const;

export const ONBOARDING_QUESTIONS = [
  {
    code: "pessoa-cultura-papel-projeto",
    dimension: "Pessoa & Cultura",
    prompt:
      "Você sente que entendeu bem o papel esperado de você neste projeto ou cliente?",
  },
  {
    code: "pessoa-cultura-consultoria",
    dimension: "Pessoa & Cultura",
    prompt: "Como avalia sua adaptação à cultura da consultoria?",
  },
  {
    code: "pessoa-cultura-cliente",
    dimension: "Pessoa & Cultura",
    prompt: "Como avalia sua adaptação à cultura do cliente?",
  },
  {
    code: "pessoa-cultura-rede-apoio",
    dimension: "Pessoa & Cultura",
    prompt:
      "Você sabe a quem recorrer quando tem dúvidas técnicas, operacionais ou de priorização?",
  },
  {
    code: "pessoa-cultura-conforto-ajuda",
    dimension: "Pessoa & Cultura",
    prompt: "Quão confortável você se sente para pedir ajuda?",
  },
  {
    code: "expectativas-clareza-atividades",
    dimension: "Expectativas",
    prompt: "As atividades atribuídas estão claras?",
  },
  {
    code: "expectativas-adequacao-tarefas",
    dimension: "Expectativas",
    prompt: "As tarefas estão adequadas ao seu nível e momento no onboarding?",
  },
  {
    code: "expectativas-feedbacks",
    dimension: "Expectativas",
    prompt: "Você recebeu feedbacks claros e acionáveis até agora?",
  },
  {
    code: "expectativas-impedimentos",
    dimension: "Expectativas",
    prompt: "Existe algum impedimento impactando sua entrega?",
  },
  {
    code: "expectativas-confianca-entregas",
    dimension: "Expectativas",
    prompt: "Quão confiante você está na qualidade das suas entregas?",
  },
  {
    code: "cliente-prioridades",
    dimension: "Cliente e Ambiente de Projeto",
    prompt: "Você entende claramente as prioridades e expectativas do cliente?",
  },
  {
    code: "cliente-relacao",
    dimension: "Cliente e Ambiente de Projeto",
    prompt: "Como avalia sua relação com o cliente até o momento?",
  },
  {
    code: "cliente-feedbacks",
    dimension: "Cliente e Ambiente de Projeto",
    prompt: "Os feedbacks do cliente têm sido úteis e construtivos?",
  },
  {
    code: "cliente-conflitos",
    dimension: "Cliente e Ambiente de Projeto",
    prompt: "O ambiente com o cliente está saudável e sem conflitos relevantes?",
  },
  {
    code: "suporte-gestor",
    dimension: "Suporte e Liderança",
    prompt: "Você sente que recebe o suporte necessário do gestor e da consultoria?",
  },
  {
    code: "suporte-frequencia",
    dimension: "Suporte e Liderança",
    prompt: "A frequência de contato com a liderança está adequada?",
  },
  {
    code: "suporte-orientacao",
    dimension: "Suporte e Liderança",
    prompt: "Existe proximidade suficiente para orientar suas decisões?",
  },
  {
    code: "suporte-apoio-geral",
    dimension: "Suporte e Liderança",
    prompt: "Como avalia o apoio recebido até agora?",
  },
  {
    code: "engajamento-satisfacao",
    dimension: "Engajamento",
    prompt: "Como você avalia sua satisfação geral até o momento?",
  },
  {
    code: "engajamento-alinhamento",
    dimension: "Engajamento",
    prompt: "O trabalho está alinhado às suas expectativas iniciais?",
  },
  {
    code: "engajamento-permanencia",
    dimension: "Engajamento",
    prompt: "Você se vê atuando neste projeto ou cliente pelos próximos meses?",
  },
  {
    code: "engajamento-risco-saida",
    dimension: "Engajamento",
    prompt: "Não há ajustes pendentes que possam impactar sua permanência?",
  },
  {
    code: "infra-equipamentos",
    dimension: "Infraestrutura",
    prompt: "Você possui todos os equipamentos necessários?",
  },
  {
    code: "infra-ferramentas",
    dimension: "Infraestrutura",
    prompt: "As ferramentas e acessos estão funcionando corretamente?",
  },
  {
    code: "infra-ambiente",
    dimension: "Infraestrutura",
    prompt:
      "O ambiente de trabalho, remoto ou presencial, permite boa produtividade?",
  },
  {
    code: "infra-problemas-recorrentes",
    dimension: "Infraestrutura",
    prompt: "Os problemas técnicos ou operacionais recorrentes estão controlados?",
  },
  {
    code: "aprendizado-evolucao",
    dimension: "Aprendizado",
    prompt: "Você sente que está aprendendo coisas novas?",
  },
  {
    code: "aprendizado-oportunidades",
    dimension: "Aprendizado",
    prompt: "As oportunidades de desenvolvimento estão claras?",
  },
  {
    code: "aprendizado-habilidades",
    dimension: "Aprendizado",
    prompt: "Você tem espaço para desenvolver as habilidades de que mais precisa agora?",
  },
  {
    code: "aprendizado-capacitacao",
    dimension: "Aprendizado",
    prompt: "As necessidades de treinamento ou capacitação estão bem atendidas?",
  },
  {
    code: "gestor-performance",
    dimension: "Gestor",
    prompt: "Como avalia a performance do colaborador até o momento?",
  },
  {
    code: "gestor-pontos-atencao",
    dimension: "Gestor",
    prompt: "Os principais pontos de atenção estão sob controle?",
  },
  {
    code: "gestor-riscos",
    dimension: "Gestor",
    prompt: "Os riscos de cliente, técnicos ou comportamentais estão mitigados?",
  },
  {
    code: "gestor-acoes-acordadas",
    dimension: "Gestor",
    prompt: "As ações acordadas neste checkpoint estão bem definidas?",
  },
  {
    code: "gestor-responsaveis",
    dimension: "Gestor",
    prompt: "Os responsáveis pelas ações estão claros?",
  },
  {
    code: "gestor-prazo",
    dimension: "Gestor",
    prompt: "O prazo de acompanhamento está adequado?",
  },
].map((question, index) => ({
  ...question,
  sortOrder: index + 1,
}));

export function getPhaseMeta(phase: CheckpointPhase) {
  return CHECKPOINT_PHASES.find((item) => item.value === phase);
}

export function formatPhaseLabel(phase: CheckpointPhase) {
  return getPhaseMeta(phase)?.label ?? phase;
}
