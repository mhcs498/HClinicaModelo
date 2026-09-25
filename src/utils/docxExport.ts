import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  PageOrientation,
  ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';
import { ClinicalCaseData, AttachedImage } from '../types/clinicalCase';

// Helper to convert base64 DataURL to Uint8Array
function dataUriToUint8Array(dataUri: string): Uint8Array {
  const commaIndex = dataUri.indexOf(',');
  const base64 = commaIndex >= 0 ? dataUri.slice(commaIndex + 1) : dataUri;
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to get image dimensions and convert image to PNG for universal Word compatibility
async function processImageForDocx(
  dataUri: string,
  maxWidth: number = 500,
  maxHeight: number = 380
): Promise<{ data: Uint8Array; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.naturalWidth || 400;
      let height = img.naturalHeight || 300;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      // Draw onto canvas to convert cleanly to PNG byte array
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || width;
      canvas.height = img.naturalHeight || height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUri = canvas.toDataURL('image/png');
        const uint8Array = dataUriToUint8Array(pngUri);
        resolve({ data: uint8Array, width, height });
      } else {
        const uint8Array = dataUriToUint8Array(dataUri);
        resolve({ data: uint8Array, width, height });
      }
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = dataUri;
  });
}

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

const subtleBoxBorder = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
};

function sectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        color: '1E293B',
      }),
    ],
  });
}

function fieldLine(label: string, value: string): Paragraph {
  const displayVal = value && value.trim() ? value.trim() : '____________________';
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 20 }),
      new TextRun({ text: displayVal, size: 20, color: value?.trim() ? '0F172A' : '94A3B8' }),
    ],
  });
}

function longTextField(label: string, description: string | null, value: string): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 160, after: 40 },
      children: [new TextRun({ text: label, bold: true, size: 21 })],
    }),
  ];

  if (description) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: `(${description})`, italics: true, size: 18, color: '475569' })],
      })
    );
  }

  const textLines = (value || '').split('\n').filter((l) => l.trim().length > 0);
  if (textLines.length === 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 40, after: 60 },
        children: [new TextRun({ text: '_________________________________________________________________________________', color: 'CBD5E1', size: 20 })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: '_________________________________________________________________________________', color: 'CBD5E1', size: 20 })],
      })
    );
  } else {
    for (const line of textLines) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 30, after: 40 },
          children: [new TextRun({ text: line, size: 20, color: '0F172A' })],
        })
      );
    }
  }

  return paragraphs;
}

export async function exportClinicalCaseToDocx(data: ClinicalCaseData) {
  const imageRunElements: Paragraph[] = [];

  if (data.attachedImages && data.attachedImages.length > 0) {
    for (const [index, img] of data.attachedImages.entries()) {
      try {
        const { data: uint8Array, width, height } = await processImageForDocx(img.dataUrl);

        imageRunElements.push(
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({
                text: `Figura ${index + 1}: ${img.type} - Data: ${img.examDate || 'Não informada'}`,
                bold: true,
                size: 20,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 80 },
            children: [
              new ImageRun({
                type: 'png',
                data: uint8Array,
                transformation: {
                  width,
                  height,
                },
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 20, after: 140 },
            children: [
              new TextRun({ text: 'Comentários do Exame: ', bold: true, size: 19 }),
              new TextRun({ text: img.notes || 'Sem comentários adicionais.', size: 19, italics: true }),
            ],
          })
        );
      } catch (err) {
        console.error('Erro ao processar imagem para DOCX:', err);
      }
    }
  }

  const reviewSistemasRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          borders: subtleBoxBorder,
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({ children: [new TextRun({ text: 'a) RESPIRATÓRIO / CARDIOVASCULAR', bold: true, size: 19 })] }),
            ...Object.entries({
              Tosse: data.revisaoSistemas.respiratorio.tosse,
              Expectoração: data.revisaoSistemas.respiratorio.expectoracao,
              'Dor torácica': data.revisaoSistemas.respiratorio.dorToracica,
              Dispneia: data.revisaoSistemas.respiratorio.dispneia,
              'DPN / Ortopneia': data.revisaoSistemas.respiratorio.dpnOrtopneia,
              Palpitações: data.revisaoSistemas.respiratorio.palpitacoes,
              'Suores nocturnos': data.revisaoSistemas.respiratorio.suoresNocturnos,
              Pieira: data.revisaoSistemas.respiratorio.pieira,
            }).map(([label, item]) =>
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({ text: `[${item.checked ? 'X' : '  '}]  ${label}`, bold: item.checked, size: 18 }),
                  ...(item.observation ? [new TextRun({ text: `: ${item.observation}`, size: 18, color: '1E40AF' })] : []),
                ],
              })
            ),
          ],
        }),
        new TableCell({
          borders: subtleBoxBorder,
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({ children: [new TextRun({ text: 'b) SISTEMA NERVOSO', bold: true, size: 19 })] }),
            ...Object.entries({
              Convulsões: data.revisaoSistemas.sistemaNervoso.convulsoes,
              Síncope: data.revisaoSistemas.sistemaNervoso.sincope,
              Cefaleias: data.revisaoSistemas.sistemaNervoso.cefaleias,
              'Distúrbios visuais': data.revisaoSistemas.sistemaNervoso.disturbiosVisuais,
              'Distúrbios da sensibilidade': data.revisaoSistemas.sistemaNervoso.disturbiosSensibilidade,
              'Fraqueza muscular': data.revisaoSistemas.sistemaNervoso.fraquezaMuscular,
            }).map(([label, item]) =>
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({ text: `[${item.checked ? 'X' : '  '}]  ${label}`, bold: item.checked, size: 18 }),
                  ...(item.observation ? [new TextRun({ text: `: ${item.observation}`, size: 18, color: '1E40AF' })] : []),
                ],
              })
            ),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          borders: subtleBoxBorder,
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({ children: [new TextRun({ text: 'c) GASTROINTESTINAL', bold: true, size: 19 })] }),
            ...Object.entries({
              Vómitos: data.revisaoSistemas.gastrointestinal.vomitos,
              Hematemeses: data.revisaoSistemas.gastrointestinal.hematemeses,
              Obstipação: data.revisaoSistemas.gastrointestinal.obstipacao,
              Pirose: data.revisaoSistemas.gastrointestinal.pirose,
              'Enfartamento pós-prandial': data.revisaoSistemas.gastrointestinal.enfartamentoPosPrandial,
              Flatulência: data.revisaoSistemas.gastrointestinal.flatulencia,
              'Dor abdominal': data.revisaoSistemas.gastrointestinal.dorAbdominal,
              Icterícia: data.revisaoSistemas.gastrointestinal.ictericia,
            }).map(([label, item]) =>
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({ text: `[${item.checked ? 'X' : '  '}]  ${label}`, bold: item.checked, size: 18 }),
                  ...(item.observation ? [new TextRun({ text: `: ${item.observation}`, size: 18, color: '1E40AF' })] : []),
                ],
              })
            ),
          ],
        }),
        new TableCell({
          borders: subtleBoxBorder,
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({ children: [new TextRun({ text: 'd) GENITOURINÁRIO', bold: true, size: 19 })] }),
            ...Object.entries({
              Disúria: data.revisaoSistemas.genitourinario.disuria,
              Polaquiúria: data.revisaoSistemas.genitourinario.polaquiuria,
              Hematúria: data.revisaoSistemas.genitourinario.hematuria,
              'Incontinência urinária': data.revisaoSistemas.genitourinario.incontinenciaUrinaria,
              'Corrimento uretral/vaginal': data.revisaoSistemas.genitourinario.corrimentoUretralVaginal,
            }).map(([label, item]) =>
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({ text: `[${item.checked ? 'X' : '  '}]  ${label}`, bold: item.checked, size: 18 }),
                  ...(item.observation ? [new TextRun({ text: `: ${item.observation}`, size: 18, color: '1E40AF' })] : []),
                ],
              })
            ),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'e) HEMOLINFOPOÉTICO', bold: true, size: 19 })] }),
            ...Object.entries({
              'Anomalias da coagulação': data.revisaoSistemas.hemolinfopoetico.anomaliasCoagulacao,
              Anemias: data.revisaoSistemas.hemolinfopoetico.anemias,
            }).map(([label, item]) =>
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({ text: `[${item.checked ? 'X' : '  '}]  ${label}`, bold: item.checked, size: 18 }),
                  ...(item.observation ? [new TextRun({ text: `: ${item.observation}`, size: 18, color: '1E40AF' })] : []),
                ],
              })
            ),
          ],
        }),
      ],
    }),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1100,
              right: 1100,
            },
          },
        },
        children: [
          // Header Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: noBorders,
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: data.institution, bold: true, size: 18 })] }),
                      new Paragraph({ children: [new TextRun({ text: '_______________________________________', size: 16, color: '64748B' })] }),
                      new Paragraph({ children: [new TextRun({ text: data.subInstitution, bold: true, size: 17 })] }),
                    ],
                  }),
                  new TableCell({
                    borders: noBorders,
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.hospital, bold: true, size: 18 })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '_________________________________', size: 16, color: '64748B' })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.service, bold: true, size: 17 })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: data.tipoEvento ? 60 : 200 },
            children: [
              new TextRun({
                text: 'HISTÓRIA CLÍNICA',
                bold: true,
                size: 32,
                color: '1E40AF',
              }),
            ],
          }),
          ...(data.tipoEvento
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 200 },
                  children: [
                    new TextRun({
                      text: data.tipoEvento.toUpperCase(),
                      bold: true,
                      size: 18,
                      color: 'B45309',
                    }),
                  ],
                }),
              ]
            : []),

          // I - IDENTIFICAÇÃO
          sectionHeading('I – IDENTIFICAÇÃO'),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Nome: ', bold: true, size: 20 }),
              new TextRun({ text: data.nome || '________________________', size: 20 }),
              new TextRun({ text: '    NID: ', bold: true, size: 20 }),
              new TextRun({ text: data.nid || '________________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Sexo: ', bold: true, size: 20 }),
              new TextRun({ text: data.sexo || '__________', size: 20 }),
              new TextRun({ text: '    Idade: ', bold: true, size: 20 }),
              new TextRun({ text: data.idade || '__________', size: 20 }),
              new TextRun({ text: '    Raça: ', bold: true, size: 20 }),
              new TextRun({ text: data.raca || '________________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Estado Civil: ', bold: true, size: 20 }),
              new TextRun({ text: data.estadoCivil || '____________', size: 20 }),
              new TextRun({ text: '    Naturalidade: ', bold: true, size: 20 }),
              new TextRun({ text: data.naturalidade || '________________', size: 20 }),
            ],
          }),
          fieldLine('Residência', data.residencia),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Profissão: ', bold: true, size: 20 }),
              new TextRun({ text: data.profissao || '________________', size: 20 }),
              new TextRun({ text: '    Local de Trabalho: ', bold: true, size: 20 }),
              new TextRun({ text: data.localTrabalho || '________________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Proveniente de: ', bold: true, size: 20 }),
              new TextRun({ text: data.provenienteDe || '________________', size: 20 }),
              new TextRun({ text: '    Em: ', bold: true, size: 20 }),
              new TextRun({ text: data.emData || '________________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'História fornecida por: ', bold: true, size: 20 }),
              new TextRun({ text: data.historiaFornecidaPor || '________________', size: 20 }),
              new TextRun({ text: '    Serviço: ', bold: true, size: 20 }),
              new TextRun({ text: data.servicoProveniencia || '________________', size: 20 }),
            ],
          }),

          // II - ANAMNESE
          sectionHeading('II – ANAMNESE'),
          ...longTextField('II.1 – MOTIVO DE INTERNAMENTO OU QUEIXA(S) PRINCIPAL(AIS)', null, data.motivoInternamento),
          ...longTextField(
            'II.2 – HISTÓRIA DA DOENÇA ACTUAL',
            'caracterizar o início e a evolução dos sintomas e sinais, referir sintomas e sinais negativos importantes para o diagnóstico diferencial, indicar tratamentos feitos e os seus resultados',
            data.historiaDoencaActual
          ),

          sectionHeading('II.3 – REVISÃO POR APARELHOS E SISTEMAS NÃO DIRECTAMENTE RELACIONADOS COM A DOENÇA ACTUAL (assinalar apenas os dados positivos)'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: reviewSistemasRows,
          }),

          ...longTextField('f) CARACTERIZAÇÃO DOS SINTOMAS E SINAIS RELEVANTES E OUTROS NÃO ESPECIFICADOS', null, data.revisaoSistemas.caracterizacaoSintomas),
          ...longTextField('II.4 – HISTÓRIA PREGRESSA', 'doenças anteriores, intervenções cirúrgicas, internamentos anteriores, história medicamentosa, transfusões, alergias, antecedentes de DTS', data.historiaPregressa),
          ...longTextField('II.5 – HISTÓRIA PESSOAL E SOCIAL', 'condições de habitação, saneamento, abastecimento de água, hábitos alimentares, alcoólicos e tabágicos, profissões e viagens anteriores', data.historiaPessoalSocial),
          ...longTextField('II.6 – HISTÓRIA GINECO-OBSTÉTRICA', 'se mulher, menarca, menopausa, última menstruação, fórmulas menstrual e gestacional, alterações da menstruação, metrorragias, anticonceptivos, idades do 1º e último partos, cesarianas', data.historiaGinecoObstetrica),
          ...longTextField('II.6 – HISTÓRIA FAMILIAR', 'saúde dos parentes próximos, causas de morte dos parentes próximos, doenças de tendência familiar', data.historiaFamiliar),

          // III - EXAME OBJECTIVO
          sectionHeading('III – EXAME OBJECTIVO'),
          sectionHeading('III.1 – EXAME GERAL'),
          fieldLine('Estado geral (impressão geral)', data.estadoGeral),
          fieldLine('Idade aparente', data.idadeAparente),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Estado de consciência: ', bold: true, size: 20 }),
              new TextRun({ text: `O: ${data.glasgowOcular || '___'}  V: ${data.glasgowVerbal || '___'}  M: ${data.glasgowMotor || '___'}    ECG (Total): ${data.glasgowTotal || '___'}`, size: 20 }),
            ],
          }),
          fieldLine('Pele', data.pele),
          fieldLine('Mucosas', data.mucosas),
          fieldLine('Edemas', data.edemas),
          fieldLine('Linfadenopatia', data.linfadenopatia),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Frequência cardíaca: ', bold: true, size: 20 }),
              new TextRun({ text: data.frequenciaCardiaca || '__________', size: 20 }),
              new TextRun({ text: '    Freqência respiratória: ', bold: true, size: 20 }),
              new TextRun({ text: data.frequenciaRespiratoria || '__________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Pulso radial: ', bold: true, size: 20 }),
              new TextRun({ text: data.pulsoRadial || '__________', size: 20 }),
              new TextRun({ text: '    Tensão arterial: ', bold: true, size: 20 }),
              new TextRun({ text: data.tensaoArterial || '__________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Temperatura axilar: ', bold: true, size: 20 }),
              new TextRun({ text: data.temperaturaAxilar || '__________', size: 20 }),
              new TextRun({ text: '    SpO2: ', bold: true, size: 20 }),
              new TextRun({ text: data.spO2 || '__________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Peso: ', bold: true, size: 20 }),
              new TextRun({ text: data.peso || '_______', size: 20 }),
              new TextRun({ text: '  Altura: ', bold: true, size: 20 }),
              new TextRun({ text: data.altura || '_______', size: 20 }),
              new TextRun({ text: '  Índice de massa corporal (Ped: relação P/E,P/I): ', bold: true, size: 20 }),
              new TextRun({ text: data.imc || '_______', size: 20 }),
            ],
          }),
          fieldLine('Outros', data.outrosExameGeral),

          sectionHeading('III.2 – CABEÇA'),
          fieldLine('Fácies', data.cabecaFacies),
          fieldLine('Olhos', data.cabecaOlhos),
          fieldLine('Nariz', data.cabecaNariz),
          fieldLine('Boca', data.cabecaBoca),
          fieldLine('Orofaringe', data.cabecaOrofaringe),
          fieldLine('Ouvidos', data.cabecaOuvidos),
          fieldLine('Outros (incluindo PC)', data.cabecaOutros),

          sectionHeading('III.3 – PESCOÇO'),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Forma: ', bold: true, size: 20 }),
              new TextRun({ text: data.pescocoForma || '__________', size: 20 }),
              new TextRun({ text: '    Dimensões: ', bold: true, size: 20 }),
              new TextRun({ text: data.pescocoDimensoes || '__________', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Mobilidade: ', bold: true, size: 20 }),
              new TextRun({ text: data.pescocoMobilidade || '__________', size: 20 }),
              new TextRun({ text: '    Posição da traqueia: ', bold: true, size: 20 }),
              new TextRun({ text: data.pescocoPosicaoTraqueia || '__________', size: 20 }),
            ],
          }),
          fieldLine('Pressão venosa jugular (PVJ)', data.pescocoPVJ),
          fieldLine('Tiróide', data.pescocoTiroide),
          fieldLine('Outros', data.pescocoOutros),

          sectionHeading('III.4 – TÓRAX'),
          new Paragraph({ children: [new TextRun({ text: 'a) SEMIOLOGIA RESPIRATÓRIA', bold: true, size: 20 })] }),
          fieldLine('Inspecção', data.semiologiaRespInspecao),
          fieldLine('Palpação', data.semiologiaRespPalpacao),
          fieldLine('Percurssão', data.semiologiaRespPercussao),
          fieldLine('Auscultação', data.semiologiaRespAuscultacao),

          new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: 'b) SEMIOLOGIA CARDÍACA', bold: true, size: 20 })] }),
          fieldLine('Inspecção', data.semiologiaCardInspecao),
          fieldLine('Palpação', data.semiologiaCardPalpacao),
          fieldLine('Percurssão', data.semiologiaCardPercussao),
          fieldLine('Auscultação', data.semiologiaCardAuscultacao),

          new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: 'c) MAMAS e AXILAS', bold: true, size: 20 })] }),
          fieldLine('Inspecção', data.mamasAxilasInspecao),
          fieldLine('Palpação', data.mamasAxilasPalpacao),

          sectionHeading('III.5 – ABDÓMEN e PERÍNEO'),
          new Paragraph({ children: [new TextRun({ text: 'a) ABDÓMEN', bold: true, size: 20 })] }),
          fieldLine('Inspecção', data.abdomenInspecao),
          fieldLine('Palpação', data.abdomenPalpacao),
          fieldLine('Percurssão', data.abdomenPercussao),
          fieldLine('Auscultação', data.abdomenAuscultacao),
          fieldLine('Manobras especiais', data.abdomenManobras),

          new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: 'b) GENITAIS EXTERNOS', bold: true, size: 20 })] }),
          fieldLine('Inspecção', data.genitaisInspecao),
          fieldLine('Palpação', data.genitaisPalpacao),
          fieldLine('Percurssão', data.genitaisPercussao),
          fieldLine('Auscultação', data.genitaisAuscultacao),
          fieldLine('Urina (cor, turvação)', data.genitaisUrina),

          new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: 'd) EXAME PROCTOLÓGICO', bold: true, size: 20 })] }),
          fieldLine('Posição', data.proctologicoPosicao),
          fieldLine('Inspecção', data.proctologicoInspecao),
          fieldLine('Palpação (toque rectal)', data.proctologicoPalpacao),

          new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: 'e) EXAME GINECOLÓGICO', bold: true, size: 20 })] }),
          fieldLine('Posição', data.ginecologicoPosicao),
          fieldLine('Inspecção', data.ginecologicoInspecao),
          fieldLine('Palpação, bimanual (toque vaginal)', data.ginecologicoPalpacao),

          sectionHeading('III.6 – EXTREMIDADES'),
          new Paragraph({ children: [new TextRun({ text: 'a) MEMBROS SUPERIORES', bold: true, size: 20 })] }),
          fieldLine('Inspecção', data.membrosSupInspecao),
          fieldLine('Palpação', data.membrosSupPalpacao),
          fieldLine('Auscultação', data.membrosSupAuscultacao),
          fieldLine('Manobras especiais', data.membrosSupManobras),

          new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: 'b) MEMBROS INFERIORES', bold: true, size: 20 })] }),
          fieldLine('Inspecção', data.membrosInfInspecao),
          fieldLine('Palpação', data.membrosInfPalpacao),
          fieldLine('Auscultação', data.membrosInfAuscultacao),
          fieldLine('Manobras especiais', data.membrosInfManobras),

          sectionHeading('III.7 – EXAME NEUROLÓGICO'),
          fieldLine('Estado mental', data.estadoMental),
          fieldLine('Linguagem', data.linguagem),
          new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: 'Nervos cranianos:', bold: true, size: 20 })] }),
          fieldLine('a) 1º par', data.par1),
          fieldLine('b) 2º par', data.par2),
          fieldLine('Fundoscopia', data.fundoscopia),
          fieldLine('c) 3º, 4º e 6º pares', data.pares3_4_6),
          fieldLine('d) 5º par', data.par5),
          fieldLine('e) 7º par', data.par7),
          fieldLine('f) 8º par', data.par8),
          fieldLine('g) 9º e 10º pares', data.pares9_10),
          fieldLine('h) 11º par', data.par11),
          fieldLine('i) 12º par', data.par12),
          fieldLine('Tónus muscular', data.tonusMuscular),
          fieldLine('Força muscular', data.forcaMuscular),
          fieldLine('Coordenação motora e marcha', data.coordenacaoMarcha),
          fieldLine('Sensibilidade', data.sensibilidade),
          fieldLine('Reflexos', data.reflexos),
          fieldLine('Sinais meníngeos', data.sinaisMeningeos),

          // IV - RESUMO
          sectionHeading('IV – RESUMO (dados importantes da anamnese e do exame físico)'),
          ...longTextField('Resumo Clínico', null, data.resumo),

          // V - DIAGNÓSTICOS SINDRÓMICOS
          sectionHeading('V- DIAGNÓSTICOS SINDRÓMICOS (por ordem de importância)'),
          ...longTextField('Diagnósticos Sindrómicos', null, data.diagnosticosSindromicos),

          // VI - DIAGNÓSTICOS ETIOLÓGICOS
          sectionHeading('VI - DIAGNÓSTICOS ETIOLÓGICOS (por ordem de importância)'),
          ...longTextField('Diagnósticos Etiológicos', null, data.diagnosticosEtiologicos),

          // VII - DIAGNÓSTICOS TOPOGRÁFICOS
          sectionHeading('VII - DIAGNÓSTICOS TOPOGRÁFICOS'),
          ...longTextField('Diagnósticos Topográficos', null, data.diagnosticosTopograficos),

          // VIII - MEIOS AUXILIARES
          sectionHeading('VIII - MEIOS AUXILIARES E COMPLEMENTARES DE DIAGNÓSTICOS (por ordem de prioridade, justificar o motivo do pedido)'),
          ...longTextField('Exames Solicitados e Justificação', null, data.meiosAuxiliares),

          // Attached Images (TAC, RX, etc.)
          ...(imageRunElements.length > 0
            ? [
                new Paragraph({
                  spacing: { before: 200, after: 100 },
                  children: [
                    new TextRun({
                      text: 'ANEXO: IMAGENS DE EXAMES COMPLEMENTARES (TAC / RX)',
                      bold: true,
                      size: 22,
                      color: '1E3A8A',
                    }),
                  ],
                }),
                ...imageRunElements,
              ]
            : []),

          // IX - DIAGNÓSTICO DIFERENCIAIS
          sectionHeading('IX - DIAGNÓSTICO DIFERENCIAIS (5) E DISCUSSÃO DO DIAGNÓSTICO (justificar)'),
          ...longTextField('Diferenciais e Discussão', null, data.diagnosticosDiferenciais),

          // X - DIAGNÓSTICO DEFINITIVO
          sectionHeading('X – DIAGNÓSTICO (S) DEFINITIVO (S)'),
          ...longTextField('Diagnóstico Definitivo', null, data.diagnosticosDefinitivos),

          // XI - PROPOSTA TERAPEUTICA
          sectionHeading('XI - PROPOSTA TERAPEUTICA/CONDUTA (justificar)'),
          ...longTextField('Conduta e Terapêutica', null, data.propostaTerapeutica),

          // XII - PROGNÓSTICO
          sectionHeading('XII - PROGNÓSTICO (de vida, sequelas,...)'),
          ...longTextField('Prognóstico', null, data.prognostico),

          // Sign-off
          new Paragraph({ spacing: { before: 240, after: 60 }, children: [] }),
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({ text: 'ELABORADO POR: Dr (a). ', bold: true, size: 20 }),
              new TextRun({ text: data.elaboradoPor || '.......................................................................................................', size: 20 }),
              new TextRun({ text: ' , MR /NC: ', bold: true, size: 20 }),
              new TextRun({ text: data.mrNc || '....................', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'CORRIGIDO POR: ', bold: true, size: 20 }),
              new TextRun({ text: data.corrigidoPor || '........................................................................................................', size: 20 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'COMENTÁRIOS: ', bold: true, size: 20 }),
              new TextRun({ text: data.comentariosFinais || '........................................................................................................', size: 20 }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const patientCleanName = (data.nome || 'Caso_Clinico').replace(/[^a-zA-Z0-9_-]/g, '_');
  saveAs(blob, `Historia_Clinica_${patientCleanName}.docx`);
}

/**
 * Exports the Interactive Clinical Poster in Word format (.docx)
 * Formatted with Landscape presentation, 3-column scientific layout,
 * image figures with diagnostic notes, Glasgow ECG tables, and neurosurgical plan.
 */
export async function exportPosterToDocx(data: ClinicalCaseData) {
  const patientCleanName = (data.nome || 'Caso_Clinico').replace(/[^a-zA-Z0-9_-]/g, '_');

  // Process radiology images specifically sized for the poster central column
  const processedImages: { img: AttachedImage; uint8Array: Uint8Array; width: number; height: number }[] = [];
  if (data.attachedImages && data.attachedImages.length > 0) {
    for (const img of data.attachedImages) {
      try {
        const { data: uint8Array, width, height } = await processImageForDocx(img.dataUrl, 320, 240);
        processedImages.push({ img, uint8Array, width, height });
      } catch (err) {
        console.error('Erro ao preparar imagem do poster para Word:', err);
      }
    }
  }

  // Helper for small card container in poster
  function makePosterCard(
    title: string,
    titleColor: string,
    bgColor: string,
    borderColor: string,
    items: Paragraph[]
  ): Table {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
                left: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
                right: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
              },
              shading: { fill: bgColor, type: ShadingType.CLEAR, color: 'auto' },
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 50 },
                  children: [
                    new TextRun({
                      text: title.toUpperCase(),
                      bold: true,
                      size: 19,
                      color: titleColor,
                    }),
                  ],
                }),
                ...items,
              ],
            }),
          ],
        }),
      ],
    });
  }

  function cardSpacer(): Paragraph {
    return new Paragraph({ spacing: { before: 80, after: 80 }, children: [] });
  }

  // --- COLUMN 1: DADOS, MOTIVO, HDA, ANTECEDENTES ---
  const col1Children: (Table | Paragraph)[] = [
    // 1. Dados Sociodemográficos
    makePosterCard('1. Dados Sociodemográficos', '1E3A8A', 'FFFFFF', 'CBD5E1', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Naturalidade: ', bold: true, size: 17 }),
          new TextRun({ text: data.naturalidade || '---', size: 17 }),
          new TextRun({ text: '    Estado Civil: ', bold: true, size: 17 }),
          new TextRun({ text: data.estadoCivil || '---', size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Residência: ', bold: true, size: 17 }),
          new TextRun({ text: data.residencia || '---', size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Profissão: ', bold: true, size: 17 }),
          new TextRun({ text: `${data.profissao || '---'} (${data.localTrabalho || '---'})`, size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Proveniência: ', bold: true, size: 17 }),
          new TextRun({ text: `${data.provenienteDe || '---'} em ${data.emData || '---'}`, size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'História fornecida por: ', bold: true, size: 17 }),
          new TextRun({ text: data.historiaFornecidaPor || '---', size: 17 }),
        ],
      }),
    ]),
    cardSpacer(),

    // 2. Motivo de Admissão & HDA
    makePosterCard('2. Motivo de Admissão & HDA', 'B45309', 'FFFFFF', 'CBD5E1', [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: 'QUEIXA PRINCIPAL / MOTIVO: ', bold: true, size: 17, color: 'B45309' }),
          new TextRun({ text: data.motivoInternamento || '---', bold: true, size: 17, color: '0F172A' }),
        ],
      }),
      new Paragraph({
        spacing: { before: 60, after: 30 },
        children: [new TextRun({ text: 'HISTÓRIA DA DOENÇA ACTUAL (HDA):', bold: true, size: 17, color: '1E293B' })],
      }),
      ...((data.historiaDoencaActual || '---').split('\n').filter((l) => l.trim().length > 0).map((line) =>
        new Paragraph({
          spacing: { before: 20, after: 30 },
          children: [new TextRun({ text: line, size: 17, color: '334155' })],
        })
      )),
      new Paragraph({
        spacing: { before: 60, after: 30 },
        children: [new TextRun({ text: 'SINAIS E SINTOMAS POSITIVOS NA REVISÃO DE SISTEMAS:', bold: true, size: 17, color: '1E3A8A' })],
      }),
      ...(data.revisaoSistemas.sistemaNervoso.cefaleias.checked
        ? [new Paragraph({ spacing: { before: 10, after: 10 }, children: [new TextRun({ text: '• Cefaleias: ', bold: true, size: 16 }), new TextRun({ text: data.revisaoSistemas.sistemaNervoso.cefaleias.observation || 'Presentes', size: 16 })] })]
        : []),
      ...(data.revisaoSistemas.gastrointestinal.vomitos.checked
        ? [new Paragraph({ spacing: { before: 10, after: 10 }, children: [new TextRun({ text: '• Vómitos: ', bold: true, size: 16 }), new TextRun({ text: data.revisaoSistemas.gastrointestinal.vomitos.observation || 'Em jato', size: 16 })] })]
        : []),
      ...(data.revisaoSistemas.sistemaNervoso.fraquezaMuscular.checked
        ? [new Paragraph({ spacing: { before: 10, after: 10 }, children: [new TextRun({ text: '• Fraqueza Muscular: ', bold: true, size: 16 }), new TextRun({ text: data.revisaoSistemas.sistemaNervoso.fraquezaMuscular.observation || 'Presente', size: 16 })] })]
        : []),
      ...(data.revisaoSistemas.sistemaNervoso.disturbiosVisuais.checked
        ? [new Paragraph({ spacing: { before: 10, after: 10 }, children: [new TextRun({ text: '• Distúrbios Visuais: ', bold: true, size: 16 }), new TextRun({ text: data.revisaoSistemas.sistemaNervoso.disturbiosVisuais.observation || 'Presentes', size: 16 })] })]
        : []),
      ...(data.revisaoSistemas.sistemaNervoso.disturbiosSensibilidade.checked
        ? [new Paragraph({ spacing: { before: 10, after: 10 }, children: [new TextRun({ text: '• Distúrbios da Sensibilidade: ', bold: true, size: 16 }), new TextRun({ text: data.revisaoSistemas.sistemaNervoso.disturbiosSensibilidade.observation || 'Presentes', size: 16 })] })]
        : []),
    ]),
    cardSpacer(),

    // 3. Antecedentes
    makePosterCard('3. Antecedentes Relevantes', '047857', 'FFFFFF', 'CBD5E1', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'História Pregressa: ', bold: true, size: 17 }),
          new TextRun({ text: data.historiaPregressa || 'Sem antecedentes de relevo.', size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Pessoal e Social: ', bold: true, size: 17 }),
          new TextRun({ text: data.historiaPessoalSocial || '---', size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'História Familiar: ', bold: true, size: 17 }),
          new TextRun({ text: data.historiaFamiliar || '---', size: 17 }),
        ],
      }),
    ]),
  ];

  // --- COLUMN 2: RADIOLOGIA (TAC/RX), SINAIS VITAIS, GLASGOW, EXAME NEUROLÓGICO ---
  const col2Children: (Table | Paragraph)[] = [
    // Estação Radiológica
    makePosterCard('Estação Radiológica (TAC / RX)', '1E40AF', 'FFFFFF', '93C5FD', [
      ...(processedImages.length > 0
        ? processedImages.flatMap(({ img, uint8Array, width, height }, idx) => [
            new Paragraph({
              spacing: { before: 40, after: 20 },
              children: [
                new TextRun({
                  text: `Figura ${idx + 1}: ${img.type} - Data: ${img.examDate || 'N/D'}`,
                  bold: true,
                  size: 18,
                  color: '1E3A8A',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 20, after: 40 },
              children: [
                new ImageRun({
                  type: 'png',
                  data: uint8Array,
                  transformation: { width, height },
                }),
              ],
            }),
            new Paragraph({
              spacing: { before: 10, after: 80 },
              children: [
                new TextRun({ text: 'Comentários / Achados: ', bold: true, size: 16, color: '1E293B' }),
                new TextRun({ text: img.notes || 'Sem comentários adicionais.', size: 16, italics: true, color: '334155' }),
              ],
            }),
          ])
        : [
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [new TextRun({ text: 'Nenhum exame de imagem (TAC / RX) anexado.', size: 17, italics: true })],
            }),
          ]),
    ]),
    cardSpacer(),

    // Sinais Vitais & Glasgow
    makePosterCard('Sinais Vitais & Escala de Glasgow (ECG)', '0369A1', 'F0F9FF', 'BAE6FD', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Tensão Arterial: ', bold: true, size: 17 }),
          new TextRun({ text: `${data.tensaoArterial || '120/80 mmHg'}    `, size: 17 }),
          new TextRun({ text: 'Freq. Cardíaca: ', bold: true, size: 17 }),
          new TextRun({ text: `${data.frequenciaCardiaca || '64 bpm'}    `, size: 17 }),
          new TextRun({ text: 'SpO2: ', bold: true, size: 17 }),
          new TextRun({ text: `${data.spO2 || '98%'}    `, size: 17 }),
          new TextRun({ text: 'Temp: ', bold: true, size: 17 }),
          new TextRun({ text: `${data.temperaturaAxilar || '36.6 ºC'}`, size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Escala de Glasgow (ECG Total): ', bold: true, size: 18, color: '0369A1' }),
          new TextRun({ text: `${data.glasgowTotal || '14/15'} `, bold: true, size: 18, color: 'B45309' }),
          new TextRun({ text: `(Ocular: ${data.glasgowOcular || '4'} | Verbal: ${data.glasgowVerbal || '5'} | Motor: ${data.glasgowMotor || '5'})`, size: 16 }),
        ],
      }),
    ]),
    cardSpacer(),

    // Exame Neurológico
    makePosterCard('Exame Neurológico Detalhado (III.7)', '1E3A8A', 'FFFFFF', 'CBD5E1', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Força Muscular: ', bold: true, size: 17 }),
          new TextRun({ text: data.forcaMuscular || 'Normotonia bilateral', size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Tónus Muscular: ', bold: true, size: 17 }),
          new TextRun({ text: data.tonusMuscular || 'Conservado', size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Reflexos Miotáticos: ', bold: true, size: 17 }),
          new TextRun({ text: `${data.reflexos || 'Normorreflexia'} | Sinais meníngeos: ${data.sinaisMeningeos || 'Ausentes'}`, size: 17 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 30, after: 20 },
        children: [new TextRun({ text: 'Nervos Cranianos Relevantes:', bold: true, size: 17, color: '1E3A8A' })],
      }),
      new Paragraph({
        spacing: { before: 10, after: 10 },
        children: [
          new TextRun({ text: '• II Par (Óptico / Fundoscopia): ', bold: true, size: 16 }),
          new TextRun({ text: data.fundoscopia || data.par2 || 'Sem edema de papila', size: 16 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 10, after: 10 },
        children: [
          new TextRun({ text: '• V Par (Trigémio): ', bold: true, size: 16 }),
          new TextRun({ text: data.par5 || 'Sensibilidade facial conservada', size: 16 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 10, after: 10 },
        children: [
          new TextRun({ text: '• VII Par (Facial): ', bold: true, size: 16 }),
          new TextRun({ text: data.par7 || 'Simetria mímica facial conservada', size: 16 }),
        ],
      }),
    ]),
    cardSpacer(),

    // Resumo Clínico
    makePosterCard('Resumo Clínico da Apresentação', '1E3A8A', 'EFF6FF', 'BFDBFE', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text: data.resumo || 'Resumo do caso clínico.', size: 16, color: '1E293B' })],
      }),
    ]),
  ];

  // --- COLUMN 3: HIPÓTESES DIAGNÓSTICAS, CONDUTA, PROGNÓSTICO, ASSINATURA ---
  const col3Children: (Table | Paragraph)[] = [
    // 4. Hipóteses Diagnósticas
    makePosterCard('4. Hipóteses Diagnósticas', '6B21A8', 'FAF5FF', 'E9D5FF', [
      new Paragraph({
        spacing: { before: 20, after: 10 },
        children: [new TextRun({ text: 'V. DIAGNÓSTICO SINDRÓMICO:', bold: true, size: 16, color: '6B21A8' })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: data.diagnosticosSindromicos || '---', size: 16 })],
      }),
      new Paragraph({
        spacing: { before: 20, after: 10 },
        children: [new TextRun({ text: 'VII. DIAGNÓSTICO TOPOGRÁFICO:', bold: true, size: 16, color: '3730A3' })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: data.diagnosticosTopograficos || '---', size: 16 })],
      }),
      new Paragraph({
        spacing: { before: 20, after: 10 },
        children: [new TextRun({ text: 'VI. DIAGNÓSTICO ETIOLÓGICO:', bold: true, size: 16, color: '9F1239' })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: data.diagnosticosEtiologicos || '---', size: 16 })],
      }),
    ]),
    cardSpacer(),

    // 5. Diagnósticos Diferenciais
    makePosterCard('5. Diagnósticos Diferenciais (5)', '92400E', 'FFFBEB', 'FDE68A', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text: data.diagnosticosDiferenciais || '---', size: 16, color: '1E293B' })],
      }),
    ]),
    cardSpacer(),

    // 6. Proposta Cirúrgica & Conduta
    makePosterCard('6. Proposta Cirúrgica & Conduta', '065F46', 'ECFDF5', 'A7F3D0', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text: data.propostaTerapeutica || '---', size: 16, color: '0F172A' })],
      }),
    ]),
    cardSpacer(),

    // 7. Prognóstico & Fechamento
    makePosterCard('7. Prognóstico & Fechamento', '334155', 'F8FAFC', 'E2E8F0', [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Prognóstico: ', bold: true, size: 16 }),
          new TextRun({ text: data.prognostico || 'Reservado', size: 16 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Elaborado por: ', bold: true, size: 16 }),
          new TextRun({ text: `${data.elaboradoPor || '---'} (${data.mrNc || 'MR/NC'})`, size: 16 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Orientação / Correcção: ', bold: true, size: 16 }),
          new TextRun({ text: data.corrigidoPor || '---', size: 16 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: 'Comentários: ', bold: true, size: 16 }),
          new TextRun({ text: data.comentariosFinais || '---', size: 16 }),
        ],
      }),
    ]),
  ];

  // Poster Top Header Banner (Clean White Background)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 10, color: '1E3A8A' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            },
            shading: { fill: 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
            width: { size: 28, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 80, left: 160, right: 160 },
            children: [
              new Paragraph({ children: [new TextRun({ text: data.institution || 'ORDEM DOS MÉDICOS DE MOÇAMBIQUE', bold: true, size: 17, color: '1E3A8A' })] }),
              new Paragraph({ children: [new TextRun({ text: data.subInstitution || 'COLÉGIO DE NEUROCIRURGIA', bold: true, size: 16, color: '334155' })] }),
            ],
          }),
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 10, color: '1E3A8A' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            },
            shading: { fill: 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
            width: { size: 44, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 80, left: 160, right: 160 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (data.tipoEvento || 'Jornadas Científicas do Hospital Central de Nampula').toUpperCase(),
                    bold: true,
                    size: 16,
                    color: 'B45309',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'CASO CLÍNICO NEUROCIRÚRGICO • APRESENTAÇÃO CIENTÍFICA', bold: true, size: 14, color: '2563EB' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({
                    text: data.diagnosticosDefinitivos || data.motivoInternamento || 'HISTÓRIA CLÍNICA DE NEUROCIRURGIA',
                    bold: true,
                    size: 24,
                    color: '0F172A',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Abordagem Semiológica, Análise Radiológica (TAC/RX) e Conduta Cirúrgica', size: 15, color: '475569' })],
              }),
            ],
          }),
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 10, color: '1E3A8A' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
            },
            shading: { fill: 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
            width: { size: 28, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 80, left: 160, right: 160 },
            children: [
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.hospital || 'HOSPITAL CENTRAL DE NAMPULA', bold: true, size: 17, color: '1E3A8A' })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.service || 'SERVIÇO DE NEUROCIRURGIA', bold: true, size: 16, color: '334155' })] }),
            ],
          }),
        ],
      }),
      // Sub-bar for authors & patient demographics
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
              left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
            width: { size: 50, type: WidthType.PERCENTAGE },
            columnSpan: 2,
            margins: { top: 60, bottom: 60, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Elaborado por: ', bold: true, size: 16, color: '64748B' }),
                  new TextRun({ text: `${data.elaboradoPor || 'Dr. Médico'} `, bold: true, size: 16, color: '0F172A' }),
                  new TextRun({ text: `(${data.mrNc || 'MR/NC'})`, size: 15, color: '64748B' }),
                  ...(data.corrigidoPor
                    ? [new TextRun({ text: `  |  Orientador: ${data.corrigidoPor}`, bold: true, size: 16, color: '047857' })]
                    : []),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
              left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
            },
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 60, bottom: 60, left: 160, right: 160 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Doente: ', bold: true, size: 16, color: '64748B' }),
                  new TextRun({ text: `${data.nome || '---'} `, bold: true, size: 16, color: '0F172A' }),
                  new TextRun({ text: ` | NID: ${data.nid || '---'} | ${data.idade || '--'} / ${data.sexo || '--'}`, size: 15, color: '334155' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Three-Column Poster Layout Table
  const posterGrid = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          // Column 1 (32%)
          new TableCell({
            borders: noBorders,
            width: { size: 32, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: col1Children,
          }),
          // Column 2 (38%)
          new TableCell({
            borders: noBorders,
            width: { size: 38, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: col2Children,
          }),
          // Column 3 (30%)
          new TableCell({
            borders: noBorders,
            width: { size: 30, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: col3Children,
          }),
        ],
      }),
    ],
  });

  // Assemble document in Landscape format
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 16838, // A4 Landscape width
              height: 11906, // A4 Landscape height
            },
            margin: {
              top: 500,
              bottom: 500,
              left: 500,
              right: 500,
            },
          },
        },
        children: [
          headerTable,
          new Paragraph({ spacing: { before: 80, after: 80 }, children: [] }),
          posterGrid,
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: 'Ordem dos Médicos de Moçambique • Hospital Central de Maputo • Serviço de Neurocirurgia',
                size: 15,
                color: '64748B',
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Poster_Cientifico_${patientCleanName}.docx`);
}
