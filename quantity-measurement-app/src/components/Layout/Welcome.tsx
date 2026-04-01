import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ruler, TrendingUp, Clock, Lock, ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Ruler className="w-8 h-8 text-indigo-600" />,
      title: 'Unit Conversion',
      description: 'Convert between various units of length, weight, volume, and temperature instantly.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
      title: 'Quick Calculations',
      description: 'Add, subtract, divide, and compare quantities with precision and speed.'
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      title: 'Conversion History',
      description: 'Track all your conversions and calculations (login required).'
    },
    {
      icon: <Lock className="w-8 h-8 text-indigo-600" />,
      title: 'Secure & Private',
      description: 'Your data is protected with modern authentication and encryption.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-sm font-medium mb-8 border border-indigo-200 shadow-sm">
            <Ruler size={16} /> Fast, accurate unit conversion
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Quantity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Measurement</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            Fast, accurate unit conversion and quantity calculations. Perfect for professionals, students, and everyday use.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/converter')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              Start Converting Now
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
            >
              Login to View History
            </button>
          </div>

          <p className="text-sm font-medium text-slate-500">💡 No account needed to start converting units</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose QuantityApp?</h2>
          <p className="text-lg text-slate-600">Everything you need for accurate unit conversion and calculations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-lg border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Units Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Supported Units</h2>
            <p className="text-indigo-100">Comprehensive support for standard measurement systems</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-px bg-slate-100">
            <div className="bg-white p-8">
              <div className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Ruler size={24} /></div>
                Length
              </div>
              <p className="text-slate-600">Metres, Centimetres, Inches, Feet, Kilometres, Miles</p>
            </div>
            <div className="bg-white p-8">
              <div className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4">
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">🌡️</div>
                Temperature
              </div>
              <p className="text-slate-600">Celsius, Fahrenheit, Kelvin</p>
            </div>
            <div className="bg-white p-8">
              <div className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4">
                <div className="bg-cyan-100 text-cyan-600 p-2 rounded-lg">💧</div>
                Volume
              </div>
              <p className="text-slate-600">Litres, Millilitres, Gallons, Quarts, Cups</p>
            </div>
            <div className="bg-white p-8">
              <div className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4">
                <div className="bg-stone-100 text-stone-600 p-2 rounded-lg">⚖️</div>
                Weight
              </div>
              <p className="text-slate-600">Kilograms, Grams, Pounds, Ounces</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-slate-600 mb-8">Choose your preferred way to continue</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => navigate('/converter')}
            className="px-6 py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
          >
            Convert as Guest
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-3 font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-colors"
          >
            Create Account
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            Existing User? Login
          </button>
        </div>
        
        <p className="mt-12 text-sm text-slate-400 font-medium">
          Secure • Fast • Free • No ads • No tracking
        </p>
      </section>
    </div>
  );
};

export default Welcome;
