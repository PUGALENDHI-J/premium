import type { Metadata } from 'next';
import './globals.css';
import { QuantumHeader } from '@/components/layout/QuantumHeader';
import { FloatingNexaPill } from '@/components/layout/FloatingNexaPill';

export const metadata: Metadata = {
  title: 'NexaTalent QX — Quantum Intelligence Ecosystem',
  description: 'Enterprise AI Robot, High-Throughput Job Marketplace & Secure LMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-surface text-on-surface">
        <QuantumHeader />
        <div className="flex-1 flex flex-col">{children}</div>
        <FloatingNexaPill />
      </body>
    </html>
  );
}

