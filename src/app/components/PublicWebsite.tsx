import { useMemo } from "react";
import {
  Calendar,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  ShoppingBag,
  LogIn,
  Menu,
  X,
  ChevronLeft,
  MessageCircle,
  Star,
  Search,
  ChevronDown,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import type { ElementType } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import clinicLogo from "@/imports/photo_2024-05-10_11-09-44-1.jpg";
import service5Image from "@/imports/service-5.jpg";
import product1Image from "@/imports/product-1.jpg";
import product2Image from "@/imports/product-2.jpg";
import product3Image from "@/imports/product-3.jpg";
import product4Image from "@/imports/product-4.jpg";
import product5Image from "@/imports/product-5.jpg";
import product6Image from "@/imports/product-6.jpg";
import product7Image from "@/imports/product-7.jpg";
import { G, OR, R, W } from "@/app/theme";
import { SERVICES, PRODUCTS, FAQS, BLOG_POSTS, TESTIMONIALS, DOCTORS, INITIAL_HERO_SLIDES, AWARD_GALLERY } from "@/app/content";

interface PublicWebsiteProps {
  heroIndex: number;
  isHeroTransitioning: boolean;
  heroSlides: typeof INITIAL_HERO_SLIDES;
  menuOpen: boolean;
  bookingDone: boolean;
  bookingStep: number;
  booking: {
    service: string;
    doctorId: number;
    fullName: string;
    phone: string;
    email: string;
    notes: string;
    date: string;
    time: string;
  };
  bookingSmsStatus: string | null;
  cart: Record<number, number>;
  onToggleMenu: () => void;
  onSetView: (view: "public" | "patient" | "admin") => void;
  onSetHeroIndex: (value: number | ((prev: number) => number)) => void;
  onSetBookingStep: (value: number | ((prev: number) => number)) => void;
  onSetBooking: (value: any) => void;
  onAdvanceBooking: () => void;
  onSetBookingDone: (value: boolean) => void;
  onAddToCart: (productId: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: () => void;
  canContinue: boolean;
}

const productImages = [product1Image, product2Image, product3Image, product4Image, product5Image, product6Image, product7Image];

const Badge = ({ label, bg, text }: { label: string; bg: string; text: string }) => (
  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold" style={{ background: bg, color: text }}>{label}</span>
);

const HeroSlide = ({ slide }: { slide: (typeof INITIAL_HERO_SLIDES)[number] }) => (
  <div className="flex min-h-[90vh] w-full shrink-0 flex-col lg:grid lg:grid-cols-2">
    <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20">
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-8 w-fit border" style={{ background: `${G}12`, borderColor: `${G}30`, color: G }}>
        <BadgeCheck className="w-3.5 h-3.5" /> {slide.badge}
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: OR }}>{slide.eyebrow}</p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] mb-6 text-gray-900 whitespace-pre-line">{slide.title}</h1>
      <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-10 max-w-md">{slide.description}</p>
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <a href="#book" className="text-white px-7 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-opacity hover:opacity-90" style={{ background: G, boxShadow: `0 8px 24px ${G}35` }}>
          <Calendar className="w-5 h-5" /> Book Appointment
        </a>
        <a href="https://wa.me/2330558379545" className="px-7 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border-2 transition-colors hover:bg-green-50" style={{ borderColor: "#25D366", color: "#128C7E" }}>
          <MessageCircle className="w-5 h-5 text-[#25D366]" /> WhatsApp Us
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-8 border-t border-gray-100 sm:grid-cols-3">
        {slide.stats.map(([n, label, color]) => (
          <div key={label as string}>
            <p className="font-display text-2xl font-bold" style={{ color: color as string }}>{n}</p>
            <p className="text-gray-400 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="relative order-first overflow-hidden min-h-[45vh] sm:min-h-[50vh] lg:order-none lg:min-h-0" style={{ background: slide.background }}>
      <div className="absolute inset-0 z-0 overflow-hidden bg-white">
        <ImageWithFallback src={slide.image} alt="" aria-hidden className="h-full w-full object-cover object-center" style={{ imageRendering: "auto", transform: "scale(1.03)" }} />
      </div>
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(90deg, rgba(28,122,58,0.55) 0%, rgba(28,122,58,0.2) 45%, rgba(28,122,58,0.05) 100%)" }} />
      <div className="relative z-20 mt-8 mx-auto mb-4 hidden rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl max-w-[240px] sm:absolute sm:bottom-6 sm:left-6 sm:right-auto sm:mt-0 sm:mb-0 sm:max-w-[220px] sm:block">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white p-0.5">
            <ImageWithFallback src={clinicLogo} alt="Edu Herbal Clinic logo" className="h-full w-full rounded-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-gray-900 text-sm">Edu Herbal Clinic</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: G }}>{slide.panelSubtitle}</p>
          </div>
        </div>
      </div>
      <div className="absolute top-6 left-6 z-20 rounded-xl px-3 py-2" style={{ background: "rgba(0,0,0,0.35)" }}>
        <div className="flex items-center gap-2 text-white text-xs font-medium">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
          AI Chat · 24/7
        </div>
      </div>
    </div>
  </div>
);

export default function PublicWebsite(props: PublicWebsiteProps) {
  const { heroIndex, isHeroTransitioning, heroSlides, menuOpen, bookingDone, bookingStep, booking, bookingSmsStatus, cart, onToggleMenu, onSetView, onSetHeroIndex, onSetBookingStep, onSetBooking, onAdvanceBooking, onSetBookingDone, onAddToCart, onRemoveFromCart, onCheckout, canContinue } = props;
  const productMap = useMemo(() => Object.fromEntries(PRODUCTS.map((product) => [product.id, product])), []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="border-b border-white/10 bg-gradient-to-r from-[#8B2E1A] via-[#C45A1F] to-[#1C7A3A] px-1.5 py-1 text-white sm:px-4 sm:py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 text-[8px] font-semibold uppercase tracking-[0.15em] sm:justify-between sm:gap-3 sm:text-[11px]">
          <span className="ml-auto flex min-w-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-sm sm:ml-0 sm:gap-1.5 sm:px-3 sm:py-1.5"><Phone className="w-3 h-3 shrink-0" /> <span className="truncate">+233 055 837 9545</span></span>
          <span className="mr-auto flex min-w-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-sm sm:mr-0 sm:gap-1.5 sm:px-3 sm:py-1.5"><Mail className="w-3 h-3 shrink-0" /> <span className="truncate">Edhecman2@gmail.com</span></span>
          <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 shadow-sm backdrop-blur-sm"><Clock className="w-3 h-3" /> Mon–Fri 8AM–6PM · Sat 9AM–3PM</span>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-2 ring-emerald-100">
              <ImageWithFallback src={clinicLogo} alt="Edu Herbal Clinic logo" className="h-10 w-10 rounded-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-extrabold leading-tight tracking-tight" style={{ color: G }}>Edu Herbal Clinic</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: R }}>Your Good Health Is Our Concern</p>
            </div>
          </a>
          <div className="hidden lg:flex items-center gap-6 rounded-full border border-gray-100 bg-gray-50/80 px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm">
            {[['#services', 'Services'], ['#book', 'Book Now'], ['#products', 'Products'], ['#blog', 'Blog'], ['#faq', 'FAQ'], ['#contact', 'Contact']].map(([href, lbl]) => (
              <a key={href} href={href} className="transition-colors hover:text-[#1C7A3A]">{lbl}</a>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => onSetView("patient")} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ color: G }}>
              <LogIn className="w-4 h-4" /> Patient Portal
            </button>
            <a href="#book" className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ background: `linear-gradient(90deg, ${OR}, ${R})` }}>
              Book Now
            </a>
          </div>
          <button className="lg:hidden p-1" onClick={onToggleMenu}>
            {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg flex flex-col gap-3">
            {[['#services', 'Services'], ['#book', 'Book Now'], ['#products', 'Products'], ['#blog', 'Blog'], ['#faq', 'FAQ'], ['#contact', 'Contact']].map(([href, lbl]) => (
              <a key={href} href={href} onClick={onToggleMenu} className="text-sm font-semibold text-gray-700 py-1">{lbl}</a>
            ))}
            <button onClick={() => { onSetView("patient"); onToggleMenu(); }} className="text-sm font-semibold text-left py-1" style={{ color: G }}>Patient Portal</button>
            <a href="#book" onClick={onToggleMenu} className="w-full rounded-full px-4 py-2.5 text-center text-sm font-bold text-white" style={{ background: `linear-gradient(90deg, ${OR}, ${R})` }}>Book Now</a>
          </div>
        )}
      </nav>

      <section id="home" className="relative overflow-hidden">
        <div className="overflow-hidden">
          <div className={`flex ${isHeroTransitioning ? "transition-transform duration-700 ease-out" : "transition-none"}`} style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
            {[...heroSlides, heroSlides[0]].map((slide, index) => (
              <HeroSlide key={`${slide.title}-${index}`} slide={slide} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => onSetHeroIndex(index)} className={`h-2.5 rounded-full transition-all ${index === (heroIndex % heroSlides.length) ? "w-8 bg-green-600" : "w-2.5 bg-white/70"}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button onClick={() => onSetHeroIndex((prev: number) => (prev - 1 + heroSlides.length + 1) % (heroSlides.length + 1))} className="rounded-full border border-white/40 bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => onSetHeroIndex((prev: number) => (prev + 1) % (heroSlides.length + 1))} className="rounded-full border border-white/40 bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur"><ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>

      <div className="h-2" style={{ background: `linear-gradient(to right,${R},${OR},${G})` }} />

      <section id="services" className="py-16 px-4 sm:py-24" style={{ background: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>What We Offer</p>
            <h2 className="font-display text-4xl text-gray-900 mt-2">Integrated Healthcare Services</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">From expert consultations to digital health records — all your healthcare needs in one connected ecosystem.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service) => {
              const isHerbalConsultation = service.title === "Herbal Consultation";
              return (
                <div key={service.title} className={`group overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isHerbalConsultation ? "bg-gradient-to-br from-emerald-50/70 via-white to-white" : ""}`}>
                  {isHerbalConsultation ? (
                    <div className="relative h-44 overflow-hidden">
                      <ImageWithFallback src={service5Image} alt="Herbal consultation session" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-700 shadow-sm">
                        Featured
                      </div>
                    </div>
                  ) : null}
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${service.color}15` }}>
                      <service.icon className="w-6 h-6" style={{ color: service.color }} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.desc}</p>
                    <div className="flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all" style={{ color: service.color }}>Learn more <ChevronRight className="w-4 h-4" /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Meet Our Specialists</p>
            <h2 className="font-display text-4xl text-gray-900 mt-2">Experienced clinicians guiding your care</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Our team combines traditional herbal medicine with modern care pathways to support you at every step.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {DOCTORS.map((doctor) => (
              <div key={doctor.id} className="rounded-[1.75rem] border border-gray-100 bg-[#fcfcfc] p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: G }}>{doctor.initials}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {doctor.slots.map((slot) => (
                    <span key={slot} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600">{slot}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="py-16 px-4 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Book Online</p>
            <h2 className="font-display text-4xl text-gray-900 mt-2">Book an Appointment</h2>
            <p className="text-gray-400 mt-3">No calls needed — choose your doctor and preferred time in minutes.</p>
          </div>
          {bookingDone ? (
            <div className="rounded-3xl p-12 text-center border" style={{ background: `${G}0e`, borderColor: `${G}30` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: G }}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl text-gray-900 mb-2">Appointment Successful!</h3>
              <p className="text-gray-400 mb-6">Your appointment request was received successfully. We’ll confirm it via SMS and WhatsApp shortly.</p>
              {bookingSmsStatus ? <p className="mb-4 text-sm font-semibold text-green-700">{bookingSmsStatus}</p> : null}
              <button onClick={() => onSetBookingDone(false)} className="text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity" style={{ background: G }}>Back to Booking</button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-4 sm:p-8">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {['Service', 'Doctor', 'Details', 'Date & Time', 'Confirm'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={i < bookingStep ? { background: G, color: W } : i === bookingStep ? { background: OR, color: W, boxShadow: `0 0 0 4px ${OR}25` } : { background: '#f3f4f6', color: '#9ca3af' }}>
                      {i < bookingStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className="text-xs font-semibold hidden sm:block" style={{ color: i === bookingStep ? OR : i < bookingStep ? G : '#9ca3af' }}>{step}</span>
                    {i < 4 && <div className="w-6 h-0.5 hidden sm:block" style={{ background: i < bookingStep ? G : '#e5e7eb' }} />}
                  </div>
                ))}
              </div>
              {bookingStep === 0 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Select a Service</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {['Herbal Consultation', 'Laboratory Tests', 'Telemedicine (Video)', 'Follow-up Visit', 'Prescription Refill', 'Skin & Dermatology'].map((service) => (
                      <button key={service} onClick={() => onSetBooking((prev: typeof booking) => ({ ...prev, service }))} className="px-4 py-3.5 rounded-xl border-2 text-sm font-semibold text-left transition-all" style={booking.service === service ? { borderColor: G, background: `${G}0e`, color: G } : { borderColor: '#e5e7eb', color: '#374151' }}>
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {bookingStep === 1 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Choose Your Doctor</p>
                  <div className="space-y-3">
                    {DOCTORS.map((doctor) => (
                      <button key={doctor.id} onClick={() => onSetBooking((prev: typeof booking) => ({ ...prev, doctorId: doctor.id }))} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all" style={booking.doctorId === doctor.id ? { borderColor: G, background: `${G}0a` } : { borderColor: '#e5e7eb' }}>
                        <div className="w-11 h-11 rounded-full text-white font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ background: G }}>{doctor.initials}</div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-gray-900">{doctor.name}</p>
                          <p className="text-sm text-gray-400">{doctor.specialty}</p>
                        </div>
                        {booking.doctorId === doctor.id && <CheckCircle className="w-5 h-5" style={{ color: G }} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {bookingStep === 2 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Tell Us About You</p>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500 mb-2 block">Full Name</label>
                      <input value={booking.fullName} onChange={(e) => onSetBooking((prev: typeof booking) => ({ ...prev, fullName: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors" style={{ background: '#f9fafb' }} onFocus={(e) => { e.currentTarget.style.borderColor = G; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-500 mb-2 block">Phone Number</label>
                        <input value={booking.phone} onChange={(e) => onSetBooking((prev: typeof booking) => ({ ...prev, phone: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors" style={{ background: '#f9fafb' }} onFocus={(e) => { e.currentTarget.style.borderColor = G; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500 mb-2 block">Email Address</label>
                        <input type="email" value={booking.email} onChange={(e) => onSetBooking((prev: typeof booking) => ({ ...prev, email: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors" style={{ background: '#f9fafb' }} onFocus={(e) => { e.currentTarget.style.borderColor = G; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500 mb-2 block">Additional Note</label>
                      <textarea value={booking.notes} onChange={(e) => onSetBooking((prev: typeof booking) => ({ ...prev, notes: e.target.value }))} rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors resize-none" style={{ background: '#f9fafb' }} onFocus={(e) => { e.currentTarget.style.borderColor = G; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
                    </div>
                  </div>
                </div>
              )}
              {bookingStep === 3 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Select Date & Time</p>
                  <div className="mb-5">
                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Preferred Date</label>
                    <input type="date" value={booking.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => onSetBooking((prev: typeof booking) => ({ ...prev, date: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors" style={{ background: '#f9fafb' }} onFocus={(e) => { e.currentTarget.style.borderColor = G; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }} />
                  </div>
                  <label className="text-sm font-semibold text-gray-500 mb-3 block">Available Times</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(DOCTORS.find((doctor) => doctor.id === booking.doctorId) || DOCTORS[0]).slots.map((time) => (
                      <button key={time} onClick={() => onSetBooking((prev: typeof booking) => ({ ...prev, time }))} className="py-3 rounded-xl border-2 text-sm font-bold transition-all" style={booking.time === time ? { borderColor: OR, background: OR, color: W } : { borderColor: '#e5e7eb', color: '#374151' }}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {bookingStep === 4 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Confirm Your Booking</p>
                  <div className="rounded-2xl p-5 space-y-3 mb-5 border" style={{ background: `${G}0a`, borderColor: `${G}25` }}>
                    {[
                      ['Service', booking.service],
                      ['Doctor', DOCTORS.find((doctor) => doctor.id === booking.doctorId)?.name || '—'],
                      ['Full Name', booking.fullName || '—'],
                      ['Phone', booking.phone || '—'],
                      ['Email', booking.email || '—'],
                      ['Additional Note', booking.notes || '—'],
                      ['Date', booking.date || '—'],
                      ['Time', booking.time || '—'],
                    ].map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm gap-3">
                        <span className="text-gray-400">{key}</span>
                        <span className="font-bold text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">A confirmation is sent via SMS and WhatsApp immediately. An automatic reminder is sent 24 hours before your appointment.</p>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                {bookingStep > 0 && <button onClick={() => onSetBookingStep((prev: number) => prev - 1)} className="px-5 py-3 rounded-full border-2 border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors">Back</button>}
                <button onClick={onAdvanceBooking} disabled={!canContinue} className="flex-1 text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: G, boxShadow: `0 6px 20px ${G}30` }}>
                  {bookingStep < 4 ? 'Continue' : 'Confirm Appointment'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="products" className="py-16 px-4 sm:py-24" style={{ background: '#f9fafb' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Our Products</p>
              <h2 className="font-display text-4xl text-gray-900 mt-2">Herbal Products Catalogue</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden" style={{ background: `${G}12` }}>
                  <img src={product.img ?? productImages[(product.id ?? 1) % productImages.length]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-bold" style={{ background: G }}>{product.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1.5">{product.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{product.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold" style={{ color: G }}>GHS {product.price}</span>
                    <button onClick={() => onAddToCart(product.id)} className="flex items-center gap-1.5 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-opacity" style={{ background: OR }}>
                      <ShoppingBag className="w-3.5 h-3.5" /> Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {Object.keys(cart).length > 0 && (
            <div className="mt-8 rounded-2xl p-5 text-white shadow-lg" style={{ background: G }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{Object.keys(cart).length} product(s) in cart</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg" style={{ color: '#fed7aa' }}>GHS {Object.entries(cart).reduce((sum, [id, qty]) => sum + ((productMap[Number(id)]?.price || 0) * qty), 0)}</span>
                  <button onClick={onCheckout} className="text-white px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: OR }}>Checkout</button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(cart).map(([id, qty]) => {
                  const product = productMap[Number(id)];
                  if (!product) return null;
                  return (
                    <div key={product.id} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm">
                      <div className="flex-1">
                        <span>{product.name}</span>
                        <span className="ml-2 text-white/70">× {qty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onRemoveFromCart(product.id)} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors">−</button>
                        <span className="w-8 text-center">{qty}</span>
                        <button onClick={() => onAddToCart(product.id)} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="blog" className="py-16 px-4 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>From Our Journal</p>
            <h2 className="font-display text-4xl text-gray-900 mt-2">Health Insights & Wellness News</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <article key={post.title} className="rounded-3xl border border-gray-100 bg-[#fbfbfb] p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-4 font-bold text-gray-900 text-xl">{post.title}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-sm font-semibold text-gray-600">
                  <span>{post.date}</span>
                  <a href="#contact" className="flex items-center gap-1" style={{ color: G }}>Read more <ChevronRight className="w-4 h-4" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 sm:py-24" style={{ background: '#f9fafb' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Questions</p>
            <h2 className="font-display text-4xl text-gray-900 mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <button className="w-full px-5 py-4 flex items-center justify-between text-left">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                <div className="px-5 pb-4 text-sm text-gray-500">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:py-24" style={{ background: "linear-gradient(135deg, #f7fbf8 0%, #ffffff 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Awards & Recognition</p>
            <h2 className="font-display text-4xl text-gray-900 mt-2">Trusted by patients and partners</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">A snapshot of the care standards, community impact, and recognition that shape the patient experience at Edu Herbal Clinic.</p>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing">
              {AWARD_GALLERY.map((item) => (
                <div key={item.title} className="snap-start shrink-0 w-[86vw] max-w-[320px] rounded-[1.5rem] border border-gray-100 bg-white shadow-sm sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)]">
                  <div className="relative h-56 overflow-hidden rounded-t-[1.5rem] bg-gray-50">
                    <ImageWithFallback src={item.src} alt={item.title} className="h-full w-full object-contain p-2" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700">Recognition</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Patient Testimonials</p>
            <h2 className="font-display text-4xl text-gray-900 mt-2">What Our Patients Say</h2>
            <div className="mt-8 space-y-4">
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.name} className="rounded-2xl border border-gray-100 bg-[#fcfcfc] p-5 shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, index) => <Star key={`${testimonial.name}-${index}`} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">“{testimonial.text}”</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-400">
                        {testimonial.condition}
                        {testimonial.date ? <> · {testimonial.date}</> : null}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div id="contact" className="rounded-[2rem] border border-gray-100 bg-gradient-to-br from-[#f0faf3] via-white to-[#fff7ed] p-8 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: OR }}>Contact Us</p>
            <h3 className="font-display text-3xl text-gray-900 mt-2">Visit or reach out today</h3>
            <div className="mt-6 space-y-4">
              <div className="flex gap-3 text-sm text-gray-600"><MapPinIcon /> <span>Odorkor Official Town & Mankessim - Bafikrom</span></div>
              <div className="flex gap-3 text-sm text-gray-600"><Phone className="w-4 h-4 mt-0.5" /> <span>+233 055 837 9545</span></div>
              <div className="flex gap-3 text-sm text-gray-600"><Mail className="w-4 h-4 mt-0.5" /> <span>Edhecman2@gmail.com</span></div>
              <div className="flex gap-3 text-sm text-gray-600"><ShieldCheck className="w-4 h-4 mt-0.5" /> <span>Just a call away — we’re here to help.</span></div>
            </div>
            <div className="mt-8 rounded-2xl border border-green-100 bg-white/80 p-5 shadow-sm">
              <p className="font-semibold text-gray-900">Need help choosing a service?</p>
              <p className="text-sm text-gray-500 mt-1">Our care coordinators can guide you through the right consultation path.</p>
              <a href="#book" className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: G }}><Calendar className="w-4 h-4" /> Book a Visit</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-[#0f172a] px-4 py-12 text-gray-300">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 p-1">
                <ImageWithFallback src={clinicLogo} alt="Edu Herbal Clinic logo" className="h-9 w-9 rounded-full object-contain" />
              </div>
              <div>
                <p className="font-semibold text-white">Edu Herbal Clinic</p>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Your Good Health Is Our Concern</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">A connected herbal healthcare ecosystem for consultations, products, follow-ups, and digital records.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="#services" className="transition hover:text-white">Services</a></li>
              <li><a href="#book" className="transition hover:text-white">Book Now</a></li>
              <li><a href="#products" className="transition hover:text-white">Products</a></li>
              <li><a href="#faq" className="transition hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> <span className="break-all">+233 055 837 9545</span></li>
              <li className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> <span className="break-all">Edhecman2@gmail.com</span></li>
              <li className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> Mon–Fri 8AM–6PM</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Care Access</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>Just a call away — speak with our care team</li>
              <li>WhatsApp support available after hours</li>
              <li>Secure online booking and follow-up reminders</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="#home" className="transition hover:text-white">Privacy Policy</a></li>
              <li><a href="#home" className="transition hover:text-white">Terms of Service</a></li>
              <li><a href="#home" className="transition hover:text-white">Cookies</a></li>
              <li><a href="#home" className="transition hover:text-white">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Edu Herbal Clinic. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#home" className="transition hover:text-white">Back to top</a>
            <a href="#contact" className="transition hover:text-white">Contact us</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MapPinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.56-6-10a6 6 0 1 1 12 0c0 4.44-6 10-6 10Z" /><circle cx="12" cy="11" r="2.5" /></svg>;
}
