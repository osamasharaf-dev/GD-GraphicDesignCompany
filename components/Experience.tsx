'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* data                                                               */
/* ------------------------------------------------------------------ */

type Service = {
  key: string;
  num: string;
  name: string;
  desc: string;
  tags: string[];
  img: string;
  bg: string;
  fg: string;
  side: 'left' | 'right';
  v: 'top' | 'bottom';
  theme: 'light' | 'dark';
};

const SERVICES: Service[] = [
  { key: 'identity', num: '01', name: 'Brand Identity', desc: 'Logo, typography, colour and guidelines — one system that tells your story before a word is read.', tags: ['Logo', 'Guidelines', 'Stationery'], img: 'identity', bg: 'var(--p3)', fg: 'var(--ink)', side: 'left', v: 'bottom', theme: 'light' },
  { key: 'packaging', num: '02', name: 'Packaging', desc: 'Boxes, labels and bags designed to be held, opened, photographed and remembered.', tags: ['Boxes', 'Labels', 'Retail'], img: 'packaging', bg: 'var(--p2)', fg: 'var(--ink)', side: 'left', v: 'top', theme: 'light' },
  { key: 'print', num: '03', name: 'Print & Profile', desc: 'Company profiles, brochures and menus with the weight and feel of good paper.', tags: ['Profiles', 'Brochures', 'Menus'], img: 'print', bg: 'var(--paper)', fg: 'var(--ink)', side: 'right', v: 'bottom', theme: 'light' },
  { key: 'social', num: '04', name: 'Social Media', desc: 'Post systems and templates that keep every feed sharp, consistent and recognisable.', tags: ['Templates', 'Campaigns', 'Content'], img: 'social', bg: 'var(--p4)', fg: 'var(--ink)', side: 'right', v: 'top', theme: 'light' },
  { key: 'motion', num: '05', name: 'Motion', desc: 'Animated logos, reels and motion systems that give a brand its pulse.', tags: ['Logo motion', 'Reels', 'Explainers'], img: 'motion', bg: 'var(--p1)', fg: 'var(--paper)', side: 'left', v: 'bottom', theme: 'dark' },
  { key: 'art', num: '06', name: 'Art Direction', desc: 'Shoots, sets and campaign visuals directed from the first idea to the final frame.', tags: ['Shoots', 'Campaigns', 'Styling'], img: 'artdirection', bg: 'var(--ink)', fg: 'var(--paper)', side: 'right', v: 'bottom', theme: 'dark' },
  { key: 'web', num: '07', name: 'Websites', desc: 'Sites that move the way your brand does — exactly like the one you are using right now.', tags: ['UX / UI', 'Development', 'Motion'], img: 'websites', bg: 'var(--p3)', fg: 'var(--ink)', side: 'right', v: 'top', theme: 'light' },
];

const SCENES: { label: string; name: string; theme: 'light' | 'dark' }[] = [
  { label: 'hero', name: 'Intro', theme: 'light' },
  { label: 'about', name: 'Studio', theme: 'dark' },
  ...SERVICES.map((s) => ({ label: s.key, name: s.name, theme: s.theme })),
  { label: 'work', name: 'Work', theme: 'dark' },
  { label: 'process', name: 'Process', theme: 'light' },
  { label: 'try', name: 'Try it', theme: 'light' },
  { label: 'contact', name: 'Contact', theme: 'light' },
];

const WORK = [
  { img: 'identity', name: 'Nakhla Coffee', tag: 'Identity', bg: 'var(--p3)', info: 'Brand identity · Stationery' },
  { img: 'packaging', name: 'Saffa Sweets', tag: 'Packaging', bg: 'var(--p2)', info: 'Gift boxes · Retail bags' },
  { img: 'social', name: 'Lumen Fashion', tag: 'Social', bg: 'var(--p4)', info: 'Content system · Campaign' },
  { img: 'print', name: 'Dar Al Bina', tag: 'Print', bg: 'var(--paper)', info: 'Company profile · Brochure' },
  { img: 'websites', name: 'Atlas Studio', tag: 'Website', bg: 'var(--p3)', info: 'Website · Motion' },
];

const SWATCHES = [
  { c: '#2B3BFF', on: '#F4F0E6', name: 'Cobalt' },
  { c: '#FF5A1F', on: '#111111', name: 'Tangerine' },
  { c: '#D7FF3A', on: '#111111', name: 'Lime' },
  { c: '#111111', on: '#F4F0E6', name: 'Ink' },
];

const FONT_STYLES = [
  { id: 'bold', label: 'Bold', family: "'Syne', sans-serif", weight: 800, upper: true },
  { id: 'soft', label: 'Friendly', family: "'Manrope', sans-serif", weight: 700, upper: false },
  { id: 'classic', label: 'Classic', family: 'Georgia, serif', weight: 700, upper: false },
];

/* ------------------------------------------------------------------ */
/* small pieces                                                       */
/* ------------------------------------------------------------------ */

function Mono({ size = 56, ring = 'var(--ink)', d = 'var(--p1)', stroke = 7, title = 'GD monogram' }: { size?: number; ring?: string; d?: string; stroke?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title}>
      <path d="M50 8 A42 42 0 0 0 50 92" fill="none" stroke={ring} strokeWidth={stroke} />
      <path d="M50 8 A42 42 0 0 1 50 92" fill="none" stroke={d} strokeWidth={stroke} />
      <path d="M50 8 V92 M28 52 H50" stroke={ring} strokeWidth={stroke} />
    </svg>
  );
}

/** splits text into masked words for reveal animations */
function Words({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className={`w ${className ?? ''}`}>
          <span>{w}</span>
          {' '}
        </span>
      ))}
    </>
  );
}

function ServiceSlide({ s }: { s: Service }) {
  const style: CSSProperties = { background: s.bg, color: s.fg };
  return (
    <div className="slide">
      <div className="slide-bg">
        <img src={`/img/${s.img}.webp`} srcSet={`/img/${s.img}-sm.webp 1024w, /img/${s.img}.webp 2048w`} sizes="100vw" alt="" />
      </div>
      <div className="slide-dim" />
      <article className={`label ${s.side} ${s.v}`} style={style}>
        <span className="big-num" aria-hidden="true">{s.num}</span>
        <div className="meta rv"><span>Service {s.num} / 07</span></div>
        <h3 className="rv">{s.name}</h3>
        <p className="rv">{s.desc}</p>
        <ul className="rv">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      </article>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="about-c">
      <div>
        <p className="eyebrow">About GD</p>
        <svg className="construct" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#F4F0E6" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#D7FF3A" strokeWidth="2.2" />
          <path d="M4 50 H96 M50 4 V96 M17 17 L83 83 M83 17 L17 83" stroke="#F4F0E6" strokeWidth="0.35" />
          <path d="M50 20 V80 M36 52 H50" stroke="#F4F0E6" strokeWidth="2.2" />
          <circle cx="50" cy="20" r="1.6" fill="#FF5A1F" />
          <circle cx="50" cy="80" r="1.6" fill="#FF5A1F" />
        </svg>
      </div>
      <div>
        <h2>
          <Words text="We are an independent design studio in Riyadh, building brands with nerve. Every colour, letter and shape is chosen to make you" />
          <em><Words text="impossible to ignore." /></em>
        </h2>
        <div className="about-stats">
          <span className="chip" style={{ background: '#D7FF3A', color: '#111' }}>Strategy</span>
          <span className="chip" style={{ background: '#FF5A1F', color: '#111' }}>Identity</span>
          <span className="chip" style={{ background: '#FF8FCB', color: '#111' }}>Packaging</span>
          <span className="chip" style={{ background: '#F4F0E6', color: '#111' }}>Motion</span>
          <span className="chip" style={{ background: '#111', color: '#F4F0E6' }}>Websites</span>
        </div>
      </div>
    </div>
  );
}

function RiyadhMap() {
  return (
    <svg viewBox="0 0 640 360" aria-hidden="true" preserveAspectRatio="xMidYMin slice">
      <rect width="640" height="360" fill="#F4F0E6" />
      {Array.from({ length: 17 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40 - 60} y2="360" stroke="#E2DACA" strokeWidth="1" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="640" y2={i * 40 + 20} stroke="#E2DACA" strokeWidth="1" />
      ))}
      <path d="M40 300 C 140 250, 160 160, 250 140 S 420 60, 600 40" fill="none" stroke="#FF8FCB" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
      <rect x="150" y="60" width="360" height="250" rx="110" fill="none" stroke="#111" strokeWidth="5" />
      <path d="M210 360 L 450 0" stroke="#2B3BFF" strokeWidth="7" />
      <path d="M0 210 L 640 150" stroke="#111" strokeWidth="3" strokeDasharray="10 8" />
      <circle cx="430" cy="250" r="34" fill="#D7FF3A" />
      <circle cx="210" cy="110" r="22" fill="#FF5A1F" opacity="0.85" />
      <text x="24" y="40" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="30" fill="#111">RIYADH</text>
      <text x="24" y="62" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="12" fill="#111" opacity="0.6">SAUDI ARABIA · 24.7136° N, 46.6753° E</text>
      <text x="470" y="330" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="12" fill="#111" opacity="0.55">King Fahd Rd</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* main                                                               */
/* ------------------------------------------------------------------ */

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [scene, setScene] = useState(0);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  // try-your-brand state
  const [brand, setBrand] = useState('Nakhla Coffee');
  const [sw, setSw] = useState(0);
  const [fontId, setFontId] = useState('bold');

  // contact state
  const [service, setService] = useState<string[]>(['Brand Identity']);
  const [sent, setSent] = useState(false);

  /* smooth scroll + preloader */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const pre = document.querySelector('.preloader');
    const tl = gsap.timeline();
    const counter = { v: 0 };
    tl.to(counter, { v: 100, duration: 2.2, ease: 'power2.inOut', onUpdate: () => setCount(Math.round(counter.v)) }, 0)
      .fromTo('.preloader .grid-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.06, ease: 'power2.out' }, 0)
      .fromTo('.preloader .mono-path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.18, ease: 'power3.inOut' }, 0.7)
      .to('.preloader .grid-line', { opacity: 0, duration: 0.4 }, 1.9)
      .to('.preloader svg', { scale: 0.22, y: () => -(window.innerHeight / 2) + 48, duration: 0.8, ease: 'power3.inOut' }, 2.3)
      .to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power3.inOut' }, 2.6)
      .from('.hero .shape', { scale: 0, duration: 1, stagger: 0.07, ease: 'back.out(1.6)' }, 2.9)
      .from('.hero h1 .w > span', { yPercent: 110, duration: 0.9, stagger: 0.05, ease: 'power4.out' }, 2.9)
      .from('.hero .fade-in', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, 3.3)
      .add(() => {
        gsap.set(pre, { display: 'none' });
        setLoading(false);
        lenis.start();
      }, 3.5);

    return () => {
      tl.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  /* the stage timeline */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = (s: string) => root.current!.querySelector(s) as HTMLElement;
      const qa = (s: string) => Array.from(root.current!.querySelectorAll(s)) as HTMLElement[];
      const L = (k: string) => q(`[data-layer="${k}"]`);

      const layers = qa('[data-layer]');
      gsap.set(layers, { autoAlpha: 0 });
      gsap.set(L('hero'), { autoAlpha: 1 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tlRef.current = tl;
      const show = (k: string, at: number) => tl.set(L(k), { autoAlpha: 1 }, at);
      const hide = (k: string, at: number) => tl.set(L(k), { autoAlpha: 0 }, at);
      const revealLabel = (k: string, at: number) => {
        tl.fromTo(qa(`[data-layer="${k}"] .label`), { y: 60, opacity: 0, rotate: -2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.45, ease: 'power3.out' }, at);
        tl.fromTo(qa(`[data-layer="${k}"] .label .rv`), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, at + 0.1);
      };
      const kenBurns = (k: string, at: number, dur: number) => {
        tl.fromTo(qa(`[data-layer="${k}"] .slide-bg img`), { scale: 1.14 }, { scale: 1, duration: dur }, at);
      };

      let t = 0;
      const HOLD = 0.9;

      /* --- hero --- */
      tl.addLabel('hero', 0);
      tl.to('.hero .s-orange', { x: '18vw', y: '-6vh', rotate: 40, duration: 1.6 }, 0.2);
      tl.to('.hero .s-blue', { x: '-14vw', y: '10vh', rotate: -30, duration: 1.6 }, 0.2);
      tl.to('.hero .s-lime', { x: '-20vw', y: '-24vh', duration: 1.6 }, 0.2);
      tl.to('.hero .s-pink', { x: '16vw', y: '-30vh', rotate: 180, duration: 1.6 }, 0.2);
      tl.to('.hero .s-ring', { x: '14vw', y: '26vh', scale: 1.6, duration: 1.6 }, 0.2);
      tl.to('.hero-inner', { scale: 0.86, opacity: 0, duration: 0.8 }, 1.0);
      t = 1.0;

      /* --- hero -> about : cobalt circle swallows the screen --- */
      show('about', t);
      tl.fromTo(L('about'), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1, ease: 'power2.in' }, t);
      tl.to('.hero .shape', { scale: 0.2, x: 0, y: 0, duration: 1, ease: 'power2.in' }, t);
      hide('hero', t + 1);
      t += 1;
      tl.addLabel('about', t);
      const aboutWords = qa('.about .about-c h2 .w > span');
      const perCopy = aboutWords.length / 3;
      tl.fromTo(aboutWords, { yPercent: 110 }, { yPercent: 0, duration: 0.45, stagger: (i: number) => (i % perCopy) * 0.012, ease: 'power3.out' }, t);
      tl.fromTo(qa('.about .construct'), { rotate: -90, scale: 0.6, opacity: 0 }, { rotate: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }, t);
      tl.fromTo(qa('.about .chip'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: (i: number) => (i % 5) * 0.05 }, t + 0.5);
      t += 0.9 + HOLD;

      /* --- about -> identity : the page folds into thirds --- */
      show('identity', t);
      const strips = qa('.about .strip');
      tl.to(strips, { rotateX: -100, yPercent: 40, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.14, ease: 'power2.in' }, t);
      tl.to(qa('.about .strip-shade'), { opacity: 0.6, duration: 0.9, stagger: 0.14, ease: 'power2.in' }, t);
      kenBurns('identity', t, 2.6);
      hide('about', t + 1.2);
      t += 1.2;
      tl.addLabel('identity', t);
      revealLabel('identity', t - 0.2);
      t += 0.6 + HOLD;

      /* --- identity -> packaging : the box flaps open --- */
      show('packaging', t);
      tl.to(q('[data-layer="identity"] .door-l'), { rotateY: -110, transformOrigin: '0% 50%', duration: 1, ease: 'power2.in' }, t);
      tl.to(q('[data-layer="identity"] .door-r'), { rotateY: 110, transformOrigin: '100% 50%', duration: 1, ease: 'power2.in' }, t);
      tl.to(qa('[data-layer="identity"] .slide-dim'), { opacity: 0.55, duration: 1 }, t);
      kenBurns('packaging', t, 2.6);
      hide('identity', t + 1);
      t += 1;
      tl.addLabel('packaging', t);
      revealLabel('packaging', t - 0.1);
      t += 0.6 + HOLD;

      /* --- packaging -> print : the page turns --- */
      show('print', t);
      tl.to(q('[data-layer="packaging"] .page'), { rotateY: -125, transformOrigin: '0% 50%', duration: 1.1, ease: 'power2.inOut' }, t);
      tl.fromTo(q('[data-layer="packaging"] .page-sheen'), { opacity: 0 }, { opacity: 1, duration: 1.1 }, t);
      kenBurns('print', t, 2.6);
      hide('packaging', t + 1.1);
      t += 1.1;
      tl.addLabel('print', t);
      revealLabel('print', t - 0.1);
      t += 0.6 + HOLD;

      /* --- print -> social : the feed builds tile by tile --- */
      show('social', t);
      const tiles = qa('[data-layer="social"] .tile');
      const realSocial = q('[data-layer="social"] .slide');
      tl.set(realSocial, { opacity: 0 }, t);
      tl.set(q('[data-layer="social"] .tiles'), { autoAlpha: 1 }, t);
      tl.fromTo(tiles, { rotateY: -90, opacity: 0, scale: 0.85 }, { rotateY: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out', stagger: { each: 0.022, from: 'random' } }, t);
      tl.set(realSocial, { opacity: 1 }, t + 1.05);
      tl.set(q('[data-layer="social"] .tiles'), { autoAlpha: 0 }, t + 1.05);
      kenBurns('social', t + 1.05, 1.6);
      hide('print', t + 1.05);
      t += 1.05;
      tl.addLabel('social', t);
      revealLabel('social', t - 0.05);
      t += 0.6 + HOLD;

      /* --- social -> motion : film strip runs through --- */
      show('motion', t);
      tl.fromTo(L('motion'), { xPercent: 100 }, { xPercent: 0, duration: 1, ease: 'power3.inOut' }, t);
      tl.fromTo(q('[data-layer="motion"] .slide'), { skewX: -8 }, { skewX: 0, duration: 1, ease: 'power3.inOut' }, t);
      tl.to(L('social'), { xPercent: -40, duration: 1, ease: 'power3.inOut' }, t);
      tl.fromTo(qa('[data-layer="motion"] .film span'), { x: 0 }, { x: '-12vw', duration: 1 }, t);
      tl.fromTo(qa('[data-layer="motion"] .film'), { yPercent: 0 }, { yPercent: (i: number) => (i === 0 ? -110 : 110), duration: 0.35, ease: 'power2.in' }, t + 1);
      kenBurns('motion', t, 2.4);
      hide('social', t + 1);
      t += 1.1;
      tl.addLabel('motion', t);
      revealLabel('motion', t - 0.1);
      t += 0.6 + HOLD;

      /* --- motion -> art direction : the camera iris opens --- */
      show('art', t);
      const iris = { r: 0, a: -70 };
      const artEl = L('art');
      const hex = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const R = (iris.r * Math.hypot(w, h)) / 2;
        const pts = Array.from({ length: 6 }, (_, k) => {
          const ang = ((iris.a + k * 60) * Math.PI) / 180;
          return `${(w / 2 + Math.cos(ang) * R).toFixed(1)}px ${(h / 2 + Math.sin(ang) * R).toFixed(1)}px`;
        });
        artEl.style.clipPath = `polygon(${pts.join(',')})`;
      };
      hex();
      tl.fromTo(iris, { r: 0, a: -70 }, { r: 1.25, a: 20, duration: 1, ease: 'power2.in', onUpdate: hex }, t);
      tl.fromTo(q('[data-layer="art"] .flash'), { opacity: 0 }, { opacity: 0.85, duration: 0.12 }, t + 0.92);
      tl.to(q('[data-layer="art"] .flash'), { opacity: 0, duration: 0.3 }, t + 1.04);
      tl.to(qa('[data-layer="motion"] .slide-dim'), { opacity: 0.5, duration: 1 }, t);
      kenBurns('art', t, 2.4);
      hide('motion', t + 1);
      t += 1.1;
      tl.addLabel('art', t);
      revealLabel('art', t - 0.1);
      t += 0.6 + HOLD;

      /* --- art -> websites : the screen zooms out of a browser --- */
      show('web', t);
      const browser = q('[data-layer="web"] .browser');
      tl.fromTo(browser, { scale: 0.3, yPercent: 40, rotateX: 28, borderRadius: 36 }, { scale: 1, yPercent: 0, rotateX: 0, borderRadius: 0, duration: 1.15, ease: 'power3.inOut' }, t);
      tl.fromTo(browser, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t);
      tl.to(q('[data-layer="web"] .chrome'), { yPercent: -100, duration: 0.35, ease: 'power2.in' }, t + 0.85);
      tl.to(qa('[data-layer="art"] .slide-dim'), { opacity: 0.7, duration: 1 }, t);
      tl.to(L('art'), { scale: 0.92, duration: 1.15, ease: 'power3.inOut' }, t);
      kenBurns('web', t, 2.4);
      hide('art', t + 1.15);
      t += 1.2;
      tl.addLabel('web', t);
      revealLabel('web', t - 0.1);
      t += 0.6 + HOLD;

      /* --- websites -> work : slides in from the side --- */
      show('work', t);
      tl.fromTo(L('work'), { xPercent: 100 }, { xPercent: 0, duration: 1, ease: 'power3.inOut' }, t);
      tl.to(L('web'), { xPercent: -30, duration: 1, ease: 'power3.inOut' }, t);
      tl.to(qa('[data-layer="web"] .slide-dim'), { opacity: 0.6, duration: 1 }, t);
      hide('web', t + 1);
      t += 1;
      tl.addLabel('work', t);
      tl.fromTo(qa('.work-head h2 .w > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, t - 0.3);
      const track = q('.track');
      tl.fromTo(track, { x: 0 }, { x: () => -(track.scrollWidth - window.innerWidth), duration: 2.4, ease: 'none' }, t + 0.2);
      t += 2.6 + 0.3;

      /* --- work -> process : the page folds up and away --- */
      show('process', t);
      tl.to(q('.work-inner'), { rotateX: 100, transformOrigin: '50% 0%', duration: 1, ease: 'power2.in' }, t);
      tl.to(q('.work-inner'), { filter: 'brightness(0.4)', duration: 1, ease: 'power2.in' }, t);
      hide('work', t + 1);
      t += 1;
      tl.addLabel('process', t);
      tl.fromTo(qa('.process h2 .w > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, t - 0.4);
      tl.fromTo(qa('.step'), { y: 80, opacity: 0, rotate: (i: number) => (i % 2 ? 3 : -3) }, { y: 0, opacity: 1, rotate: 0, duration: 0.5, stagger: 0.22, ease: 'back.out(1.4)' }, t - 0.1);
      tl.fromTo(qa('.steps .link path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1 }, t);
      t += 1.2 + HOLD;

      /* --- process -> try : a diagonal colour wipe --- */
      show('try', t);
      tl.fromTo(L('try'), { clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)' }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1, ease: 'power2.inOut' }, t);
      hide('process', t + 1);
      t += 1;
      tl.addLabel('try', t);
      tl.fromTo(qa('.try h2 .w > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, t - 0.3);
      tl.fromTo(qa('.mk'), { y: 60, opacity: 0, rotate: (i: number) => [-4, 3, -2][i] ?? 0 }, { y: 0, opacity: 1, rotate: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.3)' }, t - 0.2);
      t += 0.6 + HOLD;

      /* --- try -> contact : the envelope flap opens --- */
      show('contact', t);
      tl.fromTo(L('contact'), { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 50% 0%, 0% 0%)' }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 50% 62%, 0% 0%)', duration: 0.5, ease: 'power2.in' }, t);
      tl.to(L('contact'), { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)', duration: 0.6, ease: 'power2.out' }, t + 0.5);
      tl.to(L('try'), { scale: 0.94, duration: 1.1 }, t);
      hide('try', t + 1.1);
      t += 1.1;
      tl.addLabel('contact', t);
      tl.fromTo(qa('.contact h2 .w > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }, t - 0.3);
      tl.fromTo(qa('.contact .rise'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'power3.out' }, t - 0.2);
      t += 0.8;
      tl.to({}, { duration: 0.2 }, t);

      const labels = SCENES.map((s) => tl.labels[s.label]);
      const st = ScrollTrigger.create({
        trigger: q('.stage-wrap'),
        start: 'top top',
        end: () => '+=' + Math.round(window.innerHeight * 0.85 * tl.duration()),
        pin: q('.stage'),
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const time = self.progress * tl.duration();
          let idx = 0;
          for (let i = 0; i < labels.length; i++) if (time >= labels[i] - 0.5) idx = i;
          setScene((prev) => (prev === idx ? prev : idx));
          const bar = document.querySelector('.rail-bar i') as HTMLElement | null;
          if (bar) bar.style.transform = `scaleY(${self.progress})`;
        },
      });
      stRef.current = st;
      // lets automated previews jump to a scene; harmless in production
      (window as unknown as { __gd: unknown }).__gd = () => ({ start: st.start, end: st.end, dur: tl.duration(), labels: tl.labels });
    }, root);

    return () => ctx.revert();
  }, []);

  /* lay out the social tiles so together they show the photo like object-fit: cover */
  useEffect(() => {
    const COLS = window.innerWidth < 700 ? 4 : 7;
    const ROWS = window.innerWidth < 700 ? 6 : 4;
    const place = () => {
      const grid = root.current?.querySelector('[data-layer="social"] .tiles') as HTMLElement | null;
      if (!grid) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ratio = 16 / 9;
      let bw = w;
      let bh = w / ratio;
      if (bh < h) { bh = h; bw = h * ratio; }
      const ox = (w - bw) / 2;
      const oy = (h - bh) / 2;
      grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
      grid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
      const tw = w / COLS;
      const th = h / ROWS;
      Array.from(grid.children).forEach((el, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const s = (el as HTMLElement).style;
        s.backgroundImage = `url(/img/social.webp)`;
        s.backgroundSize = `${bw}px ${bh}px`;
        s.backgroundPosition = `${ox - c * tw}px ${oy - r * th}px`;
      });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

  /* custom cursor + hero parallax */
  useEffect(() => {
    const cur = document.querySelector('.cursor') as HTMLElement | null;
    if (!cur || window.matchMedia('(pointer: coarse)').matches) return;
    const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    const inner = document.querySelector('.hero-shapes') as HTMLElement | null;
    const pxTo = inner ? gsap.quickTo(inner, 'x', { duration: 1, ease: 'power3' }) : null;
    const pyTo = inner ? gsap.quickTo(inner, 'y', { duration: 1, ease: 'power3' }) : null;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      pxTo?.((e.clientX / window.innerWidth - 0.5) * -40);
      pyTo?.((e.clientY / window.innerHeight - 0.5) * -40);
      const t = e.target as HTMLElement;
      cur.classList.toggle('big', !!t.closest('a, button, input, select, textarea, .case'));
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const goTo = (label: string) => {
    const tl = tlRef.current;
    const st = stRef.current;
    const lenis = lenisRef.current;
    if (!tl || !st || !lenis) return;
    const p = (tl.labels[label] ?? 0) / tl.duration();
    lenis.scrollTo(st.start + (st.end - st.start) * p + 2, { duration: 2.2 });
  };

  const theme = SCENES[scene]?.theme ?? 'light';
  const swatch = SWATCHES[sw];
  const font = FONT_STYLES.find((f) => f.id === fontId)!;
  const bn = brand.trim() || 'Your Brand';
  const brandStyle: CSSProperties = { fontFamily: font.family, fontWeight: font.weight, textTransform: font.upper ? 'uppercase' : 'none' };
  const svc = (k: string) => SERVICES.find((s) => s.key === k)!;

  const toggleService = (name: string) =>
    setService((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));

  return (
    <div ref={root}>
      {/* preloader */}
      <div className="preloader" aria-hidden={!loading}>
        <svg viewBox="-20 -20 140 140">
          <circle className="grid-line" cx="50" cy="50" r="58" pathLength={1} strokeDasharray="1" />
          <circle className="grid-line" cx="50" cy="50" r="42" pathLength={1} strokeDasharray="1" />
          <path className="grid-line" d="M-20 50 H120" pathLength={1} strokeDasharray="1" />
          <path className="grid-line" d="M50 -20 V120" pathLength={1} strokeDasharray="1" />
          <path className="grid-line" d="M-10 -10 L110 110" pathLength={1} strokeDasharray="1" />
          <path className="grid-line" d="M110 -10 L-10 110" pathLength={1} strokeDasharray="1" />
          <path className="mono-path" d="M50 8 A42 42 0 0 0 50 92" stroke="#111" pathLength={1} strokeDasharray="1" />
          <path className="mono-path" d="M50 8 A42 42 0 0 1 50 92" stroke="#2B3BFF" pathLength={1} strokeDasharray="1" />
          <path className="mono-path" d="M50 8 V92" stroke="#111" pathLength={1} strokeDasharray="1" />
          <path className="mono-path" d="M28 52 H50" stroke="#111" pathLength={1} strokeDasharray="1" />
        </svg>
        <span className="preloader-tag">GD — Design Studio · Riyadh</span>
        <span className="preloader-count">{count}</span>
      </div>

      <div className="cursor" aria-hidden="true" />

      {/* header */}
      <header className="hdr" data-theme={theme}>
        <nav className="left" aria-label="Primary">
          <button className="lnk" onClick={() => goTo('work')}>Work</button>
          <button className="lnk" onClick={() => goTo('identity')}>Services</button>
        </nav>
        <button className="logo" onClick={() => goTo('hero')} aria-label="GD — back to start">
          <Mono size={52} ring={theme === 'dark' ? '#F4F0E6' : '#111'} d={theme === 'dark' ? '#D7FF3A' : '#2B3BFF'} />
        </button>
        <nav aria-label="Secondary">
          <button className="lnk hide-sm" onClick={() => goTo('about')}>Studio</button>
          <button className="talk" onClick={() => goTo('contact')}>Let’s talk</button>
        </nav>
      </header>

      {/* progress rail */}
      <div className="rail" data-theme={theme} aria-hidden="true">
        <span className="rail-num">{String(scene + 1).padStart(2, '0')}</span>
        <span className="rail-bar"><i /></span>
        <span>{String(SCENES.length).padStart(2, '0')}</span>
        <span className="rail-name">{SCENES[scene]?.name}</span>
      </div>

      <main className="stage-wrap">
        <div className="stage">
          {/* 1. hero */}
          <section className="layer hero" data-layer="hero" style={{ zIndex: 10 }} aria-label="Intro">
            <div className="hero-shapes fill" aria-hidden="true">
              <div className="shape s-orange" />
              <div className="shape s-blue" />
              <div className="shape s-lime" />
              <div className="shape s-pink" />
              <div className="shape s-ring" />
            </div>
            <div className="hero-inner">
              <p className="eyebrow fade-in">GD — Design Studio, Riyadh</p>
              <h1>
                <Words text="Crafted" />
                <br />
                <Words text="to be" /> <span className="accent"><Words text="seen." /></span>
              </h1>
              <p className="lead fade-in">Identity, packaging, motion and digital — loud where it matters, precise everywhere else.</p>
            </div>
            <div className="scroll-hint fade-in" aria-hidden="true"><i />Scroll</div>
          </section>

          {/* 2. about — three strips so it can fold away */}
          <section className="layer about" data-layer="about" style={{ zIndex: 20 }} aria-label="About">
            {[0, 1, 2].map((i) => (
              <div className="strip" key={i} aria-hidden={i > 0}>
                <div className="strip-in"><AboutContent /></div>
                <div className="strip-shade" />
              </div>
            ))}
          </section>

          {/* 3. services */}
          <section className="layer" data-layer="identity" style={{ zIndex: 19 }} aria-label="Brand Identity">
            <div className="door door-l"><ServiceSlide s={svc('identity')} /></div>
            <div className="door door-r" aria-hidden="true"><ServiceSlide s={svc('identity')} /></div>
          </section>

          <section className="layer" data-layer="packaging" style={{ zIndex: 18 }} aria-label="Packaging">
            <div className="page"><ServiceSlide s={svc('packaging')} /><div className="page-sheen" /></div>
          </section>

          <section className="layer" data-layer="print" style={{ zIndex: 17 }} aria-label="Print and Profile">
            <ServiceSlide s={svc('print')} />
          </section>

          <section className="layer" data-layer="social" style={{ zIndex: 21 }} aria-label="Social Media">
            <ServiceSlide s={svc('social')} />
            <div className="tiles" aria-hidden="true" style={{ visibility: 'hidden' }}>
              {Array.from({ length: 28 }).map((_, i) => <div className="tile" key={i} />)}
            </div>
          </section>

          <section className="layer" data-layer="motion" style={{ zIndex: 22 }} aria-label="Motion">
            <ServiceSlide s={svc('motion')} />
            <div className="film top" aria-hidden="true">{Array.from({ length: 40 }).map((_, i) => <span key={i} />)}</div>
            <div className="film bottom" aria-hidden="true">{Array.from({ length: 40 }).map((_, i) => <span key={i} />)}</div>
          </section>

          <section className="layer" data-layer="art" style={{ zIndex: 23 }} aria-label="Art Direction">
            <ServiceSlide s={svc('art')} />
            <div className="flash" aria-hidden="true" />
          </section>

          <section className="layer" data-layer="web" style={{ zIndex: 24 }} aria-label="Websites">
            <div className="browser">
              <div className="chrome" aria-hidden="true">
                <i style={{ background: '#FF5A1F' }} />
                <i style={{ background: '#D7FF3A' }} />
                <i style={{ background: '#2B3BFF' }} />
                <span className="url">gd.studio</span>
              </div>
              <div className="browser-body"><ServiceSlide s={svc('web')} /></div>
            </div>
          </section>

          {/* 4. work */}
          <section className="layer work" data-layer="work" style={{ zIndex: 25 }} aria-label="Selected work">
            <div className="work-inner">
              <div className="work-head">
                <h2><Words text="Selected" /><br /><span><Words text="work" /></span></h2>
                <p className="eyebrow">Keep scrolling →</p>
              </div>
              <div className="track">
                {WORK.map((w) => (
                  <article className="case" key={w.name}>
                    <div className="case-img">
                      <img src={`/img/${w.img}-sm.webp`} alt="" loading="lazy" />
                      <span className="case-tag" style={{ background: w.bg }}>{w.tag}</span>
                    </div>
                    <h4>{w.name}</h4>
                    <p>{w.info}</p>
                  </article>
                ))}
                <article className="case more">
                  <div className="case-img">Your brand<br />could be next</div>
                  <h4>Next project</h4>
                  <p>Let’s talk about yours</p>
                </article>
              </div>
            </div>
          </section>

          {/* 5. process (sits under work so work can fold up off it) */}
          <section className="layer process" data-layer="process" style={{ zIndex: 24 }} aria-label="How we work">
            <h2><Words text="How we" /> <span><Words text="work" /></span></h2>
            <div className="steps">
              <svg className="link" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
                <path d="M60 30 C 200 -10, 300 -10, 375 30 S 560 -10, 625 30 S 820 -10, 940 30" fill="none" stroke="#111" strokeWidth="2.5" strokeDasharray="1" pathLength={1} />
              </svg>
              {[
                { n: '01', h: 'Discover', p: 'We learn the business, the audience and the competition before we touch a pencil.', bg: 'var(--p1)', fg: 'var(--paper)' },
                { n: '02', h: 'Define', p: 'Positioning, personality and creative direction — agreed with you first.', bg: 'var(--p3)', fg: 'var(--ink)' },
                { n: '03', h: 'Design', p: 'Routes, refinement and the full visual system across every touchpoint.', bg: 'var(--p2)', fg: 'var(--ink)' },
                { n: '04', h: 'Deliver', p: 'Guidelines, production-ready files and launch support that keeps it consistent.', bg: 'var(--ink)', fg: 'var(--paper)' },
              ].map((s) => (
                <div className="step" key={s.n} style={{ background: s.bg, color: s.fg }}>
                  <b>{s.n}</b>
                  <div><h4>{s.h}</h4><p>{s.p}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. try your brand */}
          <section className="layer try" data-layer="try" style={{ zIndex: 30 }} aria-label="Try your brand">
            <div>
              <h2><Words text="Try your" /><br /><Words text="brand on." /></h2>
              <p className="sub">Type a name, pick a colour and a voice. This is how quickly a strong identity starts to feel real.</p>
              <div className="field">
                <label htmlFor="brand-name">Your brand name</label>
                <input id="brand-name" type="text" value={brand} maxLength={28} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div className="swatches" role="group" aria-label="Brand colour">
                <span>Colour</span>
                {SWATCHES.map((s, i) => (
                  <button key={s.name} className="sw" style={{ background: s.c }} aria-label={s.name} aria-pressed={i === sw} onClick={() => setSw(i)} />
                ))}
              </div>
              <div className="styles" role="group" aria-label="Type style">
                {FONT_STYLES.map((f) => (
                  <button key={f.id} aria-pressed={f.id === fontId} onClick={() => setFontId(f.id)}>{f.label}</button>
                ))}
              </div>
            </div>
            <div className="mockups" aria-live="polite">
              <div className="mk card" style={{ background: swatch.c, color: swatch.on }}>
                <small>Business card</small>
                <span className="bn" style={brandStyle}>{bn}</span>
              </div>
              <div className="mk tile" style={{ background: 'var(--paper)', color: swatch.c === '#D7FF3A' ? '#111' : swatch.c }}>
                <span className="bn" style={brandStyle}>{bn.charAt(0)}</span>
              </div>
              <div className="mk board" style={{ background: swatch.c === '#111111' ? '#D7FF3A' : '#111111', color: swatch.c === '#111111' ? '#111111' : swatch.c }}>
                <span className="bn" style={brandStyle}>{bn}</span>
              </div>
            </div>
          </section>

          {/* 7. contact */}
          <section className="layer contact" data-layer="contact" style={{ zIndex: 31 }} aria-label="Contact">
            <div>
              <h2><Words text="Let’s build" /><br /><Words text="something" /><br /><Words text="unforgettable." /></h2>
              <div className="map-card rise">
                <RiyadhMap />
                <div className="map-pin">
                  <span className="badge"><Mono size={22} ring="#F4F0E6" d="#D7FF3A" stroke={9} title="GD" />GD Studio · Olaya, Riyadh</span>
                  <span className="stem" />
                  <span className="dot" />
                </div>
              </div>
              <div className="info rise">
                <div><span>Studio</span><strong>Riyadh, Saudi Arabia</strong></div>
                <div><span>Email</span><a href="mailto:hello@gd.studio">hello@gd.studio</a></div>
                <div><span>Phone</span><a href="tel:+966500000000">+966 5X XXX XXXX</a></div>
                <div><span>Hours</span><strong>Sun – Thu · 9:00 – 18:00</strong></div>
              </div>
            </div>

            <form
              className="form rise"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {sent ? (
                <div className="sent" role="status">
                  <Mono size={64} />
                  <b>Message received.</b>
                  <p>Thank you — the studio will reply within one working day.</p>
                  <button type="button" className="submit" style={{ padding: '0 26px' }} onClick={() => setSent(false)}>Send another</button>
                </div>
              ) : (
                <>
                  <h3 className="full">Start a project</h3>
                  <div className="field">
                    <label htmlFor="c-name">Full name</label>
                    <input id="c-name" name="name" required autoComplete="name" placeholder="Your name" />
                  </div>
                  <div className="field">
                    <label htmlFor="c-email">Email</label>
                    <input id="c-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
                  </div>
                  <div className="field opt">
                    <label htmlFor="c-company">Company</label>
                    <input id="c-company" name="company" autoComplete="organization" placeholder="Company name" />
                  </div>
                  <div className="field opt">
                    <label htmlFor="c-budget">Budget</label>
                    <select id="c-budget" name="budget" defaultValue="">
                      <option value="" disabled>Select a range</option>
                      <option>Under 10,000 SAR</option>
                      <option>10,000 – 30,000 SAR</option>
                      <option>30,000 – 80,000 SAR</option>
                      <option>80,000+ SAR</option>
                    </select>
                  </div>
                  <div className="field full">
                    <span style={{ fontSize: 13, fontWeight: 700 }}>What do you need?</span>
                    <div className="chips" role="group" aria-label="Services">
                      {SERVICES.map((s) => (
                        <button type="button" key={s.key} aria-pressed={service.includes(s.name)} onClick={() => toggleService(s.name)}>{s.name}</button>
                      ))}
                    </div>
                  </div>
                  <div className="field full">
                    <label htmlFor="c-msg">Tell us about the project</label>
                    <textarea id="c-msg" name="message" required placeholder="A few lines about your brand, goals and timeline" />
                  </div>
                  <button type="submit" className="submit full">Send message →</button>
                </>
              )}
            </form>

            <div className="foot">
              <span>© {new Date().getFullYear()} GD Studio · Riyadh, Saudi Arabia</span>
              <span>Designed &amp; built with care.</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

