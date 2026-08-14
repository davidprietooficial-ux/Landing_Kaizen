import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE } from '@/lib/config.en'
import { CONTACT } from '@/lib/config'

const LEGAL_NAME = 'MIRAI GROUP CO SAS'
const NIT = '901982324'
const LAST_UPDATE = 'August 4, 2026'

export const metadata: Metadata = {
  title: `Terms and Conditions — ${SITE.name}`,
  description: `Terms and Conditions for the use of this site and the engagement of services from ${LEGAL_NAME}, operating under the ${SITE.name} brand.`,
  alternates: { canonical: '/en/terminos', languages: { es: '/terminos', en: '/en/terminos' } },
  robots: { index: true, follow: true },
}

// ─────────────────────────────────────────────────────────────────────────────
// English translation of src/app/terminos/page.tsx. Same 12 sections, same
// legal substance — see the Spanish original for sourcing notes on the
// boilerplate vs. project-specific content. The two [[ TODO David ]] items
// (payments/billing specifics, delivery timelines) are carried over unresolved.
// ─────────────────────────────────────────────────────────────────────────────

export default function TerminosEnPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '1rem 0 .6rem' }}>
              Terms and Conditions
            </h1>
            <p className="lead" style={{ marginBottom: '.5rem' }}>
              {LEGAL_NAME}, NIT {NIT}, operating under the {SITE.name} brand.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '2.2rem' }}>
              Last updated: {LAST_UPDATE}
            </p>

            <p style={{ marginBottom: '2.2rem' }}>
              <Link href="/en" style={{ color: 'var(--gold)' }}>← Back to home</Link>
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>1. Acceptance of these terms and scope</h2>
            <p>
              These Terms and Conditions govern access to and use of this website, as well as the engagement of
              the services offered by {LEGAL_NAME} under the {SITE.name} brand. By browsing this site, submitting
              the contact form, booking a call, or engaging any of the access tiers described below, you accept
              these terms in full. If you do not agree with any part of them, you should not use this site or
              engage the services described here.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              These terms apply together with the{' '}
              <Link href="/en/privacidad" style={{ color: 'var(--gold)' }}>Personal Data Processing Policy</Link>{' '}
              of this site, and with any proposal, quote, or particular contract signed with a specific client. In
              the event of a conflict between these general terms and a particular contract signed with a client,
              the terms agreed in that particular contract prevail.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>2. Description of the service</h2>
            <p>
              {SITE.name} does not sell standalone services: it sells a system made up of three phases that work
              together to attract customers, convert them, and grow the contracting client&rsquo;s business
              through organic content.
            </p>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li><strong style={{ color: 'var(--text)' }}>Attract:</strong> Meta Ads campaigns designed to bring qualified traffic to the client&rsquo;s business, not simply impressions or reach.</li>
              <li><strong style={{ color: 'var(--text)' }}>Convert:</strong> a website owned by the client, with strategic copywriting and video production, designed to convert that traffic into leads and customers.</li>
              <li><strong style={{ color: 'var(--text)' }}>Grow:</strong> organic content published on a consistent basis to build brand and trust, as a complement to the two phases above — it raises the quality of incoming leads and the conversion rate.</li>
            </ul>
            <p style={{ marginTop: '.6rem' }}>This system is currently offered in three access tiers:</p>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li><strong style={{ color: 'var(--text)' }}>Sample:</strong> a single landing page, with video production and AI support, without ad spend or a CRM — designed so the client can get to know {SITE.name}&rsquo;s way of working before committing to the full system.</li>
              <li><strong style={{ color: 'var(--text)' }}>The System:</strong> all three phases in full — attract, convert, grow — with a simple closing mechanism (scheduling link, WhatsApp, or form), without a CRM. This is the primary access tier offered by {SITE.name}, and the one on which we work with guaranteed results under the terms agreed in writing with each client in their particular proposal.</li>
              <li><strong style={{ color: 'var(--text)' }}>Full System:</strong> everything above plus automated conversation management, follow-up, and onboarding through GoHighLevel and associated automations.</li>
            </ul>
            <p style={{ marginTop: '.6rem' }}>
              The exact scope, deliverables, timelines, and particular conditions of each project are defined in
              the proposal or quote that {LEGAL_NAME} provides to the client before starting the work, and that
              proposal forms an integral part of the contractual relationship between the parties. {SITE.name}{' '}
              works to make each system fulfill its purpose of attracting and converting customers and growing the
              client&rsquo;s business effectively, within the framework agreed in each particular proposal; business results also depend
              on factors outside {SITE.name}&rsquo;s control, such as the market, the client&rsquo;s offer, and the
              advertising budget allocated to the campaigns.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>3. Links to third-party sites</h2>
            <p style={{ color: 'var(--muted)' }}>
              This site may include links to pages managed by third parties (for example, social media or the
              embedded scheduling form). {LEGAL_NAME} is not responsible for the content, products, or services
              offered on those third-party sites. When you leave this site through one of those links, you become
              subject to that site&rsquo;s own terms of use, not to this document.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>4. Intellectual property</h2>
            <p>
              Once the agreed payment for a project is completed, the website delivered to the client — code,
              design, and content developed specifically for that project — becomes 100% the client&rsquo;s
              property. The client can host it wherever they want, modify it, and use it freely, without depending
              on {SITE.name} to keep using it.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              Excluded from that transfer, and remaining the property of {LEGAL_NAME}, are: the {SITE.name} brand,
              its visual identity, its internal production processes, its reusable templates, components and work
              tools shared across projects, and any portfolio or making-of material used to showcase{' '}
              {SITE.name}&rsquo;s work — unless expressly agreed otherwise in writing with the client.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              In-house video production material (video, photography, animations) delivered as part of a project
              is governed the same way: once the project that includes it is paid, the delivered material belongs
              to the client for the agreed use; {SITE.name} retains the right to use that material in its
              portfolio, unless the client expressly requests otherwise.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>5. Cookies</h2>
            <p style={{ color: 'var(--muted)' }}>
              This site may use cookies belonging to the scheduling form and the platforms it embeds (for example,
              to remember progress through a step). Browsing this site implies accepting that use. Accepting
              cookies is not required to visit the site, although blocking them may limit the functioning of some
              sections. This site does not currently use its own analytics or advertising cookies — see section 4
              of the{' '}
              <Link href="/en/privacidad" style={{ color: 'var(--gold)' }}>Personal Data Processing Policy</Link>
              {' '}— and their use poses no virus risk and does not affect files on your device. You can configure
              your browser to reject cookies or leave the site at any time.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>6. Payments and billing</h2>
            <p>
              Engaging any of the access tiers described in section 2 involves payment of the amounts agreed in
              the particular proposal or quote sent to the client. Payment terms — the deposit required to start
              the project, the number and timing of installments, and the currency in which the invoice is
              issued — are defined in that particular proposal and confirmed before work begins.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              Intellectual property of the website transfers to the client once the agreed payment is completed,
              per section 3. In the event a project already underway is cancelled, or a refund is requested, the
              policy agreed in writing in the project&rsquo;s particular proposal applies; in the absence of a
              specific agreement, {LEGAL_NAME} evaluates each case considering the work already performed and the
              costs already incurred for that project.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>7. Communications</h2>
            <p style={{ color: 'var(--muted)' }}>
              By submitting this site&rsquo;s form, {LEGAL_NAME} may contact you by email or WhatsApp to follow up
              on your request, coordinate a call, or share information about {SITE.name} that may be of interest
              to you. If at any point you no longer want to receive those communications, you can request it
              through the channels described in section 10 of the{' '}
              <Link href="/en/privacidad" style={{ color: 'var(--gold)' }}>Personal Data Processing Policy</Link>.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>8. Acceptable use of the site</h2>
            <p>By using this site, you agree not to:</p>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li>Use it for illegal or fraudulent purposes, or purposes that infringe the rights of third parties.</li>
              <li>Attempt to gain unauthorized access to systems, accounts, or data that do not belong to you.</li>
              <li>Copy, reproduce, or distribute the content, design, or code of this site without {LEGAL_NAME}&rsquo;s authorization.</li>
              <li>Interfere with the normal operation of the site (for example, through bots, mass scraping, or denial-of-service attacks).</li>
              <li>Submit false information through the form with the intent to deceive or impersonate a third party.</li>
            </ul>
            <p style={{ marginTop: '.6rem', color: 'var(--muted)' }}>
              {LEGAL_NAME} reserves the right to restrict or suspend access to this site for anyone who violates
              this acceptable use policy.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>9. Limitation of liability</h2>
            <p>
              This site and its content are provided &ldquo;as is.&rdquo; {LEGAL_NAME} works to keep it available
              and up to date, but does not guarantee that access to the site will be uninterrupted or error-free,
              nor does it control or guarantee the absence of viruses or other elements that could affect the
              device of anyone who visits it.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              To the extent permitted by applicable law, {LEGAL_NAME} will not be liable for indirect, incidental,
              or consequential damages arising from the use of this site or the engaged services, beyond what is
              expressly agreed in the particular proposal or contract for each project. Nothing in this section
              limits liabilities that, under Colombian law, cannot be contractually limited.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>10. Governing law and jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by the laws of the Republic of Colombia. Any dispute arising
              from their interpretation or performance will be submitted to the competent courts and tribunals of
              Colombia, without prejudice to the parties agreeing on a different dispute-resolution mechanism in a
              particular contract.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>11. Changes to these terms</h2>
            <p>
              {LEGAL_NAME} may modify these Terms and Conditions at any time. Substantial changes will be reflected
              on this same page, updating the date shown at the top. Continued use of the site after an update
              implies acceptance of the modified terms.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>12. Contact</h2>
            <p>
              If you have questions about these Terms and Conditions, write to us at{' '}
              <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--gold)' }}>{CONTACT.email}</a>.
            </p>

            <p style={{ marginTop: '2.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
              Sincerely,<br />{LEGAL_NAME}
            </p>

            <p style={{ marginTop: '2.5rem' }}>
              <Link href="/en" style={{ color: 'var(--gold)' }}>← Back to home</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
