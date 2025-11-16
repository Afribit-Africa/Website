'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Settings as SettingsIcon, Database, Mail, Map, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-400">
          System configuration and preferences
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-bitcoin" />
            <h2 className="text-lg font-semibold text-white">System Status</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
              <Database className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Database</p>
                <p className="text-xs text-gray-400">Connected and operational</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
              <Mail className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Email Service</p>
                <p className="text-xs text-gray-400">Resend configured</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
              <Map className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">OpenStreetMap</p>
                <p className="text-xs text-gray-400">API connected</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Authentication</p>
                <p className="text-xs text-gray-400">NextAuth active</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Configuration</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-sm font-medium text-white">Auto-approve early adopters</p>
                <p className="text-xs text-gray-400">Automatically approve the first 100 merchants</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bitcoin"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-sm font-medium text-white">Email notifications</p>
                <p className="text-xs text-gray-400">Send email alerts for new submissions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bitcoin"></div>
              </label>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-400">
                To modify system settings, please update environment variables in `.env.local` or contact the system administrator.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
