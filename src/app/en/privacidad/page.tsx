import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE, CONTACT } from '@/lib/config.en'

const LEGAL_NAME = 'MIRAI GROUP CO SAS'
const NIT = '901982324'
const LAST_UPDATE = 'July 16, 2026'

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description: `Personal Data Processing Policy of ${LEGAL_NAME}, operating under the ${SITE.name} brand.`,
  alternates: { canonical: '/en/privacidad', languages: { es: '/privacidad', en: '/en/privacidad' } },
  robots: { index: true, follow: true },
}

// ─────────────────────────────────────────────────────────────────────────────
// English translation of src/app/privacidad/page.tsx. Structure, section count,
// and legal substance are a faithful mirror of the Spanish original (Colombian
// Ley 1581 de 2012 / Decreto 1377 de 2013 personal-data-protection notice).
// Do not add or remove sections here without mirroring the change in the ES
// original — see that file's header comment for provenance notes.
// [[ TODO David ]]: there are 2 boxes flagged below with facts I couldn't confirm.
// ─────────────────────────────────────────────────────────────────────────────

const DEFINITIONS = [
  ['Authorization', "The Data Subject's prior, express, and informed consent for the Processing of their personal data."],
  ['Privacy notice', 'The document through which the Data Subject is informed of the existence of this policy, how to access it, and the purpose of the processing of their data.'],
  ['Database', 'An organized set of personal data that is subject to Processing.'],
  ['Personal data', 'Any information linked to, or that can be associated with, one or more identified or identifiable natural persons.'],
  ['Private data', 'Data that, due to its intimate or reserved nature, is relevant only to the Data Subject.'],
  ['Sensitive data', 'Data that affects the privacy of the Data Subject or whose improper use may lead to discrimination (racial or ethnic origin, political affiliation, religious beliefs, health, sexual life, biometric data, among others).'],
  ['Data Processor', 'A natural or legal person who carries out the Processing of personal data on behalf of the Data Controller.'],
  ['Data Controller', 'A natural or legal person who decides on the database and/or the Processing of the data.'],
  ['Data Subject', 'The natural person whose personal data is subject to Processing.'],
  ['Processing', 'Any operation performed on personal data: collection, storage, use, circulation, or deletion.'],
  ['Cookie', "A file created by a website that stores small amounts of data, exchanged between the server hosting the site and the visitor's browser."],
] as const

const PRINCIPLES = [
  ['Purpose', 'The Processing of collected data must serve a legitimate purpose, disclosed to the Data Subject.'],
  ['Freedom', "Processing may only take place with the Data Subject's prior, express, and informed consent."],
  ['Accuracy or quality', 'Information subject to Processing must be truthful, complete, accurate, up to date, verifiable, and understandable.'],
  ['Transparency', 'The Data Subject has the right to obtain, at any time and without restriction, information regarding data that concerns them.'],
  ['Restricted access and circulation', 'Personal data will not be available on the internet or other mass-disclosure media, except for technically controlled access by Data Subjects or authorized third parties.'],
  ['Security', 'Information will be protected with technical, human, and administrative measures that prevent its alteration, loss, unauthorized consultation, or use.'],
  ['Confidentiality', 'All persons involved in the Processing are obligated to safeguard the confidentiality of the information, even after their relationship with that task has ended.'],
] as const

const RIGHTS = [
  ['Access', `to know, free of charge, the personal data that ${LEGAL_NAME} holds about you.`],
  ['Update, correction, and deletion', 'to request that your data be corrected, updated, or deleted when applicable.'],
  ['Proof of authorization', 'to request a copy of the authorization granted, unless the law does not require it.'],
  ['Information on use', 'to be informed about the use that has been given to your personal data.'],
  ['Complaint before the SIC', 'to file complaints with the Superintendencia de Industria y Comercio (Colombia’s data protection authority) for violations of data protection regulations.'],
  ['Revoke authorization', 'to revoke consent and/or request the deletion of your data when there is no legal or contractual duty requiring it to be kept.'],
] as const

export default function PrivacidadPageEn() {
  return (
    <>
      <Header />
      <main>
        <section className="section" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Legal</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '1rem 0 .6rem' }}>
              Personal Data Processing Policy
            </h1>
            <p className="lead" style={{ marginBottom: '.5rem' }}>
              {LEGAL_NAME}, Tax ID (NIT) {NIT}, operating under the {SITE.name} brand.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '2.2rem' }}>
              Last updated: {LAST_UPDATE}
            </p>

            <p style={{ marginBottom: '2.2rem' }}>
              <Link href="/en" style={{ color: 'var(--gold)' }}>← Back to home</Link>
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>1. Applicable law and scope</h2>
            <p>
              This policy is prepared in accordance with the Political Constitution of Colombia, Law 1581 of 2012,
              Regulatory Decree 1377 of 2013, and other complementary regulations, and is applied by {LEGAL_NAME}
              with respect to the collection, storage, use, circulation, and deletion of personal data obtained
              through this website.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>2. Definitions</h2>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem' }}>
              {DEFINITIONS.map(([term, def]) => (
                <li key={term} style={{ color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>{term}:</strong> {def}
                </li>
              ))}
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>3. Data we collect and purpose of processing</h2>
            <p>
              Through this site&apos;s contact and booking form, {LEGAL_NAME} collects the data that the interested
              person voluntarily provides: full name, email address, phone or WhatsApp number, business name,
              website (if any), the service of interest, a description of the project, and ranges for revenue,
              budget, and project urgency. Campaign parameters (UTM) are also captured when the visitor arrives
              from an ad or post, in order to know which campaign generated the contact.
            </p>
            <p>This data is used exclusively to:</p>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li>Contact the prospect and assess whether their project fits {SITE.name}&apos;s services.</li>
              <li>Coordinate and confirm the diagnostic call booked through the site.</li>
              <li>Provide the web development, audiovisual production, and/or traffic management services contracted.</li>
              <li>Measure which channels or ad campaigns generate contacts, for service-improvement purposes.</li>
            </ul>
            <p style={{ marginTop: '.6rem' }}>
              {LEGAL_NAME} does not sell, license, or disclose this data to third parties other than those
              indicated in section 4, except with the Data Subject&apos;s express authorization or as required by
              law.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>4. Who the data is shared with (data processors)</h2>
            <p>To operate this site and provide the service, data is processed through:</p>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li><strong style={{ color: 'var(--text)' }}>GoHighLevel / LeadConnector</strong> — the CRM platform that receives the form, manages the contact, and administers the appointment calendar.</li>
              <li><strong style={{ color: 'var(--text)' }}>Vercel</strong> — the hosting provider that runs this website.</li>
            </ul>
            <p style={{ marginTop: '.6rem', color: 'var(--muted)' }}>
              This site does not currently have any analytics or advertising pixel installed (Meta Pixel, Google
              Analytics, etc.). If one is installed in the future, this section will be updated before it is
              activated.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>5. Principles applicable to processing</h2>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem' }}>
              {PRINCIPLES.map(([term, def]) => (
                <li key={term} style={{ color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>{term}:</strong> {def}
                </li>
              ))}
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>6. Rights of data subjects</h2>
            <p>As the Data Subject of your personal data, you have the right:</p>
            <ul style={{ display: 'grid', gap: '.5rem', paddingLeft: '1.1rem' }}>
              {RIGHTS.map(([term, def]) => (
                <li key={term} style={{ color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>{term}:</strong> {def}
                </li>
              ))}
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>7. Duties of {LEGAL_NAME}</h2>
            <ul style={{ display: 'grid', gap: '.4rem', paddingLeft: '1.1rem', color: 'var(--muted)' }}>
              <li>Request and keep a copy of the authorization granted by the Data Subject.</li>
              <li>Clearly inform the purpose of the collection and the rights afforded to the Data Subject.</li>
              <li>Process inquiries and complaints under the terms of this policy.</li>
              <li>Keep the information under security conditions that prevent its alteration, loss, or unauthorized access.</li>
              <li>Update or correct personal data when applicable.</li>
            </ul>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>8. Data subject&apos;s authorization</h2>
            <p>
              By submitting the form on this site, the Data Subject grants {LEGAL_NAME} prior, express, and
              informed authorization for the Processing of their personal data in accordance with the purposes
              described in section 3, for the reasonable time necessary to fulfill those purposes.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>9. Data retention</h2>
            <p>
              {LEGAL_NAME} retains personal data for the reasonable time necessary to fulfill the purposes that
              motivated its collection, and data arising from a contractual relationship is further retained for
              as long as applicable legal, accounting, or tax obligations require. Once the purpose has been
              fulfilled, and absent a legal obligation stating otherwise, the data is deleted.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>10. How to exercise your rights</h2>
            <p>
              To learn about, update, correct, or request the deletion of your data, or to file a complaint or
              claim, write to{' '}
              <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--gold)' }}>{CONTACT.email}</a>{' '}
              stating your identification, a description of your request, and any supporting documents you wish
              to submit.
            </p>
            <p style={{ color: 'var(--muted)' }}>
              If the claim arrives incomplete, you will be asked to complete it within the following 5 business
              days; if you do not respond within 2 months, the claim will be considered withdrawn. The maximum
              term to resolve a complete claim is 15 business days from receipt, extendable by up to 10 additional
              business days if necessary, in which case you will be informed of the reason for the delay.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>11. Security measures</h2>
            <p>
              Data collected by this site is transmitted in encrypted form and stored on the GoHighLevel
              platform, with access restricted to {SITE.name} personnel who need that information to assist the
              prospect or client. No additional copies of this information are kept outside that platform.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>12. Cookies</h2>
            <p>
              This site embeds the GoHighLevel form and calendar within the page, which may involve the use of
              cookies native to that platform for its operation (for example, to remember progress through the
              form). This site does not use its own analytics or advertising cookies at this time.
            </p>

            <h2 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '.7rem' }}>13. Changes to this policy</h2>
            <p>
              {LEGAL_NAME} may modify this policy at any time. Substantial changes will be reflected on this same
              page, updating the date shown at the top.
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
