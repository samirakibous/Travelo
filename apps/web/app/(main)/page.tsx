import Link from 'next/link';
import {
  Map, Users, Siren, Search, CheckCircle,
  MapPin, Shield, BookOpen, Navigation, Star, ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a2e' }}>

      {/* Hero */}
      <section style={{
        backgroundImage: 'linear-gradient(135deg, rgba(26,115,232,0.82) 0%, rgba(13,71,161,0.85) 100%), url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        padding: '100px 64px', textAlign: 'center', color: '#fff',
      }}>
        <p style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.8, marginBottom: 16 }}>
          Your Safety, Our Priority
        </p>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Travel the World with<br />Confidence
        </h1>
        <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 560, margin: '0 auto 40px' }}>
          Real-time safety alerts, verified local guides, and an interactive map to keep you safe wherever you go.
        </p>
        <div style={{
          display: 'flex', maxWidth: 520, margin: '0 auto',
          background: '#fff', borderRadius: 50, overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
            <Search size={18} color="#aaa" />
          </div>
          <input
            type="text"
            placeholder="Search a destination..."
            style={{ flex: 1, padding: '16px 12px', border: 'none', outline: 'none', fontSize: 15, color: '#333' }}
          />
          <button style={{
            padding: '16px 28px', background: '#1a73e8', color: '#fff',
            border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            Explore <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Securing Every Step */}
      <section style={{ padding: '80px 64px', textAlign: 'center', background: '#f8f9ff' }} id="features">
        <p style={{ color: '#1a73e8', fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          Why Travelo
        </p>
        <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 48 }}>Securing Every Step</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 960, margin: '0 auto' }}>
          {[
            { icon: <Map size={32} color="#1a73e8" />, title: 'Interactive Safety Map', desc: 'Visualize safe and risky zones in real-time with color-coded overlays and geolocated alerts.' },
            { icon: <Users size={32} color="#1a73e8" />, title: 'Verified Local Guides', desc: 'Connect with certified local guides who know the terrain, culture, and hidden dangers.' },
            { icon: <Siren size={32} color="#1a73e8" />, title: 'SOS Instant Alarm', desc: 'One-tap SOS button that sends your GPS location to emergency contacts and local services.' },
          ].map((f) => (
            <div key={f.title} style={{
              background: '#fff', borderRadius: 16, padding: '36px 28px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'left',
            }}>
              <div style={{ marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Travelo Protects You */}
      <section style={{ padding: '80px 64px', background: '#fff' }} id="how">
        <div style={{ display: 'flex', alignItems: 'center', gap: 80, maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#1a73e8', fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Step by Step
            </p>
            <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 40 }}>How Travelo Protects You</h2>
            {[
              { icon: <Search size={18} color="#1a73e8" />, title: 'Find Your Destination', desc: 'Search any city or region and instantly get its safety score and live alerts.' },
              { icon: <Map size={18} color="#1a73e8" />, title: 'Browse Safety Zones', desc: 'Explore the interactive map with color-coded risk zones updated in real time.' },
              { icon: <BookOpen size={18} color="#1a73e8" />, title: 'Book a Certified Guide', desc: 'Choose from verified local guides with ratings, specialties, and availability.' },
              { icon: <Navigation size={18} color="#1a73e8" />, title: 'Travel with Confidence', desc: 'Get geolocated alerts, use SOS if needed, and share your live position.' },
            ].map((step) => (
              <div key={step.title} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                <div style={{
                  minWidth: 40, height: 40, borderRadius: '50%', background: '#e8f0fe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{step.icon}</div>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{step.title}</p>
                  <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 220, height: 420, background: '#1a1a2e', borderRadius: 36,
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24,
            }}>
              <div style={{ width: '100%', height: 160, background: '#1a73e8', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                <Map size={48} color="#fff" />
              </div>
              <div style={{ width: '100%', background: '#fff', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} color="#34a853" />
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#34a853' }}>Safe Zone</p>
                  <p style={{ fontSize: 9, color: '#666' }}>Paris Centre — Low Risk</p>
                </div>
              </div>
              <div style={{ width: '100%', background: '#fff2f2', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Siren size={14} color="#e53935" />
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#e53935' }}>Active Alert</p>
                  <p style={{ fontSize: 9, color: '#666' }}>Stay alert in this area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Know Before You Go */}
      <section style={{ padding: '80px 64px', background: '#f8f9ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 80, maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <div style={{
              height: 280, background: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)', borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}>
              <Map size={80} color="#2e7d32" />
              <div style={{
                position: 'absolute', bottom: 16, left: 16, background: '#fff',
                borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <MapPin size={12} color="#34a853" /> Low Risk · Paris
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#1a73e8', fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Safety Intel</p>
            <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 20 }}>Know Before You Go</h2>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>
              Access verified safety reports, local tips from certified guides, and live alerts before you even land.
            </p>
            {['Verified safety reports', 'Live geolocation alerts', 'Local guide recommendations', 'Emergency numbers by country'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <CheckCircle size={16} color="#34a853" />
                <span style={{ fontSize: 14, color: '#444' }}>{item}</span>
              </div>
            ))}
            <Link href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24,
              padding: '12px 28px', background: '#1a1a2e', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14,
            }}>
              Explore the Map <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Traveler Stories */}
      <section style={{ padding: '80px 64px', background: '#fff' }} id="stories">
        <p style={{ color: '#1a73e8', fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Community</p>
        <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>Traveler Stories</h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 14, marginBottom: 48 }}>Thousands trust Travelo to explore the world safely.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, maxWidth: 960, margin: '0 auto' }}>
          {[
            { name: 'Sarah M.', role: 'Solo Traveler', text: 'Travelo warned me about a risky neighborhood in Bangkok before I even arrived. Felt totally safe!' },
            { name: 'Carlos D.', role: 'Family Trip', text: 'We booked a certified guide through Travelo for Morocco. Best decision ever — she knew every safe route.' },
            { name: 'Amina K.', role: 'Digital Nomad', text: 'The SOS button gave me peace of mind traveling alone through Southeast Asia. Always felt protected.' },
          ].map((s) => (
            <div key={s.name} style={{ background: '#f8f9ff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
              </div>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 20 }}>"{s.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} color="#1a73e8" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>{s.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 64px', textAlign: 'center', background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', color: '#fff' }}>
        <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16 }}>Ready for your next adventure?</h2>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 36 }}>Join thousands of travelers who explore the world safely with Travelo.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link href="/register" style={{
            padding: '14px 32px', background: '#fff', color: '#1a73e8',
            borderRadius: 10, fontWeight: 700, fontSize: 15,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Get Started Now <ArrowRight size={16} />
          </Link>
          <Link href="/login" style={{
            padding: '14px 32px', border: '2px solid #fff', color: '#fff',
            borderRadius: 10, fontWeight: 700, fontSize: 15,
          }}>Login</Link>
        </div>
      </section>

    </div>
  );
}
