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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: QuizPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const sParams = await searchParams;
  const quiz = await getQuizData(slug);
  if (!quiz) return { title: 'Quiz Not Found' };

  const canonical = lang === 'en' ? `/quiz/${slug}` : `/${lang}/quiz/${slug}`;

  // If result info is in URL, generate dynamic OG image
  const resTitle = sParams.resultTitle as string;
  const resEmoji = sParams.resultEmoji as string;
  const resDesc = sParams.resultDesc as string;

  let ogImage = `${SITE_URL}/og-image.png`; // Fallback
  if (resTitle) {
    const ogParams = new URLSearchParams({
      title: quiz.title,
      result: resTitle,
      emoji: resEmoji || '✨',
      desc: resDesc || ''
    });
    ogImage = `${SITE_URL}/api/og/quiz?${ogParams.toString()}`;
  }

  return {
    title: resTitle ? `${resTitle} | ${quiz.title} Result` : `${quiz.title} | PurpleGirl Quiz`,
    description: resDesc || quiz.description,
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
      title: resTitle ? `${resTitle} | I took the ${quiz.title}` : `${quiz.title} | PurpleGirl Quiz`,
      description: resDesc || quiz.description,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resTitle || quiz.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: resTitle ? `${resTitle} | PurpleGirl Quiz Result` : quiz.title,
      description: resDesc || quiz.description,
      images: [ogImage],
    }
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
