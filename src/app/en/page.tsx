import type { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import WorkMarquee from '@/components/WorkMarquee'
import Differentiator from '@/components/Differentiator'
import SystemSection from '@/components/SystemSection'
import Testimonials from '@/components/Testimonials'
import Schedule from '@/components/Schedule'
import Footer from '@/components/Footer'
import { CONTACT, SOCIAL } from '@/lib/config'
import { SITE } from '@/lib/config.en'

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/en', languages: { es: '/', en: '/en' } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/logo/logo-kaizen.png', width: 212, height: 212, alt: `${SITE.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ['/logo/logo-kaizen.png'],
  },
  robots: { index: true, follow: true },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  email: CONTACT.email,
  slogan: SITE.tagline,
  description: SITE.description,
  founder: { '@type': 'Person', name: SITE.founder },
  address: { '@type': 'PostalAddress', addressCountry: 'CO' },
  sameAs: [SOCIAL.instagram, SOCIAL.tiktok, SOCIAL.youtube, SOCIAL.linkedin].filter(Boolean),
}

export default function HomeEn() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Header />
      <main>
        <Hero locale="en" />
        <WorkMarquee locale="en" />
        <Differentiator locale="en" />
        <SystemSection locale="en" />
        <Testimonials locale="en" />
        <Schedule locale="en" />
      </main>
      <Footer />
    </>
  )
}
