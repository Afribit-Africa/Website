"use client";

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = "bg-white/5 animate-pulse";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-2xl h-64",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className="shimmer" />
    </motion.div>
  );
}

export function DonationCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton variant="text" className="h-6 w-3/4" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
        <div className="pt-4 border-t border-white/10">
          <Skeleton variant="text" className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <Skeleton variant="circular" className="w-12 h-12 mb-4" />
      <Skeleton variant="text" className="h-8 w-24 mb-2" />
      <Skeleton variant="text" className="h-4 w-32" />
    </div>
  );
}
