import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import SystemSection from '@/components/SystemSection'
import WhyUs from '@/components/WhyUs'
import Founder from '@/components/Founder'
import Schedule from '@/components/Schedule'
import Footer from '@/components/Footer'
import { SITE, CONTACT, SOCIAL } from '@/lib/config'

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

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Header />
      <main>
        <Hero />
        <About />
        <SystemSection />
        <WhyUs />
        <Founder />
        <Schedule />
      </main>
      <Footer />
    </>
  )
}
