export interface MockProvider {
  id: string;
  name: string;
  type: "private" | "company";
  specialty: string; // lowercase slug matching category slugs
  specialtyLabel: string; // User-friendly display label
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  location: string;
  memberSince: string;
  minBooking: string;
  responseTime: string;
  completionRate: string;
  jobsCompleted: number;
  languages: string;
  avatar: string;
  about: string;
  services: string[];
  reviews: { id: number; author: string; rating: number; date: string; text: string }[];
  faqs: { q: string; a: string }[];

  // Company-specific fields
  vatNumber?: string;
  uidNumber?: string;
  registrationOffice?: string;
  insuranceCoverage?: string;

  // Private-specific fields
  ahvStatus?: string;
  uvgStatus?: string;
  complianceChecked?: boolean;
}

export const MOCK_PROVIDERS: Record<string, MockProvider> = {
  "clean-shine": {
    id: "clean-shine",
    name: "Clean & Shine AG",
    type: "company",
    specialty: "cleaner",
    specialtyLabel: "Professional Cleaning Services",
    rating: 4.9,
    reviewsCount: 128,
    location: "Zurich, Switzerland",
    memberSince: "Jan 2023",
    minBooking: "2 hours",
    responseTime: "15 min",
    completionRate: "98%",
    jobsCompleted: 312,
    languages: "DE, EN",
    hourlyRate: 52,
    avatar:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80",
    about:
      "Clean & Shine AG is a registered Swiss facility services company. We provide professional cleaning services for homes, apartments, and offices. Our staff is fully employed, insured, and trained to meet strict Swiss hygiene standards.",
    services: [
      "Regular Cleaning",
      "Deep Cleaning",
      "Move-in / Move-out Cleaning",
      "Window Cleaning",
    ],
    reviews: [
      {
        id: 1,
        author: "Anna M.",
        rating: 5,
        date: "2 weeks ago",
        text: "Excellent cleaning! They were extremely professional, punctual, and left the apartment spotless.",
      },
      {
        id: 2,
        author: "Beat S.",
        rating: 5,
        date: "1 month ago",
        text: "Very reliable service. The team was friendly and worked very fast. Highly recommended!",
      },
    ],
    faqs: [
      {
        q: "Do I need to provide cleaning supplies?",
        a: "No, as a professional agency we bring our own eco-friendly detergents, vacuums, and microfiber cloths.",
      },
      {
        q: "Is the service insured?",
        a: "Yes, Clean & Shine AG holds CHF 5,000,000 in public liability insurance covering any accidental damage.",
      },
    ],
    vatNumber: "CHE-482.931.045 MWST",
    uidNumber: "CHE-482.931.045",
    registrationOffice: "Commercial Registry of Canton Zurich",
    insuranceCoverage: "CHF 5,000,000 Public Liability Insurance",
  },
  "sparkle-home": {
    id: "sparkle-home",
    name: "Sparkle Home Services",
    type: "company",
    specialty: "cleaner",
    specialtyLabel: "House Cleaning Company",
    rating: 4.8,
    reviewsCount: 96,
    location: "Zurich, Switzerland",
    memberSince: "Mar 2023",
    minBooking: "2 hours",
    responseTime: "30 min",
    completionRate: "95%",
    jobsCompleted: 245,
    languages: "DE, EN, FR",
    hourlyRate: 48,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    about:
      "Sparkle Home Services provides top-tier home care throughout the Zurich region. We handle the recruitment, social security, and insurance of our cleaning team, allowing you to enjoy a sparkling clean home hassle-free.",
    services: ["General Cleaning", "Kitchen Deep Clean", "Ironing & Laundry"],
    reviews: [
      {
        id: 1,
        author: "Clara K.",
        rating: 5,
        date: "3 days ago",
        text: "Great pricing and super friendly cleaners. Will book again next month!",
      },
    ],
    faqs: [
      {
        q: "Can I request the same cleaner each time?",
        a: "Yes! If you sign up for recurring weekly or bi-weekly cleans, we will prioritize assigning the same cleaner to your home.",
      },
    ],
    vatNumber: "CHE-389.201.764 MWST",
    uidNumber: "CHE-389.201.764",
    registrationOffice: "Commercial Registry Office of Canton Zurich",
    insuranceCoverage: "CHF 2,000,000 Liability Insurance",
  },
  "zuri-cleaning": {
    id: "zuri-cleaning",
    name: "Zuri Cleaning Experts",
    type: "company",
    specialty: "cleaner",
    specialtyLabel: "Elite Housekeeping Agency",
    rating: 4.7,
    reviewsCount: 75,
    location: "Zurich, Switzerland",
    memberSince: "Nov 2022",
    minBooking: "2 hours",
    responseTime: "20 min",
    completionRate: "97%",
    jobsCompleted: 189,
    languages: "DE, EN, IT",
    hourlyRate: 55,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    about:
      "Zuri Cleaning Experts specializes in premium home upkeep. We cater to high-end residential properties and commercial offices looking for Swiss-quality results. Our services are fully customisable.",
    services: [
      "Regular Upkeep",
      "Move-out Deep Clean",
      "Carpet Steam Cleaning",
      "Disinfecting Services",
    ],
    reviews: [
      {
        id: 1,
        author: "Thomas L.",
        rating: 4,
        date: "1 week ago",
        text: "Very thorough clean. Professional team.",
      },
    ],
    faqs: [
      {
        q: "What is your cancellation policy?",
        a: "We offer free cancellation up to 24 hours before the service starts. Cancellations within 24 hours may incur a 50% fee.",
      },
    ],
    vatNumber: "CHE-291.503.487 MWST",
    uidNumber: "CHE-291.503.487",
    registrationOffice: "Zurich Commercial Registry Office",
    insuranceCoverage: "CHF 3,000,000 Liability Insurance",
  },
  "sarah-keller": {
    id: "sarah-keller",
    name: "Sarah Keller",
    type: "private",
    specialty: "cleaner",
    specialtyLabel: "Independent Housekeeper",
    rating: 4.95,
    reviewsCount: 42,
    location: "Zurich, Switzerland",
    memberSince: "May 2023",
    minBooking: "2 hours",
    responseTime: "10 min",
    completionRate: "100%",
    jobsCompleted: 85,
    languages: "DE, FR",
    hourlyRate: 36,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    about:
      "Hi! I am Sarah, an experienced cleaner offering private cleaning services in Zurich. I am passionate about creating clean, peaceful living spaces. Hiring me is simple and legally compliant through BlueX's automated payroll and social contribution system.",
    services: ["Regular Housework", "Laundry & Ironing", "Window Cleaning"],
    reviews: [
      {
        id: 1,
        author: "Marc O.",
        rating: 5,
        date: "1 week ago",
        text: "Sarah is amazing. Very thorough, polite, and always on time. Highly recommended!",
      },
    ],
    faqs: [
      {
        q: "How is my employment with you registered?",
        a: "By booking me through BlueX, the platform automatically handles my AHV/IV/EO registration, withholding taxes, and legal accident insurance. You do not need to do any paperwork.",
      },
    ],
    ahvStatus: "AHV/IV/EO contributions automatically processed via BlueX",
    uvgStatus: "UVG Accident Insurance active and managed via BlueX",
    complianceChecked: true,
  },
  "zuri-plumbing": {
    id: "zuri-plumbing",
    name: "Zuri Plumbing GmbH",
    type: "company",
    specialty: "plumber",
    specialtyLabel: "Licensed Plumbing Services",
    rating: 4.85,
    reviewsCount: 154,
    location: "Zurich, Switzerland",
    memberSince: "Feb 2022",
    minBooking: "1 hour",
    responseTime: "25 min",
    completionRate: "99%",
    jobsCompleted: 420,
    languages: "DE, EN, IT",
    hourlyRate: 115,
    avatar:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
    about:
      "Zuri Plumbing GmbH is your go-to provider for all residential plumbing needs, heating, and emergency leak repairs. We offer rapid response times and certified Swiss master plumbers.",
    services: [
      "Emergency Leak Repair",
      "Faucets & Toilets Installation",
      "Drain Unblocking",
      "Heating Maintenance",
    ],
    reviews: [
      {
        id: 1,
        author: "Urs P.",
        rating: 5,
        date: "3 days ago",
        text: "Had a pipe leak at 8 PM. They arrived in 30 mins and fixed it instantly. Lifesavers!",
      },
    ],
    faqs: [
      {
        q: "Do you have emergency dispatch?",
        a: "Yes! Our emergency plumbing team is available 24/7. Select 'Emergency' when booking for prioritized routing.",
      },
    ],
    vatNumber: "CHE-842.109.573 MWST",
    uidNumber: "CHE-842.109.573",
    registrationOffice: "Commercial Registry Canton Zurich",
    insuranceCoverage: "CHF 5,000,000 Public Liability Insurance",
  },
  "swiss-electricians": {
    id: "swiss-electricians",
    name: "Swiss Electricians AG",
    type: "company",
    specialty: "electrician",
    specialtyLabel: "Certified Electrical Installation",
    rating: 4.9,
    reviewsCount: 110,
    location: "Zurich, Switzerland",
    memberSince: "Jul 2021",
    minBooking: "1 hour",
    responseTime: "20 min",
    completionRate: "98%",
    jobsCompleted: 350,
    languages: "DE, EN, FR",
    hourlyRate: 125,
    avatar:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80",
    about:
      "Swiss Electricians AG provides licensed electrical services including smart home integrations, lighting design, wiring repairs, and appliance setup. Safety and precision are our core values.",
    services: [
      "Electrical Repairs",
      "Smart Home Installation",
      "Fuse Box Upgrades",
      "Safety Inspections",
    ],
    reviews: [
      {
        id: 1,
        author: "Dominik B.",
        rating: 5,
        date: "2 weeks ago",
        text: "Extremely professional. Installed all lighting fixtures and set up our smart home dashboard perfectly.",
      },
    ],
    faqs: [
      {
        q: "Are your technicians certified?",
        a: "Yes, all our electricians hold Swiss federal certificates of competence (EFZ) and are authorized by ESTI.",
      },
    ],
    vatNumber: "CHE-510.984.321 MWST",
    uidNumber: "CHE-510.984.321",
    registrationOffice: "Zurich Commercial Registry Office",
    insuranceCoverage: "CHF 10,000,000 Comprehensive Liability Insurance",
  },
  "hans-mueller": {
    id: "hans-mueller",
    name: "Hans Müller",
    type: "private",
    specialty: "carpenter",
    specialtyLabel: "Handyman & Carpenter",
    rating: 4.88,
    reviewsCount: 68,
    location: "Zurich, Switzerland",
    memberSince: "Sep 2022",
    minBooking: "2 hours",
    responseTime: "35 min",
    completionRate: "96%",
    jobsCompleted: 156,
    languages: "DE",
    hourlyRate: 68,
    avatar:
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80",
    about:
      "I am Hans, a retired carpenter offering carpentry, furniture assembly, and general handyman services. I bring my own professional woodworking tools and 30+ years of craft experience. Book me directly via BlueX.",
    services: [
      "Furniture Assembly (IKEA, etc.)",
      "Custom Woodwork",
      "Door & Window Repairs",
      "Picture Hanging & Shelf Mounting",
    ],
    reviews: [
      {
        id: 1,
        author: "Rita S.",
        rating: 5,
        date: "1 month ago",
        text: "Hans repaired our old wooden dining table. It looks absolutely brand new. Exceptional craftsmanship!",
      },
    ],
    faqs: [
      {
        q: "Can you help pick up furniture?",
        a: "Yes, I have a small van and can pick up flat-pack boxes from IKEA or other stores if arranged in advance.",
      },
    ],
    ahvStatus: "AHV/IV contributions automatically processed via BlueX",
    uvgStatus: "UVG Accident Insurance active and managed via BlueX",
    complianceChecked: true,
  },
  "marc-dubois": {
    id: "marc-dubois",
    name: "Marc Dubois",
    type: "private",
    specialty: "gardener",
    specialtyLabel: "Independent Gardener",
    rating: 4.82,
    reviewsCount: 30,
    location: "Zurich, Switzerland",
    memberSince: "Apr 2023",
    minBooking: "2 hours",
    responseTime: "45 min",
    completionRate: "94%",
    jobsCompleted: 58,
    languages: "FR, DE, EN",
    hourlyRate: 58,
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    about:
      "Hello! I am Marc. I offer professional garden maintenance, lawn mowing, hedge trimming, and planting services in Zurich. I love bringing gardens to life and keeping them beautiful.",
    services: [
      "Lawn Mowing & Care",
      "Hedge Trimming",
      "Garden Weeding & Mulching",
      "Planting & Leaf Cleanup",
    ],
    reviews: [
      {
        id: 1,
        author: "Michelle V.",
        rating: 5,
        date: "3 weeks ago",
        text: "Marc did a fantastic job trimming our hedges. Very neat, clean, and friendly gardener.",
      },
    ],
    faqs: [
      {
        q: "Do you bring your own tools?",
        a: "Yes, I bring a lawnmower, hedge trimmer, and garden waste bags. I can also dispose of the green waste for a small additional fee.",
      },
    ],
    ahvStatus: "AHV/IV/EO contributions automatically processed via BlueX",
    uvgStatus: "UVG Accident Insurance active and managed via BlueX",
    complianceChecked: true,
  },
  "elena-rossi": {
    id: "elena-rossi",
    name: "Elena Rossi",
    type: "private",
    specialty: "childcare",
    specialtyLabel: "Certified Childcare & Nanny",
    rating: 4.97,
    reviewsCount: 55,
    location: "Zurich, Switzerland",
    memberSince: "Jan 2023",
    minBooking: "3 hours",
    responseTime: "15 min",
    completionRate: "100%",
    jobsCompleted: 110,
    languages: "IT, DE, EN",
    hourlyRate: 42,
    avatar:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    about:
      "Hi families! I am Elena, a qualified nanny with a certificate in early childhood education. I have over 6 years of experience caring for children from babies to school age. I am CPR/First Aid certified.",
    services: ["Babysitting", "After-school Care", "Language Tutoring (Italian)"],
    reviews: [
      {
        id: 1,
        author: "Laura F.",
        rating: 5,
        date: "2 weeks ago",
        text: "Elena is wonderful with our kids. They absolutely adore her. Extremely responsible and trustworthy.",
      },
    ],
    faqs: [
      {
        q: "Are you First Aid certified?",
        a: "Yes, I renew my pediatric first-aid certification every 2 years. I prioritize children's safety and well-being above all.",
      },
    ],
    ahvStatus: "AHV/IV contributions automatically processed via BlueX",
    uvgStatus: "UVG Accident Insurance active and managed via BlueX",
    complianceChecked: true,
  },
  "zuri-movers": {
    id: "zuri-movers",
    name: "Zuri Movers GmbH",
    type: "company",
    specialty: "movers",
    specialtyLabel: "Moving & Transport Company",
    rating: 4.78,
    reviewsCount: 114,
    location: "Zurich, Switzerland",
    memberSince: "Nov 2022",
    minBooking: "4 hours",
    responseTime: "30 min",
    completionRate: "96%",
    jobsCompleted: 290,
    languages: "DE, EN",
    hourlyRate: 85,
    avatar:
      "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=400&q=80",
    about:
      "Zuri Movers GmbH provides professional packing, transportation, and move-out cleaning services with a handover guarantee. Let us make your moving day stress-free and efficient.",
    services: [
      "Home Relocation",
      "Office Moving",
      "Professional Packing Service",
      "Piano Transport",
    ],
    reviews: [
      {
        id: 1,
        author: "Sandra G.",
        rating: 5,
        date: "3 weeks ago",
        text: "Amazing team! They packed our 4-room apartment in a morning and moved everything without a single scratch.",
      },
    ],
    faqs: [
      {
        q: "Is transport insurance included?",
        a: "Yes, all moves are covered by our CHF 5,000,000 transport and transit insurance.",
      },
    ],
    vatNumber: "CHE-382.491.503 MWST",
    uidNumber: "CHE-382.491.503",
    registrationOffice: "Zurich Commercial Registry Office",
    insuranceCoverage: "CHF 5,000,000 Public Liability & Transport Insurance",
  },
};
