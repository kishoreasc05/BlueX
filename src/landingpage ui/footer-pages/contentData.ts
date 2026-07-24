export interface ContentSection {
  title: string;
  text?: string;
  bullets?: string[];
}

export interface PageContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: ContentSection[];
}

export const FOOTER_PAGES_CONTENT: Record<string, Record<string, PageContent>> = {
  "how-it-works": {
    en: {
      title: "How It Works",
      subtitle: "Simple, safe, and efficient trade bookings in Switzerland.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "1. Post Your Job",
          text: "Tell us what you need. Describe your project, select the trade category, set your location and preferred schedule. It's completely free to post.",
        },
        {
          title: "2. Compare Quotes",
          text: "Receive offers from vetted Swiss professionals near you. Check their profiles, verified customer reviews, qualifications, and price estimates to find the perfect fit.",
        },
        {
          title: "3. Safe Escrow Payments",
          text: "Lock in your booking by paying securely via our platform. Your money is held safely in escrow and is only released to the professional once you confirm the job is successfully completed.",
        },
        {
          title: "4. Job Done!",
          text: "Relax while your trade pro gets the job done right. Once satisfied, release the funds and leave a review to help the community.",
        },
      ],
    },
    de: {
      title: "Wie es funktioniert",
      subtitle: "Einfache, sichere und effiziente Handwerkerbuchungen in der Schweiz.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "1. Auftrag erstellen",
          text: "Sagen Sie uns, was zu tun ist. Beschreiben Sie Ihr Projekt, wählen Sie die Kategorie, Ihren Standort und den bevorzugten Zeitplan. Die Erstellung ist völlig kostenlos.",
        },
        {
          title: "2. Angebote vergleichen",
          text: "Erhalten Sie Angebote von geprüften Schweizer Profis in Ihrer Nähe. Prüfen Sie Profile, echte Kundenbewertungen, Qualifikationen und Preisvorschläge, um die beste Wahl zu treffen.",
        },
        {
          title: "3. Sichere Treuhandzahlung",
          text: "Bestätigen Sie die Buchung durch eine sichere Zahlung über unsere Plattform. Ihr Geld wird sicher auf einem Treuhandkonto hinterlegt und erst freigegeben, wenn Sie die Fertigstellung bestätigen.",
        },
        {
          title: "4. Fertigstellung & Bewertung",
          text: "Lehnen Sie sich zurück, während Ihr Profi die Arbeit erledigt. Geben Sie nach Ihrer Zufriedenheit das Geld frei und hinterlassen Sie eine Bewertung.",
        },
      ],
    },
  },
  "browse-services": {
    en: {
      title: "Browse Services",
      subtitle: "Find verified professionals for any trade job.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Our Main Categories",
          bullets: [
            "Plumbing — Leaks, installations, heating repairs, emergencies",
            "Electrical — Wiring, lighting, switchboards, smart home setup",
            "Painting — Interior, exterior, wallpapering, plastering",
            "Carpentry — Custom furniture, wood repairs, flooring",
            "Cleaning — Move-out cleaning, regular cleaning, office spaces",
            "Appliance Repair — Washers, dryers, ovens, dishwashers",
          ],
        },
        {
          title: "Why Book Through BlueX?",
          text: "Every trade category is staffed by ID-verified, qualified, and fully insured professionals operating in Switzerland. We check qualifications so you don't have to.",
        },
      ],
    },
    de: {
      title: "Dienstleistungen durchsuchen",
      subtitle: "Finden Sie verifizierte Profis für jede Handwerksarbeit.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Unsere Hauptkategorien",
          bullets: [
            "Sanitär — Lecks, Installationen, Heizungsreparaturen, Notfälle",
            "Elektrik — Verkabelung, Beleuchtung, Schalttafeln, Smart Home",
            "Malerarbeiten — Innen- und Aussenanstriche, Tapezieren, Gipsarbeiten",
            "Schreinerei — Massgeschneiderte Möbel, Holzreparaturen, Bodenbeläge",
            "Reinigung — Umzugsreinigung, regelmässige Reinigung, Büroflächen",
            "Gerätereparatur — Waschmaschinen, Trockner, Öfen, Geschirrspüler",
          ],
        },
        {
          title: "Warum über BlueX buchen?",
          text: "In jeder Kategorie arbeiten ID-geprüfte, qualifizierte und voll versicherte Fachkräfte in der Schweiz. Wir prüfen die Nachweise für Sie.",
        },
      ],
    },
  },
  "trust-security": {
    en: {
      title: "Trust & Security",
      subtitle: "Your safety and peace of mind are our top priorities.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Verified Professionals",
          text: "We require all providers on BlueX to undergo rigorous verification. This includes ID verification, background checks, valid Swiss trade certifications, and insurance verification.",
        },
        {
          title: "Escrow Payment Protection",
          text: "Payments are held securely by our Swiss payment gateway partner. The provider is only paid after you verify and sign off that the work was completed according to specifications.",
        },
        {
          title: "Full Liability Insurance",
          text: "Every booking made on our platform is backed by our partner liability insurance policy up to CHF 5,000,000. You are protected against accidental damages.",
        },
      ],
    },
    de: {
      title: "Vertrauen & Sicherheit",
      subtitle: "Ihre Sicherheit und Zufriedenheit stehen bei uns an erster Stelle.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Geprüfte Fachkräfte",
          text: "Wir verlangen von allen Anbietern auf BlueX eine strenge Überprüfung. Dazu gehören Identitätsprüfung, Zuverlässigkeitsprüfung, gültige Schweizer Fachzertifikate und ein Versicherungsnachweis.",
        },
        {
          title: "Treuhand-Zahlungsschutz",
          text: "Zahlungen werden von unserem Schweizer Zahlungsdienstleister sicher verwahrt. Der Anbieter wird erst bezahlt, wenn Sie die ordnungsgemässe Ausführung bestätigen.",
        },
        {
          title: "Vollständige Haftpflichtversicherung",
          text: "Jede über unsere Plattform getätigte Buchung ist durch eine Haftpflichtversicherung bis zu 5'000'000 CHF abgesichert. Sie sind gegen Unfallschäden geschützt.",
        },
      ],
    },
  },
  "help-center": {
    en: {
      title: "Help Center",
      subtitle: "Find answers and support for using BlueX.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Frequently Asked Questions",
          bullets: [
            "How do I request a refund? You can request a refund if the job hasn't started or if the provider fails to deliver, directly from your booking detail page.",
            "Are there hidden fees? No. Posting jobs is free. We charge a small service fee on successful bookings to cover payment processing and insurance.",
            "How do I register as a provider? Click 'Become a Provider' in the header, choose your trade, and upload your Swiss certifications to start the verification process.",
          ],
        },
        {
          title: "Need to speak with us?",
          text: "Our Swiss support team is available 24/7. You can contact us via live chat in the app or email us at support@bluex.ch.",
        },
      ],
    },
    de: {
      title: "Hilfe-Center",
      subtitle: "Finden Sie Antworten und Unterstützung bei der Nutzung von BlueX.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Häufig gestellte Fragen",
          bullets: [
            "Wie fordere ich eine Rückerstattung an? Sie können eine Rückerstattung direkt über Ihre Buchungsdetailseite anfordern, falls die Arbeit noch nicht begonnen hat oder nicht vertragsgemäss ausgeführt wurde.",
            "Gibt es versteckte Gebühren? Nein. Das Erstellen von Aufträgen ist kostenlos. Wir erheben eine geringe Servicegebühr auf erfolgreiche Buchungen zur Deckung von Abwicklungs- und Versicherungskosten.",
            "Wie registriere ich mich als Anbieter? Klicken Sie im Header auf 'Partner werden', wählen Sie Ihr Handwerk und laden Sie Ihre Diplome/Zertifikate hoch.",
          ],
        },
        {
          title: "Kontaktieren Sie uns",
          text: "Unser Schweizer Support-Team steht Ihnen rund um die Uhr zur Verfügung. Schreiben Sie uns im Live-Chat oder per E-Mail an support@bluex.ch.",
        },
      ],
    },
  },
  "become-provider": {
    en: {
      title: "Become a Provider",
      subtitle: "Grow your trade business with Swiss job leads.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Why Partner with BlueX?",
          bullets: [
            "Continuous Job Leads — Receive matching job requests from Swiss customers in your region.",
            "Guaranteed Payments — Work with confidence knowing customer payments are secured in escrow before you start.",
            "Smart Business Tools — Automated quoting, invoicing, schedule management, and AI price optimization.",
          ],
        },
        {
          title: "How to Join",
          text: "1. Sign up and complete your profile. 2. Upload your Swiss business register ID (UID) or trade certification. 3. Get verified by our Swiss onboarding team. 4. Start receiving job invites and bidding on active projects.",
        },
      ],
    },
    de: {
      title: "Partner werden",
      subtitle: "Erweitern Sie Ihr Geschäft mit Schweizer Handwerksaufträgen.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Warum Partner bei BlueX werden?",
          bullets: [
            "Ständige Auftragsanfragen — Erhalten Sie passende Anfragen von Schweizer Kunden in Ihrer Region.",
            "Garantierte Auszahlungen — Arbeiten Sie beruhigt, da die Zahlungen der Kunden vor Arbeitsbeginn auf dem Treuhandkonto gesichert sind.",
            "Intelligente Tools — Automatische Offertenerstellung, Rechnungsstellung, Terminplanung und KI-Preisanalyse.",
          ],
        },
        {
          title: "So treten Sie bei",
          text: "1. Registrieren Sie sich und vervollständigen Sie Ihr Profil. 2. Laden Sie Ihre Schweizer UID oder Ihr Diplom hoch. 3. Lassen Sie sich verifizieren. 4. Erhalten Sie Auftragsanfragen.",
        },
      ],
    },
  },
  "provider-resources": {
    en: {
      title: "Provider Resources",
      subtitle: "Tools and guides to run your Swiss trade business.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Swiss Tax & Compliance Guides",
          text: "Understand VAT (MWST) registration, Swiss payroll compliance, social security contributions, and trade regulations across Swiss cantons.",
        },
        {
          title: "Optimizing Your Profile",
          bullets: [
            "Upload high-quality photos of your completed projects.",
            "Encourage clients to leave detailed reviews.",
            "Maintain a fast response rate to stand out in search results.",
          ],
        },
      ],
    },
    de: {
      title: "Ressourcen für Partner",
      subtitle: "Werkzeuge und Leitfäden für Ihr Schweizer Handwerksunternehmen.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Schweizer Steuer- und Compliance-Leitfäden",
          text: "Erfahren Sie alles über die MWST-Registrierung, Lohnbuchhaltung, Sozialabgaben und kantonale Handwerksvorschriften.",
        },
        {
          title: "Profil optimieren",
          bullets: [
            "Laden Sie hochauflösende Fotos Ihrer abgeschlossenen Projekte hoch.",
            "Bitten Sie Kunden um detaillierte Bewertungen.",
            "Antworten Sie schnell, um in den Suchergebnissen weiter oben zu erscheinen.",
          ],
        },
      ],
    },
  },
  "success-stories": {
    en: {
      title: "Success Stories",
      subtitle: "Read how Swiss professionals scale their trade businesses.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Hanspeter M. — Electro AG (Zurich)",
          text: '"Within 6 months of joining BlueX, our monthly bookings grew by 40%. The automated quoting tool saves me 10 hours of administrative work every week, allowing us to focus entirely on on-site installations."',
        },
        {
          title: "Sandra S. — Fine Cleaners (Bern)",
          text: '"The escrow system solved our biggest issue: late payments. Knowing the funds are secure before we start cleaning is a game-changer. We\'ve hired two new team members to keep up with the demand from BlueX."',
        },
      ],
    },
    de: {
      title: "Erfolgsberichte",
      subtitle: "Erfahren Sie, wie Schweizer Handwerker ihr Geschäft ausbauen.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Hanspeter M. — Electro AG (Zürich)",
          text: '"Innerhalb von 6 Monaten nach dem Beitritt zu BlueX stiegen unsere Buchungen um 40%. Das automatische Offertentool spart mir jede Woche 10 Stunden Admin-Arbeit."',
        },
        {
          title: "Sandra S. — Fine Cleaners (Bern)",
          text: '"Das Treuhandkonto hat unser grösstes Problem gelöst: unbezahlte Rechnungen. Zu wissen, dass das Geld gesichert ist, bevor wir anfangen, ändert alles."',
        },
      ],
    },
  },
  community: {
    en: {
      title: "Community",
      subtitle: "Connect with trade professionals and experts.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "BlueX Trade Forum",
          text: "Join our active community forum where verified Swiss builders, electricians, plumbers, and renovators discuss trade tips, tool recommendations, and Swiss building standards.",
        },
        {
          title: "Local Meetups",
          text: "We host regular networking events and educational workshops in major Swiss hubs (Zurich, Geneva, Basel, Lugano) focusing on digitalization and energy efficiency transitions in trades.",
        },
      ],
    },
    de: {
      title: "Community",
      subtitle: "Vernetzen Sie sich mit Handwerkern und Experten.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "BlueX Handwerkerforum",
          text: "Tauschen Sie sich in unserem Forum mit verifizierten Schweizer Bauunternehmern, Elektrikern und Sanitärinstallateuren aus über Best Practices und Normen.",
        },
        {
          title: "Lokale Treffen",
          text: "Wir organisieren regelmässig Networking-Events in Zürich, Genf, Basel und Lugano zu Themen wie Digitalisierung und Energieeffizienz im Handwerk.",
        },
      ],
    },
  },
  "about-us": {
    en: {
      title: "About Us",
      subtitle: "Digitalizing Swiss trades, one job at a time.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Our Mission",
          text: "BlueX was founded in Zurich to modernize the Swiss trade industry. We aim to remove the administrative burden from local trade businesses while offering Swiss clients an instant, secure, and modern booking experience.",
        },
        {
          title: "Swiss Quality, Swiss Innovation",
          text: "We combine local Swiss expertise with cutting-edge artificial intelligence, building a trustworthy marketplace that fosters business growth and ensures jobs are done right — guaranteed.",
        },
      ],
    },
    de: {
      title: "Über uns",
      subtitle: "Digitalisierung des Schweizer Handwerks, Schritt für Schritt.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Unsere Mission",
          text: "BlueX wurde in Zürich gegründet, um das Schweizer Handwerk zu modernisieren. Wir nehmen lokalen Betrieben den administrativen Aufwand ab und bieten Kunden eine schnelle, sichere Buchung.",
        },
        {
          title: "Schweizer Qualität & Innovation",
          text: "Wir kombinieren Schweizer Handwerkstradition mit modernster künstlicher Intelligenz, um einen vertrauenswürdigen Marktplatz zu schaffen.",
        },
      ],
    },
  },
  careers: {
    en: {
      title: "Careers",
      subtitle: "Join our team in building the future of Swiss trade services.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Why Work at BlueX?",
          text: "We are a fast-growing team of engineers, operations specialists, and support pros based in Switzerland. We offer competitive salaries, flexible work options, and the chance to transform a multi-billion Swiss franc industry.",
        },
        {
          title: "Open Positions",
          bullets: [
            "Senior Frontend Engineer (React/TypeScript) — Zurich or Remote (CH)",
            "Operations & Compliance Manager — Zurich Office",
            "Customer Support Representative (German/French speaking) — Remote (CH)",
          ],
        },
      ],
    },
    de: {
      title: "Karriere",
      subtitle: "Bauen Sie mit uns die Zukunft der Schweizer Dienstleistungsbranche.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Warum bei BlueX arbeiten?",
          text: "Wir sind ein schnell wachsendes Team in Zürich. Wir bieten wettbewerbsfähige Gehälter, flexible Arbeitszeiten und die Chance, eine Milliardenbranche zu digitalisieren.",
        },
        {
          title: "Offene Stellen",
          bullets: [
            "Senior Frontend Engineer (React/TypeScript) — Zürich oder Remote (CH)",
            "Operations & Compliance Manager — Büro Zürich",
            "Kundenberater/in (Deutsch/Französisch) — Remote (CH)",
          ],
        },
      ],
    },
  },
  blog: {
    en: {
      title: "Blog & Insights",
      subtitle: "Educational guides, home trends, and business tips.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "For Homeowners: Essential Maintenance Checklists",
          text: "Read our comprehensive guides on preparing your home heating system for winter, energy-saving plumbing upgrades, and choosing the right electrical certifications for home extensions.",
        },
        {
          title: "For Pros: Mastering AI Quotes",
          text: "Learn how to use BlueX AI Copilot to submit winning bids in under two minutes, adjust pricing to match regional demand in Switzerland, and manage customer reviews.",
        },
      ],
    },
    de: {
      title: "Blog & Magazin",
      subtitle: "Praktische Tipps, Wohntrends und geschäftliche Ratschläge.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Für Hauseigentümer: Wartungschecklisten",
          text: "Lesen Sie unsere Leitfäden zur Vorbereitung Ihrer Heizung auf den Winter, zur Energieeinsparung und zu den wichtigsten Sicherheitszertifikaten.",
        },
        {
          title: "Für Profi-Handwerker: Erfolgreiche Offerten",
          text: "Erfahren Sie, wie Sie mit dem BlueX AI Copilot Angebote in Rekordzeit erstellen und Ihre Auslastung steigern.",
        },
      ],
    },
  },
  "contact-us": {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with the BlueX Swiss team.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Contact Information",
          text: "Have questions about a booking, verification, or business partnerships? Our support team is here to help.",
        },
        {
          title: "Send Us a Message",
          text: "Fill out the contact form on this page, and our team will respond to you within 2 hours.",
        },
      ],
    },
    de: {
      title: "Kontakt",
      subtitle: "Nehmen Sie Kontakt mit dem Schweizer BlueX-Team auf.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Kontaktinformationen",
          text: "Haben Sie Fragen zu einer Buchung, zur Verifizierung oder zu Partnerschaften? Unser Team hilft Ihnen gerne weiter.",
        },
        {
          title: "Nachricht senden",
          text: "Füllen Sie das Kontaktformular aus. Wir melden uns in der Regel innerhalb von 2 Stunden bei Ihnen.",
        },
      ],
    },
  },
  "terms-of-service": {
    en: {
      title: "Terms of Service",
      subtitle: "Terms and conditions governing the use of the BlueX marketplace.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "1. Scope & Services",
          text: "BlueX AG operates an online marketplace connecting customers with independent trade professionals. BlueX provides the booking platform and escrow payment facility but does not execute trade services directly.",
        },
        {
          title: "2. Registration & Accounts",
          text: "Users must provide accurate information. Trade professionals must upload valid certifications and proof of liability insurance to offer services. Accounts are personal and non-transferable.",
        },
        {
          title: "3. Booking & Escrow",
          text: "Bookings are binding. Customer funds are held securely in a Swiss escrow account. Upon job completion, the customer must authorize payment release. BlueX holds the authority to resolve payout disputes.",
        },
        {
          title: "4. Applicable Law & Jurisdiction",
          text: "These terms are governed by Swiss law. The exclusive place of jurisdiction is Zurich, Switzerland.",
        },
      ],
    },
    de: {
      title: "Allgemeine Geschäftsbedingungen",
      subtitle: "Nutzungsbedingungen für den BlueX-Marktplatz.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "1. Geltungsbereich & Dienstleistungen",
          text: "Die BlueX AG betreibt einen Online-Marktplatz zur Vermittlung von Handwerksleistungen. BlueX stellt die Plattform und die Treuhandabwicklung bereit, erbringt die Handwerksleistungen jedoch nicht selbst.",
        },
        {
          title: "2. Registrierung & Konten",
          text: "Nutzer müssen wahrheitsgemässe Angaben machen. Partner-Handwerker müssen Zertifikate und eine Betriebshaftpflichtversicherung vorlegen. Die Registrierung ist persönlich.",
        },
        {
          title: "3. Buchung & Treuhandkonto",
          text: "Buchungen sind verbindlich. Zahlungen werden auf einem Schweizer Treuhandkonto gesichert. Nach Abnahme gibt der Kunde das Geld frei. BlueX entscheidet im Streitfall über die Auszahlung.",
        },
        {
          title: "4. Anwendbares Recht & Gerichtsstand",
          text: "Diese Bedingungen unterliegen Schweizer Recht. Ausschliesslicher Gerichtsstand ist Zürich, Schweiz.",
        },
      ],
    },
  },
  "privacy-policy": {
    en: {
      title: "Privacy Policy",
      subtitle: "How we collect, protect, and process your personal data.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "1. Data Collection",
          text: "We collect personal information necessary for operations: contact details, location data for job matching, billing details, and trade credentials for verification.",
        },
        {
          title: "2. Data Processing & Hosting",
          text: "Your data is hosted securely in Switzerland and the European Union. We comply with the Swiss Federal Act on Data Protection (FADP) and the General Data Protection Regulation (GDPR).",
        },
        {
          title: "3. Escrow & Bank Partners",
          text: "Financial transactions are handled by FINMA-compliant payment processors. We do not store full credit card details on our servers.",
        },
      ],
    },
    de: {
      title: "Datenschutzerklärung",
      subtitle: "Wie wir Ihre persönlichen Daten erheben, schützen und verarbeiten.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "1. Datenerhebung",
          text: "Wir erheben Daten, die für den Betrieb nötig sind: Kontaktdaten, Standortdaten für Vermittlungen, Rechnungsdaten und Fachnachweise für Handwerker.",
        },
        {
          title: "2. Datenspeicherung & DSGVO",
          text: "Ihre Daten werden sicher in der Schweiz und der EU gespeichert. Wir halten uns an das Schweizer Datenschutzgesetz (DSG) sowie an die DSGVO der EU.",
        },
        {
          title: "3. Zahlungsdienstleister",
          text: "Finanztransaktionen werden über FINMA-konforme Partner abgewickelt. Wir speichern keine Kreditkartendaten auf unseren eigenen Servern.",
        },
      ],
    },
  },
  "cookie-policy": {
    en: {
      title: "Cookie Policy",
      subtitle: "Information on how we use cookies and tracking technologies.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "1. What are cookies?",
          text: "Cookies are small text files stored on your browser to collect standard internet log information and visitor behavior patterns.",
        },
        {
          title: "2. How we use cookies",
          text: "We use essential cookies for user authentication, security, and storing your language preference. We use analytical cookies (e.g. Matomo) to optimize site performance.",
        },
        {
          title: "3. Managing cookies",
          text: "You can set your browser not to accept cookies. However, some marketplace features (like signing in or booking) may not function as a result.",
        },
      ],
    },
    de: {
      title: "Cookie-Richtlinie",
      subtitle: "Informationen über die Nutzung von Cookies auf unserer Webseite.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "1. Was sind Cookies?",
          text: "Cookies sind kleine Textdateien, die auf Ihrem Computer gespeichert werden, um Anmeldeinformationen und Präferenzen zu sichern.",
        },
        {
          title: "2. Nutzung von Cookies",
          text: "Wir nutzen notwendige Cookies zur Benutzeranmeldung und für die Sprachwahl. Optionale Analyse-Cookies helfen uns, die Webseite zu verbessern.",
        },
        {
          title: "3. Cookie-Einstellungen",
          text: "Sie können das Speichern in den Browsereinstellungen deaktivieren. Einige Funktionen können dadurch beeinträchtigt werden.",
        },
      ],
    },
  },
  imprint: {
    en: {
      title: "Imprint (Impressum)",
      subtitle: "Legal disclosure required under Swiss law.",
      lastUpdated: "July 2026",
      sections: [
        {
          title: "Company Address",
          bullets: ["BlueX AG", "Bahnhofstrasse 100", "8001 Zürich", "Switzerland"],
        },
        {
          title: "Contact Info",
          bullets: ["Email: contact@bluex.ch", "Web: www.bluex.ch", "Support: support@bluex.ch"],
        },
        {
          title: "Company Registry",
          bullets: [
            "Commercial Register: Canton of Zurich",
            "Company UID: CHE-123.456.789 MWST",
            "Authorized Representative: Thomas K. (CEO)",
          ],
        },
      ],
    },
    de: {
      title: "Impressum",
      subtitle: "Gesetzliche Angaben gemäss Schweizer Recht.",
      lastUpdated: "Juli 2026",
      sections: [
        {
          title: "Unternehmensanschrift",
          bullets: ["BlueX AG", "Bahnhofstrasse 100", "8001 Zürich", "Schweiz"],
        },
        {
          title: "Kontakt",
          bullets: ["E-Mail: contact@bluex.ch", "Web: www.bluex.ch", "Support: support@bluex.ch"],
        },
        {
          title: "Registereintrag",
          bullets: [
            "Handelsregister: Kanton Zürich",
            "Firmen-UID: CHE-123.456.789 MWST",
            "Vertretungsberechtigte Person: Thomas K. (CEO)",
          ],
        },
      ],
    },
  },
};

export function getLocalizedPageContent(pageId: string, lang: string): PageContent | undefined {
  const pages = FOOTER_PAGES_CONTENT[pageId];
  if (!pages) return undefined;
  return pages[lang] || pages["en"] || pages["de"];
}
