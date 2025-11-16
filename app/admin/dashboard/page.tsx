'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface DashboardStats {
  pendingCount: number;
  approvedCount: number;
  publishedCount: number;
  rejectedCount: number;
  earlyAdoptersCount: number;
  submissionsLast7Days: number;
  submissionsLast30Days: number;
  totalSubmissions: number;
}

interface RecentSubmission {
  id: string;
  businessName: string;
  contactEmail: string;
  status: string;
  submittedAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentSubmissions(data.recentSubmissions || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Pending Review',
      value: stats?.pendingCount || 0,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      href: '/admin/submissions?status=pending',
    },
    {
      title: 'Published',
      value: stats?.publishedCount || 0,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      href: '/admin/submissions?status=published',
    },
    {
      title: 'Early Adopters',
      value: stats?.earlyAdoptersCount || 0,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      href: '/admin/merchants',
    },
    {
      title: 'Last 7 Days',
      value: stats?.submissionsLast7Days || 0,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      href: '/admin/submissions',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome back! Here's an overview of your merchant submissions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-white/20 transition-all duration-200 cursor-pointer h-full">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Submission Activity
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Last 30 days: {stats?.submissionsLast30Days || 0} submissions
                </p>
              </div>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Pending</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${
                          ((stats?.pendingCount || 0) /
                            (stats?.totalSubmissions || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-white font-medium w-8 text-right">
                    {stats?.pendingCount || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Published</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${
                          ((stats?.publishedCount || 0) /
                            (stats?.totalSubmissions || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-white font-medium w-8 text-right">
                    {stats?.publishedCount || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Rejected</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${
                          ((stats?.rejectedCount || 0) /
                            (stats?.totalSubmissions || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-white font-medium w-8 text-right">
                    {stats?.rejectedCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <Link
                href="/admin/submissions?status=pending"
                className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-bitcoin" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Review Pending Submissions
                    </p>
                    <p className="text-xs text-gray-400">
                      {stats?.pendingCount || 0} waiting for review
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/merchants"
                className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-bitcoin" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      View All Merchants
                    </p>
                    <p className="text-xs text-gray-400">
                      {stats?.publishedCount || 0} active merchants
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Recent Submissions
            </h2>
            <Link
              href="/admin/submissions"
              className="text-sm text-bitcoin hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {recentSubmissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No submissions yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-gray-400 pb-3">
                      Business Name
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 pb-3">
                      Contact
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 pb-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 pb-3">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="py-3 text-sm text-white">
                        {submission.businessName}
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {submission.contactEmail}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            submission.status === 'pending'
                              ? 'warning'
                              : submission.status === 'published'
                              ? 'success'
                              : submission.status === 'rejected'
                              ? 'error'
                              : 'default'
                          }
                        >
                          {submission.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
