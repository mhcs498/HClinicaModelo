export interface AttachedImage {
  id: string;
  type: 'TAC' | 'RX' | 'RM' | 'Outro';
  title?: string;
  examDate: string;
  notes: string;
  dataUrl: string; // base64 data url
  fileName: string;
}

export interface ReviewItem {
  checked: boolean;
  observation: string;
}

export interface ClinicalCaseData {
  // Cabeçalho
  institution: string;
  subInstitution: string;
  hospital: string;
  service: string;
  tipoEvento?: string;

  // I – IDENTIFICAÇÃO
  nome: string;
  nid: string;
  sexo: string;
  idade: string;
  raca: string;
  estadoCivil: string;
  naturalidade: string;
  residencia: string;
  profissao: string;
  localTrabalho: string;
  provenienteDe: string;
  emData: string;
  historiaFornecidaPor: string;
  servicoProveniencia: string;

  // II – ANAMNESE
  motivoInternamento: string;
  historiaDoencaActual: string;

  // II.3 – Revisão por Aparelhos e Sistemas
  revisaoSistemas: {
    respiratorio: {
      tosse: ReviewItem;
      expectoracao: ReviewItem;
      dorToracica: ReviewItem;
      dispneia: ReviewItem;
      dpnOrtopneia: ReviewItem;
      palpitacoes: ReviewItem;
      suoresNocturnos: ReviewItem;
      pieira: ReviewItem;
      outros1: ReviewItem;
    };
    sistemaNervoso: {
      convulsoes: ReviewItem;
      sincope: ReviewItem;
      cefaleias: ReviewItem;
      disturbiosVisuais: ReviewItem;
      disturbiosSensibilidade: ReviewItem;
      fraquezaMuscular: ReviewItem;
      outros1: ReviewItem;
      outros2: ReviewItem;
    };
    gastrointestinal: {
      vomitos: ReviewItem;
      hematemeses: ReviewItem;
      obstipacao: ReviewItem;
      pirose: ReviewItem;
      enfartamentoPosPrandial: ReviewItem;
      flatulencia: ReviewItem;
      dorAbdominal: ReviewItem;
      ictericia: ReviewItem;
      outros1: ReviewItem;
      outros2: ReviewItem;
    };
    genitourinario: {
      disuria: ReviewItem;
      polaquiuria: ReviewItem;
      hematuria: ReviewItem;
      incontinenciaUrinaria: ReviewItem;
      corrimentoUretralVaginal: ReviewItem;
      outros1: ReviewItem;
    };
    hemolinfopoetico: {
      anomaliasCoagulacao: ReviewItem;
      anemias: ReviewItem;
      outros1: ReviewItem;
    };
    caracterizacaoSintomas: string;
  };

  // II.4 - II.6
  historiaPregressa: string;
  historiaPessoalSocial: string;
  historiaGinecoObstetrica: string;
  historiaFamiliar: string;

  // III – EXAME OBJECTIVO
  // III.1 – Exame Geral
  estadoGeral: string;
  idadeAparente: string;
  glasgowOcular: string;
  glasgowVerbal: string;
  glasgowMotor: string;
  glasgowTotal: string;
  pele: string;
  mucosas: string;
  edemas: string;
  linfadenopatia: string;
  frequenciaCardiaca: string;
  frequenciaRespiratoria: string;
  pulsoRadial: string;
  tensaoArterial: string;
  temperaturaAxilar: string;
  spO2: string;
  peso: string;
  altura: string;
  imc: string;
  outrosExameGeral: string;

  // III.2 – Cabeça
  cabecaFacies: string;
  cabecaOlhos: string;
  cabecaNariz: string;
  cabecaBoca: string;
  cabecaOrofaringe: string;
  cabecaOuvidos: string;
  cabecaOutros: string;

  // III.3 – Pescoço
  pescocoForma: string;
  pescocoDimensoes: string;
  pescocoMobilidade: string;
  pescocoPosicaoTraqueia: string;
  pescocoPVJ: string;
  pescocoTiroide: string;
  pescocoOutros: string;

  // III.4 – Tórax
  semiologiaRespInspecao: string;
  semiologiaRespPalpacao: string;
  semiologiaRespPercussao: string;
  semiologiaRespAuscultacao: string;

  semiologiaCardInspecao: string;
  semiologiaCardPalpacao: string;
  semiologiaCardPercussao: string;
  semiologiaCardAuscultacao: string;

  mamasAxilasInspecao: string;
  mamasAxilasPalpacao: string;

  // III.5 – Abdómen e Períneo
  abdomenInspecao: string;
  abdomenPalpacao: string;
  abdomenPercussao: string;
  abdomenAuscultacao: string;
  abdomenManobras: string;

  genitaisInspecao: string;
  genitaisPalpacao: string;
  genitaisPercussao: string;
  genitaisAuscultacao: string;
  genitaisUrina: string;

  proctologicoPosicao: string;
  proctologicoInspecao: string;
  proctologicoPalpacao: string;

  ginecologicoPosicao: string;
  ginecologicoInspecao: string;
  ginecologicoPalpacao: string;

  // III.6 – Extremidades
  membrosSupInspecao: string;
  membrosSupPalpacao: string;
  membrosSupAuscultacao: string;
  membrosSupManobras: string;

  membrosInfInspecao: string;
  membrosInfPalpacao: string;
  membrosInfAuscultacao: string;
  membrosInfManobras: string;

  // III.7 – Exame Neurológico
  estadoMental: string;
  linguagem: string;
  par1: string;
  par2: string;
  fundoscopia: string;
  pares3_4_6: string;
  par5: string;
  par7: string;
  par8: string;
  pares9_10: string;
  par11: string;
  par12: string;
  tonusMuscular: string;
  forcaMuscular: string;
  coordenacaoMarcha: string;
  sensibilidade: string;
  reflexos: string;
  sinaisMeningeos: string;

  // IV – RESUMO
  resumo: string;

  // V - DIAGNÓSTICOS SINDRÓMICOS
  diagnosticosSindromicos: string;

  // VI - DIAGNÓSTICOS ETIOLÓGICOS
  diagnosticosEtiologicos: string;

  // VII - DIAGNÓSTICOS TOPOGRÁFICOS
  diagnosticosTopograficos: string;

  // VIII - MEIOS AUXILIARES E COMPLEMENTARES
  meiosAuxiliares: string;
  attachedImages: AttachedImage[];

  // IX - DIAGNÓSTICO DIFERENCIAIS
  diagnosticosDiferenciais: string;

  // X – DIAGNÓSTICO (S) DEFINITIVO (S)
  diagnosticosDefinitivos: string;

  // XI - PROPOSTA TERAPEUTICA/CONDUTA
  propostaTerapeutica: string;

  // XII - PROGNÓSTICO
  prognostico: string;

  // Assinaturas / Fechamento
  elaboradoPor: string;
  mrNc: string;
  corrigidoPor: string;
  comentariosFinais: string;
}
