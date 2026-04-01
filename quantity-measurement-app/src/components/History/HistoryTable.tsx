import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { QuantityMeasurementEntity } from '../../services/quantityService';

interface HistoryTableProps {
  history: QuantityMeasurementEntity[];
  isLoading: boolean;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mt-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <Clock className="text-indigo-600 animate-pulse" size={24} />
          <h2 className="text-2xl font-bold text-slate-900">Operation History</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-16 bg-slate-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-12 mt-8 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <Clock className="text-indigo-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No History Yet</h3>
        <p className="text-slate-500 max-w-sm">
          Your successful operations will be recorded here automatically.
        </p>
      </div>
    );
  }

  return (
    <div id="history-section" className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-8">
      <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-6 border-b border-indigo-100 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-700">
          <Clock size={20} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Operation History</h2>
        <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {history.length} Records
        </span>
      </div>

      <div className="p-0 overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-semibold text-slate-600 text-sm tracking-wider uppercase">Status</th>
              <th className="py-4 px-6 font-semibold text-slate-600 text-sm tracking-wider uppercase">Operation</th>
              <th className="py-4 px-6 font-semibold text-slate-600 text-sm tracking-wider uppercase">Operand 1</th>
              <th className="py-4 px-6 font-semibold text-slate-600 text-sm tracking-wider uppercase">Operand 2</th>
              <th className="py-4 px-6 font-semibold text-slate-600 text-sm tracking-wider uppercase">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item, index) => {
              // Ensure we have a unique key if id is missing
              const key = item.id ? item.id : `history-${index}`;
              const isSuccess = !item.status || item.status.toLowerCase().includes('success');
              const isError = item.errormessage && item.errormessage.trim().length > 0;
              
              return (
                <tr key={key} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    {isError ? (
                      <div className="flex items-center gap-2 text-red-600" title={item.errormessage}>
                        <XCircle size={20} className="text-red-500" />
                      </div>
                    ) : isSuccess ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle size={20} className="text-amber-500" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                      {item.operation}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {item.operand1 || '—'}
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {item.operand2 || '—'}
                  </td>
                  <td className="py-4 px-6">
                    {isError ? (
                      <span className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-lg">
                        Error: {item.errormessage}
                      </span>
                    ) : (
                      <span className="text-slate-900 font-bold bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-200">
                        {item.result || '—'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
