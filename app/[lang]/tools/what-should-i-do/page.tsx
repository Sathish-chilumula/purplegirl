import React from 'react';
import { Metadata } from 'next';
import { DecisionToolClient } from './DecisionToolClient';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'What Should I Do? | PurpleGirl Decision Tool',
  description: 'Confused about a situation? Use our interactive decision tool to get anonymous, practical advice tailored to your needs.',
};

export default async function DecisionToolPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-pg-gray-900 mb-4">
            What Should I Do?
          </h1>
          <p className="text-lg text-pg-gray-600">
            Tell us a bit about your situation, and we'll guide you to the right steps.
          </p>
        </header>

        <DecisionToolClient lang={lang} />
      </div>
    </div>
  );
}
