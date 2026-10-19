import Lenis from 'lenis'
let lenis: Lenis | null = null
export function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ duration: 1.15, smoothWheel: true })
  let id = 0
  const raf = (t: number) => { lenis?.raf(t); id = requestAnimationFrame(raf) }
  id = requestAnimationFrame(raf)
  return () => { cancelAnimationFrame(id); lenis?.destroy(); lenis = null }
}
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -20 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
