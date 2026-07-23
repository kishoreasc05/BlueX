export interface MockProvider {
  id: string;
  name: string;
  type: "private" | "company";
  specialty: string; // lowercase slug matching category slugs
  specialtyLabel: string; // User-friendly display label
  rating: number | null;
  reviewsCount: number;
  hourlyRate: number;
  location: string;
  memberSince: string;
  minBooking: string;
  responseTime: string | null;
  completionRate: string | null;
  jobsCompleted: number;
  languages: string;
  avatar?: string;
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Jan 2023",
    minBooking: "2 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "DE, EN",
    hourlyRate: 52,
    avatar: "",
    about:
      "Clean & Shine AG is a registered Swiss facility services company. We provide professional cleaning services for homes, apartments, and offices. Our staff is fully employed, insured, and trained to meet strict Swiss hygiene standards.",
    services: [
      "Regular Cleaning",
      "Deep Cleaning",
      "Move-in / Move-out Cleaning",
      "Window Cleaning",
    ],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Mar 2023",
    minBooking: "2 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "DE, EN, FR",
    hourlyRate: 48,
    avatar: "",
    about:
      "Sparkle Home Services provides top-tier home care throughout the Zurich region. We handle the recruitment, social security, and insurance of our cleaning team, allowing you to enjoy a sparkling clean home hassle-free.",
    services: ["General Cleaning", "Kitchen Deep Clean", "Ironing & Laundry"],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Nov 2022",
    minBooking: "2 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "DE, EN, IT",
    hourlyRate: 55,
    avatar: "",
    about:
      "Zuri Cleaning Experts specializes in premium home upkeep. We cater to high-end residential properties and commercial offices looking for Swiss-quality results. Our services are fully customisable.",
    services: [
      "Regular Upkeep",
      "Move-out Deep Clean",
      "Carpet Steam Cleaning",
      "Disinfecting Services",
    ],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "May 2023",
    minBooking: "2 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "DE, FR",
    hourlyRate: 36,
    avatar: "",
    about:
      "Hi! I am Sarah, an experienced cleaner offering private cleaning services in Zurich. I am passionate about creating clean, peaceful living spaces. Hiring me is simple and legally compliant through BlueX's automated payroll and social contribution system.",
    services: ["Regular Housework", "Laundry & Ironing", "Window Cleaning"],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Feb 2022",
    minBooking: "1 hour",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "DE, EN, IT",
    hourlyRate: 115,
    avatar: "",
    about:
      "Zuri Plumbing GmbH is your go-to provider for all residential plumbing needs, heating, and emergency leak repairs. We offer rapid response times and certified Swiss master plumbers.",
    services: [
      "Emergency Leak Repair",
      "Faucets & Toilets Installation",
      "Drain Unblocking",
      "Heating Maintenance",
    ],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Jul 2021",
    minBooking: "1 hour",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "DE, EN, FR",
    hourlyRate: 125,
    avatar: "",
    about:
      "Swiss Electricians AG provides licensed electrical services including smart home integrations, lighting design, wiring repairs, and appliance setup. Safety and precision are our core values.",
    services: [
      "Electrical Repairs",
      "Smart Home Installation",
      "Fuse Box Upgrades",
      "Safety Inspections",
    ],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Sep 2022",
    minBooking: "2 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "DE",
    hourlyRate: 68,
    avatar: "",
    about:
      "I am Hans, a retired carpenter offering carpentry, furniture assembly, and general handyman services. I bring my own professional woodworking tools and 30+ years of craft experience. Book me directly via BlueX.",
    services: [
      "Furniture Assembly (IKEA, etc.)",
      "Custom Woodwork",
      "Door & Window Repairs",
      "Picture Hanging & Shelf Mounting",
    ],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Apr 2023",
    minBooking: "2 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "FR, DE, EN",
    hourlyRate: 58,
    avatar: "",
    about:
      "Hello! I am Marc. I offer professional garden maintenance, lawn mowing, hedge trimming, and planting services in Zurich. I love bringing gardens to life and keeping them beautiful.",
    services: [
      "Lawn Mowing & Care",
      "Hedge Trimming",
      "Garden Weeding & Mulching",
      "Planting & Leaf Cleanup",
    ],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Jan 2023",
    minBooking: "3 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
    languages: "IT, DE, EN",
    hourlyRate: 42,
    avatar: "",
    about:
      "Hi families! I am Elena, a qualified nanny with a certificate in early childhood education. I have over 6 years of experience caring for children from babies to school age. I am CPR/First Aid certified.",
    services: ["Babysitting", "After-school Care", "Language Tutoring (Italian)"],
    reviews: [],
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
    rating: null,
    reviewsCount: 0,
    location: "Zurich, Switzerland",
    memberSince: "Nov 2022",
    minBooking: "4 hours",
    responseTime: null,
    completionRate: null,
    jobsCompleted: 0,
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
    reviews: [],
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
