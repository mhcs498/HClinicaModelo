import React, { useState, useEffect, useRef } from 'react';
import {
  FileDown,
  Printer,
  FileText,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Share2,
  Stethoscope,
  ChevronRight,
  Eye,
  Loader2,
  Sparkles,
  Layout,
} from 'lucide-react';
import { ClinicalCaseData } from './types/clinicalCase';
import { createEmptyCase, sampleCaseData } from './utils/initialData';
import { exportClinicalCaseToDocx, exportPosterToDocx } from './utils/docxExport';
import { ClinicalCaseForm } from './components/ClinicalCaseForm';
import { InteractivePoster } from './components/InteractivePoster';

const LOCAL_STORAGE_KEY = 'neuro_historia_clinica_data_v1';

export default function App() {
  const [formData, setFormData] = useState<ClinicalCaseData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...sampleCaseData,
          ...parsed,
          tipoEvento: parsed.tipoEvento || 'Jornadas Científicas do Hospital Central de Nampula',
          hospital: parsed.hospital || 'HOSPITAL CENTRAL DE NAMPULA',
        };
      }
    } catch (e) {
      console.error('Falha ao carregar rascunho:', e);
    }
    // Default to sample so the user immediately sees the populated form with TAC & RX, or empty
    return sampleCaseData;
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPoster, setIsExportingPoster] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Guardado');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [viewMode, setViewMode] = useState<'poster' | 'form'>('poster');
  const fileInputBackupRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      setSaveStatus('Guardado');
    } catch (e) {
      // In case images exceed localStorage quota (e.g. >5MB), show warning gracefully
      setSaveStatus('Armazenamento local cheio');
    }
  }, [formData]);

  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      await exportClinicalCaseToDocx(formData);
    } catch (error) {
      console.error('Erro na exportação para Word:', error);
      alert('Houve um erro ao gerar o documento Word. Verifique as imagens anexadas.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPosterDocx = async () => {
    try {
      setIsExportingPoster(true);
      await exportPosterToDocx(formData);
    } catch (error) {
      console.error('Erro na exportação do poster para Word:', error);
      alert('Houve um erro ao gerar o Poster em Word. Verifique as imagens anexadas.');
    } finally {
      setIsExportingPoster(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSample = () => {
    setFormData(sampleCaseData);
    setShowConfirmReset(false);
  };

  const handleClear = () => {
    setFormData(createEmptyCase());
    setShowConfirmReset(false);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Caso_Clinico_${(formData.nome || 'Paciente').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setFormData(parsed);
      } catch (err) {
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Application Header & Action Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Branding Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md">
                <Stethoscope className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-slate-900">
                    História Clínica & Poster Científico
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Hospital Central de Maputo</span>
                  <span aria-hidden="true">·</span>
                  <span>Neurocirurgia</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle className="w-3 h-3" /> {saveStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* View Mode Switcher (Poster Interativo vs Formulário Hospitalar) */}
            <div className="flex items-center justify-center">
              <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setViewMode('poster')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'poster'
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Poster Interativo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'form'
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Formulário Hospitalar</span>
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {viewMode === 'poster' ? (
                <>
                  <button
                    type="button"
                    onClick={handleExportPosterDocx}
                    disabled={isExportingPoster}
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg shadow-sm text-xs sm:text-sm font-bold transition-all hover:shadow cursor-pointer disabled:opacity-50 ring-2 ring-blue-600/30"
                    title="Exportar Poster Científico no formato Word (.docx) em layout horizontal com todas as caixas clínicas e exames anexados"
                  >
                    {isExportingPoster ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>A Gerar Poster Word...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 text-blue-200" />
                        <span>Exportar Poster em Word</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportDocx}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    title="Exportar história clínica oficial completa de 9 páginas para Microsoft Word"
                  >
                    {isExporting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className="hidden sm:inline">Formulário Word (.docx)</span>
                    <span className="sm:hidden">Formulário</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleExportDocx}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg shadow-sm text-xs sm:text-sm font-bold transition-all hover:shadow cursor-pointer disabled:opacity-50"
                    title="Exportar formulário oficial completo com todas as seções e imagens para Microsoft Word"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>A Gerar Formulário...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 text-blue-200" />
                        <span>Baixar Word (.docx)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportPosterDocx}
                    disabled={isExportingPoster}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    title="Exportar versão em formato de Poster Científico para Word"
                  >
                    {isExportingPoster ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>Poster em Word</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="Imprimir ou Salvar como PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimir / PDF</span>
              </button>

              {/* Utility Dropdown / Buttons */}
              <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-2 py-1 text-xs text-blue-700 hover:text-blue-900 font-medium hover:bg-blue-50 rounded transition-colors cursor-pointer"
                  title="Carregar exemplo completo de caso com TAC e RX anexados"
                >
                  Exemplo
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-red-600 font-medium hover:bg-red-50 rounded transition-colors cursor-pointer"
                  title="Limpar todos os campos"
                >
                  Limpar
                </button>

                <input
                  type="file"
                  ref={fileInputBackupRef}
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                  title="Exportar backup JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputBackupRef.current?.click()}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                  title="Restaurar backup JSON"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Section Anchors for fast navigation when in Form mode */}
          {viewMode === 'form' && (
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar text-xs">
              <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
                Saltar para:
              </span>
              <button
                onClick={() => scrollToSection('sec-identificacao')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-600 whitespace-nowrap transition-colors"
              >
                I. Identificação
              </button>
              <button
                onClick={() => scrollToSection('sec-anamnese')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-600 whitespace-nowrap transition-colors"
              >
                II. Anamnese
              </button>
              <button
                onClick={() => scrollToSection('sec-exame-objectivo')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-600 whitespace-nowrap transition-colors"
              >
                III. Exame Físico
              </button>
              <button
                onClick={() => scrollToSection('sec-neurologico')}
                className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 whitespace-nowrap transition-colors"
              >
                III.7 Exame Neurológico
              </button>
              <button
                onClick={() => scrollToSection('sec-resumo')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-600 whitespace-nowrap transition-colors"
              >
                IV. Resumo
              </button>
              <button
                onClick={() => scrollToSection('sec-diagnosticos')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-600 whitespace-nowrap transition-colors"
              >
                V-VII. Diagnósticos
              </button>
              <button
                onClick={() => scrollToSection('sec-exames-complementares')}
                className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-800 font-bold hover:bg-indigo-100 whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <span>VIII. Exames & Imagens (TAC / RX)</span>
                {formData.attachedImages.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                    {formData.attachedImages.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => scrollToSection('sec-conduta')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-600 whitespace-nowrap transition-colors"
              >
                XI. Conduta
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 text-lg">Limpar Formulário?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Esta ação irá apagar todas as respostas e imagens atualmente preenchidas no formulário e no poster. Deseja prosseguir?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm"
              >
                Sim, Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        {viewMode === 'poster' ? (
          <InteractivePoster
            data={formData}
            onEditInForm={() => setViewMode('form')}
            onExportDocx={handleExportDocx}
            onExportPosterDocx={handleExportPosterDocx}
            isExportingDocx={isExporting}
            isExportingPosterDocx={isExportingPoster}
          />
        ) : (
          <div className="py-8 px-3 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>
                  Está a editar o formulário hospitalar. As alterações são sincronizadas instantaneamente com o <strong>Poster Interativo</strong> e o <strong>documento Word</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('poster')}
                className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0"
              >
                Ver Poster Interativo
              </button>
            </div>
            <ClinicalCaseForm data={formData} onChange={setFormData} />
          </div>
        )}
      </main>

      {/* Footer info (when not in full poster mode or for standard footer) */}
      {viewMode === 'form' && (
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
            <div>
              Ordem dos Médicos de Moçambique • Colégio de Neurocirurgia • Hospital Central de Maputo
            </div>
            <div className="text-slate-400">
              Exportação nativa .docx com suporte a imagens de TAC & RX
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

