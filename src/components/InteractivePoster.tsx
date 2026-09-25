import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  FileDown,
  Edit3,
  Sliders,
  Sparkles,
  Activity,
  Layers,
  Brain,
  AlertCircle,
  HelpCircle,
  Award,
  Check,
  Crosshair,
  Printer,
  Info,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { ClinicalCaseData, AttachedImage } from '../types/clinicalCase';

interface InteractivePosterProps {
  data: ClinicalCaseData;
  onEditInForm: () => void;
  onExportDocx: () => void;
  onExportPosterDocx: () => void;
  isExportingDocx: boolean;
  isExportingPosterDocx: boolean;
}

type PosterTheme = 'clean-light' | 'blue-header' | 'clinical-blue' | 'classic-navy';

export const InteractivePoster: React.FC<InteractivePosterProps> = ({
  data,
  onEditInForm,
  onExportDocx,
  onExportPosterDocx,
  isExportingDocx,
  isExportingPosterDocx,
}) => {
  // Default to 100% white background as requested by user
  const [theme, setTheme] = useState<PosterTheme>('clean-light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [laserPointerActive, setLaserPointerActive] = useState(false);
  const [laserCoords, setLaserCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [imageFilter, setImageFilter] = useState<'normal' | 'invert' | 'high-contrast' | 'bone'>('normal');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const posterContainerRef = useRef<HTMLDivElement>(null);

  // Laser pointer tracking for presentations
  useEffect(() => {
    if (!laserPointerActive) {
      setLaserCoords(null);
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      setLaserCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [laserPointerActive]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      posterContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Theme styling configurations (Clean 100% White Presentation by default)
  const isDark = theme === 'classic-navy';

  const themeStyles = {
    'clean-light': {
      bg: 'bg-white',
      headerBg: 'bg-white border-2 border-slate-300 shadow-md',
      headerBorder: 'border-slate-300',
      headerIsLight: true,
      headerTitle: 'text-blue-950',
      headerSubtitle: 'text-slate-600',
      headerInst: 'text-blue-900',
      headerSubInst: 'text-slate-700',
      headerHosp: 'text-blue-900',
      headerService: 'text-slate-700',
      headerIconBox: 'bg-blue-50 border-blue-200 text-blue-700',
      headerBadge: 'bg-amber-100 text-amber-950 border-amber-300/90 shadow-xs',
      headerBadgeIcon: 'text-amber-700',
      headerDivider: 'border-slate-200',
      headerAuthorLabel: 'text-slate-500',
      headerAuthorName: 'text-slate-900 font-bold',
      headerOrientador: 'text-emerald-700 font-bold',
      headerPatientBox: 'bg-slate-50 border-slate-200 text-slate-800',
      headerPatientLabel: 'text-slate-500',
      headerPatientName: 'text-slate-900 font-bold',
      headerPatientNid: 'text-blue-700 font-semibold',
      cardBg: 'bg-white border-slate-200 text-slate-800 shadow-xs',
      panelHeader: 'text-blue-900 border-b border-slate-200 font-bold',
      subtext: 'text-slate-500 font-medium',
      subBox: 'bg-slate-50 border-slate-200/90 text-slate-800',
      bodyText: 'text-slate-700',
      accentColor: 'text-blue-700',
      footerBorder: 'border-slate-200 text-slate-600',
    },
    'blue-header': {
      bg: 'bg-white',
      headerBg: 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950',
      headerBorder: 'border-blue-900',
      headerIsLight: false,
      headerTitle: 'text-white',
      headerSubtitle: 'text-slate-200',
      headerInst: 'text-sky-300',
      headerSubInst: 'text-slate-100',
      headerHosp: 'text-sky-300',
      headerService: 'text-slate-100',
      headerIconBox: 'bg-white/10 border-white/25 text-sky-300',
      headerBadge: 'bg-amber-400/20 text-amber-200 border-amber-300/40 shadow-xs',
      headerBadgeIcon: 'text-amber-300',
      headerDivider: 'border-white/15',
      headerAuthorLabel: 'text-slate-300',
      headerAuthorName: 'text-white font-bold',
      headerOrientador: 'text-emerald-300 font-bold',
      headerPatientBox: 'bg-white/10 border-white/15 text-white',
      headerPatientLabel: 'text-slate-300',
      headerPatientName: 'text-white font-bold',
      headerPatientNid: 'text-sky-300 font-semibold',
      cardBg: 'bg-white border-slate-200 text-slate-800 shadow-xs',
      panelHeader: 'text-blue-900 border-b border-slate-200 font-bold',
      subtext: 'text-slate-500 font-medium',
      subBox: 'bg-slate-50 border-slate-200/90 text-slate-800',
      bodyText: 'text-slate-700',
      accentColor: 'text-blue-700',
      footerBorder: 'border-slate-200 text-slate-600',
    },
    'clinical-blue': {
      bg: 'bg-blue-50/70',
      headerBg: 'bg-gradient-to-r from-blue-900 via-sky-950 to-blue-900',
      headerBorder: 'border-blue-600',
      headerIsLight: false,
      headerTitle: 'text-white',
      headerSubtitle: 'text-sky-100',
      headerInst: 'text-sky-300',
      headerSubInst: 'text-slate-100',
      headerHosp: 'text-sky-300',
      headerService: 'text-slate-100',
      headerIconBox: 'bg-white/10 border-white/25 text-sky-300',
      headerBadge: 'bg-amber-400/20 text-amber-200 border-amber-300/40 shadow-xs',
      headerBadgeIcon: 'text-amber-300',
      headerDivider: 'border-white/15',
      headerAuthorLabel: 'text-slate-300',
      headerAuthorName: 'text-white font-bold',
      headerOrientador: 'text-emerald-300 font-bold',
      headerPatientBox: 'bg-white/10 border-white/15 text-white',
      headerPatientLabel: 'text-slate-300',
      headerPatientName: 'text-white font-bold',
      headerPatientNid: 'text-sky-300 font-semibold',
      cardBg: 'bg-white border-blue-200 text-slate-800 shadow-sm',
      panelHeader: 'text-blue-950 border-b border-blue-100 font-bold',
      subtext: 'text-slate-500 font-medium',
      subBox: 'bg-blue-50/60 border-blue-100 text-slate-800',
      bodyText: 'text-slate-700',
      accentColor: 'text-blue-800',
      footerBorder: 'border-blue-200 text-slate-600',
    },
    'classic-navy': {
      bg: 'bg-slate-950',
      headerBg: 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950',
      headerBorder: 'border-blue-700/60',
      headerIsLight: false,
      headerTitle: 'text-white',
      headerSubtitle: 'text-slate-200',
      headerInst: 'text-sky-300',
      headerSubInst: 'text-slate-100',
      headerHosp: 'text-sky-300',
      headerService: 'text-slate-100',
      headerIconBox: 'bg-white/10 border-white/25 text-sky-300',
      headerBadge: 'bg-amber-400/20 text-amber-200 border-amber-300/40 shadow-xs',
      headerBadgeIcon: 'text-amber-300',
      headerDivider: 'border-white/15',
      headerAuthorLabel: 'text-slate-300',
      headerAuthorName: 'text-white font-bold',
      headerOrientador: 'text-emerald-300 font-bold',
      headerPatientBox: 'bg-white/10 border-white/15 text-white',
      headerPatientLabel: 'text-slate-300',
      headerPatientName: 'text-white font-bold',
      headerPatientNid: 'text-sky-300 font-semibold',
      cardBg: 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl',
      panelHeader: 'text-blue-300 border-b border-blue-900/80 font-bold',
      subtext: 'text-slate-400',
      subBox: 'bg-slate-800/60 border-slate-700 text-slate-200',
      bodyText: 'text-slate-300',
      accentColor: 'text-sky-400',
      footerBorder: 'border-slate-800 text-slate-400',
    },
  }[theme];

  const currentImg: AttachedImage | undefined = data.attachedImages[selectedImageIndex];

  // Helper for filter style
  const getFilterStyle = () => {
    switch (imageFilter) {
      case 'invert':
        return 'invert contrast-125';
      case 'high-contrast':
        return 'contrast-175 brightness-110';
      case 'bone':
        return 'contrast-200 grayscale brightness-125';
      default:
        return '';
    }
  };

  return (
    <div
      ref={posterContainerRef}
      className={`min-h-screen ${themeStyles.bg} transition-colors duration-300 pb-12 selection:bg-blue-500/20 font-sans relative`}
    >
      {/* Virtual Laser Pointer Simulator */}
      {laserPointerActive && laserCoords && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${laserCoords.x}px`, top: `${laserCoords.y}px` }}
        >
          <div className="w-5 h-5 rounded-full bg-red-500/80 animate-ping absolute -inset-0.5"></div>
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_12px_#ff0000] border-2 border-white"></div>
        </div>
      )}

      {/* Poster Toolbar (Control Bar) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm tracking-wide text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              POSTER CIENTÍFICO INTERATIVO
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-600 font-medium hidden sm:inline">
              Fundo Branco • {data.tipoEvento || 'Jornadas Científicas do Hospital Central de Nampula'}
            </span>
          </div>

          {/* Theme Palette Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-300/80">
            <span className="text-[11px] text-slate-500 px-1.5 font-medium">Tema:</span>
            {(
              [
                { id: 'clean-light', label: 'Fundo 100% Branco' },
                { id: 'blue-header', label: 'Cabeçalho Azul' },
                { id: 'clinical-blue', label: 'Azul Clínico' },
                { id: 'classic-navy', label: 'Escuro' },
              ] as { id: PosterTheme; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  theme === t.id
                    ? 'bg-blue-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Laser Pointer Toggle */}
          <button
            type="button"
            onClick={() => setLaserPointerActive(!laserPointerActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              laserPointerActive
                ? 'bg-red-600 text-white border-red-500 shadow-xs'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Ativar apontador laser virtual para apresentações orais em congressos ou sessões clínicas"
          >
            <Crosshair className={`w-3.5 h-3.5 ${laserPointerActive ? 'text-white' : 'text-red-600'}`} />
            <span>{laserPointerActive ? 'Laser Ativo' : 'Apontador Laser'}</span>
          </button>

          {/* Fullscreen Presentation */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Modo Ecrã Inteiro para Apresentação em Projetor"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFullscreen ? 'Sair' : 'Apresentação'}</span>
          </button>

          {/* Edit in Form */}
          <button
            type="button"
            onClick={onEditInForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium transition-colors cursor-pointer"
            title="Editar os dados do caso clínico no formulário hospitalar"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Editar Formulário</span>
          </button>

          {/* Export Poster to Word Button */}
          <button
            type="button"
            onClick={onExportPosterDocx}
            disabled={isExportingPosterDocx}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 ring-2 ring-blue-600/30"
            title="Exportar o Poster Científico no formato Word (.docx) em layout horizontal com cabeçalho, caixas e exames"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-200" />
            <span>{isExportingPosterDocx ? 'A Gerar Poster Word...' : 'Exportar Poster em Word'}</span>
          </button>

          {/* Export Full Clinical History to Word */}
          <button
            type="button"
            onClick={onExportDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Descarregar a história clínica oficial completa de 9 páginas em formato Word (.docx)"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{isExportingDocx ? 'A Exportar...' : 'Formulário Completo (.docx)'}</span>
            <span className="sm:hidden">Formulário</span>
          </button>
        </div>
      </div>

      {/* Main Poster Container (Standard Scientific E-Poster Layout) */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 pt-5">
        {/* ========================================================
            POSTER BANNER / HEADER (INSTITUCIONAL & TÍTULO)
           ======================================================== */}
        <header
          className={`${themeStyles.headerBg} rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden mb-6 ${
            themeStyles.headerIsLight ? 'border-2 border-slate-300' : 'border-2 ' + themeStyles.headerBorder + ' text-white'
          }`}
        >
          {/* Subtle Decorative Pattern */}
          <div
            className={`absolute inset-0 pointer-events-none [background-size:16px_16px] ${
              themeStyles.headerIsLight
                ? 'opacity-30 bg-[radial-gradient(#94a3b8_1px,transparent_1px)]'
                : 'opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)]'
            }`}
          ></div>

          <div
            className={`relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b ${themeStyles.headerDivider}`}
          >
            {/* Institution Left */}
            <div className="flex items-center gap-4">
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${themeStyles.headerIconBox}`}
              >
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <p className={`text-[11px] uppercase tracking-widest font-extrabold ${themeStyles.headerInst}`}>
                  {data.institution || 'ORDEM DOS MÉDICOS DE MOÇAMBIQUE'}
                </p>
                <p className={`text-sm font-bold ${themeStyles.headerSubInst}`}>
                  {data.subInstitution || 'COLÉGIO DE NEUROCIRURGIA'}
                </p>
              </div>
            </div>

            {/* Title Center */}
            <div className="text-center md:flex-1 max-w-3xl">
              <div
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full mb-2 ${themeStyles.headerBadge}`}
              >
                <Award className={`w-3.5 h-3.5 shrink-0 ${themeStyles.headerBadgeIcon}`} />
                <span>{data.tipoEvento || 'Jornadas Científicas do Hospital Central de Nampula'}</span>
              </div>
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-tight font-serif drop-shadow-xs ${themeStyles.headerTitle}`}>
                {data.diagnosticosDefinitivos || data.motivoInternamento || 'HISTÓRIA CLÍNICA DE NEUROCIRURGIA'}
              </h1>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${themeStyles.headerSubtitle}`}>
                Abordagem Semiológica, Análise Radiológica (TAC/RX) e Conduta Cirúrgica
              </p>
            </div>

            {/* Hospital Right */}
            <div className="text-right shrink-0">
              <p className={`text-[11px] uppercase tracking-widest font-extrabold ${themeStyles.headerHosp}`}>
                {data.hospital || 'HOSPITAL CENTRAL DE NAMPULA'}
              </p>
              <p className={`text-sm font-bold ${themeStyles.headerService}`}>
                {data.service || 'SERVIÇO DE NEUROCIRURGIA'}
              </p>
            </div>
          </div>

          {/* Authors & Patient Quick Demographics Sub-Bar */}
          <div className="relative z-10 pt-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
              <div>
                <span className={themeStyles.headerAuthorLabel}>Elaborado por: </span>
                <span className={themeStyles.headerAuthorName}>
                  {data.elaboradoPor || 'Dr. Médico Residente'}
                </span>
                {data.mrNc && <span className={themeStyles.headerAuthorLabel}> ({data.mrNc})</span>}
              </div>
              {data.corrigidoPor && (
                <div>
                  <span className={themeStyles.headerAuthorLabel}>Orientação / Correcção: </span>
                  <span className={themeStyles.headerOrientador}>{data.corrigidoPor}</span>
                </div>
              )}
            </div>

            {/* Patient Badge */}
            <div className={`flex items-center gap-3 px-3.5 py-1.5 rounded-xl border ${themeStyles.headerPatientBox}`}>
              <div>
                <span className={themeStyles.headerPatientLabel}>Doente: </span>
                <span className={themeStyles.headerPatientName}>{data.nome || 'Não identificado'}</span>
              </div>
              <span className={themeStyles.headerPatientLabel}>•</span>
              <div>
                <span className={themeStyles.headerPatientLabel}>NID: </span>
                <span className={`font-mono ${themeStyles.headerPatientNid}`}>{data.nid || '---'}</span>
              </div>
              <span className={themeStyles.headerPatientLabel}>•</span>
              <div>
                <span className={themeStyles.headerPatientLabel}>Idade/Sexo: </span>
                <span className={themeStyles.headerPatientName}>
                  {data.idade || '--'} / {data.sexo || '--'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================
            POSTER 3-COLUMN SCIENTIFIC GRID
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ----------------------------------------------------
              COLUMN 1: INTRODUÇÃO, ANAMNESE & SINTOMAS (3 COLS)
             ---------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-5 flex flex-col">
            {/* Box 1: Identificação & Proveniência */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-xs`}>
              <h2 className={`text-xs font-bold tracking-wider uppercase ${themeStyles.panelHeader} pb-2 mb-3 flex items-center gap-2`}>
                <Info className="w-4 h-4 text-blue-600" />
                <span>1. Dados Sociodemográficos</span>
              </h2>

              <dl className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-xs">
                <div>
                  <dt className={themeStyles.subtext}>Naturalidade:</dt>
                  <dd className="font-medium text-slate-800 truncate">{data.naturalidade || '---'}</dd>
                </div>
                <div>
                  <dt className={themeStyles.subtext}>Estado Civil:</dt>
                  <dd className="font-medium text-slate-800">{data.estadoCivil || '---'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className={themeStyles.subtext}>Residência:</dt>
                  <dd className="font-medium text-slate-800">{data.residencia || '---'}</dd>
                </div>
                <div>
                  <dt className={themeStyles.subtext}>Profissão:</dt>
                  <dd className="font-medium text-slate-800 truncate">{data.profissao || '---'}</dd>
                </div>
                <div>
                  <dt className={themeStyles.subtext}>Proveniência:</dt>
                  <dd className="font-medium text-slate-800 truncate">{data.provenienteDe || '---'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className={themeStyles.subtext}>História fornecida por:</dt>
                  <dd className="font-medium text-slate-800">{data.historiaFornecidaPor || '---'}</dd>
                </div>
              </dl>
            </div>

            {/* Box 2: Motivo de Internamento & HDA */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-xs flex-1`}>
              <h2 className={`text-xs font-bold tracking-wider uppercase ${themeStyles.panelHeader} pb-2 mb-3 flex items-center gap-2`}>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>2. Motivo de Admissão & HDA</span>
              </h2>

              <div className="mb-3.5">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block mb-1">
                  Queixa Principal / Motivo:
                </span>
                <p className="text-xs font-semibold leading-relaxed p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                  {data.motivoInternamento || 'Sem queixa principal registada.'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  História da Doença Actual (HDA):
                </span>
                <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line text-justify max-h-64 overflow-y-auto pr-1">
                  {data.historiaDoencaActual || 'História clínica da doença actual não preenchida.'}
                </p>
              </div>

              {/* Symptom Highlights / Positive findings */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide block mb-2">
                  Revisão Positiva por Aparelhos:
                </span>
                <div className="space-y-1.5 text-xs">
                  {data.revisaoSistemas.sistemaNervoso.cefaleias.checked && (
                    <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">Cefaleias:</strong>{' '}
                        <span className="text-slate-700 font-medium">
                          {data.revisaoSistemas.sistemaNervoso.cefaleias.observation || 'Presentes'}
                        </span>
                      </div>
                    </div>
                  )}
                  {data.revisaoSistemas.gastrointestinal.vomitos.checked && (
                    <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">Vómitos:</strong>{' '}
                        <span className="text-slate-700 font-medium">
                          {data.revisaoSistemas.gastrointestinal.vomitos.observation || 'Em jato'}
                        </span>
                      </div>
                    </div>
                  )}
                  {data.revisaoSistemas.sistemaNervoso.fraquezaMuscular.checked && (
                    <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">Fraqueza Muscular:</strong>{' '}
                        <span className="text-slate-700 font-medium">
                          {data.revisaoSistemas.sistemaNervoso.fraquezaMuscular.observation || 'Hemicorpo esquerdo'}
                        </span>
                      </div>
                    </div>
                  )}
                  {data.revisaoSistemas.sistemaNervoso.disturbiosVisuais.checked && (
                    <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">Distúrbios Visuais:</strong>{' '}
                        <span className="text-slate-700 font-medium">
                          {data.revisaoSistemas.sistemaNervoso.disturbiosVisuais.observation || 'Visão turva'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Box 3: Antecedentes & História Pregressa */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-xs`}>
              <h2 className={`text-xs font-bold tracking-wider uppercase ${themeStyles.panelHeader} pb-2 mb-3 flex items-center gap-2`}>
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>3. Antecedentes Pessoais & Familiares</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-800 block">História Pregressa:</span>
                  <p className="text-slate-600 line-clamp-3 hover:line-clamp-none transition-all">
                    {data.historiaPregressa || 'Sem antecedentes patológicos de relevo.'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Pessoal & Social:</span>
                  <p className="text-slate-600 line-clamp-2 hover:line-clamp-none transition-all">
                    {data.historiaPessoalSocial || 'Condições habitacionais normais.'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">História Familiar:</span>
                  <p className="text-slate-600 line-clamp-2 hover:line-clamp-none transition-all">
                    {data.historiaFamiliar || 'Sem historial oncológico ou neurológico.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              COLUMN 2: CENTRO - RADIOLOGIA INTERATIVA (TAC/RX) &
              EXAME FÍSICO / GLASGOW (6 COLS)
             ---------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-5 flex flex-col">
            {/* Box 4: Radiologia Interativa (Negatoscópio Digital) */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-md flex-1 flex flex-col`}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-blue-100 text-blue-800">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold tracking-wide uppercase text-slate-900 flex items-center gap-2">
                      Estação Radiológica Interativa (TAC / RX)
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Visualizador digital com magnificação, filtros de exame e laudo anexado
                    </p>
                  </div>
                </div>

                {/* Radiology Filter controls */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px]">
                  <button
                    onClick={() => setImageFilter('normal')}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      imageFilter === 'normal' ? 'bg-blue-700 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setImageFilter('invert')}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      imageFilter === 'invert' ? 'bg-blue-700 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Inverter cores (Negatoscópio de alto contraste)"
                  >
                    Invertido
                  </button>
                  <button
                    onClick={() => setImageFilter('bone')}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      imageFilter === 'bone' ? 'bg-blue-700 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Janela Óssea / Alta definição"
                  >
                    Janela Óssea
                  </button>
                  <button
                    onClick={() => setImageFilter('high-contrast')}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      imageFilter === 'high-contrast' ? 'bg-blue-700 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Realce Tecidual"
                  >
                    Realce
                  </button>
                </div>
              </div>

              {/* Image Tabs / Selector */}
              {data.attachedImages.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 py-3 overflow-x-auto">
                    {data.attachedImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => {
                          setSelectedImageIndex(idx);
                          setZoomLevel(1);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                          selectedImageIndex === idx
                            ? 'bg-blue-700 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>
                          #{idx + 1} {img.type}
                        </span>
                        <span className="text-[10px] opacity-80">({img.examDate || 'Data N/D'})</span>
                      </button>
                    ))}
                  </div>

                  {/* Main Radiology Viewer Canvas (Dark negatoscópio frame is essential for high contrast CT/X-Ray viewing) */}
                  {currentImg && (
                    <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[380px] max-h-[460px] group shadow-inner">
                      <img
                        src={currentImg.dataUrl}
                        alt={`${currentImg.type} - ${currentImg.fileName}`}
                        style={{ transform: `scale(${zoomLevel})` }}
                        className={`max-h-[430px] w-auto object-contain transition-transform duration-200 select-none ${getFilterStyle()}`}
                      />

                      {/* On-Screen HUD Overlay */}
                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs font-mono text-emerald-400">
                        <div className="font-bold flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          <span>EXAME: {currentImg.type}</span>
                        </div>
                        <div className="text-[10px] text-slate-300">
                          Data: {currentImg.examDate || '2026-09-24'} | Zoom: {(zoomLevel * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Zoom controls */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/15 text-xs text-white">
                        <button
                          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                          className="px-2 py-1 hover:bg-white/20 rounded font-bold cursor-pointer"
                          title="Diminuir Zoom"
                        >
                          -
                        </button>
                        <button
                          onClick={() => setZoomLevel(1)}
                          className="px-2 py-1 hover:bg-white/20 rounded text-[11px] cursor-pointer"
                          title="Redefinir Zoom"
                        >
                          100%
                        </button>
                        <button
                          onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                          className="px-2 py-1 hover:bg-white/20 rounded font-bold cursor-pointer"
                          title="Aumentar Zoom"
                        >
                          +
                        </button>
                      </div>

                      {/* Medical commentary bar inside viewer */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 text-xs text-slate-200">
                        <span className="font-bold text-sky-300 flex items-center gap-1 mb-1">
                          <Check className="w-3.5 h-3.5" />
                          Achados e Comentários Radiológicos:
                        </span>
                        <p className="leading-relaxed text-slate-200 drop-shadow">
                          {currentImg.notes || 'Sem comentários registados para esta imagem.'}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl my-4 bg-slate-50">
                  <p className="text-slate-600 text-sm mb-3">Nenhuma imagem radiológica (TAC/RX) anexada.</p>
                  <button
                    onClick={onEditInForm}
                    className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                  >
                    Anexar Imagens no Formulário
                  </button>
                </div>
              )}

              {/* Sinais Vitais & Glasgow Interactive Dial */}
              <div className="mt-4 pt-3.5 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Pressão Arterial</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{data.tensaoArterial || '120/80'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Freq. Cardíaca</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{data.frequenciaCardiaca || '64 bpm'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">SpO2 / Temp</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {data.spO2 || '98%'} / {data.temperaturaAxilar || '36.6ºC'}
                  </span>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  <span className="text-[10px] uppercase font-bold text-blue-900 block">Glasgow (ECG)</span>
                  <span className="text-sm font-black text-blue-950 font-mono">
                    {data.glasgowTotal || '14/15'}{' '}
                    <span className="text-[10px] font-medium text-slate-600 block">
                      (O:{data.glasgowOcular || 4} V:{data.glasgowVerbal || 5} M:{data.glasgowMotor || 5})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Box 5: Exame Neurológico Topográfico & Nervos Cranianos */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-xs`}>
              <h2 className={`text-xs font-bold tracking-wider uppercase ${themeStyles.panelHeader} pb-2 mb-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-700" />
                  <span>3. Exame Neurológico Detalhado (III.7)</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">Pares Cranianos & Défices</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Lateralization & Motor Deficit */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-amber-900 uppercase tracking-wide text-[11px] block">
                    Motricidade, Reflexos & Marcha:
                  </span>
                  <div>
                    <span className="text-slate-500">Força Muscular:</span>
                    <p className="font-medium text-slate-900 mt-0.5">{data.forcaMuscular || 'Grau 5/5 bilateral'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Tónus:</span>
                    <p className="font-medium text-slate-900 mt-0.5">{data.tonusMuscular || 'Normotonia'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Reflexos Miotáticos:</span>
                    <p className="font-medium text-slate-900 mt-0.5">{data.reflexos || 'Normorreflexia'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Sinais Meníngeos:</span>
                    <p className="font-medium text-slate-900 mt-0.5">{data.sinaisMeningeos || 'Ausentes'}</p>
                  </div>
                </div>

                {/* Cranial Nerves Interactive Chips */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-blue-900 uppercase tracking-wide text-[11px] block">
                    Nervos Cranianos Relevantes:
                  </span>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <span className="font-bold text-blue-900">II Par / Fundo de Olho:</span>
                      <p className="text-slate-800 mt-0.5 truncate" title={data.fundoscopia || data.par2}>
                        {data.fundoscopia || data.par2 || 'Sem papiledema'}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <span className="font-bold text-blue-900">V Par (Trigémio):</span>
                      <p className="text-slate-800 mt-0.5 truncate" title={data.par5}>
                        {data.par5 || 'Sensibilidade facial conservada'}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <span className="font-bold text-blue-900">VII Par (Facial):</span>
                      <p className="text-slate-800 mt-0.5 truncate" title={data.par7}>
                        {data.par7 || 'Simetria mímica facial normal'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Summary Banner */}
              <div className="mt-3.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <span className="font-bold text-blue-950 uppercase text-[11px] block mb-1">
                  Resumo Clínico da Apresentação:
                </span>
                <p className="text-slate-800 leading-relaxed text-justify">
                  {data.resumo || 'Resumo clínico da anamnese e exame objectivo não disponível.'}
                </p>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              COLUMN 3: RACIOCÍNIO DIAGNÓSTICO, CONDUTA E PROGNÓSTICO (3 COLS)
             ---------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-5 flex flex-col">
            {/* Box 6: Diagnósticos Hierarquizados */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-xs`}>
              <h2 className={`text-xs font-bold tracking-wider uppercase ${themeStyles.panelHeader} pb-2 mb-3 flex items-center gap-2`}>
                <Brain className="w-4 h-4 text-purple-700" />
                <span>4. Hipóteses Diagnósticas</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Sindrómico */}
                <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                  <span className="font-bold text-purple-900 uppercase tracking-wide text-[10px] block mb-1">
                    V. Diagnósticos Sindrómicos:
                  </span>
                  <p className="text-slate-900 whitespace-pre-line leading-relaxed font-medium">
                    {data.diagnosticosSindromicos || '---'}
                  </p>
                </div>

                {/* Topográfico */}
                <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200">
                  <span className="font-bold text-indigo-900 uppercase tracking-wide text-[10px] block mb-1">
                    VII. Diagnóstico Topográfico:
                  </span>
                  <p className="text-slate-900 whitespace-pre-line leading-relaxed font-medium">
                    {data.diagnosticosTopograficos || '---'}
                  </p>
                </div>

                {/* Etiológico */}
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-900 uppercase tracking-wide text-[10px] block mb-1">
                    VI. Diagnósticos Etiológicos:
                  </span>
                  <p className="text-slate-900 whitespace-pre-line leading-relaxed font-medium">
                    {data.diagnosticosEtiologicos || '---'}
                  </p>
                </div>
              </div>
            </div>

            {/* Box 7: Discussão & Diferenciais */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-xs`}>
              <h2 className={`text-xs font-bold tracking-wider uppercase ${themeStyles.panelHeader} pb-2 mb-3 flex items-center gap-2`}>
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>5. Diagnósticos Diferenciais (5)</span>
              </h2>

              <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-1">
                {data.diagnosticosDiferenciais || 'Nenhum diferencial preenchido.'}
              </p>
            </div>

            {/* Box 8: Conduta Neurocirúrgica & Prognóstico */}
            <div className={`${themeStyles.cardBg} rounded-2xl p-5 border shadow-md flex-1`}>
              <h2 className={`text-xs font-bold tracking-wider uppercase ${themeStyles.panelHeader} pb-2 mb-3 flex items-center gap-2`}>
                <Award className="w-4 h-4 text-emerald-700" />
                <span>6. Proposta Cirúrgica & Conduta</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Conduta */}
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-950 uppercase tracking-wide text-[10px] block mb-1">
                    XI. Terapêutica / Intervenção:
                  </span>
                  <p className="text-slate-900 whitespace-pre-line leading-relaxed font-medium">
                    {data.propostaTerapeutica || 'Conduta cirúrgica e médica pendente de definição.'}
                  </p>
                </div>

                {/* Prognóstico */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block mb-1">
                    XII. Prognóstico:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {data.prognostico || 'Prognóstico reservado.'}
                  </p>
                </div>

                {/* Word Document Callout */}
                <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onExportPosterDocx}
                    disabled={isExportingPosterDocx}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 ring-2 ring-blue-500/20"
                  >
                    <FileDown className="w-4 h-4 text-blue-200" />
                    <span>{isExportingPosterDocx ? 'A Gerar Poster Word...' : 'Exportar Poster em Word (.docx)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onExportDocx}
                    disabled={isExportingDocx}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-[11px] border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <FileDown className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isExportingDocx ? 'A Gerar Formulário...' : 'Baixar Formulário Clínico Oficial (.docx)'}</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-500 mt-0.5">
                    Gera arquivo Word com layout horizontal do poster e imagens de TAC/RX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Poster Footer Sign-off Bar */}
        <footer className={`mt-8 ${themeStyles.footerBorder} border-t pt-4 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs`}>
          <div className="flex flex-wrap items-center gap-2 font-medium">
            <span className="text-slate-800">{data.institution || 'Ordem dos Médicos de Moçambique'}</span>
            <span>•</span>
            <span className="text-blue-900 font-bold">{data.tipoEvento || 'Jornadas Científicas do Hospital Central de Nampula'}</span>
            <span>•</span>
            <span className="text-slate-800">{data.hospital || 'Hospital Central de Nampula'}</span>
            <span>•</span>
            <span className="text-slate-800">{data.service || 'Serviço de Neurocirurgia'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">Poster Científico Interativo & Formato Word</span>
            <button
              onClick={() => window.print()}
              className="text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Poster</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
