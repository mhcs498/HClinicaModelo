import React from 'react';

interface UnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const UnderlineInput: React.FC<UnderlineInputProps> = ({
  label,
  value,
  onChange,
  containerClassName = '',
  labelClassName = '',
  placeholder = '',
  ...props
}) => {
  return (
    <div className={`flex items-baseline gap-1.5 ${containerClassName}`}>
      <span className={`font-semibold text-slate-800 text-sm whitespace-nowrap shrink-0 ${labelClassName}`}>
        {label}:
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 min-w-[60px] border-b border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:outline-none bg-transparent px-1 py-0.5 text-sm text-slate-900 transition-colors placeholder:text-slate-300"
        {...props}
      />
    </div>
  );
};

interface FormTextAreaProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  description,
  value,
  onChange,
  placeholder = 'Escreva aqui...',
  rows = 4,
}) => {
  return (
    <div className="space-y-1.5 my-3">
      <div className="flex flex-col">
        <label className="text-sm font-bold text-slate-800 tracking-tight">{label}</label>
        {description && (
          <span className="text-xs text-slate-500 italic leading-relaxed">
            ({description})
          </span>
        )}
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm leading-relaxed border border-slate-300 rounded-lg p-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400 font-sans shadow-2xs"
      />
    </div>
  );
};

interface SystemCheckboxItemProps {
  label: string;
  checked: boolean;
  observation: string;
  onToggle: (checked: boolean) => void;
  onObservationChange: (observation: string) => void;
  customLabel?: boolean;
}

export const SystemCheckboxItem: React.FC<SystemCheckboxItemProps> = ({
  label,
  checked,
  observation,
  onToggle,
  onObservationChange,
}) => {
  return (
    <div className={`flex items-center gap-2 p-1.5 rounded transition-colors ${checked ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}>
      <label className="flex items-center gap-2 cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className={`text-xs select-none ${checked ? 'font-bold text-blue-950' : 'text-slate-700'}`}>
          {label}
        </span>
      </label>

      {/* Observation field when checked or subtle line */}
      <input
        type="text"
        value={observation}
        onChange={(e) => onObservationChange(e.target.value)}
        placeholder={checked ? 'Observações / detalhes...' : '______________'}
        className={`flex-1 text-xs border-b px-1 py-0.5 bg-transparent transition-colors focus:outline-none ${
          checked
            ? 'border-blue-300 text-blue-900 focus:border-blue-600'
            : 'border-slate-200 text-slate-400 hover:border-slate-300 focus:border-blue-400'
        }`}
      />
    </div>
  );
};
