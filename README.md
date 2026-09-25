# História Clínica & Poster Científico - Neurocirurgia

Aplicação web interativa para elaboração, apresentação e exportação de **Histórias Clínicas Hospitalares de Neurocirurgia** e **Posters Científicos Digitais (E-Posters)** para eventos médicos, congressos e jornadas científicas.

Desenvolvida com alinhamento aos padrões da **Ordem dos Médicos de Moçambique (Colégio de Neurocirurgia)** e adaptada para as **Jornadas Científicas do Hospital Central de Nampula** e demais serviços hospitalares de referência.

---

## 📋 Principais Funcionalidades

### 1. Formulário Hospitalar Completo (9 Páginas Oficiais)
- **Identificação & Dados Sociodemográficos**: Nome, NID, idade, sexo, naturalidade, estado civil, residência, profissão e proveniência.
- **Motivo de Internamento & HDA**: Queixa principal com tempo de evolução e relato cronológico detalhado da história da doença atual.
- **Revisão Sistemática por Aparelhos**: Verificação rápida com caixas de seleção e anotações clínicas (Sistema Nervoso, Aparelho Cardiovascular, Respiratório, Gastrointestinal, Geniturinário e Músculo-Esquelético).
- **Antecedentes Pessoais & Hábitos**: História médica prévia (HTA, Diabetes, Epilepsia, etc.), cirurgias prévias, transfusões, alergias, medicação em uso e hábitos psicossociais (álcool, tabaco, substâncias).
- **Exame Físico Geral**: Avaliação do estado geral, coloração de mucosas, hidratação, sinais vitais completos (Tensão Arterial, Frequência Cardíaca, Frequência Respiratória, Saturação de O₂, Temperatura Axilar).
- **Exame Neurológico Minucioso**:
  - Escala de Coma de Glasgow (GCS) com pontuação detalhada de Abertura Ocular, Resposta Verbal e Motora.
  - Sinais Meníngeos (Rigidez da nuca, Kernig, Brudzinski).
  - Pares Cranianos (I ao XII) e reatividade pupilar.
  - Exame Motor e Força Muscular segundo a escala MRC (0 a 5) nos 4 membros.
  - Sensibilidade superficial e profunda, Reflexos Osteotendinosos (ROT) e reflexo cutâneo-plantar (Babinski).
  - Coordenação, prova dedo-nariz, diadococinesia, marcha e postura.
- **Galeria de Exames Radiológicos (TAC, RX, RMN)**:
  - Anexo de imagens diagnósticas com suporte a descrições técnicas.
  - Ferramentas de análise radiológica integradas: inversão de cores (negativo/positivo), realce de estruturas ósseas, alto contraste e ampliação (zoom).
- **Raciocínio & Diagnóstico Neurocirúrgico**:
  - Diagnóstico Sindrómico
  - Diagnóstico Topográfico / Anatómico
  - Diagnóstico Etiológico
  - Diagnósticos Diferenciais
- **Conduta, Planeamento Cirúrgico & Prognóstico**: Abordagem cirúrgica proposta, tratamento conservador/farmacológico, prognóstico clínico e comentários de orientação/tutoria médica.

---

### 2. Poster Científico Interativo (E-Poster de Congresso)
- **Layout Científico em 3 Colunas**: Distribuição clássica de poster de congresso internacional para máxima legibilidade.
- **Fundo 100% Branco Puro (`bg-white`)**:
  - Otimizado para visualização em projetores, monitores e painéis de congresso.
  - Cabeçalho institucional em fundo branco com tipografia médica azul e ardósia de alto contraste.
  - Faixa comemorativa e distintivo das **Jornadas Científicas do Hospital Central de Nampula**.
- **Apontador Laser Virtual**:
  - Simulador de feixe laser vermelho na ponta do cursor do rato para apontar achados clínicos e radiológicos durante sessões orais.
- **Modo Apresentação em Ecrã Inteiro**:
  - Transforma o poster numa apresentação digital limpa com um clique.
- **Seletor Dinâmico de Temas**:
  - *Fundo 100% Branco* (Padrão e recomendado)
  - *Cabeçalho Azul* (Fundo branco com faixa azul-escura clássica)
  - *Azul Clínico* (Tonalidade hospitalar suave)
  - *Escuro / Dark Navy* (Para auditórios com pouca luminosidade)

---

### 3. Exportação para Microsoft Word (.docx)
- **Exportar Poster em Word (`.docx`)**:
  - Formato **Paisagem (Horizontal)** que reflete a estrutura em 3 colunas do poster físico/digital.
  - Cabeçalho institucional limpo em fundo branco com a identificação do evento e dos autores.
  - Caixas formatadas com bordas elegantes prontas para impressão em grandes formatos (A0/A1) ou envio para comissões científicas.
- **Exportar Formulário Hospitalar Integral (`.docx`)**:
  - Documento oficial de 9 páginas formatado profissionalmente com cabeçalhos, tabelas semiológicas e secções de assinaturas médicas.

---

### 4. Gestão de Dados & Backup
- **Armazenamento Automático Local**: Os dados são guardados localmente no navegador (`localStorage`), evitando perdas acidentais de informação durante o preenchimento.
- **Exportação / Importação em JSON**: Permite guardar cópias de segurança em ficheiro `.json` e transferir casos clínicos completos entre computadores.
- **Caso Clínico Exemplo**: Botão rápido de carregamento com caso exemplo de neurocirurgia completo (incluindo TAC e RX demonstrativos).
- **Impressão / PDF**: Compatibilidade com a ferramenta de impressão nativa e conversão direta para PDF.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Empacotador / Dev Server**: [Vite](https://vite.dev/)
- **Geração de Documentos Word**: [`docx`](https://docx.js.org/) e [`file-saver`](https://github.com/eligrey/FileSaver.js/)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gestor de pacotes `npm` ou `bun`

### Instalação

1. Clone ou descarregue o repositório do projeto:
```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no seu navegador o endereço indicado (normalmente `http://localhost:3000`).

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento na porta 3000 |
| `npm run build` | Compila a aplicação otimizada para produção na pasta `dist/` |
| `npm run preview` | Pré-visualiza localmente a versão compilada |
| `npm run lint` | Executa a validação de tipos TypeScript (`tsc --noEmit`) |
| `npm run clean` | Limpa artefactos compilados anteriores |

---

## 📁 Estrutura de Pastas

```text
├── index.html                  # Ponto de entrada HTML da aplicação
├── metadata.json               # Metadados e título do projeto
├── package.json                # Dependências e scripts do Node.js
├── src/
│   ├── App.tsx                 # Componente principal e orquestrador de estado
│   ├── main.tsx                # Ponto de montagem React
│   ├── index.css               # Estilos globais e importação do Tailwind CSS
│   ├── components/
│   │   ├── ClinicalCaseForm.tsx   # Formulário hospitalar estruturado (9 secções)
│   │   ├── FormFields.tsx         # Componentes reutilizáveis de campos de formulário
│   │   ├── ImageUploader.tsx      # Módulo de anexo e edição de TAC, RX e RMN
│   │   └── InteractivePoster.tsx  # Poster interativo, laser, filtros e ecrã inteiro
│   ├── types/
│   │   └── clinicalCase.ts        # Interfaces e modelos TypeScript do caso clínico
│   └── utils/
│       ├── docxExport.ts          # Gerador dos ficheiros Word (.docx) do formulário e poster
│       ├── initialData.ts         # Caso modelo e gerador de formulário em branco
│       └── sampleImages.ts        # Imagens radiológicas de exemplo (TAC / Raio-X)
└── tsconfig.json               # Configurações do compilador TypeScript
```

---

## 🏥 Filiação Institucional & Créditos

- **Ordem dos Médicos de Moçambique** — Colégio da Especialidade de Neurocirurgia
- **Hospital Central de Nampula** — Serviço de Neurocirurgia (Jornadas Científicas)
- **Hospital Central de Maputo** — Serviço de Neurocirurgia
