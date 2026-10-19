import { motion, useInView, useMotionValue, useSpring, useReducedMotion, animate } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { scrollToId } from '../lenis'

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ text, as = 'h2', className, delay = 0 }: { text: string; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; delay?: number }) {
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word-mask" aria-hidden>
            <motion.span className="word" variants={{ hidden: { y: '110%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease } } }}>{w}</motion.span>
          </span>{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease, delay }}>
      {children}
    </motion.div>
  )
}

type BtnProps = { children: ReactNode; href?: string; to?: string; variant?: 'gold' | 'ghost' | 'line'; onClick?: () => void; type?: 'button' | 'submit'; external?: boolean }
export function Magnetic({ children, href, to, variant = 'gold', onClick, type = 'button', external }: BtnProps) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 }), sy = useSpring(y, { stiffness: 220, damping: 18 })
  const move = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25); y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  const leave = () => { x.set(0); y.set(0) }
  const cls = `btn btn-${variant}`
  const inner = <span className="btn-inner">{children}</span>
  if (to) return <motion.a href={`#${to}`} className={cls} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave}
    onClick={(e) => { e.preventDefault(); scrollToId(to) }}>{inner}</motion.a>
  if (href) return <motion.a href={href} className={cls} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</motion.a>
  return <motion.button type={type} className={cls} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave} onClick={onClick}>{inner}</motion.button>
}

export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2.2, ease, onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow"><span className="eyebrow-line" />{children}</div>
}
