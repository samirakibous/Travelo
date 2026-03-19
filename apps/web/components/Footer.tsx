import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', fontFamily: 'sans-serif' }}>
      {/* Main footer */}
      <div style={{ padding: '64px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Shield size={22} color="#1a73e8" />
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>Travelo</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
            Making the world more accessible and safer for everyone through technology and community-driven insights.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: '50%', background: '#1e293b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <Icon size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Platform</p>
          {['How it Works', 'Verified Guides', 'Safety Index', 'Pricing Plans'].map((item) => (
            <Link key={item} href="#" style={{
              display: 'block', fontSize: 14, color: '#94a3b8',
              marginBottom: 12, textDecoration: 'none',
            }}>
              {item}
            </Link>
          ))}
        </div>

        {/* Resources */}
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Resources</p>
          {['Safety Tips', 'Destination Guides', 'Blog', 'Help Center'].map((item) => (
            <Link key={item} href="#" style={{
              display: 'block', fontSize: 14, color: '#94a3b8',
              marginBottom: 12, textDecoration: 'none',
            }}>
              {item}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Contact</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <Mail size={15} color="#1a73e8" />
              support@travelo.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <Phone size={15} color="#1a73e8" />
              +1 (800) SAFE-TRV
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <MapPin size={15} color="#1a73e8" />
              San Francisco, CA
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #1e293b', padding: '20px 64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 13,
      }}>
        <p>© 2026 Travelo Inc. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
            <Link key={item} href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
