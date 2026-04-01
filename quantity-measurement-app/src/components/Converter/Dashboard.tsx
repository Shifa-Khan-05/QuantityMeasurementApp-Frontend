import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ruler, Thermometer, Droplets, Weight, ArrowLeftRight, Plus, Minus, Divide, Equal, ArrowRight } from 'lucide-react';
import { UNIT_DATA } from '../../utils/unitData';
import type { UnitCategory } from '../../utils/unitData';
import { convertQuantity, compareQuantity, addQuantity, subtractQuantity, divideQuantity, getHistory } from '../../services/quantityService';
import type { QuantityMeasurementEntity } from '../../services/quantityService';
import HistoryTable from '../History/HistoryTable';
import { getBackendErrorMessage } from '../../utils/errorHandler';
import { useAuth } from '../../contexts/AuthContext';
import { showSuccess } from '../../utils/toast';

type OperationType = 'convert' | 'compare' | 'add' | 'subtract' | 'divide';

const Dashboard: React.FC = () => {
  const [operation, setOperation] = useState<OperationType>('convert');
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromValue, setFromValue] = useState<string>('0');
  const [toValue, setToValue] = useState<string>('0');
  const [fromUnit, setFromUnit] = useState<string>(UNIT_DATA.length.units[0]);
  const [toUnit, setToUnit] = useState<string>(UNIT_DATA.length.units[1]);
  const [thisValue, setThisValue] = useState<string>('1');
  const [thisUnit, setThisUnit] = useState<string>(UNIT_DATA.length.units[0]);
  const [thatValue, setThatValue] = useState<string>('1');
  const [thatUnit, setThatUnit] = useState<string>(UNIT_DATA.length.units[1]);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<QuantityMeasurementEntity[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // Extract auth info on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    if (token) {
      // Decode the optional name, or fallback on email parsing logic if it looks like email
      const decodedName = name ? decodeURIComponent(name) : '';
      login(token, decodedName.includes('@') ? decodedName : 'user@example.com', decodedName, 'google');
      
      // Remove query parameters from URL cleanly
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, login]);

  const fetchOperationHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsFetchingHistory(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsFetchingHistory(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOperationHistory();
  }, [fetchOperationHistory]);

  // Scroll to history section if hash is present
  useEffect(() => {
    if (location.hash === '#history-section') {
      const element = document.getElementById('history-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash, history]); // Re-run if hash changes or history is loaded

  const handleCategoryChange = (selected: UnitCategory) => {
    setCategory(selected);
    setFromUnit(UNIT_DATA[selected].units[0]);
    setToUnit(UNIT_DATA[selected].units[1]);
    setThisUnit(UNIT_DATA[selected].units[0]);
    setThatUnit(UNIT_DATA[selected].units[1]);
    setFromValue('0');
    setToValue('0');
    setThisValue('1');
    setThatValue('1');
    setResult('');
    setError('');
  };

  const handleOperationChange = (selected: OperationType) => {
    setOperation(selected);
    setFromValue('0');
    setToValue('0');
    setThisValue('1');
    setThatValue('1');
    setResult('');
    setError('');
  };

  const performOperation = async () => {
    setError('');
    setIsLoading(true);

    try {
        if (operation === 'convert') {
          const response = await convertQuantity({ value: Number(fromValue), unit: fromUnit }, toUnit);
          setToValue(String(response.value));
          setToUnit(response.unit);
          showSuccess('Conversion completed successfully.');
        } else {
          if (thisValue.trim() === '' || isNaN(Number(thisValue)) || thatValue.trim() === '' || isNaN(Number(thatValue))) {
            setError('Please enter valid values for both quantities.');
            return;
          }
          const payload = {
            thisQuantityDTO: { value: Number(thisValue), unit: thisUnit },
            thatQuantityDTO: { value: Number(thatValue), unit: thatUnit },
          };
          if (operation === 'compare') {
            const response = await compareQuantity(payload);
            setResult(response ? 'Equal' : 'Not Equal');
            showSuccess('Comparison completed successfully.');
          } else if (operation === 'add') {
            const response = await addQuantity(payload);
            setResult(`${response.value} ${response.unit}`);
            showSuccess('Addition completed successfully.');
          } else if (operation === 'subtract') {
            const response = await subtractQuantity(payload);
            setResult(`${response.value} ${response.unit}`);
            showSuccess('Subtraction completed successfully.');
          } else if (operation === 'divide') {
            const response = await divideQuantity(payload);
            setResult(String(response));
            showSuccess('Division completed successfully.');
          }

          // Update history if logged in and not just comparing
          if (operation !== 'compare' && isAuthenticated) {
            fetchOperationHistory();
            showSuccess('History saved successfully.');
          }
        }
    } catch (err: any) {
      const errorMessage = getBackendErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current units for the selected category
  const units = UNIT_DATA[category].units;

  // Function to swap units in convert operation
  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-6 border-b border-indigo-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">
            {operation.charAt(0).toUpperCase() + operation.slice(1)} Units
          </h1>
          <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-200">
            Dashboard
          </div>
        </div>

        <div className="p-8">
          {/* Operations Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {(['convert', 'compare', 'add', 'subtract', 'divide'] as OperationType[]).map((op) => (
              <button
                key={op}
                onClick={() => handleOperationChange(op)}
                className={`flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  operation === op 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50 transform -translate-y-0.5' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>
                  {op === 'convert' && <ArrowLeftRight size={18} />}
                  {op === 'compare' && <Equal size={18} />}
                  {op === 'add' && <Plus size={18} />}
                  {op === 'subtract' && <Minus size={18} />}
                  {op === 'divide' && <Divide size={18} />}
                </span>
                <span className="hidden sm:inline capitalize">{op}</span>
              </button>
            ))}
          </div>

          {/* Unit Category Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {(['length', 'temperature', 'volume', 'weight'] as UnitCategory[]).map((type) => (
              <button
                key={type}
                onClick={() => handleCategoryChange(type)}
                className={`flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  category === type 
                    ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <span>
                  {type === 'length' && <Ruler size={18} />}
                  {type === 'temperature' && <Thermometer size={18} />}
                  {type === 'volume' && <Droplets size={18} />}
                  {type === 'weight' && <Weight size={18} />}
                </span>
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>

          {/* Converter Body */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
            {operation === 'convert' ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                
                <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <label htmlFor="fromValue" className="block text-xs font-bold text-slate-500 tracking-wider mb-2">FROM</label>
                  <input
                    id="fromValue"
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    min="0"
                    placeholder="Enter value"
                    className="w-full text-2xl font-medium text-slate-900 bg-transparent border-0 border-b-2 border-slate-200 focus:ring-0 focus:border-indigo-600 px-0 py-2 mb-4 transition-colors"
                  />
                  <select 
                    value={fromUnit} 
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {units.map((u) => <option key={`from-${u}`} value={u}>{u}</option>)}
                  </select>
                </div>

                <button 
                  type="button" 
                  className="shrink-0 w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-full text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm hover:-rotate-180" 
                  onClick={swapUnits} 
                  aria-label="Swap units"
                >
                  <ArrowLeftRight size={24} />
                </button>

                <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-16 translate-x-16"></div>
                  <label htmlFor="toValue" className="block text-xs font-bold text-slate-500 tracking-wider mb-2 relative z-10">TO</label>
                  <input 
                    id="toValue" 
                    type="text" 
                    value={toValue} 
                    readOnly 
                    placeholder="Result" 
                    className="w-full text-2xl font-medium text-slate-900 bg-transparent border-0 border-b-2 border-slate-200 focus:ring-0 px-0 py-2 mb-4 relative z-10"
                  />
                  <select 
                    value={toUnit} 
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 relative z-10"
                  >
                    {units.map((u) => <option key={`to-${u}`} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <label htmlFor="thisValue" className="block text-xs font-bold text-slate-500 tracking-wider mb-2">FIRST UNIT</label>
                  <input
                    id="thisValue"
                    type="number"
                    value={thisValue}
                    onChange={(e) => setThisValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full text-2xl font-medium text-slate-900 bg-transparent border-0 border-b-2 border-slate-200 focus:ring-0 focus:border-indigo-600 px-0 py-2 mb-4 transition-colors"
                  />
                  <select 
                    value={thisUnit} 
                    onChange={(e) => setThisUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-indigo-500"
                  >
                    {units.map((u) => <option key={`this-${u}`} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold text-2xl rounded-full">
                  {operation === 'compare' && '='}
                  {operation === 'add' && '+'}
                  {operation === 'subtract' && '-'}
                  {operation === 'divide' && '/'}
                </div>

                <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <label htmlFor="thatValue" className="block text-xs font-bold text-slate-500 tracking-wider mb-2">SECOND UNIT</label>
                  <input
                    id="thatValue"
                    type="number"
                    value={thatValue}
                    onChange={(e) => setThatValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full text-2xl font-medium text-slate-900 bg-transparent border-0 border-b-2 border-slate-200 focus:ring-0 focus:border-indigo-600 px-0 py-2 mb-4 transition-colors"
                  />
                  <select 
                    value={thatUnit} 
                    onChange={(e) => setThatUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-indigo-500"
                  >
                    {units.map((u) => <option key={`that-${u}`} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="shrink-0 hidden md:block w-8 text-center text-slate-400 font-bold">
                  <ArrowRight size={24} className="mx-auto" />
                </div>

                <div className="flex-1 w-full bg-indigo-600 p-6 rounded-2xl shadow-lg relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <label className="block text-xs font-bold text-indigo-200 tracking-wider mb-2 relative z-10">RESULT</label>
                  <div className="w-full h-24 flex items-center text-3xl font-bold bg-transparent border-0 relative z-10 overflow-hidden break-words">
                    {result || '—'}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3">
                <span className="font-semibold text-sm">{error}</span>
              </div>
            )}
            
            <div className="mt-8 flex justify-end gap-4">
              {operation === 'convert' && (
                <button
                  type="button"
                  onClick={swapUnits}
                  className="px-6 py-3 font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  Swap
                </button>
              )}
              <button
                type="button"
                onClick={performOperation}
                disabled={isLoading}
                className="px-8 py-3 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>{operation.charAt(0).toUpperCase() + operation.slice(1)}</>
                )}
              </button>
            </div>
          </div>
          
          {/* Dual-Mode History Panel */}
          {isAuthenticated ? (
            <HistoryTable history={history} isLoading={isFetchingHistory} />
          ) : (
            <div className="w-full mt-8 bg-gradient-to-r from-indigo-50 to-white rounded-3xl border border-indigo-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Track Your Operations</h3>
                <p className="text-slate-600">Login to save your successful add, subtract, and divide records securely.</p>
              </div>
              <a href="/login" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 active:bg-indigo-800 transition-all whitespace-nowrap">
                Login / Signup
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;