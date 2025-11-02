"use client";

import { useEffect, useState } from "react";

interface DonationStats {
  totalRaised: number;
  goal: number;
  contributors: number;
  percentageComplete: number;
}

export function DonationStats() {
  const [stats, setStats] = useState<DonationStats>({
    totalRaised: 2149.45,
    goal: 100000,
    contributors: 54,
    percentageComplete: 2.15,
  });
  const [loading, setLoading] = useState(true);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedContributors, setAnimatedContributors] = useState(0);

  useEffect(() => {
    // Fetch stats on mount
    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate the total counter smoothly
    if (animatedTotal < stats.totalRaised) {
      const increment = stats.totalRaised / 60;
      const timer = setTimeout(() => {
        setAnimatedTotal(prev => Math.min(prev + increment, stats.totalRaised));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [animatedTotal, stats.totalRaised]);

  useEffect(() => {
    // Animate the contributors counter
    if (animatedContributors < stats.contributors) {
      const increment = 1;
      const timer = setTimeout(() => {
        setAnimatedContributors(prev => Math.min(prev + increment, stats.contributors));
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [animatedContributors, stats.contributors]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/donations/stats');
      const data = await response.json();
      
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-8">
      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-bitcoin font-display">
          Campaign Progress
        </h3>
        <p className="text-gray-300 text-xs md:text-sm">Building a Bitcoin circular economy in Kibera</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2 gap-1">
          <span className="text-2xl md:text-4xl font-bold text-bitcoin font-numbers">
            ${animatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-gray-300 font-numbers text-sm md:text-base">
            of ${stats.goal.toLocaleString('en-US')} goal
          </span>
        </div>
        
        <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-bitcoin rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(stats.percentageComplete, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-400">{stats.percentageComplete.toFixed(2)}% funded</span>
          <span className="text-sm text-gray-400">{stats.contributors} contributors</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="text-center p-3 md:p-4 bg-white/5 border border-white/10 rounded-lg md:rounded-xl">
          <div className="text-xl md:text-3xl font-bold text-bitcoin font-numbers">
            {Math.round(animatedContributors)}
          </div>
          <div className="text-[10px] md:text-sm text-gray-400 mt-0.5 md:mt-1">Contributors</div>
        </div>
        
        <div className="text-center p-3 md:p-4 bg-white/5 border border-white/10 rounded-lg md:rounded-xl">
          <div className="text-xl md:text-3xl font-bold text-bitcoin font-numbers">
            ${(animatedTotal / stats.contributors).toFixed(0)}
          </div>
          <div className="text-[10px] md:text-sm text-gray-400 mt-0.5 md:mt-1">Avg Donation</div>
        </div>
        
        <div className="text-center p-3 md:p-4 bg-white/5 border border-white/10 rounded-lg md:rounded-xl">
          <div className="text-xl md:text-3xl font-bold text-bitcoin font-numbers">
            ${(stats.goal - animatedTotal).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] md:text-sm text-gray-400 mt-0.5 md:mt-1 whitespace-nowrap">To Go</div>
        </div>
      </div>

      {/* Recent Activity Indicator */}
      <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs md:text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Live tracking from BTCPay Server</span>
      </div>
    </div>
  );
}
