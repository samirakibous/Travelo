import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, X, Camera, Briefcase, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-[#94a3b8]">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 px-16 py-16">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={22} color="#1a73e8" />
            <span className="text-white font-extrabold text-xl">Travelo</span>
          </div>
          <p className="text-sm leading-[1.8] max-w-[280px] mb-6">
            Making the world more accessible and safer for everyone through technology and community-driven insights.
          </p>
          <div className="flex gap-3">
            {[Globe, X, Camera, Briefcase].map((Icon, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center cursor-pointer hover:bg-[#334155] transition-colors">
                <Icon size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <p className="text-white font-bold text-sm mb-5">Platform</p>
          {['How it Works', 'Verified Guides', 'Safety Index', 'Pricing Plans'].map((item) => (
            <Link key={item} href="#" className="block text-sm text-[#94a3b8] mb-3 hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* Resources */}
        <div>
          <p className="text-white font-bold text-sm mb-5">Resources</p>
          {['Safety Tips', 'Destination Guides', 'Blog', 'Help Center'].map((item) => (
            <Link key={item} href="#" className="block text-sm text-[#94a3b8] mb-3 hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p className="text-white font-bold text-sm mb-5">Contact</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-sm">
              <Mail size={15} color="#1a73e8" />
              support@travelo.com
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Phone size={15} color="#1a73e8" />
              +1 (800) SAFE-TRV
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <MapPin size={15} color="#1a73e8" />
              San Francisco, CA
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e293b] px-16 py-5 flex items-center justify-between text-[13px]">
        <p>© 2026 Travelo Inc. All rights reserved.</p>
        <div className="flex gap-7">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
            <Link key={item} href="#" className="text-[#94a3b8] hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
