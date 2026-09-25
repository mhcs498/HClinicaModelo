import React from 'react';
import { ClinicalCaseData, AttachedImage, ReviewItem } from '../types/clinicalCase';
import { UnderlineInput, FormTextArea, SystemCheckboxItem } from './FormFields';
import { ImageUploader } from './ImageUploader';

interface ClinicalCaseFormProps {
  data: ClinicalCaseData;
  onChange: (data: ClinicalCaseData) => void;
}

export const ClinicalCaseForm: React.FC<ClinicalCaseFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof ClinicalCaseData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateReviewItem = (
    system: keyof ClinicalCaseData['revisaoSistemas'],
    itemKey: string,
    updated: Partial<ReviewItem>
  ) => {
    const currentSystem = data.revisaoSistemas[system] as Record<string, ReviewItem>;
    onChange({
      ...data,
      revisaoSistemas: {
        ...data.revisaoSistemas,
        [system]: {
          ...currentSystem,
          [itemKey]: {
            ...currentSystem[itemKey],
            ...updated,
          },
        },
      },
    });
  };

  // Auto calculate Glasgow ECG if O, V, M are numbers
  const handleGlasgowChange = (type: 'O' | 'V' | 'M', val: string) => {
    const newO = type === 'O' ? val : data.glasgowOcular;
    const newV = type === 'V' ? val : data.glasgowVerbal;
    const newM = type === 'M' ? val : data.glasgowMotor;

    const oNum = parseInt(newO, 10);
    const vNum = parseInt(newV, 10);
    const mNum = parseInt(newM, 10);

    let calculatedTotal = data.glasgowTotal;
    if (!isNaN(oNum) && !isNaN(vNum) && !isNaN(mNum)) {
      calculatedTotal = `${oNum + vNum + mNum}/15`;
    }

    onChange({
      ...data,
      glasgowOcular: newO,
      glasgowVerbal: newV,
      glasgowMotor: newM,
      glasgowTotal: calculatedTotal,
    });
  };

  return (
    <div className="bg-white max-w-5xl mx-auto shadow-xl rounded-xl border border-slate-200 p-6 md:p-12 font-sans text-slate-900 print:shadow-none print:border-none print:p-2">
      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <div>
            <input
              type="text"
              value={data.institution}
              onChange={(e) => updateField('institution', e.target.value)}
              className="w-full font-bold text-sm tracking-wide uppercase border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
            />
            <div className="border-t border-slate-400 my-1 w-4/5"></div>
            <input
              type="text"
              value={data.subInstitution}
              onChange={(e) => updateField('subInstitution', e.target.value)}
              className="w-full font-bold text-xs tracking-wider uppercase text-slate-800 border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
            />
          </div>

          <div className="sm:text-right">
            <input
              type="text"
              value={data.hospital}
              onChange={(e) => updateField('hospital', e.target.value)}
              className="w-full sm:text-right font-bold text-sm tracking-wide uppercase border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
            />
            <div className="border-t border-slate-400 my-1 w-4/5 sm:ml-auto"></div>
            <input
              type="text"
              value={data.service}
              onChange={(e) => updateField('service', e.target.value)}
              className="w-full sm:text-right font-bold text-xs tracking-wider uppercase text-slate-800 border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
            />
          </div>
        </div>

        <div className="text-center pt-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-blue-900 font-serif uppercase">
            HISTÓRIA CLÍNICA
          </h1>
          <div className="w-24 h-0.5 bg-blue-700 mx-auto mt-1 mb-2"></div>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-lg text-xs text-amber-900 mt-1 shadow-xs">
            <span className="font-semibold text-amber-800">Tipo de Evento:</span>
            <input
              type="text"
              value={data.tipoEvento || 'Jornadas Científicas do Hospital Central de Nampula'}
              onChange={(e) => updateField('tipoEvento', e.target.value)}
              placeholder="Ex: Jornadas Científicas do Hospital Central de Nampula"
              className="bg-transparent border-b border-amber-400 focus:outline-none focus:border-amber-700 font-bold text-amber-950 px-1 py-0.5 min-w-[280px]"
            />
          </div>
        </div>
      </div>

      {/* SECTION I - IDENTIFICAÇÃO */}
      <section id="sec-identificacao" className="mb-8 scroll-mt-24">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            I – IDENTIFICAÇÃO
          </h2>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <UnderlineInput
              label="Nome"
              value={data.nome}
              onChange={(e) => updateField('nome', e.target.value)}
              containerClassName="md:col-span-2"
              placeholder="Nome completo do paciente"
            />
            <UnderlineInput
              label="NID"
              value={data.nid}
              onChange={(e) => updateField('nid', e.target.value)}
              placeholder="Número de identificação"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <UnderlineInput
              label="Sexo"
              value={data.sexo}
              onChange={(e) => updateField('sexo', e.target.value)}
              placeholder="Ex: Masculino / Feminino"
            />
            <UnderlineInput
              label="Idade"
              value={data.idade}
              onChange={(e) => updateField('idade', e.target.value)}
              placeholder="Ex: 45 anos"
            />
            <UnderlineInput
              label="Raça"
              value={data.raca}
              onChange={(e) => updateField('raca', e.target.value)}
              placeholder="Ex: Negra / Caucasiana"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UnderlineInput
              label="Estado Civil"
              value={data.estadoCivil}
              onChange={(e) => updateField('estadoCivil', e.target.value)}
              placeholder="Ex: Casado(a), Solteiro(a)"
            />
            <UnderlineInput
              label="Naturalidade"
              value={data.naturalidade}
              onChange={(e) => updateField('naturalidade', e.target.value)}
              placeholder="Província / Distrito"
            />
          </div>

          <UnderlineInput
            label="Residência"
            value={data.residencia}
            onChange={(e) => updateField('residencia', e.target.value)}
            placeholder="Endereço habitual completo"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UnderlineInput
              label="Profissão"
              value={data.profissao}
              onChange={(e) => updateField('profissao', e.target.value)}
              placeholder="Ocupação profissional"
            />
            <UnderlineInput
              label="Local de Trabalho"
              value={data.localTrabalho}
              onChange={(e) => updateField('localTrabalho', e.target.value)}
              placeholder="Empresa / Localidade"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UnderlineInput
              label="Proveniente de"
              value={data.provenienteDe}
              onChange={(e) => updateField('provenienteDe', e.target.value)}
              placeholder="Unidade sanitária ou domicílio"
            />
            <UnderlineInput
              label="Em"
              value={data.emData}
              onChange={(e) => updateField('emData', e.target.value)}
              placeholder="Data e hora de admissão"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UnderlineInput
              label="História fornecida por"
              value={data.historiaFornecidaPor}
              onChange={(e) => updateField('historiaFornecidaPor', e.target.value)}
              placeholder="Próprio / Acompanhante"
            />
            <UnderlineInput
              label="Serviço"
              value={data.servicoProveniencia}
              onChange={(e) => updateField('servicoProveniencia', e.target.value)}
              placeholder="Serviço de proveniência"
            />
          </div>
        </div>
      </section>

      {/* SECTION II - ANAMNESE */}
      <section id="sec-anamnese" className="mb-8 scroll-mt-24">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            II – ANAMNESE
          </h2>
        </div>

        <FormTextArea
          label="II.1 – MOTIVO DE INTERNAMENTO OU QUEIXA(S) PRINCIPAL(AIS)"
          value={data.motivoInternamento}
          onChange={(val) => updateField('motivoInternamento', val)}
          placeholder="Ex: Cefaleia holocraniana intensa progressiva acompanhada de vómitos..."
          rows={3}
        />

        <FormTextArea
          label="II.2 – HISTÓRIA DA DOENÇA ACTUAL"
          description="caracterizar o início e a evolução dos sintomas e sinais, referir sintomas e sinais negativos importantes para o diagnóstico diferencial, indicar tratamentos feitos e os seus resultados"
          value={data.historiaDoencaActual}
          onChange={(val) => updateField('historiaDoencaActual', val)}
          placeholder="Descreva detalhadamente a cronologia e sintomatologia..."
          rows={7}
        />

        {/* II.3 - REVISÃO POR APARELHOS E SISTEMAS */}
        <div className="my-6 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase">
              II.3 – REVISÃO POR APARELHOS E SISTEMAS NÃO DIRECTAMENTE RELACIONADOS COM A DOENÇA ACTUAL
            </h3>
            <p className="text-xs text-slate-500 italic">
              (assinalar apenas os dados positivos)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* a) Respiratório/Cardiovascular */}
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 border-b pb-1">
                a) RESPIRATÓRIO / CARDIOVASCULAR
              </h4>
              <div className="space-y-1">
                <SystemCheckboxItem
                  label="Tosse"
                  checked={data.revisaoSistemas.respiratorio.tosse.checked}
                  observation={data.revisaoSistemas.respiratorio.tosse.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'tosse', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'tosse', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Expectoração"
                  checked={data.revisaoSistemas.respiratorio.expectoracao.checked}
                  observation={data.revisaoSistemas.respiratorio.expectoracao.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'expectoracao', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'expectoracao', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Dor torácica"
                  checked={data.revisaoSistemas.respiratorio.dorToracica.checked}
                  observation={data.revisaoSistemas.respiratorio.dorToracica.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'dorToracica', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'dorToracica', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Dispneia"
                  checked={data.revisaoSistemas.respiratorio.dispneia.checked}
                  observation={data.revisaoSistemas.respiratorio.dispneia.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'dispneia', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'dispneia', { observation: o })}
                />
                <SystemCheckboxItem
                  label="DPN / Ortopneia"
                  checked={data.revisaoSistemas.respiratorio.dpnOrtopneia.checked}
                  observation={data.revisaoSistemas.respiratorio.dpnOrtopneia.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'dpnOrtopneia', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'dpnOrtopneia', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Palpitações"
                  checked={data.revisaoSistemas.respiratorio.palpitacoes.checked}
                  observation={data.revisaoSistemas.respiratorio.palpitacoes.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'palpitacoes', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'palpitacoes', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Suores nocturnos"
                  checked={data.revisaoSistemas.respiratorio.suoresNocturnos.checked}
                  observation={data.revisaoSistemas.respiratorio.suoresNocturnos.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'suoresNocturnos', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'suoresNocturnos', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Pieira"
                  checked={data.revisaoSistemas.respiratorio.pieira.checked}
                  observation={data.revisaoSistemas.respiratorio.pieira.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'pieira', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'pieira', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Outros"
                  checked={data.revisaoSistemas.respiratorio.outros1.checked}
                  observation={data.revisaoSistemas.respiratorio.outros1.observation}
                  onToggle={(c) => updateReviewItem('respiratorio', 'outros1', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('respiratorio', 'outros1', { observation: o })}
                />
              </div>
            </div>

            {/* b) Sistema Nervoso */}
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 border-b pb-1">
                b) SISTEMA NERVOSO
              </h4>
              <div className="space-y-1">
                <SystemCheckboxItem
                  label="Convulsões"
                  checked={data.revisaoSistemas.sistemaNervoso.convulsoes.checked}
                  observation={data.revisaoSistemas.sistemaNervoso.convulsoes.observation}
                  onToggle={(c) => updateReviewItem('sistemaNervoso', 'convulsoes', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('sistemaNervoso', 'convulsoes', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Síncope"
                  checked={data.revisaoSistemas.sistemaNervoso.sincope.checked}
                  observation={data.revisaoSistemas.sistemaNervoso.sincope.observation}
                  onToggle={(c) => updateReviewItem('sistemaNervoso', 'sincope', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('sistemaNervoso', 'sincope', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Cefaleias"
                  checked={data.revisaoSistemas.sistemaNervoso.cefaleias.checked}
                  observation={data.revisaoSistemas.sistemaNervoso.cefaleias.observation}
                  onToggle={(c) => updateReviewItem('sistemaNervoso', 'cefaleias', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('sistemaNervoso', 'cefaleias', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Distúrbios visuais"
                  checked={data.revisaoSistemas.sistemaNervoso.disturbiosVisuais.checked}
                  observation={data.revisaoSistemas.sistemaNervoso.disturbiosVisuais.observation}
                  onToggle={(c) => updateReviewItem('sistemaNervoso', 'disturbiosVisuais', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('sistemaNervoso', 'disturbiosVisuais', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Distúrbios da sensibilidade"
                  checked={data.revisaoSistemas.sistemaNervoso.disturbiosSensibilidade.checked}
                  observation={data.revisaoSistemas.sistemaNervoso.disturbiosSensibilidade.observation}
                  onToggle={(c) => updateReviewItem('sistemaNervoso', 'disturbiosSensibilidade', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('sistemaNervoso', 'disturbiosSensibilidade', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Fraqueza muscular"
                  checked={data.revisaoSistemas.sistemaNervoso.fraquezaMuscular.checked}
                  observation={data.revisaoSistemas.sistemaNervoso.fraquezaMuscular.observation}
                  onToggle={(c) => updateReviewItem('sistemaNervoso', 'fraquezaMuscular', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('sistemaNervoso', 'fraquezaMuscular', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Outros"
                  checked={data.revisaoSistemas.sistemaNervoso.outros1.checked}
                  observation={data.revisaoSistemas.sistemaNervoso.outros1.observation}
                  onToggle={(c) => updateReviewItem('sistemaNervoso', 'outros1', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('sistemaNervoso', 'outros1', { observation: o })}
                />
              </div>
            </div>

            {/* c) Gastrointestinal */}
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 border-b pb-1">
                c) GASTROINTESTINAL
              </h4>
              <div className="space-y-1">
                <SystemCheckboxItem
                  label="Vómitos"
                  checked={data.revisaoSistemas.gastrointestinal.vomitos.checked}
                  observation={data.revisaoSistemas.gastrointestinal.vomitos.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'vomitos', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'vomitos', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Hematemeses"
                  checked={data.revisaoSistemas.gastrointestinal.hematemeses.checked}
                  observation={data.revisaoSistemas.gastrointestinal.hematemeses.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'hematemeses', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'hematemeses', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Obstipação"
                  checked={data.revisaoSistemas.gastrointestinal.obstipacao.checked}
                  observation={data.revisaoSistemas.gastrointestinal.obstipacao.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'obstipacao', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'obstipacao', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Pirose"
                  checked={data.revisaoSistemas.gastrointestinal.pirose.checked}
                  observation={data.revisaoSistemas.gastrointestinal.pirose.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'pirose', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'pirose', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Enfartamento pós-prandial"
                  checked={data.revisaoSistemas.gastrointestinal.enfartamentoPosPrandial.checked}
                  observation={data.revisaoSistemas.gastrointestinal.enfartamentoPosPrandial.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'enfartamentoPosPrandial', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'enfartamentoPosPrandial', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Flatulência"
                  checked={data.revisaoSistemas.gastrointestinal.flatulencia.checked}
                  observation={data.revisaoSistemas.gastrointestinal.flatulencia.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'flatulencia', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'flatulencia', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Dor abdominal"
                  checked={data.revisaoSistemas.gastrointestinal.dorAbdominal.checked}
                  observation={data.revisaoSistemas.gastrointestinal.dorAbdominal.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'dorAbdominal', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'dorAbdominal', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Icterícia"
                  checked={data.revisaoSistemas.gastrointestinal.ictericia.checked}
                  observation={data.revisaoSistemas.gastrointestinal.ictericia.observation}
                  onToggle={(c) => updateReviewItem('gastrointestinal', 'ictericia', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('gastrointestinal', 'ictericia', { observation: o })}
                />
              </div>
            </div>

            {/* d) Genitourinário & e) Hemolinfopoético */}
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 border-b pb-1">
                d) GENITOURINÁRIO
              </h4>
              <div className="space-y-1 mb-4">
                <SystemCheckboxItem
                  label="Disúria"
                  checked={data.revisaoSistemas.genitourinario.disuria.checked}
                  observation={data.revisaoSistemas.genitourinario.disuria.observation}
                  onToggle={(c) => updateReviewItem('genitourinario', 'disuria', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('genitourinario', 'disuria', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Polaquiúria"
                  checked={data.revisaoSistemas.genitourinario.polaquiuria.checked}
                  observation={data.revisaoSistemas.genitourinario.polaquiuria.observation}
                  onToggle={(c) => updateReviewItem('genitourinario', 'polaquiuria', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('genitourinario', 'polaquiuria', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Hematúria"
                  checked={data.revisaoSistemas.genitourinario.hematuria.checked}
                  observation={data.revisaoSistemas.genitourinario.hematuria.observation}
                  onToggle={(c) => updateReviewItem('genitourinario', 'hematuria', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('genitourinario', 'hematuria', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Incontinência urinária"
                  checked={data.revisaoSistemas.genitourinario.incontinenciaUrinaria.checked}
                  observation={data.revisaoSistemas.genitourinario.incontinenciaUrinaria.observation}
                  onToggle={(c) => updateReviewItem('genitourinario', 'incontinenciaUrinaria', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('genitourinario', 'incontinenciaUrinaria', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Corrimento uretral/vaginal"
                  checked={data.revisaoSistemas.genitourinario.corrimentoUretralVaginal.checked}
                  observation={data.revisaoSistemas.genitourinario.corrimentoUretralVaginal.observation}
                  onToggle={(c) => updateReviewItem('genitourinario', 'corrimentoUretralVaginal', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('genitourinario', 'corrimentoUretralVaginal', { observation: o })}
                />
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 border-b pb-1">
                e) HEMOLINFOPOÉTICO
              </h4>
              <div className="space-y-1">
                <SystemCheckboxItem
                  label="Anomalias da coagulação"
                  checked={data.revisaoSistemas.hemolinfopoetico.anomaliasCoagulacao.checked}
                  observation={data.revisaoSistemas.hemolinfopoetico.anomaliasCoagulacao.observation}
                  onToggle={(c) => updateReviewItem('hemolinfopoetico', 'anomaliasCoagulacao', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('hemolinfopoetico', 'anomaliasCoagulacao', { observation: o })}
                />
                <SystemCheckboxItem
                  label="Anemias"
                  checked={data.revisaoSistemas.hemolinfopoetico.anemias.checked}
                  observation={data.revisaoSistemas.hemolinfopoetico.anemias.observation}
                  onToggle={(c) => updateReviewItem('hemolinfopoetico', 'anemias', { checked: c })}
                  onObservationChange={(o) => updateReviewItem('hemolinfopoetico', 'anemias', { observation: o })}
                />
              </div>
            </div>
          </div>
        </div>

        <FormTextArea
          label="f) CARACTERIZAÇÃO DOS SINTOMAS E SINAIS RELEVANTES E OUTROS NÃO ESPECIFICADOS"
          value={data.revisaoSistemas.caracterizacaoSintomas}
          onChange={(val) =>
            onChange({
              ...data,
              revisaoSistemas: {
                ...data.revisaoSistemas,
                caracterizacaoSintomas: val,
              },
            })
          }
          placeholder="Comente sintomas e sinais positivos relevantes apurados acima..."
          rows={3}
        />

        <FormTextArea
          label="II.4 – HISTÓRIA PREGRESSA"
          description="doenças anteriores, intervenções cirúrgicas, internamentos anteriores, história medicamentosa, transfusões, alergias, antecedentes de DTS"
          value={data.historiaPregressa}
          onChange={(val) => updateField('historiaPregressa', val)}
          placeholder="Antecedentes patológicos, cirurgias prévias, alergias e medicações em curso..."
          rows={4}
        />

        <FormTextArea
          label="II.5 – HISTÓRIA PESSOAL E SOCIAL"
          description="condições de habitação, saneamento, abastecimento de água, hábitos alimentares, alcoólicos e tabágicos, profissões e viagens anteriores"
          value={data.historiaPessoalSocial}
          onChange={(val) => updateField('historiaPessoalSocial', val)}
          placeholder="Estilo de vida, hábitos tóxicos, condições habitacionais e histórico profissional..."
          rows={4}
        />

        <FormTextArea
          label="II.6 – HISTÓRIA GINECO-OBSTÉTRICA"
          description="se mulher, menarca, menopausa, última menstruação, fórmulas menstrual e gestacional, alterações da menstruação, metrorragias, anticonceptivos, idades do 1º e último partos, cesarianas"
          value={data.historiaGinecoObstetrica}
          onChange={(val) => updateField('historiaGinecoObstetrica', val)}
          placeholder="Para pacientes do sexo feminino (ou 'Não aplicável')..."
          rows={3}
        />

        <FormTextArea
          label="II.6 – HISTÓRIA FAMILIAR"
          description="saúde dos parentes próximos, causas de morte dos parentes próximos, doenças de tendência familiar"
          value={data.historiaFamiliar}
          onChange={(val) => updateField('historiaFamiliar', val)}
          placeholder="Antecedentes patológicos familiares (pais, irmãos, filhos)..."
          rows={3}
        />
      </section>

      {/* SECTION III - EXAME OBJECTIVO */}
      <section id="sec-exame-objectivo" className="mb-8 scroll-mt-24">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            III – EXAME OBJECTIVO
          </h2>
        </div>

        {/* III.1 - EXAME GERAL */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b pb-1 mb-3">
            III.1 – EXAME GERAL
          </h3>

          <div className="space-y-3">
            <UnderlineInput
              label="Estado geral (impressão geral)"
              value={data.estadoGeral}
              onChange={(e) => updateField('estadoGeral', e.target.value)}
              placeholder="Ex: Bom, regular ou mau estado geral; vigil, orientado..."
            />
            <UnderlineInput
              label="Idade aparente"
              value={data.idadeAparente}
              onChange={(e) => updateField('idadeAparente', e.target.value)}
              placeholder="Ex: Compatível com a cronológica"
            />

            {/* Glasgow Scale Row */}
            <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100">
              <span className="font-semibold text-slate-800 text-sm block mb-2">
                Estado de consciência (Escala de Coma de Glasgow):
              </span>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">O (Ocular 1-4):</span>
                  <input
                    type="text"
                    value={data.glasgowOcular}
                    onChange={(e) => handleGlasgowChange('O', e.target.value)}
                    placeholder="4"
                    className="w-14 text-center border-b border-blue-400 bg-white px-2 py-0.5 rounded text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">V (Verbal 1-5):</span>
                  <input
                    type="text"
                    value={data.glasgowVerbal}
                    onChange={(e) => handleGlasgowChange('V', e.target.value)}
                    placeholder="5"
                    className="w-14 text-center border-b border-blue-400 bg-white px-2 py-0.5 rounded text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">M (Motor 1-6):</span>
                  <input
                    type="text"
                    value={data.glasgowMotor}
                    onChange={(e) => handleGlasgowChange('M', e.target.value)}
                    placeholder="6"
                    className="w-14 text-center border-b border-blue-400 bg-white px-2 py-0.5 rounded text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-blue-100/70 px-3 py-1 rounded-md">
                  <span className="font-bold text-blue-900">ECG (Total):</span>
                  <input
                    type="text"
                    value={data.glasgowTotal}
                    onChange={(e) => updateField('glasgowTotal', e.target.value)}
                    placeholder="15/15"
                    className="w-20 font-bold text-center border-b border-blue-600 bg-transparent px-1 py-0.5 text-sm text-blue-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnderlineInput
                label="Pele"
                value={data.pele}
                onChange={(e) => updateField('pele', e.target.value)}
                placeholder="Coloração, elasticidade, lesões"
              />
              <UnderlineInput
                label="Mucosas"
                value={data.mucosas}
                onChange={(e) => updateField('mucosas', e.target.value)}
                placeholder="Normocoradas, hidratadas"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnderlineInput
                label="Edemas"
                value={data.edemas}
                onChange={(e) => updateField('edemas', e.target.value)}
                placeholder="Localização e magnitude (ex: ausentes)"
              />
              <UnderlineInput
                label="Linfadenopatia"
                value={data.linfadenopatia}
                onChange={(e) => updateField('linfadenopatia', e.target.value)}
                placeholder="Gânglios palpáveis"
              />
            </div>

            {/* Sinais Vitais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <UnderlineInput
                label="Freq. cardíaca"
                value={data.frequenciaCardiaca}
                onChange={(e) => updateField('frequenciaCardiaca', e.target.value)}
                placeholder="Ex: 72 bpm"
              />
              <UnderlineInput
                label="Freq. respiratória"
                value={data.frequenciaRespiratoria}
                onChange={(e) => updateField('frequenciaRespiratoria', e.target.value)}
                placeholder="Ex: 16 cpm"
              />
              <UnderlineInput
                label="Pulso radial"
                value={data.pulsoRadial}
                onChange={(e) => updateField('pulsoRadial', e.target.value)}
                placeholder="Rítmico, cheio"
              />
              <UnderlineInput
                label="Tensão arterial"
                value={data.tensaoArterial}
                onChange={(e) => updateField('tensaoArterial', e.target.value)}
                placeholder="Ex: 120/80 mmHg"
              />
              <UnderlineInput
                label="Temp. axilar"
                value={data.temperaturaAxilar}
                onChange={(e) => updateField('temperaturaAxilar', e.target.value)}
                placeholder="Ex: 36.5 ºC"
              />
              <UnderlineInput
                label="SpO2"
                value={data.spO2}
                onChange={(e) => updateField('spO2', e.target.value)}
                placeholder="Ex: 98%"
              />
              <UnderlineInput
                label="Peso"
                value={data.peso}
                onChange={(e) => updateField('peso', e.target.value)}
                placeholder="Ex: 70 kg"
              />
              <UnderlineInput
                label="Altura"
                value={data.altura}
                onChange={(e) => updateField('altura', e.target.value)}
                placeholder="Ex: 1.70 m"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnderlineInput
                label="Índice de massa corporal (Ped: relação P/E,P/I)"
                value={data.imc}
                onChange={(e) => updateField('imc', e.target.value)}
                placeholder="Ex: 24.2 kg/m²"
              />
              <UnderlineInput
                label="Outros"
                value={data.outrosExameGeral}
                onChange={(e) => updateField('outrosExameGeral', e.target.value)}
                placeholder="Observações complementares"
              />
            </div>
          </div>
        </div>

        {/* III.2 - CABEÇA */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b pb-1 mb-3">
            III.2 – CABEÇA
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UnderlineInput
              label="Fácies"
              value={data.cabecaFacies}
              onChange={(e) => updateField('cabecaFacies', e.target.value)}
              placeholder="Atípica, simétrica, desvio..."
            />
            <UnderlineInput
              label="Olhos"
              value={data.cabecaOlhos}
              onChange={(e) => updateField('cabecaOlhos', e.target.value)}
              placeholder="Pupilas isocóricas / fotorreativas..."
            />
            <UnderlineInput
              label="Nariz"
              value={data.cabecaNariz}
              onChange={(e) => updateField('cabecaNariz', e.target.value)}
              placeholder="Pérvio, rinorréia..."
            />
            <UnderlineInput
              label="Boca"
              value={data.cabecaBoca}
              onChange={(e) => updateField('cabecaBoca', e.target.value)}
              placeholder="Mucosa, dentição..."
            />
            <UnderlineInput
              label="Orofaringe"
              value={data.cabecaOrofaringe}
              onChange={(e) => updateField('cabecaOrofaringe', e.target.value)}
              placeholder="Pilares, úvula..."
            />
            <UnderlineInput
              label="Ouvidos"
              value={data.cabecaOuvidos}
              onChange={(e) => updateField('cabecaOuvidos', e.target.value)}
              placeholder="Conduto, otorragia..."
            />
            <UnderlineInput
              label="Outros (incluindo PC)"
              value={data.cabecaOutros}
              onChange={(e) => updateField('cabecaOutros', e.target.value)}
              placeholder="Perímetro cefálico, palpação craniana..."
              containerClassName="sm:col-span-2"
            />
          </div>
        </div>

        {/* III.3 - PESCOÇO */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b pb-1 mb-3">
            III.3 – PESCOÇO
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UnderlineInput
              label="Forma"
              value={data.pescocoForma}
              onChange={(e) => updateField('pescocoForma', e.target.value)}
              placeholder="Cilíndrico, simétrico"
            />
            <UnderlineInput
              label="Dimensões"
              value={data.pescocoDimensoes}
              onChange={(e) => updateField('pescocoDimensoes', e.target.value)}
              placeholder="Normotrófico"
            />
            <UnderlineInput
              label="Mobilidade"
              value={data.pescocoMobilidade}
              onChange={(e) => updateField('pescocoMobilidade', e.target.value)}
              placeholder="Livre, dolorosa, rigidez..."
            />
            <UnderlineInput
              label="Posição da traqueia"
              value={data.pescocoPosicaoTraqueia}
              onChange={(e) => updateField('pescocoPosicaoTraqueia', e.target.value)}
              placeholder="Centrada na linha média"
            />
            <UnderlineInput
              label="Pressão venosa jugular (PVJ)"
              value={data.pescocoPVJ}
              onChange={(e) => updateField('pescocoPVJ', e.target.value)}
              placeholder="Normal, turgência jugular a 45º..."
            />
            <UnderlineInput
              label="Tiróide"
              value={data.pescocoTiroide}
              onChange={(e) => updateField('pescocoTiroide', e.target.value)}
              placeholder="Palpável, nódulos, bócio..."
            />
            <UnderlineInput
              label="Outros"
              value={data.pescocoOutros}
              onChange={(e) => updateField('pescocoOutros', e.target.value)}
              placeholder="Sopros carotídeos, massas..."
              containerClassName="sm:col-span-2"
            />
          </div>
        </div>

        {/* III.4 - TÓRAX */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b pb-1 mb-3">
            III.4 – TÓRAX
          </h3>

          <div className="space-y-4">
            {/* a) SEMIOLOGIA RESPIRATÓRIA */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                a) SEMIOLOGIA RESPIRATÓRIA
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UnderlineInput
                  label="Inspecção"
                  value={data.semiologiaRespInspecao}
                  onChange={(e) => updateField('semiologiaRespInspecao', e.target.value)}
                  placeholder="Expansibilidade, simetria..."
                />
                <UnderlineInput
                  label="Palpação"
                  value={data.semiologiaRespPalpacao}
                  onChange={(e) => updateField('semiologiaRespPalpacao', e.target.value)}
                  placeholder="Frémito tóraco-vocal..."
                />
                <UnderlineInput
                  label="Percurssão"
                  value={data.semiologiaRespPercussao}
                  onChange={(e) => updateField('semiologiaRespPercussao', e.target.value)}
                  placeholder="Som claro pulmonar..."
                />
                <UnderlineInput
                  label="Auscultação"
                  value={data.semiologiaRespAuscultacao}
                  onChange={(e) => updateField('semiologiaRespAuscultacao', e.target.value)}
                  placeholder="Murmúrio vesicular..."
                />
              </div>
            </div>

            {/* b) SEMIOLOGIA CARDÍACA */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                b) SEMIOLOGIA CARDÍACA
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UnderlineInput
                  label="Inspecção"
                  value={data.semiologiaCardInspecao}
                  onChange={(e) => updateField('semiologiaCardInspecao', e.target.value)}
                  placeholder="Ápice visível..."
                />
                <UnderlineInput
                  label="Palpação"
                  value={data.semiologiaCardPalpacao}
                  onChange={(e) => updateField('semiologiaCardPalpacao', e.target.value)}
                  placeholder="Choque da ponta no 5º EIC..."
                />
                <UnderlineInput
                  label="Percurssão"
                  value={data.semiologiaCardPercussao}
                  onChange={(e) => updateField('semiologiaCardPercussao', e.target.value)}
                  placeholder="Área cardíaca..."
                />
                <UnderlineInput
                  label="Auscultação"
                  value={data.semiologiaCardAuscultacao}
                  onChange={(e) => updateField('semiologiaCardAuscultacao', e.target.value)}
                  placeholder="Sons cardíacos, sopros..."
                />
              </div>
            </div>

            {/* c) MAMAS e AXILAS */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                c) MAMAS e AXILAS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UnderlineInput
                  label="Inspecção"
                  value={data.mamasAxilasInspecao}
                  onChange={(e) => updateField('mamasAxilasInspecao', e.target.value)}
                  placeholder="Simetria, retração, nódulos..."
                />
                <UnderlineInput
                  label="Palpação"
                  value={data.mamasAxilasPalpacao}
                  onChange={(e) => updateField('mamasAxilasPalpacao', e.target.value)}
                  placeholder="Nódulos mamários, gânglios axilares..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* III.5 - ABDÓMEN e PERÍNEO */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b pb-1 mb-3">
            III.5 – ABDÓMEN e PERÍNEO
          </h3>

          <div className="space-y-4">
            {/* a) Abdómen */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                a) ABDÓMEN
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UnderlineInput
                  label="Inspecção"
                  value={data.abdomenInspecao}
                  onChange={(e) => updateField('abdomenInspecao', e.target.value)}
                  placeholder="Plano, distendido, cicatrizes..."
                />
                <UnderlineInput
                  label="Palpação"
                  value={data.abdomenPalpacao}
                  onChange={(e) => updateField('abdomenPalpacao', e.target.value)}
                  placeholder="Mole, depressível, dor..."
                />
                <UnderlineInput
                  label="Percurssão"
                  value={data.abdomenPercussao}
                  onChange={(e) => updateField('abdomenPercussao', e.target.value)}
                  placeholder="Timpanismo, macicez hepática..."
                />
                <UnderlineInput
                  label="Auscultação"
                  value={data.abdomenAuscultacao}
                  onChange={(e) => updateField('abdomenAuscultacao', e.target.value)}
                  placeholder="Ruídos hidroaéreos..."
                />
                <UnderlineInput
                  label="Manobras especiais"
                  value={data.abdomenManobras}
                  onChange={(e) => updateField('abdomenManobras', e.target.value)}
                  placeholder="Murphy, Blumberg, Giordano..."
                  containerClassName="sm:col-span-2"
                />
              </div>
            </div>

            {/* b) Genitais Externos */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                b) GENITAIS EXTERNOS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UnderlineInput
                  label="Inspecção"
                  value={data.genitaisInspecao}
                  onChange={(e) => updateField('genitaisInspecao', e.target.value)}
                  placeholder="Desenvolvimento, lesões cutâneas..."
                />
                <UnderlineInput
                  label="Palpação"
                  value={data.genitaisPalpacao}
                  onChange={(e) => updateField('genitaisPalpacao', e.target.value)}
                  placeholder="Testículos / órgãos palpáveis..."
                />
                <UnderlineInput
                  label="Percurssão"
                  value={data.genitaisPercussao}
                  onChange={(e) => updateField('genitaisPercussao', e.target.value)}
                  placeholder="Bexigoma / globo vesical..."
                />
                <UnderlineInput
                  label="Auscultação"
                  value={data.genitaisAuscultacao}
                  onChange={(e) => updateField('genitaisAuscultacao', e.target.value)}
                  placeholder="Sopros ilíacos/femorais..."
                />
                <UnderlineInput
                  label="Urina (cor, turvação)"
                  value={data.genitaisUrina}
                  onChange={(e) => updateField('genitaisUrina', e.target.value)}
                  placeholder="Límpida, âmbar, colúria, hematúria..."
                  containerClassName="sm:col-span-2"
                />
              </div>
            </div>

            {/* d) Exame Proctológico & e) Exame Ginecológico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                  d) EXAME PROCTOLÓGICO
                </span>
                <div className="space-y-2">
                  <UnderlineInput
                    label="Posição"
                    value={data.proctologicoPosicao}
                    onChange={(e) => updateField('proctologicoPosicao', e.target.value)}
                    placeholder="Sims, genupeitoral..."
                  />
                  <UnderlineInput
                    label="Inspecção"
                    value={data.proctologicoInspecao}
                    onChange={(e) => updateField('proctologicoInspecao', e.target.value)}
                    placeholder="Fissuras, hemorróidas..."
                  />
                  <UnderlineInput
                    label="Palpação (toque rectal)"
                    value={data.proctologicoPalpacao}
                    onChange={(e) => updateField('proctologicoPalpacao', e.target.value)}
                    placeholder="Tónus esfincteriano, próstata..."
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                  e) EXAME GINECOLÓGICO
                </span>
                <div className="space-y-2">
                  <UnderlineInput
                    label="Posição"
                    value={data.ginecologicoPosicao}
                    onChange={(e) => updateField('ginecologicoPosicao', e.target.value)}
                    placeholder="Ginecológica (ou 'Não aplicável')..."
                  />
                  <UnderlineInput
                    label="Inspecção"
                    value={data.ginecologicoInspecao}
                    onChange={(e) => updateField('ginecologicoInspecao', e.target.value)}
                    placeholder="Genitália externa, espéculo..."
                  />
                  <UnderlineInput
                    label="Palpação, bimanual (toque vaginal)"
                    value={data.ginecologicoPalpacao}
                    onChange={(e) => updateField('ginecologicoPalpacao', e.target.value)}
                    placeholder="Colo do útero, fundos de saco..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* III.6 - EXTREMIDADES */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b pb-1 mb-3">
            III.6 – EXTREMIDADES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                a) MEMBROS SUPERIORES
              </span>
              <div className="space-y-2">
                <UnderlineInput
                  label="Inspecção"
                  value={data.membrosSupInspecao}
                  onChange={(e) => updateField('membrosSupInspecao', e.target.value)}
                  placeholder="Atrofia, simetria..."
                />
                <UnderlineInput
                  label="Palpação"
                  value={data.membrosSupPalpacao}
                  onChange={(e) => updateField('membrosSupPalpacao', e.target.value)}
                  placeholder="Pulsos radiais, temperatura..."
                />
                <UnderlineInput
                  label="Auscultação"
                  value={data.membrosSupAuscultacao}
                  onChange={(e) => updateField('membrosSupAuscultacao', e.target.value)}
                  placeholder="Sopros arteriais..."
                />
                <UnderlineInput
                  label="Manobras especiais"
                  value={data.membrosSupManobras}
                  onChange={(e) => updateField('membrosSupManobras', e.target.value)}
                  placeholder="Mingazzini de MMS..."
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                b) MEMBROS INFERIORES
              </span>
              <div className="space-y-2">
                <UnderlineInput
                  label="Inspecção"
                  value={data.membrosInfInspecao}
                  onChange={(e) => updateField('membrosInfInspecao', e.target.value)}
                  placeholder="Edema maleolar, varizes..."
                />
                <UnderlineInput
                  label="Palpação"
                  value={data.membrosInfPalpacao}
                  onChange={(e) => updateField('membrosInfPalpacao', e.target.value)}
                  placeholder="Pulsos pediosos, tibiais..."
                />
                <UnderlineInput
                  label="Auscultação"
                  value={data.membrosInfAuscultacao}
                  onChange={(e) => updateField('membrosInfAuscultacao', e.target.value)}
                  placeholder="Sopros femorais..."
                />
                <UnderlineInput
                  label="Manobras especiais"
                  value={data.membrosInfManobras}
                  onChange={(e) => updateField('membrosInfManobras', e.target.value)}
                  placeholder="Barré, Lasègue..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* III.7 - EXAME NEUROLÓGICO */}
        <div id="sec-neurologico" className="mb-6 scroll-mt-24">
          <div className="bg-blue-900 text-white px-3 py-1.5 rounded-t-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              III.7 – EXAME NEUROLÓGICO (ESPECIALIZADO)
            </h3>
          </div>

          <div className="bg-slate-50/70 p-4 border border-blue-900/30 rounded-b-lg space-y-3">
            <UnderlineInput
              label="Estado mental"
              value={data.estadoMental}
              onChange={(e) => updateField('estadoMental', e.target.value)}
              placeholder="Orientação têmporo-espacial, memória, raciocínio, afeto..."
            />

            <UnderlineInput
              label="Linguagem"
              value={data.linguagem}
              onChange={(e) => updateField('linguagem', e.target.value)}
              placeholder="Fluência, compreensão, nomeação, repetição, afasia..."
            />

            <div className="border border-slate-200 bg-white rounded-lg p-3 my-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-950 block mb-3 border-b pb-1">
                Nervos cranianos:
              </span>
              <div className="space-y-2">
                <UnderlineInput
                  label="a) 1º par (Olfativo)"
                  value={data.par1}
                  onChange={(e) => updateField('par1', e.target.value)}
                  placeholder="Olfato em cada narina"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UnderlineInput
                    label="b) 2º par (Óptico)"
                    value={data.par2}
                    onChange={(e) => updateField('par2', e.target.value)}
                    placeholder="Acuidade e campos visuais"
                  />
                  <UnderlineInput
                    label="Fundoscopia"
                    value={data.fundoscopia}
                    onChange={(e) => updateField('fundoscopia', e.target.value)}
                    placeholder="Edema de papila, hemorragias..."
                  />
                </div>
                <UnderlineInput
                  label="c) 3º, 4º e 6º pares (Oculomotor, Troclear, Abducente)"
                  value={data.pares3_4_6}
                  onChange={(e) => updateField('pares3_4_6', e.target.value)}
                  placeholder="Motilidade ocular extrínseca, pupilas, diplopia..."
                />
                <UnderlineInput
                  label="d) 5º par (Trigémeo)"
                  value={data.par5}
                  onChange={(e) => updateField('par5', e.target.value)}
                  placeholder="Sensibilidade da face (V1, V2, V3), mastigação, reflexo corneano..."
                />
                <UnderlineInput
                  label="e) 7º par (Facial)"
                  value={data.par7}
                  onChange={(e) => updateField('par7', e.target.value)}
                  placeholder="Mímica facial (paresia central vs. periférica), paladar 2/3 anteriores..."
                />
                <UnderlineInput
                  label="f) 8º par (Vestibulococlear)"
                  value={data.par8}
                  onChange={(e) => updateField('par8', e.target.value)}
                  placeholder="Acuidade auditiva, Rinne, Weber, nistagmo, vertigem..."
                />
                <UnderlineInput
                  label="g) 9º e 10º pares (Glossofaríngeo e Vago)"
                  value={data.pares9_10}
                  onChange={(e) => updateField('pares9_10', e.target.value)}
                  placeholder="Voz, deglutição, reflexo do vómito, véu palatino..."
                />
                <UnderlineInput
                  label="h) 11º par (Acessório)"
                  value={data.par11}
                  onChange={(e) => updateField('par11', e.target.value)}
                  placeholder="Esternocleidomastóideo e trapézio (elevação ombro / rotação cabeça)..."
                />
                <UnderlineInput
                  label="i) 12º par (Hipoglosso)"
                  value={data.par12}
                  onChange={(e) => updateField('par12', e.target.value)}
                  placeholder="Protusão e movimentos da língua, desvios, atrofia..."
                />
              </div>
            </div>

            <UnderlineInput
              label="Tónus muscular"
              value={data.tonusMuscular}
              onChange={(e) => updateField('tonusMuscular', e.target.value)}
              placeholder="Eutonia, espasticidade (roda dentada/canivete), hipotonia..."
            />

            <UnderlineInput
              label="Força muscular"
              value={data.forcaMuscular}
              onChange={(e) => updateField('forcaMuscular', e.target.value)}
              placeholder="Escala MRC 0 a 5/5 por segmentos (paresia / plegia)..."
            />

            <UnderlineInput
              label="Coordenação motora e marcha"
              value={data.coordenacaoMarcha}
              onChange={(e) => updateField('coordenacaoMarcha', e.target.value)}
              placeholder="Índice-nariz, calcanhar-joelho, Romberg, marcha ceifante/atáxica..."
            />

            <UnderlineInput
              label="Sensibilidade"
              value={data.sensibilidade}
              onChange={(e) => updateField('sensibilidade', e.target.value)}
              placeholder="Táctil, térmica, dolorosa, proprioceptiva (nível sensitivo)..."
            />

            <UnderlineInput
              label="Reflexos"
              value={data.reflexos}
              onChange={(e) => updateField('reflexos', e.target.value)}
              placeholder="Osteotendinosos (bicipital, patelar, etc.), cutâneo-plantar (Babinski)..."
            />

            <UnderlineInput
              label="Sinais meníngeos"
              value={data.sinaisMeningeos}
              onChange={(e) => updateField('sinaisMeningeos', e.target.value)}
              placeholder="Rigidez da nuca, sinal de Kernig, sinal de Brudzinski..."
            />
          </div>
        </div>
      </section>

      {/* SECTION IV - RESUMO */}
      <section id="sec-resumo" className="mb-8 scroll-mt-24">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            IV – RESUMO (dados importantes da anamnese e do exame físico)
          </h2>
        </div>
        <FormTextArea
          label="Resumo Clínico da Admissão"
          value={data.resumo}
          onChange={(val) => updateField('resumo', val)}
          placeholder="Síntese sumária que fundamenta o raciocínio diagnóstico e topográfico..."
          rows={6}
        />
      </section>

      {/* SECTION V - DIAGNÓSTICOS SINDRÓMICOS */}
      <section id="sec-diagnosticos" className="mb-8 scroll-mt-24">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            V- DIAGNÓSTICOS SINDRÓMICOS (por ordem de importância)
          </h2>
        </div>
        <FormTextArea
          label="Síndromes Clínicas Identificadas"
          value={data.diagnosticosSindromicos}
          onChange={(val) => updateField('diagnosticosSindromicos', val)}
          placeholder="Ex: 1. Síndrome de Hipertensão Intracraniana&#10;2. Síndrome Deficitária Motora..."
          rows={4}
        />
      </section>

      {/* SECTION VI - DIAGNÓSTICOS ETIOLÓGICOS */}
      <section className="mb-8">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            VI - DIAGNÓSTICOS ETIOLÓGICOS (por ordem de importância)
          </h2>
        </div>
        <FormTextArea
          label="Hipóteses Etiológicas Prováveis"
          value={data.diagnosticosEtiologicos}
          onChange={(val) => updateField('diagnosticosEtiologicos', val)}
          placeholder="Ex: 1. Neoplasia primária do SNC (Glioma alto grau)&#10;2. Metástase cerebral..."
          rows={4}
        />
      </section>

      {/* SECTION VII - DIAGNÓSTICOS TOPOGRÁFICOS */}
      <section className="mb-8">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            VII - DIAGNÓSTICOS TOPOGRÁFICOS
          </h2>
        </div>
        <FormTextArea
          label="Localização Anatómica / Topográfica da Lesão"
          value={data.diagnosticosTopograficos}
          onChange={(val) => updateField('diagnosticosTopograficos', val)}
          placeholder="Ex: Região supratentorial fronto-parietal direita (córtex e substância branca)..."
          rows={3}
        />
      </section>

      {/* SECTION VIII - MEIOS AUXILIARES E COMPLEMENTARES + UPLOAD DE IMAGENS (TAC, RX) */}
      <section id="sec-exames-complementares" className="mb-8 scroll-mt-24">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            VIII - MEIOS AUXILIARES E COMPLEMENTARES DE DIAGNÓSTICOS
          </h2>
          <span className="text-xs text-slate-500 font-normal">
            (por ordem de prioridade, justificar o motivo do pedido)
          </span>
        </div>

        <FormTextArea
          label="Exames Solicitados e Justificação Clínica"
          value={data.meiosAuxiliares}
          onChange={(val) => updateField('meiosAuxiliares', val)}
          placeholder="1. TAC Craniana c/ contraste: para avaliar lesão expansiva e desvio da linha média...&#10;2. RX Tórax PA: rastreio infeccioso e primário neoplásico...&#10;3. Análises laboratoriais..."
          rows={5}
        />

        {/* User-requested feature: TAC and RX image upload fields with exam date and brief comments */}
        <ImageUploader
          images={data.attachedImages}
          onChange={(imgs) => updateField('attachedImages', imgs)}
        />
      </section>

      {/* SECTION IX - DIAGNÓSTICO DIFERENCIAIS */}
      <section className="mb-8">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            IX - DIAGNÓSTICO DIFERENCIAIS (5) E DISCUSSÃO DO DIAGNÓSTICO (justificar)
          </h2>
        </div>
        <FormTextArea
          label="Diagnósticos Diferenciais e Discussão"
          value={data.diagnosticosDiferenciais}
          onChange={(val) => updateField('diagnosticosDiferenciais', val)}
          placeholder="Discuta os 5 principais diagnósticos diferenciais fundamentando a favor e contra cada um..."
          rows={6}
        />
      </section>

      {/* SECTION X - DIAGNÓSTICO DEFINITIVO */}
      <section className="mb-8">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            X – DIAGNÓSTICO (S) DEFINITIVO (S)
          </h2>
        </div>
        <FormTextArea
          label="Diagnóstico Definitivo / Conclusão Clínica"
          value={data.diagnosticosDefinitivos}
          onChange={(val) => updateField('diagnosticosDefinitivos', val)}
          placeholder="Conclusão diagnóstica consolidada..."
          rows={3}
        />
      </section>

      {/* SECTION XI - PROPOSTA TERAPÊUTICA / CONDUTA */}
      <section id="sec-conduta" className="mb-8 scroll-mt-24">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            XI - PROPOSTA TERAPEUTICA/CONDUTA (justificar)
          </h2>
        </div>
        <FormTextArea
          label="Conduta Médica, Cirúrgica e Plano de Cuidados"
          value={data.propostaTerapeutica}
          onChange={(val) => updateField('propostaTerapeutica', val)}
          placeholder="1. Terapêutica médica imediata (anti-edema, analgesia, profilaxia)&#10;2. Proposta cirúrgica neurocirúrgica e urgência da intervenção..."
          rows={5}
        />
      </section>

      {/* SECTION XII - PROGNÓSTICO */}
      <section className="mb-8">
        <div className="bg-slate-100/80 px-3 py-1.5 border-l-4 border-blue-900 mb-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            XII - PROGNÓSTICO (de vida, sequelas,...)
          </h2>
        </div>
        <FormTextArea
          label="Avaliação Prognóstica"
          value={data.prognostico}
          onChange={(val) => updateField('prognostico', val)}
          placeholder="Prognóstico quanto à sobrevida, sequelas neurológicas funcionais e reabilitação..."
          rows={3}
        />
      </section>

      {/* SIGN-OFF SECTION */}
      <section className="mt-12 pt-6 border-t-2 border-slate-900 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UnderlineInput
            label="ELABORADO POR: Dr (a)"
            value={data.elaboradoPor}
            onChange={(e) => updateField('elaboradoPor', e.target.value)}
            containerClassName="md:col-span-2"
            placeholder="Nome do médico relator"
          />
          <UnderlineInput
            label="MR /NC"
            value={data.mrNc}
            onChange={(e) => updateField('mrNc', e.target.value)}
            placeholder="Nº de Ordem / Categoria"
          />
        </div>

        <UnderlineInput
          label="CORRIGIDO POR"
          value={data.corrigidoPor}
          onChange={(e) => updateField('corrigidoPor', e.target.value)}
          placeholder="Médico Especialista / Tutor de Neurocirurgia"
        />

        <div className="space-y-1">
          <span className="font-semibold text-slate-800 text-sm">COMENTÁRIOS:</span>
          <textarea
            rows={3}
            value={data.comentariosFinais}
            onChange={(e) => updateField('comentariosFinais', e.target.value)}
            placeholder="Anotações da discussão clínica, parecer do tutor ou orientações de serviço..."
            className="w-full text-sm leading-relaxed border border-slate-300 rounded-lg p-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </section>
    </div>
  );
};
