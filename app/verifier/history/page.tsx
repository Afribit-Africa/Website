'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Eye,
} from 'lucide-react';

interface VerificationHistory {
  id: string;
  businessName: string;
  category: string;
  location: string;
  verificationStatus: string;
  verifiedAt: string;
  distance: number;
}

export default function VerifierHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<VerificationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHistory();
    }
  }, [status]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/verifier/history');
      const data = await response.json();

      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      // Error fetching history
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-4 px-3 md:py-8 md:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/verifier/dashboard"
            className="text-gray-400 hover:text-white mb-3 md:mb-4 inline-flex items-center gap-2 transition-colors text-sm md:text-base"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Verification History
          </h1>
          <p className="text-sm md:text-base text-gray-400">
            All your completed verifications
          </p>
        </div>

        {/* History List */}
        <Card className="bg-[#1A1A1A] border-white/10">
          <CardBody>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No verifications yet</p>
                <p className="text-gray-500 text-sm">
                  Start verifying merchants to see your history here
                </p>
                <Link
                  href="/verifier/dashboard"
                  className="mt-6 inline-block px-6 py-3 bg-bitcoin hover:bg-bitcoin/90 text-white rounded-lg font-medium transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-[#0A0A0A] border border-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {item.businessName}
                          </h3>
                          {item.verificationStatus === 'verified' ? (
                            <Badge variant="success" className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="error" className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Not Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </span>
                          <span>{formatDistance(item.distance)} away</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.verifiedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
