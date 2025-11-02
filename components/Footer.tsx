import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaInstagram, FaYoutube, FaMedium } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="bg-linear-to-b from-black/50 to-black border-t border-white/10 py-12 md:py-16 pb-24 md:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/Media/Logo/icon symbol only svg.svg"
                alt="Afribit Africa"
                width={36}
                height={36}
              />
              <span className="text-xl font-bold">
                Afribit <span className="text-gradient">Africa</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Empowering African communities through Bitcoin education, merchant onboarding, and sustainable development.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://x.com/afribitkibera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-bitcoin transition-colors"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/afribit_africa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-bitcoin transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@AfribitAfrica"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-bitcoin transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a
                href="https://medium.com/@afribitkibera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-bitcoin transition-colors"
                aria-label="Medium"
              >
                <FaMedium className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://pay.afribit.africa/apps/2xYtsTMHMqYv6qozQ8j9zjP66FiR/crowdfund" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Donate
                </a>
              </li>
              <li>
                <Link href="/#testimonials" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-bitcoin transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://btcmap.org/community/afribit-kibera" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors">
                  BTC Map
                </a>
              </li>
              <li>
                <a href="https://staging.geyser.fund/project/afribitkibera" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Geyser Fund
                </a>
              </li>
              <li>
                <a href="https://bitcoinconfederation.org/hub/afribit-kibera/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Bitcoin Confederation
                </a>
              </li>
              <li>
                <a href="https://pay.afribit.africa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors">
                  BTCPay Server
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://x.com/afribitkibera" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Latest News
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="https://medium.com/@afribitkibera" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bitcoin transition-colors">
                  Medium
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Afribit Africa. All Rights Reserved.</p>
          <p className="text-center sm:text-right">
            Empowering Communities <span className="text-bitcoin">Through Bitcoin</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
