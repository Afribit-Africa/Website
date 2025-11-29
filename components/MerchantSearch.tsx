'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface Merchant {
  id: number;
  businessName: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  adopterNumber: number;
  confirmed: boolean;
  osmNodeId: string;
}

interface MerchantSearchProps {
  onSelect: (merchant: Merchant) => void;
}

export default function MerchantSearch({ onSelect }: MerchantSearchProps) {
  const [query, setQuery] = useState('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchMerchants = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError('');

    try {
      const url = searchQuery.trim()
        ? `/api/merchants/search?q=${encodeURIComponent(searchQuery)}`
        : '/api/merchants/search';

      console.log('[MerchantSearch] Fetching from:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('[MerchantSearch] Received data:', { success: data.success, count: data.count, merchantsLength: data.merchants?.length });

      if (data.success) {
        setMerchants(data.merchants);
        if (!searchQuery.trim()) {
          setAllMerchants(data.merchants);
        }
        console.log('[MerchantSearch] Merchants set successfully, count:', data.merchants.length);
      } else {
        setError(data.error || 'Failed to load merchants');
        setMerchants([]);
        console.error('[MerchantSearch] API returned error:', data.error);
      }
    } catch (err) {
      setError('An error occurred while loading merchants');
      setMerchants([]);
      console.error('[MerchantSearch] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all merchants on mount
  useEffect(() => {
    searchMerchants('');
  }, [searchMerchants]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchMerchants(query.trim());
      } else {
        setMerchants(allMerchants);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchMerchants, allMerchants]);

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center gap-3 mb-8">
        <Search className="w-7 h-7 text-bitcoin" />
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Find Your Business
        </h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by business name, location, or category... (or scroll through all businesses below)"
          className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30 hover:border-white/20 hover:bg-white/8 transition-all duration-200 text-base"
        />
        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Loader2 className="w-5 h-5 text-bitcoin animate-spin" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Initial Loading */}
      {loading && merchants.length === 0 && (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 text-bitcoin animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading all early adopter businesses...</p>
        </div>
      )}

      {/* Results */}
      {merchants.length > 0 && (
        <div className="space-y-6">
          <p className="text-sm text-gray-400">
            {query.trim() ? 'Found' : 'Showing'} {merchants.length} business{merchants.length !== 1 ? 'es' : ''}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {merchants.map((merchant) => (
              <button
                key={merchant.id}
                onClick={() => onSelect(merchant)}
                className="group text-left p-5 bg-white/5 border-2 border-white/10 rounded-xl hover:border-bitcoin hover:bg-white/10 hover:shadow-xl hover:shadow-bitcoin/10 transition-all duration-200 active:scale-98"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-white group-hover:text-bitcoin transition-colors text-lg">
                    {merchant.businessName}
                  </h3>
                  <span title={merchant.confirmed ? 'Already confirmed' : 'Not confirmed yet'}>
                    {merchant.confirmed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-500" />
                    )}
                  </span>
                </div>
                {merchant.confirmed && (
                  <p className="text-xs text-green-400 mb-3 flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-md w-fit">
                    <CheckCircle className="w-3 h-3" />
                    Details confirmed
                  </p>
                )}
                <div className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-bitcoin" />
                  <span>{merchant.address}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="bg-white/5 px-2 py-1 rounded">{merchant.category}</span>
                  <span>•</span>
                  <span className="bg-bitcoin/20 text-bitcoin px-2 py-1 rounded">Early Adopter #{merchant.adopterNumber}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - No search results */}
      {!loading && query && merchants.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-gray-300 mb-2 text-lg font-medium">No businesses found</p>
          <p className="text-sm text-gray-500">Try searching with a different term</p>
        </div>
      )}

      {/* Empty State - No early adopters in database */}
      {!loading && !query && merchants.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-bitcoin/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-bitcoin" />
          </div>
          <p className="text-gray-300 mb-2 text-lg font-medium">No Early Adopter Merchants Found</p>
          <p className="text-sm text-gray-500 mb-4">There are currently no early adopter merchants in the system.</p>
          <p className="text-xs text-gray-600">If you believe this is an error, please contact support at info@afribit.africa</p>
        </div>
      )}
    </div>
  );
}
