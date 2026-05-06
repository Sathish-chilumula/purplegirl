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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const quiz = await getQuizData(params.slug);
  if (!quiz) return { title: 'Quiz Not Found' };
  
  return {
    title: `${quiz.title} | PurpleGirl Quiz`,
    description: quiz.description,
    alternates: {
      canonical: `/quiz/${params.slug}`
    },
    openGraph: {
      title: `${quiz.title} | PurpleGirl Quiz`,
      description: quiz.description,
      type: 'website',
    }
  };
}

export default async function QuizPage({ params }: { params: { slug: string } }) {
  const quiz = await getQuizData(params.slug);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <QuizEngine quiz={{ ...quiz, slug: params.slug }} />
    </div>
  );
}
