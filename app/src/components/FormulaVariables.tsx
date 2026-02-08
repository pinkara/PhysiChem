import { useEffect, useRef } from 'react';
import { Ruler, BookOpen } from 'lucide-react';
import type { FormulaVariable } from '@/types';

interface FormulaVariablesProps {
  variables: FormulaVariable[];
}

// Composant pour afficher une variable individuelle avec son unité
function VariableCard({ variable, index }: { variable: FormulaVariable; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).MathJax?.typesetPromise) {
      (window as any).MathJax.typesetPromise([containerRef.current]);
    }
  }, [variable.symbol, variable.unit]);

  // Couleurs alternées pour les cartes
  const colorSchemes = [
    { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', symbol: 'text-blue-700', unit: 'bg-blue-100' },
    { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-500', symbol: 'text-purple-700', unit: 'bg-purple-100' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', symbol: 'text-emerald-700', unit: 'bg-emerald-100' },
    { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', symbol: 'text-amber-700', unit: 'bg-amber-100' },
    { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-500', symbol: 'text-rose-700', unit: 'bg-rose-100' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'text-cyan-500', symbol: 'text-cyan-700', unit: 'bg-cyan-100' },
  ];
  const colors = colorSchemes[index % colorSchemes.length];

  return (
    <div 
      className={`${colors.bg} border ${colors.border} rounded-lg p-3 flex items-start gap-3 transition-all hover:shadow-md hover:scale-[1.02]`}
    >
      {/* Icône */}
      <div className={`${colors.icon} mt-0.5 flex-shrink-0`}>
        <BookOpen className="w-4 h-4" />
      </div>
      
      {/* Contenu */}
      <div className="flex-1 min-w-0" ref={containerRef}>
        {/* Symbole + Unité */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`font-bold ${colors.symbol}`}>
            ${variable.symbol}$
          </span>
          <span className={`${colors.unit} text-xs px-2 py-0.5 rounded-full font-mono`}>
            ${variable.unit}$
          </span>
        </div>
        
        {/* Nom */}
        <p className="text-sm text-gray-700 font-medium leading-tight">
          {variable.name}
        </p>
        
        {/* Description optionnelle */}
        {variable.description && (
          <p className="text-xs text-gray-500 mt-1 leading-tight">
            {variable.description}
          </p>
        )}
      </div>
    </div>
  );
}

// Version compacte pour mobile
function VariableBadge({ variable, index }: { variable: FormulaVariable; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).MathJax?.typesetPromise) {
      (window as any).MathJax.typesetPromise([containerRef.current]);
    }
  }, [variable.symbol, variable.unit]);

  const colorSchemes = [
    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
    { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  ];
  const colors = colorSchemes[index % colorSchemes.length];

  return (
    <div 
      ref={containerRef}
      className={`inline-flex items-center gap-1.5 ${colors.bg} ${colors.text} border ${colors.border} rounded-full px-2.5 py-1 text-xs`}
      title={`${variable.name}: ${variable.unit.replace(/\\pu\{([^}]+)\}/, '$1')}`}
    >
      <span className="font-bold">${variable.symbol}$</span>
      <span className="opacity-60">=</span>
      <span className="font-mono">${variable.unit}$</span>
    </div>
  );
}

export function FormulaVariables({ variables }: FormulaVariablesProps) {
  if (!variables || variables.length === 0) return null;

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Ruler className="w-4 h-4 text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-700">
          Variables et unités
        </h4>
      </div>

      {/* Version desktop: Cartes */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {variables.map((variable, index) => (
          <VariableCard key={index} variable={variable} index={index} />
        ))}
      </div>

      {/* Version mobile: Badges compacts */}
      <div className="sm:hidden flex flex-wrap gap-2" ref={useRef<HTMLDivElement>(null)}>
        {variables.map((variable, index) => (
          <VariableBadge key={index} variable={variable} index={index} />
        ))}
      </div>
    </div>
  );
}

// Version alternative: Tableau style "fiche de révision"
export function FormulaVariablesTable({ variables }: FormulaVariablesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).MathJax?.typesetPromise) {
      (window as any).MathJax.typesetPromise([containerRef.current]);
    }
  }, [variables]);

  if (!variables || variables.length === 0) return null;

  return (
    <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Variables et unités</span>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto" ref={containerRef}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-600 w-16">Symbole</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Description</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 w-24">Unité</th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-white/50">
                <td className="px-3 py-2 font-bold text-gray-800">
                  ${variable.symbol}$
                </td>
                <td className="px-3 py-2 text-gray-700">
                  {variable.name}
                  {variable.description && (
                    <span className="block text-xs text-gray-500 mt-0.5">
                      {variable.description}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className="inline-block bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">
                    ${variable.unit}$
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
