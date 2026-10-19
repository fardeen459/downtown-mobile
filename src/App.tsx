import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  Award, ShieldCheck, Wrench, Zap, Smartphone, Tablet, Laptop, Watch, Gamepad2, Sparkles as SparkIcon,
  Clock, Gem, BadgeDollarSign, Home, MapPin, Phone, Mail, ArrowRight, ArrowUpRight, Plus, Check, Menu, X, Search, Hammer, Store,
} from 'lucide-react'
import { initLenis, scrollToId } from './lenis'
import { Counter, Eyebrow, FadeUp, Magnetic, Reveal } from './components/ui'
type Imgs = typeof import('./images').default
let imgCache: Imgs | null = null
function useImgs(): Partial<Imgs> {
  const [imgs, set] = useState<Partial<Imgs>>(imgCache ?? {})
  useEffect(() => { if (!imgCache) import('./images').then((m) => { imgCache = m.default; set(m.default) }) }, [])
  return imgs
}

const Scene = lazy(() => import('./components/Scene'))
const ease = [0.22, 1, 0.36, 1] as const
const TEL = 'tel:+12095851104'
const PHONE = '(209) 585-1104'
const MAPS = 'https://www.google.com/maps/search/?api=1&query=520+E+Main+St+Turlock+CA+95380'

/* ---------------- Nav ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const links: [string, string][] = [['Services', 'devices'], ['Studio', 'studio'], ['Process', 'process'], ['Visit', 'visit'], ['FAQ', 'faq']]
  const go = (e: MouseEvent, id: string) => { e.preventDefault(); setOpen(false); scrollToId(id) }
  return (
    <motion.header className={`nav ${scrolled ? 'nav-scrolled' : ''}`} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease, delay: 0.2 }}>
      <a href="#top" className="logo" onClick={(e) => go(e, 'top')}>
        <span className="logo-mark">D</span><span className="logo-word">Downtown <em>Mobile</em></span>
      </a>
      <nav className="nav-links">{links.map(([l, id]) => <a key={id} href={`#${id}`} onClick={(e) => go(e, id)}>{l}</a>)}</nav>
      <div className="nav-cta">
        <a className="nav-phone" href={TEL}><Phone size={14} strokeWidth={1.5} />{PHONE}</a>
        <Magnetic to="book" variant="line">Book</Magnetic>
      </div>
      <button className="nav-burger" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {links.map(([l, id]) => <a key={id} href={`#${id}`} onClick={(e) => go(e, id)}>{l}</a>)}
            <a href={TEL}>Call {PHONE}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/* ---------------- Hero ---------------- */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.6 })
  const textY = useTransform(progress, [0, 1], [0, -120])
  const textO = useTransform(progress, [0, 0.6], [1, 0])
  const inView = useInView(ref, { margin: '100px' })
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 50); return () => clearTimeout(t) }, [])
  return (
    <section id="top" ref={ref} className="hero">
      <div className="hero-glow" />
      <div className="hero-canvas" aria-hidden>
        {ready && <Suspense fallback={null}><Scene progress={progress} active={inView} reduced={reduced} /></Suspense>}
      </div>
      <motion.div className="hero-content" style={reduced ? {} : { y: textY, opacity: textO }}>
        <motion.div className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1.2 }}>
          <span className="dot" /> Turlock, California · Est. on Main Street
        </motion.div>
        <Reveal as="h1" className="hero-title" text="Fast & Affordable Phone Repair in Turlock" delay={0.35} />
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1, ease }}>
          Same-Day Service <i>•</i> Walk-Ins Welcome <i>•</i> 90-Day Warranty
        </motion.p>
        <motion.p className="hero-line" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 1, ease }}>
          Expert repairs for iPhone, Samsung, Google Pixel, and more
        </motion.p>
        <motion.div className="hero-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1, ease }}>
          <Magnetic to="book">Schedule Appointment <ArrowRight size={16} /></Magnetic>
          <Magnetic href={TEL} variant="ghost"><Phone size={15} strokeWidth={1.5} /> Call {PHONE}</Magnetic>
          <Magnetic to="book" variant="line">Get a Quote</Magnetic>
        </motion.div>
      </motion.div>
      <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span>Scroll</span><span className="scroll-bar"><motion.i animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} /></span>
      </motion.div>
    </section>
  )
}

/* ---------------- Stats ---------------- */
function Stats() {
  const items = [
    { icon: Award, title: 'Certified Technicians', text: 'Expert repairs by trained professionals', big: <>Certified</> },
    { icon: ShieldCheck, title: '90-Day Warranty', text: 'All repairs guaranteed', big: <><Counter to={90} /><small>days</small></> },
    { icon: Wrench, title: '1000+ Repairs', text: 'Trusted by Turlock community', big: <><Counter to={1000} suffix="+" /></> },
    { icon: Zap, title: 'Same-Day Service', text: 'Most repairs done while you wait', big: <>Same day</> },
  ]
  return (
    <section className="stats">
      {items.map((s, i) => (
        <FadeUp key={s.title} delay={i * 0.1} className="stat">
          <s.icon className="stat-icon" size={22} strokeWidth={1.2} />
          <div className="stat-big">{s.big}</div>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </FadeUp>
      ))}
    </section>
  )
}

/* ---------------- Devices ---------------- */
const DEVICES = [
  { icon: Smartphone, name: 'Smartphones', desc: 'iPhone, Samsung, Google Pixel, and all Android devices', fixes: ['Screen & glass', 'Battery', 'Charging port', 'Cameras', 'Water damage'] },
  { icon: Tablet, name: 'Tablets', desc: 'iPad, Samsung Galaxy Tab, and all tablet devices', fixes: ['Cracked digitizer', 'Battery', 'Charging port', 'Buttons', 'Software'] },
  { icon: Laptop, name: 'Computers', desc: 'Laptops, desktops, and MacBooks', fixes: ['Displays', 'Keyboards', 'Batteries', 'Storage upgrades', 'Liquid spills'] },
  { icon: Watch, name: 'Smartwatches', desc: 'Apple Watch, Samsung Galaxy Watch, and more', fixes: ['Screen', 'Battery', 'Back glass', 'Sensors', 'Bands & crowns'] },
  { icon: Gamepad2, name: 'Game Consoles', desc: 'PlayStation, Xbox, Nintendo Switch', fixes: ['HDMI ports', 'Overheating', 'Joy-Con drift', 'Disc drives', 'Power issues'] },
  { icon: SparkIcon, name: 'Something Else', desc: 'Other electronic devices and gadgets', fixes: ['Earbuds', 'Speakers', 'Drones', 'E-readers', 'Ask us anything'] },
]
function TiltCard({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20 }), sry = useSpring(ry, { stiffness: 200, damping: 20 })
  const reduced = useReducedMotion()
  return (
    <motion.button className={`dcard ${active ? 'dcard-active' : ''}`} onClick={onClick} aria-pressed={active}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 800 }}
      onMouseMove={(e) => { if (reduced) return; const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - 0.5) * 12); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12) }}
      onMouseLeave={() => { rx.set(0); ry.set(0) }} whileTap={{ scale: 0.98 }}>
      {children}
    </motion.button>
  )
}
function Devices() {
  const [sel, setSel] = useState(0)
  const d = DEVICES[sel]
  return (
    <section id="devices" className="section">
      <div className="section-head center">
        <Eyebrow>Services</Eyebrow>
        <Reveal text="What device are you looking to fix?" />
        <FadeUp><p className="lede">Get a free consultation and fast repair for all your devices</p></FadeUp>
      </div>
      <div className="devices">
        <div className="dgrid">
          {DEVICES.map((dv, i) => (
            <FadeUp key={dv.name} delay={i * 0.06}>
              <TiltCard active={sel === i} onClick={() => setSel(i)}>
                <dv.icon size={26} strokeWidth={1.1} />
                <span className="dcard-name">{dv.name}</span>
                <span className="dcard-desc">{dv.desc}</span>
                {sel === i && <motion.span layoutId="dglow" className="dcard-glow" transition={{ type: 'spring', stiffness: 260, damping: 30 }} />}
              </TiltCard>
            </FadeUp>
          ))}
        </div>
        <div className="dpanel">
          <AnimatePresence mode="wait">
            <motion.div key={d.name} initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }} transition={{ duration: 0.55, ease }}>
              <div className="dpanel-icon"><d.icon size={44} strokeWidth={0.9} /></div>
              <span className="dpanel-num">0{sel + 1} / 06</span>
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              <ul>{d.fixes.map((f, i) => (
                <motion.li key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <Check size={14} strokeWidth={1.5} /> {f}
                </motion.li>))}
              </ul>
              <Magnetic to="book" variant="line">Free consultation <ArrowRight size={15} /></Magnetic>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <FadeUp className="help-row">
        <p>Not sure what you need? <em>We're here to help!</em></p>
        <div className="row-btns">
          <Magnetic to="book">Get Free Quote</Magnetic>
          <Magnetic to="visit" variant="ghost">Contact Us</Magnetic>
        </div>
      </FadeUp>
    </section>
  )
}

/* ---------------- Pinned Studio ---------------- */
function Studio() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const draw = useTransform(p, [0.05, 0.55], [0, 1])
  const ringR = useTransform(p, [0, 1], [0, 120])
  const scale = useTransform(p, [0, 0.5, 1], [0.85, 1, 1.05])
  const t1 = useTransform(p, [0.0, 0.12], [0, 1]), y1 = useTransform(p, [0.0, 0.12], [40, 0])
  const t2 = useTransform(p, [0.18, 0.32], [0, 1]), y2 = useTransform(p, [0.18, 0.32], [40, 0])
  const t3 = useTransform(p, [0.38, 0.5], [0, 1]), y3 = useTransform(p, [0.38, 0.5], [40, 0])
  const t4 = useTransform(p, [0.52, 0.64], [0, 1]), y4 = useTransform(p, [0.52, 0.64], [40, 0])
  const t5 = useTransform(p, [0.66, 0.78], [0, 1]), y5 = useTransform(p, [0.66, 0.78], [30, 0])
  const scan = useTransform(p, [0.2, 0.9], ['8%', '92%'])
  const fixed = useTransform(p, [0.55, 0.75], [0, 1])
  const cracks = useTransform(p, [0.45, 0.65], [1, 0])
  const bar = useTransform(p, [0, 1], ['0%', '100%'])
  const imgs = useImgs()
  const bgScale = useTransform(p, [0, 1], [1.12, 1])
  const bgOp = useTransform(p, [0, 0.15, 0.85, 1], [0.35, 0.75, 0.75, 0.4])
  return (
    <section id="studio" ref={ref} className="studio">
      <div className="studio-bg" aria-hidden="true">
        <motion.img src={imgs.studioBg} alt="" loading="lazy" decoding="async" style={{ scale: bgScale, opacity: bgOp }} />
        <div className="studio-bg-shade" />
      </div>
      <div className="studio-sticky">
        <div className="studio-text">
          <motion.div style={{ opacity: t1, y: y1 }}><Eyebrow>The Studio</Eyebrow></motion.div>
          <motion.h2 style={{ opacity: t1, y: y1 }}>Professional Repairs, <em>Proven Results</em></motion.h2>
          <motion.p style={{ opacity: t2, y: y2 }} className="lede">
            Our modern, fully-equipped repair facility features the latest tools and technology to restore your device to like-new condition. From shattered screens to complex water damage, we handle every repair with precision and care.
          </motion.p>
          <div className="studio-hl">
            <motion.div style={{ opacity: t3, y: y3 }} className="hl"><Clock size={22} strokeWidth={1.2} /><div><h4>Fast Service</h4><p>30-60 minute repairs</p></div></motion.div>
            <motion.div style={{ opacity: t4, y: y4 }} className="hl"><Gem size={22} strokeWidth={1.2} /><div><h4>Quality Parts</h4><p>OEM-grade components</p></div></motion.div>
          </div>
          <motion.div style={{ opacity: t5, y: y5 }}><Magnetic to="book">Schedule Your Repair <ArrowRight size={16} /></Magnetic></motion.div>
        </div>
        <motion.div className="studio-visual" style={{ scale }}>
          <svg viewBox="0 0 400 500" className="studio-svg">
            <defs>
              <linearGradient id="sv-scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2b2219" /><stop offset="1" stopColor="#09090b" /></linearGradient>
              <radialGradient id="sv-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#d8b98a" stopOpacity=".35" /><stop offset="1" stopColor="#d8b98a" stopOpacity="0" /></radialGradient>
            </defs>
            <circle cx="200" cy="250" r="200" fill="url(#sv-glow)" />
            {[0, 1, 2].map((i) => <motion.circle key={i} cx="200" cy="250" r={useTransform(ringR, (v) => 110 + i * 40 + v * (i + 1) * 0.3)} fill="none" stroke="#d8b98a" strokeOpacity={0.18 - i * 0.04} />)}
            <motion.rect x="110" y="70" width="180" height="360" rx="30" fill="none" stroke="#d8b98a" strokeWidth="1.5" style={{ pathLength: draw }} />
            <motion.rect x="120" y="80" width="160" height="340" rx="22" fill="url(#sv-scr)" style={{ opacity: fixed }} />
            <motion.g stroke="#cfd3da" strokeOpacity=".5" fill="none" style={{ opacity: cracks }}>
              <path d="M170 200 L130 150 M170 200 L150 300 M170 200 L240 170 M170 200 L230 260 L280 300 M150 300 L130 390" />
            </motion.g>
            <motion.text x="200" y="200" textAnchor="middle" fill="#f3ece2" fontFamily="Fraunces, serif" fontSize="44" fontWeight="300" style={{ opacity: fixed }}>10:09</motion.text>
            <motion.text x="200" y="225" textAnchor="middle" fill="#d8b98a" fontFamily="Inter" fontSize="9" letterSpacing="3" style={{ opacity: fixed }}>LIKE NEW</motion.text>
            <motion.line x1="100" x2="300" stroke="#e7c99a" strokeWidth="1" style={{ y: scan, opacity: draw }} y1="0" y2="0" />
          </svg>
          <motion.div className="scan-line" style={{ top: scan }} />
        </motion.div>
        <div className="studio-progress"><motion.span style={{ width: bar }} /></div>
      </div>
    </section>
  )
}

/* ---------------- Why ---------------- */
function Why() {
  const f = [
    { icon: Clock, t: 'Fast Turnaround', d: 'Most repairs completed in 30-60 minutes. We value your time and get you back to your life quickly.' },
    { icon: Gem, t: 'Quality Parts', d: 'We use only high-quality replacement parts that meet or exceed OEM specifications for lasting repairs.' },
    { icon: BadgeDollarSign, t: 'Fair Pricing', d: 'Transparent, competitive pricing with no hidden fees. We offer price matching to ensure you get the best deal.' },
    { icon: Home, t: 'Local & Trusted', d: 'Family-owned business serving Turlock and the Central Valley. Your neighbors trust us with their devices.' },
  ]
  return (
    <section className="section" id="why">
      <div className="section-head split">
        <div><Eyebrow>Why us</Eyebrow><Reveal text="Why Choose Downtown Mobile?" /></div>
        <FadeUp><p className="lede">We're Turlock's trusted phone repair experts with a commitment to quality, speed, and customer satisfaction.</p></FadeUp>
      </div>
      <div className="why-grid">
        {f.map((x, i) => (
          <motion.article key={x.t} className="why" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease, delay: i * 0.12 }}>
            <span className="why-num">0{i + 1}</span>
            <x.icon size={28} strokeWidth={1} className="why-icon" />
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

/* ---------------- How ---------------- */
function How() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })
  const steps = [
    { icon: Store, t: 'Bring In Your Device', d: 'Visit our shop or schedule an appointment online. Walk-ins always welcome!' },
    { icon: Search, t: 'Free Diagnosis', d: "We'll examine your device and provide a free quote with no obligation." },
    { icon: Hammer, t: 'Quick Repair', d: 'Most repairs done in 30-60 minutes. Relax in our waiting area or come back later.' },
  ]
  return (
    <section className="section" id="process">
      <div className="section-head center"><Eyebrow>Process</Eyebrow><Reveal text="How It Works" /></div>
      <div className="how" ref={ref}>
        <div className="how-track"><motion.div className="how-fill" style={{ scaleX: line }} /></div>
        <div className="how-track-v"><motion.div className="how-fill-v" style={{ scaleY: line }} /></div>
        {steps.map((s, i) => (
          <FadeUp key={s.t} delay={i * 0.15} className="step">
            <div className="step-badge"><span>{i + 1}</span></div>
            <s.icon size={22} strokeWidth={1.2} className="step-icon" />
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Gallery ---------------- */
function GalleryItem({ src, alt, caption, idx }: { src?: string; alt: string; caption: string; idx: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [idx === 1 ? 80 : 30, idx === 1 ? -80 : -30])
  const inner = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  return (
    <motion.figure ref={ref} className={`gitem gitem-${idx}`} style={{ y }}>
      <div className="gframe"><motion.div className="gart" style={{ y: inner }}><img className="art" src={src} alt={alt} loading="lazy" decoding="async" width={1456} height={1088} /></motion.div><div className="gshade" /></div>
      <figcaption><span>0{idx + 1}</span>{caption}<ArrowUpRight size={16} strokeWidth={1.3} /></figcaption>
    </motion.figure>
  )
}
function Gallery() {
  const imgs = useImgs()
  return (
    <section className="section gallery-sec">
      <div className="section-head split">
        <div><Eyebrow>Gallery</Eyebrow><Reveal text="Craft, up close" /></div>
        <FadeUp><p className="lede">A look inside the bench — where cracked glass becomes flawless again.</p></FadeUp>
      </div>
      <div className="gallery">
        <GalleryItem idx={0} src={imgs.beforeAfter} alt="Before and after phone screen repair - Downtown Mobile Turlock" caption="Before and after screen repair" />
        <GalleryItem idx={1} src={imgs.studio} alt="Downtown Mobile professional repair shop interior" caption="Our repair studio interior" />
        <GalleryItem idx={2} src={imgs.devices} alt="Variety of smartphone models repaired at Downtown Mobile Turlock CA" caption="Smartphones we repair" />
      </div>
    </section>
  )
}

/* ---------------- Testimonials ---------------- */
// PLACEHOLDER TESTIMONIALS — replace with real, verified customer reviews before launch.
const TESTIMONIALS = [
  { q: 'Dropped my phone on the way to work and had it back with a brand-new screen before lunch. Couldn’t believe how quick it was.', n: 'Maria G.', d: 'Screen replacement' },
  { q: 'They explained exactly what was wrong, gave me a price up front, and the battery has been great ever since.', n: 'Daniel R.', d: 'Battery replacement' },
  { q: 'Friendly, honest, and fast. It feels good supporting a local shop that actually cares about doing it right.', n: 'Priya S.', d: 'Charging port repair' },
]
function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="section-head center"><Eyebrow>Kind words</Eyebrow><Reveal text="From our neighbors" /></div>
      <div className="tgrid">
        {TESTIMONIALS.map((t, i) => (
          <FadeUp key={t.n} delay={i * 0.12} className="tcard">
            <span className="tquote">“</span>
            <p>{t.q}</p>
            <div className="tmeta"><span className="tavatar">{t.n[0]}</span><div><strong>{t.n}</strong><small>{t.d}</small></div></div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Booking form ---------------- */
function Book() {
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setName(String(new FormData(e.currentTarget).get('name') || '')); setDone(true) }
  return (
    <section className="section" id="book">
      <div className="book">
        <div className="book-intro">
          <Eyebrow>Appointments & quotes</Eyebrow>
          <Reveal text="Reserve your bench time" />
          <p className="lede">Tell us what happened and we'll get back to you with a free, no-obligation quote. Prefer to talk? Call <a href={TEL}>{PHONE}</a>.</p>
          <ul className="book-points"><li><Check size={14} /> Free diagnosis</li><li><Check size={14} /> 90-day warranty</li><li><Check size={14} /> Price matching</li></ul>
        </div>
        <div className="book-card">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.form key="f" onSubmit={submit} initial={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                <label><span>Name</span><input name="name" required placeholder="Your full name" autoComplete="name" /></label>
                <label><span>Phone</span><input name="phone" type="tel" required placeholder="(209) 555-0123" autoComplete="tel" /></label>
                <label><span>Device</span>
                  <select name="device" required defaultValue=""><option value="" disabled>Select a device</option>{DEVICES.map((d) => <option key={d.name}>{d.name}</option>)}</select>
                </label>
                <label><span>Issue</span><textarea name="issue" rows={3} required placeholder="Cracked screen, battery drains fast, won't charge…" /></label>
                <Magnetic type="submit">Request Appointment <ArrowRight size={16} /></Magnetic>
                <small className="form-note">No payment required. We'll call or text to confirm.</small>
              </motion.form>
            ) : (
              <motion.div key="s" className="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }}>
                <motion.div className="success-ring" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}><Check size={30} strokeWidth={1.4} /></motion.div>
                <h3>Thank you{name ? `, ${name.split(' ')[0]}` : ''}.</h3>
                <p>Your request is in. A technician will reach out shortly to confirm your appointment and quote.</p>
                <button className="link" onClick={() => setDone(false)}>Send another request</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Location ---------------- */
const HOURS: [string, string][] = [['Mon – Fri', '10:00 AM – 6:00 PM'], ['Saturday', '10:00 AM – 4:00 PM'], ['Sunday', 'Closed']]
function MapArt() {
  return (
    <svg viewBox="0 0 600 420" className="map-svg" role="img" aria-label="Stylized map of downtown Turlock showing 520 E Main St">
      <rect width="600" height="420" fill="#0d0d0f" />
      <g stroke="#1f1f23" strokeWidth="1">{Array.from({ length: 16 }).map((_, i) => <line key={'v' + i} x1={i * 40} y1="0" x2={i * 40} y2="420" />)}{Array.from({ length: 11 }).map((_, i) => <line key={'h' + i} x1="0" y1={i * 40} x2="600" y2={i * 40} />)}</g>
      <g stroke="#2e2c29" strokeWidth="14" strokeLinecap="round"><line x1="-10" y1="140" x2="610" y2="250" /><line x1="160" y1="-10" x2="250" y2="430" /><line x1="420" y1="-10" x2="380" y2="430" /></g>
      <motion.line x1="-10" y1="200" x2="610" y2="200" stroke="#3b342b" strokeWidth="20" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease }} />
      <text x="40" y="190" fill="#8c857a" fontSize="11" letterSpacing="3" fontFamily="Inter">E MAIN ST</text>
      <text x="262" y="60" fill="#5c5750" fontSize="10" letterSpacing="2" fontFamily="Inter" transform="rotate(78 262 60)">N CENTER ST</text>
      <circle cx="330" cy="200" r="60" fill="#d8b98a" opacity=".08" />
      <motion.circle cx="330" cy="200" r="22" fill="none" stroke="#d8b98a" initial={{ scale: 0.6, opacity: 0.9 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ repeat: Infinity, duration: 2.4 }} style={{ transformOrigin: '330px 200px' }} />
      <circle cx="330" cy="200" r="8" fill="#d8b98a" />
      <rect x="350" y="150" width="180" height="40" rx="6" fill="#0b0b0c" stroke="#d8b98a" strokeOpacity=".5" />
      <text x="364" y="175" fill="#f3ece2" fontSize="13" fontFamily="Fraunces, serif">Downtown Mobile</text>
    </svg>
  )
}
function Location() {
  return (
    <section className="section" id="visit">
      <div className="loc">
        <div className="loc-info">
          <Eyebrow>Location</Eyebrow>
          <Reveal text="Visit Our Turlock Location" />
          <p className="addr"><MapPin size={18} strokeWidth={1.3} /> 520 E Main St, Turlock, CA 95380</p>
          <div className="hours">{HOURS.map(([d, h]) => <div key={d} className="hrow"><span>{d}</span><span className="hdots" /><span>{h}</span></div>)}</div>
          <div className="row-btns"><Magnetic href={MAPS} external>Get Directions <ArrowUpRight size={16} /></Magnetic><Magnetic href={TEL} variant="ghost">Call {PHONE}</Magnetic></div>
        </div>
        <FadeUp className="loc-map"><MapArt /></FadeUp>
      </div>
    </section>
  )
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  { q: 'How much does repair cost?', a: 'Call us at (209) 585-1104 or visit us at 520 E Main St, Turlock, CA 95380 for an instant free quote. We guarantee competitive pricing and offer price matching.' },
  { q: 'How long does repair take?', a: 'Most repairs are completed in 30-60 minutes while you wait. Complex repairs may take longer, but we always provide an estimated timeframe upfront.' },
  { q: 'Do you have a warranty?', a: "Yes! All repairs come with a 90-day warranty on parts and labor. If you experience any issues with your repair, bring it back and we'll make it right." },
  { q: 'Can I just walk in?', a: 'Yes, walk-ins are always welcome! You can also schedule an appointment online or by calling (209) 585-1104 to skip the wait.' },
]
function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="section faq-sec" id="faq">
      <div className="section-head center"><Eyebrow>FAQ</Eyebrow><Reveal text="Questions, answered" /></div>
      <div className="faq">
        {FAQS.map((f, i) => (
          <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span>{f.q}</span>
              <motion.span className="faq-icon" animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.4, ease }}><Plus size={18} strokeWidth={1.3} /></motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }}>
                  <p>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Final CTA ---------------- */
function FinalCTA() {
  const imgs = useImgs()
  return (
    <section className="final">
      <div className="final-tex" aria-hidden="true" style={imgs.ctaTexture ? { backgroundImage: `url(${imgs.ctaTexture})` } : undefined} />
      <div className="final-ring" />
      <Reveal text="Ready to Fix Your Phone?" className="final-title" />
      <FadeUp><p className="lede">Schedule your appointment or walk in today for same-day service</p></FadeUp>
      <FadeUp delay={0.15} className="row-btns center"><Magnetic to="book">Schedule Now <ArrowRight size={16} /></Magnetic><Magnetic href={TEL} variant="ghost"><Phone size={15} strokeWidth={1.5} /> Call {PHONE}</Magnetic></FadeUp>
    </section>
  )
}

/* ---------------- Footer ---------------- */
function Footer() {
  const q: [string, string][] = [['Services', 'devices'], ['Schedule Appointment', 'book'], ['Get Quote', 'book'], ['About Us', 'why'], ['Contact', 'visit']]
  return (
    <footer className="footer">
      <div className="fgrid">
        <div className="fbrand">
          <div className="logo"><span className="logo-mark">D</span><span className="logo-word">Downtown <em>Mobile</em></span></div>
          <p>Turlock's trusted phone repair experts</p>
          <p className="muted">Fast, affordable, and reliable.</p>
        </div>
        <div><h4>Quick Links</h4><ul>{q.map(([l, id]) => <li key={l}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id) }}>{l}</a></li>)}</ul></div>
        <div><h4>Contact</h4><ul>
          <li><a href={TEL}><Phone size={14} strokeWidth={1.4} /> {PHONE}</a></li>
          <li><a href="mailto:info@downtownmobile.com"><Mail size={14} strokeWidth={1.4} /> info@downtownmobile.com</a></li>
          <li><a href={MAPS} target="_blank" rel="noopener noreferrer"><MapPin size={14} strokeWidth={1.4} /> 520 E Main St, Turlock, CA 95380</a></li>
        </ul></div>
        <div><h4>Business Hours</h4><ul className="fhours">{HOURS.map(([d, h]) => <li key={d}><span>{d}</span><span>{h}</span></li>)}</ul></div>
      </div>
      <div className="fword" aria-hidden>Downtown Mobile</div>
      <div className="fbottom">
        <span>© 2026 Downtown Mobile. All rights reserved.</span>
        <div><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Warranty Policy</a></div>
      </div>
    </footer>
  )
}

/* ---------------- Cursor glow ---------------- */
function CursorGlow() {
  const x = useMotionValue(-400), y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 120, damping: 20 }), sy = useSpring(y, { stiffness: 120, damping: 20 })
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const m = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('pointermove', m)
    return () => window.removeEventListener('pointermove', m)
  }, [x, y])
  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} aria-hidden />
}

export default function App() {
  useEffect(() => initLenis(), [])
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <>
      <motion.div className="page-progress" style={{ scaleX: bar }} />
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Devices />
        <Studio />
        <Why />
        <How />
        <Gallery />
        <Testimonials />
        <Book />
        <Location />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
