import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Free Period & Ovulation Calculator | ${SITE_NAME}`,
  description: 'Track your cycle, predict your next period, and calculate your most fertile days. 100% private and anonymous, no signup required.',
  alternates: {
    canonical: '/tools/period-calculator',
  },
};

export default function PeriodCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
