'use client';

import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-400">
          Manage your admin account information
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Account Information</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-bitcoin/20 flex items-center justify-center">
              <User className="w-10 h-10 text-bitcoin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {session?.user?.name || 'Admin User'}
              </h3>
              <p className="text-gray-400">Administrator</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="text-white">{session?.user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="text-white capitalize">{(session?.user as any)?.role || 'admin'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400">Last Login</p>
                <p className="text-white">{format(new Date(), 'PPpp')}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-400 text-sm mb-4">
            To change your password or update security settings, please contact the system administrator at{' '}
            <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">
              info@afribit.africa
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
