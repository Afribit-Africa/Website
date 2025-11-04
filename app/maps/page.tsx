'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  FiMapPin, 
  FiPhone, 
  FiSearch, 
  FiFilter, 
  FiExternalLink, 
  FiMap, 
  FiList,
  FiShoppingBag,
  FiTruck,
  FiTool,
  FiGlobe,
  FiMonitor,
  FiHeart,
  FiMoreHorizontal,
  FiScissors,
  FiPackage
} from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import { SiBitcoin } from 'react-icons/si';
import { MERCHANTS, CATEGORY_INFO, getCategories, getMerchantsByCategory } from '@/lib/merchants-data';

// Category icon mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  restaurant: <MdRestaurant className="w-full h-full" />,
  transport: <FiTruck className="w-full h-full" />,
  beauty: <FiScissors className="w-full h-full" />,
  shop: <FiShoppingBag className="w-full h-full" />,
  service: <FiTool className="w-full h-full" />,
  tourism: <FiGlobe className="w-full h-full" />,
  tech: <FiMonitor className="w-full h-full" />,
  nonprofit: <FiHeart className="w-full h-full" />,
  other: <FiMoreHorizontal className="w-full h-full" />
};

// Dynamic import for map component (client-side only)
const MerchantsMap = dynamic(() => import('@/components/MerchantsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-xl bg-dark/50 border border-gray-800 flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

export default function MapsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const categories = useMemo(() => getCategories(), []);

  // Filter merchants based on search and category
  const filteredMerchants = useMemo(() => {
    let filtered = MERCHANTS;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.businessName.toLowerCase().includes(query) ||
        m.ownerName.toLowerCase().includes(query) ||
        m.location.toLowerCase().includes(query) ||
        (m.category && CATEGORY_INFO[m.category]?.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Group merchants by category
  const merchantsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredMerchants> = {};
    
    filteredMerchants.forEach(merchant => {
      const category = merchant.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(merchant);
    });

    return grouped;
  }, [filteredMerchants]);

  return (
    <div className="min-h-screen bg-black pt-8 md:pt-32 pb-24 md:pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Bitcoin <span className="text-gradient">Merchant Directory</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover {MERCHANTS.length} Bitcoin-accepting businesses in Kibera. Support local entrepreneurs by donating directly via Lightning Network.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-12 md:mb-16">
          <div className="glass-card text-center p-4 md:p-6">
            <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient font-numbers mb-1 md:mb-2">{MERCHANTS.length}</div>
            <div className="text-gray-400 text-[10px] md:text-sm lg:text-base">Total Merchants</div>
          </div>
          <div className="glass-card text-center p-4 md:p-6">
            <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient font-numbers mb-1 md:mb-2">{categories.length}</div>
            <div className="text-gray-400 text-[10px] md:text-sm lg:text-base">Categories</div>
          </div>
          <div className="glass-card text-center p-4 md:p-6">
            <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient font-numbers mb-1 md:mb-2">100%</div>
            <div className="text-gray-400 text-[10px] md:text-sm lg:text-base">Bitcoin Powered</div>
          </div>
        </div>

        {/* Search, Filters, and View Toggle */}
        <div className="glass-card mb-12 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search merchants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-black/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-bitcoin cursor-pointer transition-all appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="all" className="bg-black text-white">All Categories</option>
                {categories.map(cat => {
                  const info = CATEGORY_INFO[cat];
                  const count = getMerchantsByCategory(cat).length;
                  return (
                    <option key={cat} value={cat} className="bg-black text-white">
                      {info?.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="text-sm text-gray-400 font-medium">
              {filteredMerchants.length} {filteredMerchants.length === 1 ? 'merchant' : 'merchants'}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('list')}
                className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-bitcoin text-black'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-bitcoin/30'
                }`}
              >
                <FiList className="w-4 h-4" />
                <span className="text-sm">List</span>
              </button>
              
              <button
                onClick={() => setViewMode('map')}
                className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-bitcoin text-black'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-bitcoin/30'
                }`}
              >
                <FiMap className="w-4 h-4" />
                <span className="text-sm">Map</span>
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-bitcoin hover:text-bitcoin-light transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {viewMode === 'map' ? (
          /* Map View */
          <div className="mb-12">
            <MerchantsMap merchants={filteredMerchants} />
            <p className="text-xs text-gray-500 mt-4 text-center">
              Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">OpenStreetMap</a> contributors
            </p>
          </div>
        ) : (
          /* List View - Grouped by Category */
          selectedCategory === 'all' ? (
            <div className="space-y-12">
              {Object.entries(merchantsByCategory)
                .sort(([catA], [catB]) => {
                  const nameA = CATEGORY_INFO[catA]?.name || '';
                  const nameB = CATEGORY_INFO[catB]?.name || '';
                  return nameA.localeCompare(nameB);
                })
                .map(([category, merchants]) => {
                  const categoryInfo = CATEGORY_INFO[category];
                  
                  return (
                    <div key={category}>
                      {/* Category Header */}
                      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                        <div className={`w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl ${categoryInfo.color} flex items-center justify-center border`}>
                          <div className="w-6 md:w-7 h-6 md:h-7">
                            {CATEGORY_ICONS[category]}
                          </div>
                        </div>
                        <div>
                          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">{categoryInfo.name}</h2>
                          <p className="text-xs md:text-sm text-gray-400 font-medium">{merchants.length} {merchants.length === 1 ? 'merchant' : 'merchants'}</p>
                        </div>
                      </div>

                      {/* Merchants Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {merchants.map((merchant) => (
                          <Link
                            key={merchant.id}
                            href={`/merchants/${merchant.slug}`}
                            className="group overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 hover:border-bitcoin/50 transition-all duration-300 p-4 md:p-6"
                          >
                            <div className="flex items-start gap-3 mb-3 md:mb-4">
                              <div className={`w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl ${categoryInfo.color} flex items-center justify-center border shrink-0`}>
                                <div className="w-4 md:w-5 h-4 md:h-5">
                                  {CATEGORY_ICONS[category]}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-heading text-base md:text-lg font-bold text-white group-hover:text-bitcoin transition-colors line-clamp-1">
                                  {merchant.businessName}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-400 line-clamp-1">{merchant.ownerName}</p>
                              </div>
                            </div>

                            <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5">
                              <div className="flex items-start gap-2 text-xs md:text-sm text-gray-300">
                                <FiMapPin className="w-3.5 md:w-4 h-3.5 md:h-4 text-bitcoin mt-0.5 shrink-0" />
                                <span className="line-clamp-2 leading-relaxed">{merchant.location}</span>
                              </div>
                              
                              {merchant.phoneNumber && (
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                                  <FiPhone className="w-3.5 md:w-4 h-3.5 md:h-4 text-bitcoin shrink-0" />
                                  <span className="font-numbers">+254 {merchant.phoneNumber}</span>
                                </div>
                              )}
                            </div>

                            <div className="pt-3 md:pt-4 border-t border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <SiBitcoin className="w-3.5 md:w-4 h-3.5 md:h-4 text-bitcoin shrink-0" />
                                <span className="font-mono text-[10px] md:text-xs text-gray-400 truncate">{merchant.blinkAddress}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                {merchant.btcMapUrl && (
                                  <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                                    <FiExternalLink className="w-2.5 md:w-3 h-2.5 md:h-3" />
                                    Verified
                                  </span>
                                )}
                                <span className="text-[10px] md:text-xs text-bitcoin font-semibold group-hover:translate-x-1 transition-transform">
                                  View Details →
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            /* Filtered by Single Category */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredMerchants.map((merchant) => {
                const categoryInfo = CATEGORY_INFO[merchant.category || 'other'];
                const category = merchant.category || 'other';
                
                return (
                  <Link
                    key={merchant.id}
                    href={`/merchants/${merchant.slug}`}
                    className="group overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 hover:border-bitcoin/50 transition-all duration-300 p-4 md:p-6"
                  >
                    <div className="flex items-start gap-3 mb-3 md:mb-4">
                      <div className={`w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl ${categoryInfo.color} flex items-center justify-center border shrink-0`}>
                        <div className="w-4 md:w-5 h-4 md:h-5">
                          {CATEGORY_ICONS[category]}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-base md:text-lg font-bold text-white group-hover:text-bitcoin transition-colors line-clamp-1">
                          {merchant.businessName}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400 line-clamp-1">{merchant.ownerName}</p>
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5">
                      <div className="flex items-start gap-2 text-xs md:text-sm text-gray-300">
                        <FiMapPin className="w-3.5 md:w-4 h-3.5 md:h-4 text-bitcoin mt-0.5 shrink-0" />
                        <span className="line-clamp-2 leading-relaxed">{merchant.location}</span>
                      </div>
                      
                      {merchant.phoneNumber && (
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                          <FiPhone className="w-3.5 md:w-4 h-3.5 md:h-4 text-bitcoin shrink-0" />
                          <span className="font-numbers">+254 {merchant.phoneNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 md:pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <SiBitcoin className="w-3.5 md:w-4 h-3.5 md:h-4 text-bitcoin shrink-0" />
                        <span className="font-mono text-[10px] md:text-xs text-gray-400 truncate">{merchant.blinkAddress}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {merchant.btcMapUrl && (
                          <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                            <FiExternalLink className="w-2.5 md:w-3 h-2.5 md:h-3" />
                            Verified
                          </span>
                        )}
                        <span className="text-[10px] md:text-xs text-bitcoin font-semibold group-hover:translate-x-1 transition-transform">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        )}

        {/* Empty State */}
        {filteredMerchants.length === 0 && (
          <div className="glass-card text-center py-20">
            <FiSearch className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="font-heading text-2xl font-bold text-white mb-3">No merchants found</h3>
            <p className="text-gray-400 mb-8 text-lg">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="glass-card mt-12 md:mt-16 p-4 md:p-6">
          <div className="flex items-start gap-4 md:gap-5">
            <div className="w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl bg-bitcoin/10 flex items-center justify-center shrink-0 border border-bitcoin/20">
              <SiBitcoin className="w-6 md:w-7 h-6 md:h-7 text-bitcoin" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">About This Directory</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                All merchants listed here are part of the Afribit Bitcoin Circular Economy program in Kibera, Nairobi. 
                Each business accepts Bitcoin payments via the Lightning Network through their Blink wallets.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                When you donate to a merchant, 100% of your contribution goes directly to their wallet - no middlemen, no fees from Afribit.
                We simply facilitate the connection between donors and local entrepreneurs building a Bitcoin-powered economy.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Merchant locations and additional details provided by{' '}
                <a 
                  href="https://btcmap.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-bitcoin hover:text-bitcoin-light transition-colors underline"
                >
                  BTCMap.org
                </a>
                , a community-driven map of Bitcoin merchants worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 md:mt-12 py-12 md:py-16 px-6 md:px-8 text-center rounded-2xl md:rounded-3xl bg-linear-to-br from-bitcoin/10 via-bitcoin/5 to-transparent border border-bitcoin/20">
          <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            Accept Bitcoin in Your Business
          </h3>
          <p className="text-gray-300 text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our growing network of Bitcoin merchants in Kibera. Get listed on this directory, 
            receive training, and connect with donors worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ronnie@afribit.africa?subject=Add My Business to Merchant Directory"
              className="btn btn-primary btn-lg"
            >
              Add Your Business
            </a>
            <a
              href="https://btcmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg inline-flex items-center gap-2"
            >
              <span>Add to BTCMap</span>
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
