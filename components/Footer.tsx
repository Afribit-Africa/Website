import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaInstagram, FaYoutube, FaMedium } from 'react-icons/fa6';
import { FiExternalLink } from 'react-icons/fi';

export function Footer() {
  const resourceLinks = [
    { name: 'Bitcoin Beach', url: 'https://github.com/bitcoinbeach/bubbles' },
    { name: 'Learn From Ekasi', url: 'https://bitcoinekasi.com/learn/' },
    { name: 'Trezor Academy', url: 'https://youtu.be/w3hnFCfCo84?si=iVIS3Ea34uI3_EY6' },
    { name: 'African Bitcoiners', url: 'https://bitcoiners.africa/learn-bitcoin/' },
    { name: 'Bitcoin Kenya', url: 'https://bitcoin.co.ke/' },
    { name: 'Machankura', url: 'https://8333.mobi/faqs' },
    { name: 'Blink', url: 'https://www.blink.sv/' },
    { name: 'FEDI', url: 'https://www.fedi.xyz/' },
  ];

  return (
    <footer className="bg-gradient-to-b from-black/50 to-black border-t border-white/10 py-16 pb-24 md:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Brand Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/Media/Logo/icon symbol only svg.svg"
                alt="Afribit Africa"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold font-heading">
                Afribit <span className="text-gradient">Africa</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering African communities through Bitcoin education, merchant onboarding, and sustainable development.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://x.com/afribitkibera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-bitcoin/20 border border-white/10 hover:border-bitcoin/50 rounded-lg flex items-center justify-center transition-all group"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-4 h-4 text-gray-400 group-hover:text-bitcoin transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/afribit_africa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-bitcoin/20 border border-white/10 hover:border-bitcoin/50 rounded-lg flex items-center justify-center transition-all group"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4 text-gray-400 group-hover:text-bitcoin transition-colors" />
              </a>
              <a
                href="https://www.youtube.com/@AfribitAfrica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-bitcoin/20 border border-white/10 hover:border-bitcoin/50 rounded-lg flex items-center justify-center transition-all group"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4 text-gray-400 group-hover:text-bitcoin transition-colors" />
              </a>
              <a
                href="https://medium.com/@afribitkibera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-bitcoin/20 border border-white/10 hover:border-bitcoin/50 rounded-lg flex items-center justify-center transition-all group"
                aria-label="Medium"
              >
                <FaMedium className="w-4 h-4 text-gray-400 group-hover:text-bitcoin transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/programs/merchants" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>Merchant Program</span>
                </Link>
              </li>
              <li>
                <Link href="/maps" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>Merchant Map</span>
                </Link>
              </li>
              <li>
                <Link href="/fedi" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>Community</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group font-medium">
                  <span>Donate</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-base font-semibold mb-4 font-heading">Community</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://btcmap.org/community/afribit-kibera" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>BTC Map</span>
                  <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://staging.geyser.fund/project/afribitkibera" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>Geyser Fund</span>
                  <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://bitcoinconfederation.org/hub/afribit-kibera/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>Bitcoin Confederation</span>
                  <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://pay.afribit.africa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>BTCPay Server</span>
                  <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://x.com/afribitkibera" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group">
                  <span>Latest News</span>
                  <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base font-semibold mb-4 font-heading">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-bitcoin transition-colors flex items-center gap-1.5 group"
                  >
                    <span>{link.name}</span>
                    <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-sm text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} Afribit Africa. All Rights Reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-500">
                <Link href="/legal/privacy" className="hover:text-bitcoin transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-700">•</span>
                <Link href="/legal/terms" className="hover:text-bitcoin transition-colors">
                  Terms of Service
                </Link>
                <span className="text-gray-700">•</span>
                <Link href="/legal/cookies" className="hover:text-bitcoin transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            <p className="text-sm text-center md:text-right">
              Empowering Communities <span className="text-bitcoin font-medium">Through Bitcoin</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
