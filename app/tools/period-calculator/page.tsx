'use client';

import React, { useState } from 'react';
import { Calendar, Droplets, Heart, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PeriodCalculatorPage() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  
  const [results, setResults] = useState<{
    nextPeriod: Date;
    ovulationDate: Date;
    fertileStart: Date;
    fertileEnd: Date;
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastPeriod) return;

    const startDate = new Date(lastPeriod);
    const cycle = parseInt(cycleLength, 10);
    
    // Next period is simply startDate + cycleLength days
    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);
    
    // Ovulation is usually 14 days before the NEXT period
    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    
    // Fertile window is usually 5 days before ovulation to 1 day after
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    setResults({
      nextPeriod,
      ovulationDate,
      fertileStart,
      fertileEnd
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-pg-rose border-b border-pg-rose-dark py-16 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <Droplets className="mx-auto mb-4 text-white opacity-90" size={48} />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Period & Ovulation Calculator
          </h1>
          <p className="text-lg text-pg-rose-light max-w-xl mx-auto">
            Track your cycle, predict your next period, and find your most fertile days. 100% private.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-sm border border-pg-gray-200 p-6 md:p-10 mb-10">
          <form onSubmit={calculate} className="space-y-6">
            <div>
              <label className="block font-bold text-pg-gray-900 mb-2">
                First day of your last period
              </label>
              <input
                type="date"
                required
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pg-gray-300 focus:border-pg-rose outline-none text-pg-gray-900"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-pg-gray-900 mb-2">
                  Cycle Length (Days)
                </label>
                <input
                  type="number"
                  min="20"
                  max="45"
                  required
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pg-gray-300 focus:border-pg-rose outline-none text-pg-gray-900"
                />
                <p className="text-xs text-pg-gray-500 mt-1">Usually 28 days</p>
              </div>
              <div>
                <label className="block font-bold text-pg-gray-900 mb-2">
                  Period Length (Days)
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  required
                  value={periodLength}
                  onChange={(e) => setPeriodLength(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pg-gray-300 focus:border-pg-rose outline-none text-pg-gray-900"
                />
                <p className="text-xs text-pg-gray-500 mt-1">Usually 5 days</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pg-plum hover:bg-pg-plum-dark text-white font-bold px-6 py-4 rounded-xl transition-colors mt-4 text-lg"
            >
              Calculate My Cycle
            </button>
          </form>
        </div>

        {results && (
          <div className="bg-pg-rose-light rounded-3xl border border-pg-rose/20 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-display text-2xl font-bold text-pg-gray-900 mb-6 text-center">Your Results</h2>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="bg-pg-rose/10 text-pg-rose w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Droplets size={24} />
                </div>
                <h3 className="text-sm font-bold text-pg-gray-500 uppercase tracking-widest mb-1">Next Period</h3>
                <p className="font-display text-2xl font-bold text-pg-gray-900">
                  {formatDate(results.nextPeriod)}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="bg-pg-plum/10 text-pg-plum w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart size={24} />
                </div>
                <h3 className="text-sm font-bold text-pg-gray-500 uppercase tracking-widest mb-1">Ovulation Day</h3>
                <p className="font-display text-2xl font-bold text-pg-gray-900">
                  {formatDate(results.ovulationDate)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-bold text-pg-gray-900 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-pg-rose" /> Fertile Window
              </h3>
              <p className="text-pg-gray-700">
                You are most likely to get pregnant if you have sex between <strong className="text-pg-plum">{formatDate(results.fertileStart)}</strong> and <strong className="text-pg-plum">{formatDate(results.fertileEnd)}</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3 text-xs text-pg-gray-500 bg-white/50 p-4 rounded-xl">
              <Info className="shrink-0 mt-0.5" size={16} />
              <p>
                <strong>Disclaimer:</strong> This calculator provides estimates based on averages. It should not be used as a guaranteed form of birth control or medical advice. If you have irregular periods, these dates may not be accurate.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h3 className="font-display font-bold text-xl text-pg-gray-900 mb-4">Related Guides</h3>
          <div className="space-y-3">
            <Link href="/category/womens-health" className="flex items-center justify-between bg-white p-4 rounded-xl border border-pg-gray-200 hover:border-pg-rose transition-colors group">
              <span className="font-bold text-pg-gray-700 group-hover:text-pg-rose">PCOS & Irregular Periods</span>
              <ArrowRight size={18} className="text-pg-gray-400 group-hover:text-pg-rose" />
            </Link>
            <Link href="/category/pregnancy-fertility" className="flex items-center justify-between bg-white p-4 rounded-xl border border-pg-gray-200 hover:border-pg-rose transition-colors group">
              <span className="font-bold text-pg-gray-700 group-hover:text-pg-rose">Pregnancy & Fertility Advice</span>
              <ArrowRight size={18} className="text-pg-gray-400 group-hover:text-pg-rose" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
