"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiZap, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';
import Image from 'next/image';

interface PaymentDisplayProps {
  lightningInvoice: string;
  qrCodeDataUrl: string;
  invoiceData: any;
  timeLeft: number;
  isExpired: boolean;
  paymentStatus: 'pending' | 'paid' | 'expired';
  onBack: () => void;
  onCheckStatus: () => void;
}

export function PaymentDisplay({
  lightningInvoice,
  qrCodeDataUrl,
  invoiceData,
  timeLeft,
  isExpired,
  paymentStatus,
  onBack,
  onCheckStatus,
}: PaymentDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lightningInvoice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <FiArrowLeft /> Start Over
      </button>

      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-8 space-y-6">
        {/* Status */}
        {paymentStatus === 'pending' && !isExpired && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bitcoin/10 flex items-center justify-center">
                <FiZap className="text-2xl text-bitcoin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Awaiting Payment</h3>
                <p className="text-sm text-gray-400">Scan QR code or copy invoice</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Time remaining</p>
              <p className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-bitcoin'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <FiAlertCircle className="text-2xl text-red-400" />
            <div>
              <p className="font-semibold text-red-400">Payment Expired</p>
              <p className="text-sm text-gray-400">
                This invoice has expired. Please start over to create a new one.
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'paid' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
            <FiCheck className="text-2xl text-green-400" />
            <div>
              <p className="font-semibold text-green-400">Payment Received!</p>
              <p className="text-sm text-gray-400">
                Thank you for your contribution to Afribit Kibera
              </p>
            </div>
          </div>
        )}

        {/* QR Code */}
        {!isExpired && paymentStatus === 'pending' && qrCodeDataUrl && (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-xl">
              <Image
                src={qrCodeDataUrl}
                alt="Lightning Invoice QR Code"
                width={256}
                height={256}
                className="w-64 h-64"
              />
            </div>
            <p className="text-sm text-gray-400 text-center">
              Scan with your Lightning wallet
            </p>
          </div>
        )}

        {/* Invoice Details */}
        {!isExpired && paymentStatus === 'pending' && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Lightning Invoice
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lightningInvoice}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white text-sm font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-bitcoin hover:bg-bitcoin-dark text-black rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-400">Amount</p>
                <p className="text-lg font-bold text-white">
                  ${invoiceData?.amount || '0'} USD
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-lg font-bold text-bitcoin capitalize">
                  {invoiceData?.status || 'Pending'}
                </p>
              </div>
            </div>

            <button
              onClick={onCheckStatus}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <SiBitcoin className="text-xl" />
              Check Payment Status
            </button>
          </>
        )}

        {/* Instructions */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">Payment Instructions:</h4>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-bitcoin font-bold">1.</span>
              <span>Open your Lightning-enabled Bitcoin wallet</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bitcoin font-bold">2.</span>
              <span>Scan the QR code or paste the Lightning invoice</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bitcoin font-bold">3.</span>
              <span>Confirm the payment in your wallet</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bitcoin font-bold">4.</span>
              <span>Wait for confirmation (usually instant)</span>
            </li>
          </ol>
        </div>

        {/* Recommended Wallets */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">Don't have a Lightning wallet?</h4>
          <p className="text-sm text-gray-400 mb-3">
            Try one of these popular Lightning wallets:
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://phoenix.acinq.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-bitcoin/20 hover:bg-bitcoin/30 text-bitcoin rounded-full text-sm transition-colors"
            >
              Phoenix
            </a>
            <a
              href="https://www.walletofsatoshi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-bitcoin/20 hover:bg-bitcoin/30 text-bitcoin rounded-full text-sm transition-colors"
            >
              Wallet of Satoshi
            </a>
            <a
              href="https://muun.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-bitcoin/20 hover:bg-bitcoin/30 text-bitcoin rounded-full text-sm transition-colors"
            >
              Muun
            </a>
            <a
              href="https://bluewallet.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-bitcoin/20 hover:bg-bitcoin/30 text-bitcoin rounded-full text-sm transition-colors"
            >
              BlueWallet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
