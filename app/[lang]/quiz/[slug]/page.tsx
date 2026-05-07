import React from 'react';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { QuizEngine } from '@/components/quiz/QuizEngine';
import { Metadata } from 'next';

export const runtime = 'edge';

async function getQuizData(slug: string) {
  const { data } = await supabaseAdmin
    .from('quizzes')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

const SITE_URL = 'https://purplegirl.in';

interface QuizPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const quiz = await getQuizData(slug);
  if (!quiz) return { title: 'Quiz Not Found' };

  const canonical = lang === 'en' ? `/quiz/${slug}` : `/${lang}/quiz/${slug}`;

  return {
    title: `${quiz.title} | PurpleGirl Quiz`,
    description: quiz.description,
    alternates: {
      canonical,
      languages: {
        'en': `${SITE_URL}/quiz/${slug}`,
        'hi': `${SITE_URL}/hi/quiz/${slug}`,
        'te': `${SITE_URL}/te/quiz/${slug}`,
        'x-default': `${SITE_URL}/quiz/${slug}`,
      },
    },
    openGraph: {
      title: `${quiz.title} | PurpleGirl Quiz`,
      description: quiz.description,
      type: 'website',
    },
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params;
  const quiz = await getQuizData(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <QuizEngine quiz={{ ...quiz, slug: slug }} />
    </div>
  );
}
