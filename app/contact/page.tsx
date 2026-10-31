'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PROFILE_DATA } from '@/src/data/profile';
import {
  ContactPayload,
  validateContactForm,
  CONTACT_PAGE_CHAPTER_RANGES,
  SANDMOVING_SCENE_ID,
} from '@/src/lib/arrakis-logic';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useScrollProgress, useMagneticHover } from '@/src/hooks/useScrollProgress';
import { ArchitecturalWindow } from '@/src/components/layout/ArchitecturalWindow';
import ArrakisVideoBackground from '@/src/components/arrakis/ArrakisVideoBackground';
import PointerSandParticles from '@/src/components/arrakis/PointerSandParticles';
import Navigation from '@/src/components/layout/Navigation';
import ChapterIndicator from '@/src/components/layout/ChapterIndicator';
import { BoneyardSkeleton } from '@/src/components/layout/BoneyardSkeleton';
import Footer from '@/src/components/layout/Footer';

const GET_IN_TOUCH_WORDS = ['Get', 'in', 'touch.'] as const;

export default function ContactPage() {
  const reducedMotion = useReducedMotion();
  const {
    scrollProgress,
    activeChapter,
    isScrolled,
    scrollToSection,
  } = useScrollProgress(reducedMotion, CONTACT_PAGE_CHAPTER_RANGES);

  const magneticSubmitBtn = useMagneticHover(reducedMotion, 6);

  const [form, setForm] = useState<ContactPayload>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactPayload]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === 'error' || status === 'success') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setStatus('error');
      setServerMessage('Please correct the highlighted fields before sending.');
      return;
    }

    setErrors({});
    setStatus('submitting');
    setServerMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setStatus('error');
        setServerMessage(data.message || 'Unable to send message. Please check your inputs.');
        return;
      }

      setStatus('success');
      setServerMessage(
        data.message || 'Transmission received. Thank you for reaching out—I will respond shortly.'
      );
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setServerMessage('Network error while submitting the form. Please try again.');
    }
  };

  return (
    <div
      className="relative min-h-screen bg-[#08090B] text-[#F2EFE9] selection:bg-[#E99A45] selection:text-[#08090B] overflow-x-hidden pb-12"
      data-active-chapter={activeChapter.id}
    >
      {/* Inset Rounded Rectangular Experience Window (VOS9X Consistent Frame) */}
      <ArchitecturalWindow
        activeChapterNumber={activeChapter.number}
        activeChapterLabel={activeChapter.label}
      />

      {/* Persistent Sandmoving Video Background Clipped Inside Rectangular Window */}
      <ArrakisVideoBackground fixedScene={SANDMOVING_SCENE_ID} />

      {/* Pointer-Only Three.js Golden Sand Particles Clipped Inside Rectangular Window */}
      <PointerSandParticles />

      {/* Minimal Editorial Header Integrated Inside Window */}
      <Navigation
        isScrolled={isScrolled}
        isCaseStudyPage={true}
      />

      {/* VOS9X Bottom Bar Chapter Indicator & Circular Scroll Progress Ring */}
      <ChapterIndicator
        activeChapter={activeChapter}
        onSelectChapter={scrollToSection}
        scrollProgress={scrollProgress}
        chapters={CONTACT_PAGE_CHAPTER_RANGES}
      />

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 sm:pt-24 pb-16 px-7 sm:px-12 lg:px-16 max-w-[1380px] mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <section id="contact-hero" data-world-scene="desert">
          <BoneyardSkeleton variant="editorial">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2EFE9]/15 pb-3.5 mb-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6DFD5]/85">
                07 · HORIZON / DIRECT TRANSMISSION
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 py-1 text-[12px] font-light tracking-[0.08em] text-[#F2EFE9]/80 hover:text-[#E99A45] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E99A45]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Portfolio</span>
              </Link>
            </div>

            <div data-gsap-parallax="14" className="max-w-2xl">
              <h1
                data-gsap-words
                className="font-display text-[clamp(2.5rem,5.5vw,4.6rem)] font-light leading-[1.04] tracking-[-0.044em] text-[#F2EFE9]"
              >
                <span className="block overflow-hidden pb-2.5 -mb-1.5">
                  {GET_IN_TOUCH_WORDS.map((word, idx) => (
                    <span
                      key={idx}
                      className="inline-block overflow-hidden align-bottom pb-2 -mb-2 mr-[0.26em] last:mr-0"
                    >
                      <span data-gsap-word className="inline-block will-change-transform">
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 max-w-[50ch] text-[15px] md:text-[17px] font-light leading-[1.6] text-[#F2EFE9]/85"
              >
                Whether you have an ambitious product idea, want to collaborate on cutting-edge interactive web experiences, or discuss an open role, drop a line below.
              </motion.p>
            </div>
          </BoneyardSkeleton>
        </section>

        {/* The Shifted Two-Column Composition: Direct Channels & Interactive Form */}
        <section
          id="contact-channels"
          data-world-scene="desert"
          className="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
        >
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5">
            <BoneyardSkeleton variant="card">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65 }}
                className="border-t border-[#F2EFE9]/20 pt-6 space-y-6"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C69A61]">
                    DIRECT CHANNELS
                  </p>
                  <h2
                    data-gsap-masked-lines
                    className="mt-2 font-display text-xl md:text-2xl font-light tracking-[-0.03em] text-[#F2EFE9]"
                  >
                    <span className="block overflow-hidden pb-1 -mb-1">
                      <span data-gsap-line className="block will-change-transform">
                        {PROFILE_DATA.name}
                      </span>
                    </span>
                  </h2>
                  <p className="mt-1 text-[13px] font-light text-[#F2EFE9]/70">
                    {PROFILE_DATA.education}
                  </p>
                </div>

                <dl className="space-y-4 divide-y divide-[#F2EFE9]/12">
                  <div className="pt-3.5 first:pt-0">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/60">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${PROFILE_DATA.contact.email}`}
                        className="text-[14px] md:text-[15px] font-light text-[#F2EFE9] hover:text-[#E99A45] transition-colors break-all"
                      >
                        {PROFILE_DATA.contact.email}
                      </a>
                    </dd>
                  </div>

                  <div className="pt-3.5">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/60">
                      GitHub
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={PROFILE_DATA.contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[14px] md:text-[15px] font-light text-[#F2EFE9] hover:text-[#E99A45] transition-colors"
                      >
                        <span>{PROFILE_DATA.contact.github}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#C69A61]" />
                      </a>
                    </dd>
                  </div>

                  <div className="pt-3.5">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/60">
                      LinkedIn
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={PROFILE_DATA.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[14px] md:text-[15px] font-light text-[#F2EFE9] hover:text-[#E99A45] transition-colors"
                      >
                        <span>{PROFILE_DATA.contact.linkedin}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#C69A61]" />
                      </a>
                    </dd>
                  </div>

                  <div className="pt-3.5">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/60">
                      Medium
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={PROFILE_DATA.contact.medium}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[14px] md:text-[15px] font-light text-[#F2EFE9] hover:text-[#E99A45] transition-colors"
                      >
                        <span>{PROFILE_DATA.contact.medium}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#C69A61]" />
                      </a>
                    </dd>
                  </div>

                  <div className="pt-3.5">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/60">
                      Location
                    </dt>
                    <dd className="mt-1 text-[14px] md:text-[15px] font-light text-[#F2EFE9]">
                      {PROFILE_DATA.contact.location}
                    </dd>
                  </div>
                </dl>
              </motion.div>
            </BoneyardSkeleton>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <BoneyardSkeleton variant="form">
              <motion.form
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact Form"
                className="border-t border-[#F2EFE9]/20 pt-6 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/75 mb-2"
                    >
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'error-name' : undefined}
                      className="w-full rounded-lg bg-[#08090B]/28 backdrop-blur-md border border-[#F2EFE9]/[0.16] focus:border-[#E99A45] px-4 py-2.5 text-[14px] font-light text-[#F2EFE9] placeholder-[#F2EFE9]/40 focus:outline-none transition-colors"
                    />
                    {errors.name && (
                      <p
                        id="error-name"
                        role="alert"
                        className="mt-1.5 text-xs text-[#E99A45] flex items-center gap-1.5"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/75 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'error-email' : undefined}
                      className="w-full rounded-lg bg-[#08090B]/28 backdrop-blur-md border border-[#F2EFE9]/[0.16] focus:border-[#E99A45] px-4 py-2.5 text-[14px] font-light text-[#F2EFE9] placeholder-[#F2EFE9]/40 focus:outline-none transition-colors"
                    />
                    {errors.email && (
                      <p
                        id="error-email"
                        role="alert"
                        className="mt-1.5 text-xs text-[#E99A45] flex items-center gap-1.5"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/75 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project collaboration, role inquiry, or idea"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'error-subject' : undefined}
                    className="w-full rounded-lg bg-[#08090B]/28 backdrop-blur-md border border-[#F2EFE9]/[0.16] focus:border-[#E99A45] px-4 py-2.5 text-[14px] font-light text-[#F2EFE9] placeholder-[#F2EFE9]/40 focus:outline-none transition-colors"
                  />
                  {errors.subject && (
                    <p
                      id="error-subject"
                      role="alert"
                      className="mt-1.5 text-xs text-[#E99A45] flex items-center gap-1.5"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[10px] uppercase tracking-[0.18em] text-[#F2EFE9]/75 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about the world or system you want to build..."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'error-message' : undefined}
                    className="w-full rounded-lg bg-[#08090B]/28 backdrop-blur-md border border-[#F2EFE9]/[0.16] focus:border-[#E99A45] px-4 py-2.5 text-[14px] font-light text-[#F2EFE9] placeholder-[#F2EFE9]/40 focus:outline-none transition-colors resize-y"
                  />
                  {errors.message && (
                    <p
                      id="error-message"
                      role="alert"
                      className="mt-1.5 text-xs text-[#E99A45] flex items-center gap-1.5"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Status Feedback Banner */}
                {status === 'error' && serverMessage && (
                  <div
                    role="alert"
                    className="rounded-lg border border-[#E99A45]/60 bg-[#08090B]/45 backdrop-blur-md px-4 py-3 text-xs text-[#F2EFE9] flex items-center gap-2.5"
                  >
                    <AlertCircle className="h-4 w-4 text-[#E99A45] shrink-0" />
                    <span>{serverMessage}</span>
                  </div>
                )}

                {status === 'success' && serverMessage && (
                  <div
                    role="status"
                    className="rounded-lg border border-[#C69A61]/60 bg-[#08090B]/45 backdrop-blur-md px-4 py-3 text-xs text-[#F2EFE9] flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#E99A45] shrink-0" />
                    <span>{serverMessage}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#F2EFE9]/60">
                    * Required fields
                  </span>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    onPointerMove={magneticSubmitBtn.onPointerMove}
                    onPointerLeave={magneticSubmitBtn.onPointerLeave}
                    className="rounded-full bg-[#F2EFE9] hover:bg-[#E99A45] disabled:opacity-50 px-7 py-3 text-[13px] font-medium tracking-[-0.01em] text-[#08090B] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2EFE9] will-change-transform"
                  >
                    {status === 'submitting' ? 'Transmitting...' : 'Send message ↗'}
                  </button>
                </div>
              </motion.form>
            </BoneyardSkeleton>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer isCaseStudyPage={true} />
    </div>
  );
}

