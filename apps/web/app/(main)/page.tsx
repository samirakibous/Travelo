import Link from 'next/link';
import {
  Map, Users, Siren, Search, CheckCircle,
  MapPin, Shield, BookOpen, Navigation, Star, ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="font-sans text-[#1a1a2e]">

      {/* Hero */}
      <section
        className="py-[100px] px-16 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(135deg, rgba(26,115,232,0.82) 0%, rgba(13,71,161,0.85) 100%), url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)' }}
      >
        <p className="text-[13px] tracking-[2px] uppercase opacity-80 mb-4">Your Safety, Our Priority</p>
        <h1 className="text-[52px] font-extrabold leading-tight mb-5">
          Travel the World with<br />Confidence
        </h1>
        <p className="text-lg opacity-85 max-w-[560px] mx-auto mb-10">
          Real-time safety alerts, verified local guides, and an interactive map to keep you safe wherever you go.
        </p>
        <div className="flex max-w-[520px] mx-auto bg-white rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex items-center pl-5">
            <Search size={18} color="#aaa" />
          </div>
          <input
            type="text"
            placeholder="Search a destination..."
            className="flex-1 px-3 py-4 border-none outline-none text-[15px] text-[#333]"
          />
          <button className="px-7 py-4 bg-[#1a73e8] text-white border-none font-bold text-[15px] cursor-pointer flex items-center gap-2 hover:bg-blue-600 transition-colors">
            Explore <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Securing Every Step */}
      <section className="py-20 px-16 text-center bg-[#f8f9ff]" id="features">
        <p className="text-[#1a73e8] font-semibold text-[13px] tracking-[2px] uppercase mb-3">Why Travelo</p>
        <h2 className="text-[34px] font-extrabold mb-12">Securing Every Step</h2>
        <div className="grid grid-cols-3 gap-8 max-w-[960px] mx-auto">
          {[
            { icon: <Map size={32} color="#1a73e8" />, title: 'Interactive Safety Map', desc: 'Visualize safe and risky zones in real-time with color-coded overlays and geolocated alerts.' },
            { icon: <Users size={32} color="#1a73e8" />, title: 'Verified Local Guides', desc: 'Connect with certified local guides who know the terrain, culture, and hidden dangers.' },
            { icon: <Siren size={32} color="#1a73e8" />, title: 'SOS Instant Alarm', desc: 'One-tap SOS button that sends your GPS location to emergency contacts and local services.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-9 shadow-[0_2px_16px_rgba(0,0,0,0.06)] text-left">
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2.5">{f.title}</h3>
              <p className="text-[#666] text-sm leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Travelo Protects You */}
      <section className="py-20 px-16 bg-white" id="how">
        <div className="flex items-center gap-20 max-w-[1000px] mx-auto">
          <div className="flex-1">
            <p className="text-[#1a73e8] font-semibold text-[13px] tracking-[2px] uppercase mb-3">Step by Step</p>
            <h2 className="text-[34px] font-extrabold mb-10">How Travelo Protects You</h2>
            {[
              { icon: <Search size={18} color="#1a73e8" />, title: 'Find Your Destination', desc: 'Search any city or region and instantly get its safety score and live alerts.' },
              { icon: <Map size={18} color="#1a73e8" />, title: 'Browse Safety Zones', desc: 'Explore the interactive map with color-coded risk zones updated in real time.' },
              { icon: <BookOpen size={18} color="#1a73e8" />, title: 'Book a Certified Guide', desc: 'Choose from verified local guides with ratings, specialties, and availability.' },
              { icon: <Navigation size={18} color="#1a73e8" />, title: 'Travel with Confidence', desc: 'Get geolocated alerts, use SOS if needed, and share your live position.' },
            ].map((step) => (
              <div key={step.title} className="flex gap-5 mb-7">
                <div className="min-w-[40px] h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <p className="font-bold mb-1">{step.title}</p>
                  <p className="text-[#666] text-sm leading-[1.6]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Phone mockup */}
          <div className="flex-1 flex justify-center">
            <div className="w-[220px] h-[420px] bg-[#1a1a2e] rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-full h-40 bg-[#1a73e8] rounded-2xl flex items-center justify-center opacity-90">
                <Map size={48} color="#fff" />
              </div>
              <div className="w-full bg-white rounded-xl p-3 flex items-center gap-2">
                <Shield size={14} color="#34a853" />
                <div>
                  <p className="text-[10px] font-bold text-[#34a853]">Safe Zone</p>
                  <p className="text-[9px] text-[#666]">Paris Centre — Low Risk</p>
                </div>
              </div>
              <div className="w-full bg-red-50 rounded-xl p-3 flex items-center gap-2">
                <Siren size={14} color="#e53935" />
                <div>
                  <p className="text-[10px] font-bold text-[#e53935]">Active Alert</p>
                  <p className="text-[9px] text-[#666]">Stay alert in this area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Know Before You Go */}
      <section className="py-20 px-16 bg-[#f8f9ff]">
        <div className="flex items-center gap-20 max-w-[1000px] mx-auto">
          <div className="flex-1">
            <div className="h-[280px] bg-gradient-to-br from-[#c8e6c9] to-[#a5d6a7] rounded-[20px] flex items-center justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
              <Map size={80} color="#2e7d32" />
              <div className="absolute bottom-4 left-4 bg-white rounded-[10px] px-3.5 py-2 text-xs font-semibold shadow-md flex items-center gap-1.5">
                <MapPin size={12} color="#34a853" /> Low Risk · Paris
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[#1a73e8] font-semibold text-[13px] tracking-[2px] uppercase mb-3">Safety Intel</p>
            <h2 className="text-[34px] font-extrabold mb-5">Know Before You Go</h2>
            <p className="text-[#666] leading-[1.8] mb-7 text-[15px]">
              Access verified safety reports, local tips from certified guides, and live alerts before you even land.
            </p>
            {['Verified safety reports', 'Live geolocation alerts', 'Local guide recommendations', 'Emergency numbers by country'].map((item) => (
              <div key={item} className="flex items-center gap-2.5 mb-3">
                <CheckCircle size={16} color="#34a853" />
                <span className="text-sm text-[#444]">{item}</span>
              </div>
            ))}
            <Link href="/register" className="inline-flex items-center gap-2 mt-6 px-7 py-3 bg-[#1a1a2e] text-white rounded-[10px] font-bold text-sm hover:bg-[#2a2a4e] transition-colors">
              Explore the Map <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Traveler Stories */}
      <section className="py-20 px-16 bg-white" id="stories">
        <p className="text-[#1a73e8] font-semibold text-[13px] tracking-[2px] uppercase mb-3 text-center">Community</p>
        <h2 className="text-[34px] font-extrabold mb-3 text-center">Traveler Stories</h2>
        <p className="text-center text-[#888] text-sm mb-12">Thousands trust Travelo to explore the world safely.</p>
        <div className="grid grid-cols-3 gap-7 max-w-[960px] mx-auto">
          {[
            { name: 'Sarah M.', role: 'Solo Traveler', text: 'Travelo warned me about a risky neighborhood in Bangkok before I even arrived. Felt totally safe!' },
            { name: 'Carlos D.', role: 'Family Trip', text: 'We booked a certified guide through Travelo for Morocco. Best decision ever — she knew every safe route.' },
            { name: 'Amina K.', role: 'Digital Nomad', text: 'The SOS button gave me peace of mind traveling alone through Southeast Asia. Always felt protected.' },
          ].map((s) => (
            <div key={s.name} className="bg-[#f8f9ff] rounded-2xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
              </div>
              <p className="text-sm text-[#555] leading-[1.7] mb-5">&quot;{s.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                  <Users size={18} color="#1a73e8" />
                </div>
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-xs text-[#888]">{s.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-16 text-center bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] text-white">
        <h2 className="text-[38px] font-extrabold mb-4">Ready for your next adventure?</h2>
        <p className="text-base opacity-85 mb-9">Join thousands of travelers who explore the world safely with Travelo.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a73e8] rounded-[10px] font-bold text-[15px] hover:bg-gray-50 transition-colors">
            Get Started Now <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="px-8 py-3.5 border-2 border-white text-white rounded-[10px] font-bold text-[15px] hover:bg-white/10 transition-colors">
            Login
          </Link>
        </div>
      </section>

    </div>
  );
}
