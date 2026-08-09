import { useState, useRef, useEffect } from "react";
import {
  Calendar, Phone, MapPin, MessageCircle, ShoppingBag,
  ChevronDown, ChevronLeft, Star, Clock, Users, TrendingUp, Package,
  FileText, Leaf, Stethoscope, AlertTriangle, Search,
  CheckCircle, ArrowRight, Menu, X, LogIn, PhoneCall, PhoneMissed,
  PhoneForwarded, FlaskConical, Send, Plus, Mail,
  BarChart2, Shield, ChevronRight, Bot,
  UserCheck, Pill, Download, LogOut,
  RefreshCw, Inbox, Home, Microscope, Footprints, BedDouble, Ambulance,
  Moon, Sun,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/app/components/ui/carousel";
import clinicLogo from "@/imports/photo_2024-05-10_11-09-44-1.jpg";
import service5Image from "@/imports/service-5.jpg";
import service1Image from "@/imports/service-1.jpg";
import service2Image from "@/imports/service-2.jpg";
import service4Image from "@/imports/service-4.jpg";
import service3Image from "@/imports/service-3.jpg";
import service6Image from "@/imports/service-6.jpg";
import skilled3Image from "@/imports/skilled-3.jpg";
import service7Image from "@/imports/service-7.jpg";
import service9Image from "@/imports/service-9.png";
import service10Image from "@/imports/service-10.png";
import carousel1 from "@/imports/carousel-1.jpg";
import carousel2 from "@/imports/carousel-2.jpg";
import carousel3 from "@/imports/carousel-3.jpg";
import news12 from "@/imports/news-12.jpg";
import news3 from "@/imports/news-3.jpg";
import news4 from "@/imports/news-4.jpg";
import news5 from "@/imports/news-5.jpg";
import news6 from "@/imports/news-6.jpg";
import news7 from "@/imports/news-7.jpg";
import news76 from "@/imports/news-76.jpg";
import product1Image from "@/imports/product-1.jpg";
import product2Image from "@/imports/product-2.jpg";
import product3Image from "@/imports/product-3.jpg";
import product4Image from "@/imports/product-4.jpg";
import product5Image from "@/imports/product-5.jpg";
import product6Image from "@/imports/product-6.jpg";
import product7Image from "@/imports/product-7.jpg";

// ─── Brand palette ─────────────────────────────────────────────────────────
// GREEN   : #1C7A3A   — dominant brand colour (logo oval border, EDHEC text)
// ORANGE  : #E07820   — warm accent (CTAs, highlights, stars)
// RED     : #8B2E1A   — faded/deep red (inner logo ring, urgency)
// WHITE   : #FFFFFF   — backgrounds, reversed text

const G  = "#1C7A3A";   // green
const OR = "#E07820";   // orange
const R  = "#8B2E1A";   // faded red
const W  = "#FFFFFF";   // white

type View     = "public" | "patient" | "admin";
type AdminTab = "overview" | "crm" | "callcentre" | "sales" | "inventory" | "staff";
type PatientEntry = (typeof PATIENTS)[number] & {
  lastCallAt?: string;
  callCount?: number;
  lastCallMode?: "Phone" | "WhatsApp";
};
type PatientAppointment = {
  id: number;
  patientName: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Completed" | "Upcoming";
  createdAt: string;
};

type PatientPayment = {
  id: number;
  description: string;
  amount: number;
  date: string;
  method: string;
  status: "Paid" | "Pending";
  recipientName?: string;
  recipientNumber?: string;
  createdAt: string;
};

type PatientOrder = {
  id: number;
  description: string;
  amount: number;
  date: string;
  method: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  createdAt: string;
};

type MonthlyReport = {
  id: number;
  month: string;
  year: number;
  generatedAt: string;
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  topProduct: string;
  topProductUnits: number;
  topProductRevenue: number;
  lowStockCount: number;
  productsSold: Array<{ name: string; sold: number; revenue: number }>;
};

// ─── Data ──────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: Stethoscope, title: "Consultation",    desc: "Experts Who Are Qualified Conduct Consultation. Holistic Treatment Is Given To Our Patients So During Consultation, An Opportunity Is Given To Our Patients To Sit Down In A Relaxed And Supportive Environment To Have An In-Depth Conversation About Their Health Concerns. We Put Our Patients First.", color: G,  image: service5Image },
  { icon: FlaskConical, title: "Laboratory Tests",       desc: "At Edu Herbal Clinic We Diagnose With The Help Of Lab Results. An Expert In Medical Lab Conducts Laboratory Tests On Clinical Specimens To Obtain Information About The Health Of Our Patients And To Aid In The Diagnosis, Treatment, And Prevention Of Diseases. At Our Head Office In Mankessim-Baifikrom And Our Other Branches, Quality Care Is Provided By Our Doctors With The Help Of Their Expectations And Professionals.",    color: R,  image: service1Image },
  { icon: Leaf,         title: "Herbal Products",        desc: "We Use Organic And Natural Herbal Medicine To Treat Diseases. The FDA Has Approved Our Herbal Supplement. Therefore The Efficacy Is Very High. Precautions Are Taken To Ensure That The Body Returns To A State Of Natural Balance So That It Can Heal Itself.",     color: G,  image: service2Image },
  { icon: Calendar,     title: "Online Booking",         desc: "Schedule your appointment online at your convenience. Easily book your appointment anytime, anywhere. Securely your scheduled appointment with just a few clicks. Convenient online booking for a seamless healthcare experience 24/7.",                color: OR, image: service9Image },
  { icon: Microscope,   title: "Diagnostic Center", desc: "We Do Both Ultrasound And Quantum Scans That Help To Identify Affected Tissues And Also Aid In Diagnosing A Particular Disease Condition.", color: R, image: service4Image },
  { icon: Phone,        title: "Telemedicine",           desc: "Stay Connected To Edu Herbal Clinic Through Our Secure Telemedicine Service. Enjoy Our Flexible Virtual Appointments, Professional Medical Consultation And A Reliable Healthcare Support.",                   color: OR, image: service10Image },
  { icon: Footprints,   title: "Physiotherapy",          desc: "Edu Herbal Medicines Can Provide Soothing Relief, And They Can Reduce Pain And Inflammation When Applied To The Affected Area With Physical Massage.", color: G, image: service3Image },
  { icon: BedDouble,   title: "Private & General Wards", desc: "We Provide Our Patients With Ultra Modern Private And General Wards. Our Clinic Contains Double Or Single Bed That Gives A Patient Total Privacy. We Care For Our Patient Always By Assisting Them To Recover Very Fast.", color: OR, image: service6Image },
  { icon: Ambulance,   title: "Clinic On-Wheels",         desc: "We Do Free Screenings For Communities, Churches, Schools, And Any Formidable Organizations When We Are Called Upon To Come And Do This Exercise As Part Of Our Responsibilities.", color: R, image: service7Image },
];

const WHAT_WE_DO_CARDS = [
  { title: "Health Kidney and / Prostate problems", desc: "Prostatitis, Prostate enlargement and Prostate cancer are the condition that affects the prostate. kidney disease leads to severe and adverse effects, which results in loss of kidney function, Causes kidney stones which are clear indications of kidney failure." },
  { title: "Infertility / Sexual Weakness", desc: "Infertility is the inability of a person to reproduce by natural means and erectile dysfunction is a man’s inability to achieve full erection despite a man’s willingness to perform sexual act with his partner." },
  { title: "Sciatica", desc: "It is a constant pain that radiates along the path of the sciatic nerve, which branches from your lower back through your hips and buttocks and down each leg, Typically, sciatica can affect both sides of your body." },
  { title: "Malaria", desc: "Suffering from Malaria is a serious and sometimes fatal disease caused by a parasite that commonly affects a certain type of mosquito which feeds on humans." },
  { title: "Asthma", desc: "A disorder wherein a person's airways narrow, swell, and generate additional mucus, making it difficult to breathe. Airborne allergens, such as pollen, dust mites, and mold spores, are the source of this ailment." },
  { title: "Stroke Expert", desc: "We Use Organic And Natural Herbal Medicine To Treat Stroke. Stroke occurs When There Is Insufficient Blood To The Brain. Symptoms Includes: Paralysis, Numbness Or Weakness In The Arm, Face, And Leg, Especially On One Side Of The Body. Difficulty in speaking and hearing." },
  { title: "Hypertension / Diabetes", desc: "High blood pressure, often occurs alongside diabetes mellitus, including type 1, type 2, and gestational diabetes. Hypertension and type 2 diabetes are both aspects of metabolic syndrome and also causes cardiovascular disease." },
  { title: "Cancer", desc: "A category of illnesses known as \"cancer\" involve abnormal cell proliferation and have the ability to move to other body regions or invade them." },
];

const DOCTORS = [
  { id: 1, name: "Dr. Edu Mohammed",       specialty: "Special General Consultation",    initials: "AO", slots: ["09:00 AM","10:00 AM","02:00 PM","03:00 PM"] },
  { id: 2, name: "Dr. Opoku", specialty: "Stroke Specialist", initials: "FA", slots: ["08:30 AM","11:00 AM","01:00 PM","04:00 PM"] },
  { id: 3, name: "Mr. Eric",     specialty: "Reflexology, Physiotherapy and Massage Unit", initials: "KA", slots: ["09:30 AM","10:30 AM","02:30 PM","04:30 PM"] },
];

const PRODUCTS = [
  { id:1, name:"Edhec SM Bitters",           category:"Bitters",    price:70,  img: product1Image, desc:"Edhec SM Bitters is a potent herbal remedy known for effectively relieving waist pain and enhancing overall well-being. It supports a healthy libido and addresses sexual weakness, making it ideal for those seeking to boost their vitality naturally. The unique blend of herbs works to restore energy levels and promote better physical performance. Regular use can help improve circulation and reduce discomfort associated with body aches. Edhec SM Bitters is a natural solution for maintaining both physical and sexual health."     },
  { id:2, name:"Edhec Herbal Mixture",      category:"Tincture",   price:40,  img: product2Image, desc:"Edhec Herbal Mixture is a powerful natural solution for relieving abdominal and body pains. Its unique herbal blend works quickly to soothe discomfort, promoting faster recovery and overall well-being. Ideal for those seeking an effective, natural approach, it provides relief without side effects. Experience the healing power of Edhec Herbal Mixture for a pain-free life.."          },
  { id:3, name:"Edhec Herbal Tonic",        category:"Topical",    price:40,  img: product3Image, desc:"Edhec Herbal Tonic is an excellent solution for loss of appetite and anemia. Its potent blend of natural ingredients stimulates appetite and boosts iron levels, promoting overall vitality and well-being. Rediscover your energy and zest for life with this trusted tonic."           },
  { id:4, name:"Edhec Be Stronge",           category:"Capsules",   price:40,  img: product4Image, desc:"Edhec Be Stronge is highly effective for general body pain, offering quick and lasting relief. Its natural formulation targets pain sources to provide soothing comfort and restore mobility. Experience enhanced well-being with this trusted solution."             },
  { id:5, name:"Edhec Malacure Mixture",    category:"Raw Herbs",  price:40,  img: product5Image, desc:"Edhec Herbal Malacure is a powerful solution for malaria, crafted to support effective recovery. Its unique herbal blend works synergistically to combat malaria symptoms and enhance overall health. With its natural approach, you can trust Edhec Herbal Malacure to restore your well-being and vitality safely and effectively."           },
  { id:6, name:"Edhec Herbal Laxative",       category:"Syrup",      price:40,  img: product6Image, desc:"Edhec Herbal Laxative is highly effective for relieving constipation and menstrual disorders. Its natural formula promotes regular bowel movements and supports menstrual health. Experience comfort and balance with this trusted herbal solution.."               },
  { id:7, name:"Edhec Herbal Cough Mixture", category:"Tea",        price:30,  img: product7Image, desc:"Edhec Herbal Cough Mixture is highly effective for relieving coughs. Its potent natural ingredients soothe the throat and reduce irritation, providing fast and lasting relief. Trust this herbal solution for effective cough relief."                   },
];

const TESTIMONIALS = [
  { name:"Mr. Emmanual Amoako",    condition:"Stroke", date:"March 2025",rating:5,text:"I had a stroke and as a final resort, I tried herbal treatment. To my surprise, the therapies enhanced my mobility and cognitive performance in addition to relieving my symptoms. I am appreciative of Doc. Edu's comprehensive herbal approach for helping me restore my quality of life."        },
  { name:"Mr. Majid",condition:"Hypertension",         date:"April 2026", rating:5,text:"Despite I had doubts about herbal medicine's ability to treat hypertension, I gave it a try out of desperation for relief. I was astounded that the customized herbal treatments not only reduced my symptoms but also markedly enhanced my general health, demonstrating the efficacy of alternative medicine."         },
  { name:"Adwoa Sarpong",        condition:"Low libido",       date:"May 2026",   rating:5,text:"Edu Herbal medicine transformed my life by addressing my low libido. I'm grateful for the holistic healing it offers. By meeting their professional doctors, I got my value back again."           },
];

const INITIAL_BLOG_POSTS = [
  { title:"7 Herbs That Naturally Lower Blood Sugar", category:"Diabetes", date:"28 June 2025", readTime:"5 min", excerpt:"Discover scientifically-backed herbal remedies that clinical trials show can meaningfully support healthy blood glucose levels.", image: news3 },
  { title:"Managing Hypertension Without Synthetic Drugs", category:"Heart Health", date:"15 June 2025", readTime:"7 min", excerpt:"High blood pressure doesn't always demand pharmaceutical intervention. Here's what lifestyle medicine and herbal protocols achieve.", image: news4 },
  { title:"The Complete Guide to Herbal Liver Detoxification", category:"Wellness", date:"3 June 2025", readTime:"6 min", excerpt:"A well-designed herbal detox supports liver, kidneys and lymphatic function simultaneously. Here is what actually works.", image: news5 },
];

type BlogPostData = (typeof INITIAL_BLOG_POSTS)[number];

const FAQS = [
  { q:"Do you treat stroke and neurological conditions?",a:"Yes. We have dedicated protocols for post-stroke rehabilitation, memory disorders and peripheral neuropathy, led by Dr. Edu Mohammed."                         },
  { q:"Do you treat diabetes and hypertension?",         a:"These are our most-treated conditions. We have well-established herbal protocols with documented clinical outcomes for both Type 2 Diabetes and essential hypertension."           },
  { q:"Can I book an appointment online?",               a:"Yes. Use our booking form to select your preferred doctor, date and time. Confirmation is sent instantly via SMS and WhatsApp."                                                    },
  { q:"What are your opening hours?",                    a:"Monday–Friday: 8:00 AM – 6:00 PM. Saturday: 9:00 AM – 3:00 PM. Sunday: Closed. Emergency WhatsApp consultations are available outside hours."                                    },
  { q:"Where are you located?",                          a:"Odorkor Official Town & Mankessim - Bafikrom. We also operate branches in Greater Accra and Mankessim."                                                                                       },
];

const INITIAL_HERO_SLIDES = [
  {
    badge: "EDHEC 'NKWA SOMBO'",
    eyebrow: "Evidence-based care",
    title: "Your Good\nHealth Is\n.Our Concern",
    description: "Evidence-based herbal medicine for diabetes, hypertension, skin conditions and more. Expert herbalists, digital records, 24/7 support.",
    stats: [["5,200+", "Patients Treated", G], ["16 yrs", "In Practice", OR], ["200+", "Herbal Formulas", R]],
    panelTitle: "Today at 2:00 PM",
    panelSubtitle: "Dr Edu Mohammed · Herbal Consult",
    panelAccent: G,
    background: G,
    image: carousel1,
    overlayText: "EDHEC",
    subText: "Edu Herbal Clinic",
    smallText: '"Your Good Health Is Our Concern"',
  },
  {
    badge: "Personalised Treatment Plans",
    eyebrow: "Book with confidence",
    title: "Modern herbal care, tailored to your needs.",
    description: "Choose your preferred doctor, book in minutes, and receive follow-up support through our connected care platform.",
    stats: [["24/7", "Support", G], ["Same Day", "Appointments", OR], ["NHIS", "Accepted", R]],
    panelTitle: "Next available",
    panelSubtitle: "Dr Prince · Hypertension Review",
    panelAccent: OR,
    background: OR,
    image: carousel2,
    overlayText: "CARE",
    subText: "Secure appointments",
    smallText: "Trusted specialists, flexible booking",
  },
  {
    badge: "Connected patient experience",
    eyebrow: "EDHEC 'NKWA SOMBO'",
    title: "From consultation to follow-up, all in one place.",
    description: "Track prescriptions, lab results, payments, and product orders through our digital patient portal.",
    stats: [["100%", "Digital Records", G], ["4.9/5", "Patient Rating", OR], ["Fast", "Refills", R]],
    panelTitle: "Patient Portal Ready",
    panelSubtitle: "Ama Owusu · Appointments & Records",
    panelAccent: R,
    background: R,
    image: carousel3,
    overlayText: "PORTAL",
    subText: "Your care journey",
    smallText: "Simple, secure and accessible",
  },
];

type HeroSlideData = (typeof INITIAL_HERO_SLIDES)[number];

const AWARD_GALLERY = [
  { src: news12, title: "Patient-Centred Care", caption: "Modern herbal care with a human touch" },
  { src: news3, title: "Clinical Presence", caption: "A polished, professional clinic experience" },
  { src: news4, title: "Wellness Focus", caption: "Holistic support for long-term wellness" },
  { src: news5, title: "Herbal Expertise", caption: "Evidence-led treatment and compassionate guidance" },
  { src: news6, title: "Trusted Team", caption: "Dedicated professionals behind every visit" },
  { src: news7, title: "Community Impact", caption: "Building healthier lives through care and education" },
  { src: news76, title: "Care in Action", caption: "A closer look at the clinic atmosphere" },
];

const PATIENTS = [
  { id:1, name:"Ama Owusu",       phone:"+233 24 456 7890", condition:"Diabetes Type 2", lastVisit:"30 Jun 2025", nextAppt:"14 Jul 2025", doctor:"Dr. Osei",       status:"Active",   balance:0,   products:["Edhec SM Bitters","Edhec Herbal Mixture"]     },
  { id:2, name:"Kofi Agyeman",    phone:"+233 20 123 4567", condition:"Hypertension",    lastVisit:"28 Jun 2025", nextAppt:"12 Jul 2025", doctor:"Dr. Al-Rashid",  status:"Active",   balance:150, products:["Edhec Be Stronge"]                       },
  { id:3, name:"Akosua Frimpong", phone:"+233 26 789 0123", condition:"Eczema",          lastVisit:"25 Jun 2025", nextAppt:"9 Jul 2025",  doctor:"Dr. Asante",     status:"Follow-up",balance:0,   products:["Edhec Herbal Tonic"]                       },
  { id:4, name:"Yaw Darko",       phone:"+233 54 234 5678", condition:"Liver Disease",   lastVisit:"20 Jun 2025", nextAppt:"Pending",     doctor:"Dr. Osei",       status:"Pending",  balance:250, products:["Edhec Malacure Mixture","Edhec Herbal Tonic"]           },
  { id:5, name:"Abena Mensah",    phone:"+233 27 890 1234", condition:"Arthritis",       lastVisit:"18 Jun 2025", nextAppt:"16 Jul 2025", doctor:"Dr. Asante",     status:"Active",   balance:0,   products:["Edhec Be Stronge","Edhec Herbal Laxative"]      },
  { id:6, name:"Kwesi Appiah",    phone:"+233 23 345 6789", condition:"Stroke Recovery", lastVisit:"15 Jun 2025", nextAppt:"8 Jul 2025",  doctor:"Dr. Al-Rashid",  status:"Active",   balance:80,  products:["Edhec Herbal Tonic","Edhec SM Bitters"]         },
];

const CALLS = [
  { id:1, patient:"Ama Owusu",      phone:"+233 24 456 7890", time:"09:14 AM", type:"incoming", duration:"4:32", status:"resolved",   note:"Called re Edhec SM Bitters refill. Confirmed pickup Thursday. Blood sugar stable at 8.1."         },
  { id:2, patient:"Kofi Agyeman",   phone:"+233 20 123 4567", time:"10:47 AM", type:"incoming", duration:"2:15", status:"resolved",   note:"Confirmed July 12 appointment. Reminded about medication timing with meals."               },
  { id:3, patient:"Yaw Darko",      phone:"+233 54 234 5678", time:"12:08 PM", type:"returned", duration:"6:50", status:"resolved",   note:"Discussed liver test results. Referred to Dr. Osei. Booked for 10 Jul."                   },
  { id:4, patient:"New Enquiry",    phone:"+233 27 554 3322", time:"01:35 PM", type:"incoming", duration:"3:18", status:"resolved",   note:"Inquired about stroke rehab. Directed to book with Dr. Al-Rashid."                        },
];

const SALES_DATA = [
  { month:"Jan", revenue:12400, patients:84  },
  { month:"Feb", revenue:14800, patients:97  },
  { month:"Mar", revenue:16200, patients:108 },
  { month:"Apr", revenue:13900, patients:91  },
  { month:"May", revenue:18700, patients:124 },
  { month:"Jun", revenue:21200, patients:142 },
  { month:"Jul", revenue:17800, patients:118 },
];

const TOP_PRODUCTS_DATA = PRODUCTS.slice(0, 5).map((product, index) => ({
  name: product.name,
  sold: 40 - index * 6,
  revenue: Math.max(product.price * (40 - index * 6), product.price * 10),
}));

const PIE_DATA = [
  { name:"Diabetes",    value:34, color:G  },
  { name:"Hypertension",value:28, color:OR },
  { name:"Skin/Derm",   value:16, color:R  },
  { name:"Arthritis",   value:12, color:"#2DA85A" },
  { name:"Other",       value:10, color:"#9CA3AF" },
];

const INVENTORY = PRODUCTS.map((product) => ({
  item: product.name,
  category: product.category,
  stock: 10,
  min: 5,
  unit: "units",
}));

const STAFF_LIST = [
  { name:"Dr Edu Mohammed",      role:"Chief Herbalist", dept:"Clinical",   status:"Present", schedule:"8AM–5PM"  },
  { name:"Dr Prince",role:"Cardiologist",    dept:"Clinical",   status:"Present", schedule:"9AM–6PM"  },
  { name:"Dr. Kwame Asante",    role:"Dermatologist",   dept:"Clinical",   status:"Leave",   schedule:"–"        },
  { name:"Abena Tawiah",        role:"Pharmacist",      dept:"Dispensary", status:"Present", schedule:"8AM–4PM"  },
  { name:"Kofi Boateng",        role:"Lab Technician",  dept:"Laboratory", status:"Present", schedule:"7AM–3PM"  },
  { name:"Grace Nyarko",        role:"Call Agent",      dept:"CRM",        status:"Present", schedule:"8AM–5PM"  },
  { name:"Michael Adu",         role:"IT & Systems",    dept:"Admin",      status:"Remote",  schedule:"Flexible" },
];

const EMPTY_BOOKING = {
  service:"",
  doctorId:-1,
  fullName:"",
  phone:"",
  email:"",
  notes:"",
  date:"",
  time:"",
};

const CHAT_KEYS: Record<string, string> = {
  location:     "We are at Odorkor Official Town & Mankessim - Bafikrom. Branches in Tema and Kumasi. 📍",
  open:         "We are open Mon–Fri 8 AM–6 PM and Saturday 9 AM–3 PM. Closed Sundays. 🕗",
  hours:        "Opening hours: Mon–Fri 8 AM–6 PM · Saturday 9 AM–3 PM · Sunday Closed.",
  consultation: "Initial consultation: GHS 250 (adults) · GHS 180 (children under 12). Follow-ups: GHS 150.",
  fee:          "Initial consultation: GHS 250 (adults) · GHS 180 (children). Follow-ups: GHS 150.",
  price:        "Herbal products range GHS 35–85. Consultations start at GHS 150.",
  cost:         "Initial consultation: GHS 250 (adults) · GHS 180 (children). Follow-ups: GHS 150.",
  book:         "Book online via our booking form on this page, or WhatsApp +233 055 837 9545. 📅",
  appointment:  "Use our online booking form above, or call +233 30 123 4567. 📅",
  diabetes:     "Yes! We specialise in herbal treatment for Type 2 Diabetes. Our Diabetox formula has excellent results. Book with Dr. Osei. 🌿",
  stroke:       "Yes — we offer post-stroke herbal rehabilitation. Dr. Al-Rashid leads our neuro-recovery programme.",
  hypertension: "Absolutely. We treat hypertension naturally. Many patients have reduced pharmaceutical dependency under our care. 💚",
  insurance:    "We accept NHIS and selected corporate plans. Call us for your specific provider.",
  default:      "Thank you! For detailed queries our team will assist. WhatsApp +233 055 837 9545 or call +233 30 123 4567. 🌿",
};

// ─── Tiny helpers ──────────────────────────────────────────────────────────

const Badge = ({ label, bg, text }: { label: string; bg: string; text: string }) => (
  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold" style={{ background: bg, color: text }}>{label}</span>
);

const statusStyle = (s: string) =>
  s === "Active"    ? { bg:"#dcfce7", text:"#15803d" } :
  s === "Pending"   ? { bg:"#fef9c3", text:"#854d0e" } :
  s === "Follow-up" ? { bg:"#dbeafe", text:"#1d4ed8" } :
  s === "Present"   ? { bg:"#dcfce7", text:"#15803d" } :
  s === "Leave"     ? { bg:"#fef9c3", text:"#854d0e" } :
  s === "Remote"    ? { bg:"#dbeafe", text:"#1d4ed8" } :
                      { bg:"#f3f4f6", text:"#6b7280" };

const HeroSlide = ({ slide }: { slide: HeroSlideData }) => (
  <div className="flex min-h-[90vh] w-full shrink-0 flex-col lg:grid lg:grid-cols-2">
    <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20">
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-8 w-fit border"
        style={{ background:`${G}12`, borderColor:`${G}30`, color:G }}>
        <Leaf className="w-3.5 h-3.5" /> {slide.badge}
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: OR }}>{slide.eyebrow}</p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] mb-6 text-gray-900 whitespace-pre-line">
        {slide.title}
      </h1>

      <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
        {slide.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <a href="#book" className="text-white px-7 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-opacity hover:opacity-90"
          style={{ background:G, boxShadow:`0 8px 24px ${G}35` }}>
          <Calendar className="w-5 h-5" /> Book Appointment
        </a>
        <a href="https://wa.me/2330558379545"
          className="px-7 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 border-2 transition-colors hover:bg-green-50"
          style={{ borderColor:"#25D366", color:"#128C7E" }}>
          <MessageCircle className="w-5 h-5 text-[#25D366]" /> WhatsApp Us
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-8 border-t border-gray-100 sm:grid-cols-3">
        {slide.stats.map(([n, label, color]) => (
          <div key={label as string}>
            <p className="font-display text-2xl font-bold" style={{ color: color as string }}>{n}</p>
            <p className="text-gray-400 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="relative order-first overflow-hidden min-h-[45vh] sm:min-h-[50vh] lg:order-none lg:min-h-0" style={{ background: slide.background }}>
      <div className="absolute inset-0 z-0 overflow-hidden bg-white">
        <ImageWithFallback
          src={slide.image}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
          style={{ imageRendering: "auto", transform: "scale(1.03)" }}
        />
      </div>

      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(90deg, rgba(28,122,58,0.55) 0%, rgba(28,122,58,0.2) 45%, rgba(28,122,58,0.05) 100%)" }} />

      <div className="absolute inset-0 z-20 flex items-end justify-start p-4 sm:hidden">
        <div className="min-w-0 max-w-[220px] rounded-2xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
          <p className="font-bold text-sm text-white">{slide.panelTitle}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-green-200">{slide.panelSubtitle}</p>
        </div>
      </div>

      <div className="relative z-20 mt-8 mx-auto mb-4 hidden bg-white rounded-2xl p-4 shadow-2xl max-w-[240px] sm:absolute sm:bottom-6 sm:left-6 sm:right-auto sm:mt-0 sm:mb-0 sm:max-w-[220px] sm:block">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:`${slide.panelAccent}18` }}>
            <CheckCircle className="w-4 h-4" style={{ color:slide.panelAccent }} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{slide.panelTitle}</p>
            <p className="text-xs font-semibold" style={{ color:slide.panelAccent }}>Available Now</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">{slide.panelSubtitle}</p>
      </div>

      <div className="absolute top-6 left-6 z-20 rounded-xl px-3 py-2" style={{ background:"rgba(0,0,0,0.35)" }}>
        <div className="flex items-center gap-2 text-white text-xs font-medium">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:"#4ade80" }} />
          AI Chat · 24/7
        </div>
      </div>
    </div>
  </div>
);

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const getStoredCrmPatients = () => {
    if (typeof window === "undefined") return PATIENTS;
    try {
      const stored = window.localStorage.getItem("eduCrmPatients");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed) && parsed.length) {
        return parsed as PatientEntry[];
      }
    } catch {
      // fall back to defaults
    }
    return PATIENTS;
  };

  const getStoredHeroSlides = () => {
    if (typeof window === "undefined") return INITIAL_HERO_SLIDES;
    try {
      const stored = window.localStorage.getItem("eduHeroSlides");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed) && parsed.length) {
        return parsed as HeroSlideData[];
      }
    } catch {
      // fall back to defaults
    }
    return INITIAL_HERO_SLIDES;
  };

  const getStoredBlogPosts = () => {
    if (typeof window === "undefined") return INITIAL_BLOG_POSTS;
    try {
      const stored = window.localStorage.getItem("eduBlogPosts");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed) && parsed.length) {
        return parsed as BlogPostData[];
      }
    } catch {
      // fall back to defaults
    }
    return INITIAL_BLOG_POSTS;
  };

  const getStoredPatientAppointments = () => {
    if (typeof window === "undefined") return [] as PatientAppointment[];
    try {
      const stored = window.localStorage.getItem("eduPatientAppointments");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed)) {
        return parsed as PatientAppointment[];
      }
    } catch {
      // fall back to empty
    }
    return [] as PatientAppointment[];
  };

  const prunePatientPayments = (payments: PatientPayment[]) => {
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const filtered = payments.filter(payment => {
      const parsedTime = Date.parse(payment.createdAt || "");
      if (!Number.isFinite(parsedTime)) {
        return false;
      }
      return parsedTime >= twoWeeksAgo;
    });

    return filtered
      .sort((a, b) => {
        const aTime = Date.parse(a.createdAt || "");
        const bTime = Date.parse(b.createdAt || "");
        return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
      })
      .slice(0, 3);
  };

  const getStoredPatientPayments = () => {
    if (typeof window === "undefined") return [] as PatientPayment[];
    try {
      const stored = window.localStorage.getItem("eduPatientPayments");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed)) {
        return prunePatientPayments(parsed as PatientPayment[]);
      }
    } catch {
      // fall back to empty
    }
    return [] as PatientPayment[];
  };

  const getStoredPatientOrders = () => {
    if (typeof window === "undefined") return [] as PatientOrder[];
    try {
      const stored = window.localStorage.getItem("eduPatientOrders");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed)) {
        return parsed as PatientOrder[];
      }
    } catch {
      // fall back to empty
    }
    return [] as PatientOrder[];
  };

  const getStoredMonthlyReports = () => {
    if (typeof window === "undefined") return [] as MonthlyReport[];
    try {
      const stored = window.localStorage.getItem("eduMonthlyReports");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed)) {
        return parsed as MonthlyReport[];
      }
    } catch {
      // fall back to empty
    }
    return [] as MonthlyReport[];
  };

  const getStoredCallLogs = () => {
    if (typeof window === "undefined") return CALLS;
    try {
      const stored = window.localStorage.getItem("eduCallLogs");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed) && parsed.length) {
        return parsed as typeof CALLS;
      }
    } catch {
      // fall back to default seed data
    }
    return CALLS;
  };

  const getStoredInventory = () => {
    if (typeof window === "undefined") return INVENTORY;
    try {
      const stored = window.localStorage.getItem("eduInventory");
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed) && parsed.length) {
        return parsed as typeof INVENTORY;
      }
    } catch {
      // fall back to default seed data
    }
    return INVENTORY;
  };

  const [view,          setView         ] = useState<View>("public");
  const [menuOpen,      setMenuOpen     ] = useState(false);
  const [isDarkMode,    setIsDarkMode   ] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem("eduDarkMode") === "true";
    } catch {
      return false;
    }
  });
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("eduDarkMode", String(next));
      }
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
        document.documentElement.style.colorScheme = next ? "dark" : "light";
      }
      return next;
    });
  };
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDarkMode);
      document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("eduDarkMode", String(isDarkMode));
    }
  }, [isDarkMode]);
  const [bookingStep,   setBookingStep  ] = useState(0);
  const [activeFaq,     setActiveFaq    ] = useState<number | null>(null);
  const [booking,       setBooking      ] = useState(EMPTY_BOOKING);
  const [bookingDone,   setBookingDone  ] = useState(false);
  const [bookingSmsStatus, setBookingSmsStatus] = useState<string | null>(null);
  const [crmPatients,   setCrmPatients  ] = useState<PatientEntry[]>(getStoredCrmPatients);
  const [selPatient,    setSelPatient   ] = useState<PatientEntry | null>(null);
  const [callNotes,     setCallNotes    ] = useState<Record<number,string>>({});
  const [editingCallNoteId, setEditingCallNoteId] = useState<number | null>(null);
  const [callLogEntries, setCallLogEntries] = useState(getStoredCallLogs);
  const [chatOpen,      setChatOpen     ] = useState(false);
  const [chatInput,     setChatInput    ] = useState("");
  const [chatMessages,  setChatMessages ] = useState([{ role:"bot", text:"Hello! I am EduBot, your 24/7 assistant at Edu Herbal Clinic. How can I help you today? 🌿" }]);
  const [adminTab,      setAdminTab     ] = useState<AdminTab>("overview");
  const [patientTab,    setPatientTab   ] = useState("orders");
  const [cart,          setCart         ] = useState<Record<number,number>>({});
  const [staffFilter,   setStaffFilter  ] = useState<"Present" | "Leave" | "Remote" | null>(null);
  const filteredStaff = staffFilter ? STAFF_LIST.filter(member => member.status === staffFilter) : STAFF_LIST;
  const [searchCRM,     setSearchCRM    ] = useState("");
  const [searchCalls,   setSearchCalls  ] = useState("");
  const [crmNewPatientOpen, setCrmNewPatientOpen] = useState(false);
  const [crmNewPatientData, setCrmNewPatientData] = useState({
    name: "",
    phone: "",
    condition: "",
    doctorId: DOCTORS[0].id,
    date: "",
    time: "",
  });
  const [inventoryItems, setInventoryItems] = useState(getStoredInventory);
  const [inventoryFormOpen, setInventoryFormOpen] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [inventoryFormData, setInventoryFormData] = useState({
    item: PRODUCTS[0]?.name || "",
    category: PRODUCTS[0]?.category || "",
    stock: "10",
    min: "5",
    unit: "units",
  });
  const [selectedTopSellingProductName, setSelectedTopSellingProductName] = useState<string | null>(null);
  const [reportHistoryOpen, setReportHistoryOpen] = useState(false);
  const [awardIndex,    setAwardIndex   ] = useState(0);
  const [heroIndex,     setHeroIndex    ] = useState(0);
  const [blogIndex,     setBlogIndex    ] = useState(0);
  const [blogAutoPlaying, setBlogAutoPlaying] = useState(true);
  const [blogEditorOpen, setBlogEditorOpen] = useState(false);
  const [blogDraftPosts, setBlogDraftPosts] = useState<BlogPostData[]>(getStoredBlogPosts);
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>(getStoredBlogPosts);
  const [blogSaveMessage, setBlogSaveMessage] = useState<string | null>(null);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlideData[]>(getStoredHeroSlides);
  const [heroDraftSlides, setHeroDraftSlides] = useState<HeroSlideData[]>(getStoredHeroSlides);
  const [patientAppointments, setPatientAppointments] = useState<PatientAppointment[]>(getStoredPatientAppointments);
  const [patientPayments, setPatientPayments] = useState<PatientPayment[]>(() => prunePatientPayments(getStoredPatientPayments()));
  const [patientOrders, setPatientOrders] = useState<PatientOrder[]>(getStoredPatientOrders);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>(getStoredMonthlyReports);
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");
  const [paymentRecipientName, setPaymentRecipientName] = useState("");
  const [paymentRecipientNumber, setPaymentRecipientNumber] = useState("");
  const [paymentPromptOpen, setPaymentPromptOpen] = useState(false);
  const [paymentPromptMethod, setPaymentPromptMethod] = useState<string | null>(null);
  const [paymentPromptName, setPaymentPromptName] = useState("");
  const [paymentPromptNumber, setPaymentPromptNumber] = useState("");
  const [paymentPromptError, setPaymentPromptError] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [heroEditorOpen, setHeroEditorOpen] = useState(false);
  const [heroSaveMessage, setHeroSaveMessage] = useState<string | null>(null);
  const [selectedHeroPreviewIndex, setSelectedHeroPreviewIndex] = useState(0);
  const [selectedBlogPreviewIndex, setSelectedBlogPreviewIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [activeMapLocation, setActiveMapLocation] = useState<{ title:string; subtitle:string; address:string; desc:string; buttonLabel:string; accent:string; embedUrl:string } | null>(null);
  const [facebookModalOpen, setFacebookModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const locationCards = [
    {
      title: "Edu Herbal Clinic",
      subtitle: "Odorkor Official Town",
      address: "Odorkor Official Town & Mankessim - Bafikrom",
      desc: "A welcoming branch in the heart of Odorkor with accessible care and consultation support.",
      buttonLabel: "View on Maps",
      accent: G,
      embedUrl: "https://www.google.com/maps?q=Edu%20Herbal%20Clinic%20Odorkor%20Official%20Town%20Accra&output=embed",
    },
    {
      title: "Mankessim - Bafikrom",
      subtitle: "Branch Office",
      address: "Odorkor Official Town & Mankessim - Bafikrom",
      desc: "Our regional branch serving patients with dedicated support and herbal wellness services.",
      buttonLabel: "View on Maps",
      accent: OR,
      embedUrl: "https://www.google.com/maps?q=Mankessim%20Bafikrom&output=embed",
    },
  ];

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  useEffect(() => {
    if (!blogAutoPlaying) return;
    const timer = window.setInterval(() => {
      setBlogIndex((prev) => (prev + 1) % Math.max(blogPosts.length, 1));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [blogAutoPlaying, blogPosts.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (path === "/admin") {
      setView("admin");
    } else if (path === "/patient") {
      setView("patient");
    } else {
      setView("public");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = view === "admin" ? "/admin" : view === "patient" ? "/patient" : "/";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  }, [view]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAwardIndex((prev) => (prev + 1) % AWARD_GALLERY.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [AWARD_GALLERY.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => prev + 1);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (heroIndex === heroSlides.length) {
      const timer = window.setTimeout(() => {
        setIsHeroTransitioning(false);
        setHeroIndex(0);
      }, 700);
      return () => window.clearTimeout(timer);
    }
    setIsHeroTransitioning(true);
  }, [heroIndex]);

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    };
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduHeroSlides", JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduBlogPosts", JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduCrmPatients", JSON.stringify(crmPatients));
  }, [crmPatients]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduPatientAppointments", JSON.stringify(patientAppointments));
  }, [patientAppointments]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduPatientPayments", JSON.stringify(patientPayments));
  }, [patientPayments]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduPatientOrders", JSON.stringify(patientOrders));
  }, [patientOrders]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduMonthlyReports", JSON.stringify(monthlyReports));
  }, [monthlyReports]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduCallLogs", JSON.stringify(callLogEntries));
  }, [callLogEntries]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduInventory", JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    if (!selPatient && crmPatients.length > 0) {
      setSelPatient(crmPatients[0]);
    }
  }, [crmPatients, selPatient]);

  useEffect(() => {
    if (!heroSaveMessage) return;
    const timer = window.setTimeout(() => setHeroSaveMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [heroSaveMessage]);

  useEffect(() => {
    if (!blogSaveMessage) return;
    const timer = window.setTimeout(() => setBlogSaveMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [blogSaveMessage]);

  useEffect(() => {
    if (!bookingSmsStatus) return;
    const timer = window.setTimeout(() => setBookingSmsStatus(null), 3200);
    return () => window.clearTimeout(timer);
  }, [bookingSmsStatus]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput; setChatInput("");
    setChatMessages(p => [...p, { role:"user", text:msg }]);
    const key = Object.keys(CHAT_KEYS).find(k => msg.toLowerCase().includes(k)) || "default";
    setTimeout(() => setChatMessages(p => [...p, { role:"bot", text:CHAT_KEYS[key] }]), 650);
  };

  const canContinue = bookingStep === 0
    ? Boolean(booking.service)
    : bookingStep === 1
      ? booking.doctorId !== -1
      : bookingStep === 2
        ? Boolean(booking.fullName.trim() && booking.phone.trim() && booking.email.trim())
        : bookingStep === 3
          ? Boolean(booking.date && booking.time)
          : true;

  const handleAdminLogin = () => {
    if (adminUsername.trim().toLowerCase() === "admin" && adminPassword === "1234") {
      setAdminAuthenticated(true);
      setAdminLoginError("");
    } else {
      setAdminLoginError("Invalid username or password");
    }
  };

  const addPatientAppointment = (appointment: Omit<PatientAppointment, "id" | "createdAt">) => {
    const entry: PatientAppointment = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...appointment,
    };

    setPatientAppointments(prev => {
      const next = [entry, ...prev];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("eduPatientAppointments", JSON.stringify(next));
      }
      return next;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId]) {
        newCart[productId] -= 1;
        if (newCart[productId] <= 0) {
          delete newCart[productId];
        }
      }
      return newCart;
    });
  };

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (quantity <= 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = quantity;
      }
      return newCart;
    });
  };

  const formatPaymentNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9+]/g, "").trim();
    if (!cleaned) return "";
    if (cleaned.startsWith("+233")) return cleaned;
    if (cleaned.startsWith("233")) return `+${cleaned}`;
    if (cleaned.startsWith("0")) return `+233${cleaned.slice(1)}`;
    return `+233${cleaned}`;
  };

  const isValidPaymentNumber = (value: string) => {
    const formatted = formatPaymentNumber(value);
    return /^(\+233|233|0)\d{9}$/.test(formatted);
  };

  const openPaymentPrompt = (method: string) => {
    setPaymentPromptMethod(method);
    setPaymentPromptName(paymentRecipientName);
    setPaymentPromptNumber(paymentRecipientNumber);
    setPaymentPromptError(null);
    setPaymentPromptOpen(true);
  };

  const finalizeCheckout = (overrides?: { method?: string; recipientName?: string; recipientNumber?: string }) => {
    const cartItems = Object.entries(cart);
    if (cartItems.length === 0) {
      setCheckoutMessage("Payment unsuccessful. Your cart is empty.");
      return;
    }

    const selectedMethod = overrides?.method ?? paymentMethod;
    const selectedName = overrides?.recipientName ?? paymentRecipientName;
    const selectedNumber = overrides?.recipientNumber ?? paymentRecipientNumber;

    const supportedMethods = ["Mobile Money", "Telecel Cash"];
    if (!supportedMethods.includes(selectedMethod)) {
      setCheckoutMessage("Payment unsuccessful. Please choose Mobile Money or Telecel Cash.");
      return;
    }

    if (!selectedName || !selectedNumber) {
      const message = "Payment unsuccessful. Please confirm your full name and phone number.";
      setCheckoutMessage(message);
      return;
    }

    const selectedItems = cartItems.map(([id, qty]) => ({
      product: PRODUCTS.find(p => p.id === Number(id)),
      quantity: qty,
    })).filter(item => item.product);

    const total = selectedItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const description = selectedItems.map(item => `${item.product?.name} (x${item.quantity})`).join(", ");
    const trimmedDescription = description.length > 90 ? `${description.slice(0, 87)}...` : description;
    const paymentEntry: PatientPayment = {
      id: Date.now(),
      description: trimmedDescription,
      amount: total,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      method: selectedMethod,
      status: "Paid",
      recipientName: selectedName,
      recipientNumber: selectedNumber,
      createdAt: new Date().toISOString(),
    };

    const orderEntry: PatientOrder = {
      id: Date.now() + 1,
      description: trimmedDescription,
      amount: total,
      date: paymentEntry.date,
      method: selectedMethod,
      items: selectedItems.map(item => ({
        name: item.product?.name || "Medicine",
        quantity: item.quantity,
        price: item.product?.price || 0,
      })),
      createdAt: new Date().toISOString(),
    };

    setPaymentMethod(selectedMethod);
    setPaymentRecipientName(selectedName);
    setPaymentRecipientNumber(selectedNumber);
    setPatientPayments(prev => prunePatientPayments([paymentEntry, ...prev]));
    setPatientOrders(prev => [orderEntry, ...prev]);
    setCart({});
    const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    setCheckoutMessage(`Payment successful. ${totalItems} medication item(s) have been added to your payment history.`);
    setView("patient");
    setPatientTab("orders");
  };

  const confirmPaymentDetails = () => {
    const fullName = paymentPromptName.trim();
    const numberInput = paymentPromptNumber.trim();

    if (!fullName) {
      setPaymentPromptError("Full name is required to continue.");
      return;
    }

    if (!numberInput) {
      setPaymentPromptError("Phone number is required to continue.");
      return;
    }

    if (!isValidPaymentNumber(numberInput)) {
      const message = "The phone number is not valid. Use a Ghana number such as 0241234567.";
      setPaymentPromptError(message);
      return;
    }

    const formattedNumber = formatPaymentNumber(numberInput);
    setPaymentMethod(paymentPromptMethod || "Mobile Money");
    setPaymentRecipientName(fullName);
    setPaymentRecipientNumber(formattedNumber);
    setPaymentPromptOpen(false);
    setPaymentPromptError(null);
    finalizeCheckout({
      method: paymentPromptMethod || "Mobile Money",
      recipientName: fullName,
      recipientNumber: formattedNumber,
    });
  };

  const handleCheckout = () => {
    setView("patient");
    setPatientTab("orders");
    setCheckoutMessage(null);
  };

  const sendAppointmentSms = (bookingData: { fullName?: string; phone?: string; service?: string; doctorId?: number; date?: string; time?: string }) => {
    if (typeof window === "undefined") return;

    const doctorName = DOCTORS.find(d => d.id === bookingData.doctorId)?.name ?? "our doctor";
    const appointmentDate = bookingData.date || "your selected date";
    const appointmentTime = bookingData.time || "your selected time";
    const service = bookingData.service || "your appointment";
    const fullName = (bookingData.fullName || "").trim() || "there";
    const hospitalNumber = "+233 30 123 4567";
    const message = `Hello ${fullName}, we have received and confirmed your appointment at Edu Herbal Clinic. Your appointment with ${doctorName} is scheduled for ${appointmentDate} at ${appointmentTime}. For questions call ${hospitalNumber}.`;
    const encodedMessage = encodeURIComponent(message);
    const target = (bookingData.phone || "").trim() ? `sms:${(bookingData.phone || "").trim()}?body=${encodedMessage}` : `sms:?body=${encodedMessage}`;

    const smsWindow = window.open(target, "_blank", "noopener,noreferrer");
    if (!smsWindow) {
      window.location.href = target;
    }

    return message;
  };

  const normalizeDialPhone = (value: string) => {
    const fallback = (value || "").trim();
    if (!fallback) return "";
    const digitsOnly = fallback.replace(/\D/g, "");
    if (!digitsOnly) return "";
    if (digitsOnly.startsWith("233") && fallback.startsWith("+")) return `+${digitsOnly}`;
    if (digitsOnly.startsWith("233")) return `+${digitsOnly}`;
    if (digitsOnly.startsWith("0")) return `+233${digitsOnly.slice(1)}`;
    if (digitsOnly.length === 9) return `+233${digitsOnly}`;
    return fallback.startsWith("+") ? fallback : `+${digitsOnly}`;
  };

  const logCallAction = async (phone: string, patientName?: string, mode: "phone" | "whatsapp" = "phone") => {
    const cleanedPhone = normalizeDialPhone(phone || "");
    const friendlyMode = mode === "whatsapp" ? "WhatsApp" : "Phone";
    const attemptedAt = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setCrmPatients(prev => prev.map(patient => {
      if (patient.phone === cleanedPhone || patient.name === patientName) {
        return {
          ...patient,
          lastCallAt: attemptedAt,
          callCount: (patient.callCount || 0) + 1,
          lastCallMode: friendlyMode as PatientEntry["lastCallMode"],
        };
      }
      return patient;
    }));

    setCallLogEntries(prev => {
      const existing = prev.find(call => call.patient === patientName || call.phone === cleanedPhone);
      if (existing) {
        return prev.map(call => call.id === existing.id ? {
          ...call,
          status: "unresolved",
          note: `${call.note ? `${call.note} ` : ""}${friendlyMode} attempt logged at ${attemptedAt}.`,
        } : call);
      }

      return [{
        id: Date.now(),
        patient: patientName || "Patient",
        phone: cleanedPhone || "+233 055 837 9545",
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        type: "incoming",
        duration: "0:00",
        status: "unresolved",
        note: `${friendlyMode} attempt logged at ${attemptedAt}.`,
      }, ...prev];
    });

    try {
      const response = await fetch("http://localhost:3001/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName: patientName || "Patient", phone: cleanedPhone, mode: friendlyMode, attemptedAt }),
      });
      const data = await response.json().catch(() => null);
      setBookingSmsStatus(data?.message || `${friendlyMode} channel opened for ${patientName || "the patient"}.`);
    } catch {
      setBookingSmsStatus(`${friendlyMode} channel prepared for ${patientName || "the patient"}.`);
    }
  };

  const initiatePatientCall = (phone: string, patientName?: string) => {
    if (typeof window === "undefined") return;
    const cleanedPhone = normalizeDialPhone(phone || "");
    if (!cleanedPhone) {
      setBookingSmsStatus("No phone number is available for this patient.");
      return;
    }

    const telUrl = `tel:${cleanedPhone}`;
    try {
      const dialerWindow = window.open(telUrl, "_self", "noopener,noreferrer");
      if (!dialerWindow) {
        window.location.href = telUrl;
      }
    } catch {
      window.location.href = telUrl;
    }
    setBookingSmsStatus(`Call action started for ${patientName || "the patient"}. Dialing ${cleanedPhone}.`);
    void logCallAction(cleanedPhone, patientName, "phone");
  };

  const getWhatsAppChatUrl = (phone: string) => {
    const cleanedPhone = normalizeDialPhone(phone || "");
    if (!cleanedPhone) return "";
    const normalizedPhone = cleanedPhone.startsWith("+") ? cleanedPhone.replace(/\+/g, "") : cleanedPhone.replace(/^0/, "233");
    return `https://wa.me/${normalizedPhone}`;
  };

  const openPatientWhatsApp = (phone: string, patientName?: string) => {
    if (typeof window === "undefined") return;
    const cleanedPhone = normalizeDialPhone(phone || "");
    if (!cleanedPhone) {
      setBookingSmsStatus("No phone number is available for this patient.");
      return;
    }

    const whatsappUrl = getWhatsAppChatUrl(cleanedPhone);
    if (!whatsappUrl) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setBookingSmsStatus(`Opening WhatsApp chat with ${patientName || "the patient"} on ${cleanedPhone}.`);
    void logCallAction(cleanedPhone, patientName, "whatsapp");
  };

  const getWhatsAppQrUrl = (phone: string) => {
    const whatsappUrl = getWhatsAppChatUrl(phone);
    if (!whatsappUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(whatsappUrl)}`;
  };

  const markQrScanned = (callId: number, patientName?: string, phone?: string) => {
    const attemptedAt = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const scanNote = `QR scan completed at ${attemptedAt}.`;
    setCallLogEntries(prev => prev.map(call => call.id === callId ? {
      ...call,
      note: `${call.note ? `${call.note} ` : ""}${scanNote}`,
      status: "unresolved",
    } : call));
    setCallNotes(prev => ({ ...prev, [callId]: `${(prev[callId] || "").trim()} ${scanNote}`.trim() }));
    setBookingSmsStatus(`QR scan recorded for ${patientName || "the patient"}.`);
    void logCallAction(phone || "", patientName, "whatsapp");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const shouldProcessScan = params.get("qrScan") === "1";
    if (!shouldProcessScan) return;

    const callId = Number(params.get("callId"));
    const phone = params.get("phone") || "";
    const patientName = params.get("patient") || "Patient";
    const targetCall = callId ? callLogEntries.find(call => call.id === callId) : null;

    if (targetCall) {
      markQrScanned(callId, patientName, phone);
      const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

    const nextUrl = window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
  }, [callLogEntries]);

  const createCallCentreEntry = (bookingData: { fullName?: string; phone?: string; service?: string; date?: string; time?: string; notes?: string }) => {
    const patientName = (bookingData.fullName || "").trim() || "New Patient";
    const service = (bookingData.service || "Appointment").trim();
    const isTelemedicine = /telemedicine/i.test(service);
    const patientPhone = normalizeDialPhone(bookingData.phone || "");
    const phone = patientPhone || (isTelemedicine ? normalizeDialPhone("0558379545") : "+233240000000");
    const dateLabel = bookingData.date || "Pending";
    const timeLabel = bookingData.time || "Pending";
    const noteParts = [
      isTelemedicine ? `Telemedicine request received for ${service}.` : `Appointment request received for ${service}.`,
      bookingData.notes ? `Note: ${bookingData.notes}` : "",
      patientPhone ? `Patient phone: ${patientPhone}` : "",
      `Preferred slot: ${dateLabel} at ${timeLabel}`,
    ].filter(Boolean);

    setCallLogEntries(prev => [{
      id: Date.now(),
      patient: patientName,
      phone,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      type: "incoming",
      duration: "0:00",
      status: "unresolved",
      note: noteParts.join(" "),
    }, ...prev]);
  };

  const handleAdminBookAppointment = (patient: PatientEntry) => {
    if (typeof window === "undefined") return;

    const defaultDoctor = DOCTORS.find(d => d.name === patient.doctor) ?? DOCTORS[0];
    const [existingDate, existingTime] = patient.nextAppt.includes("·")
      ? patient.nextAppt.split("·").map(part => part.trim())
      : ["", ""];

    const appointmentDate = window.prompt("Enter appointment date", existingDate || "")?.trim();
    const appointmentTime = window.prompt("Enter appointment time", existingTime || "10:00 AM")?.trim();

    if (!appointmentDate || !appointmentTime) return;

    const updatedPatient = {
      ...patient,
      nextAppt: `${appointmentDate} · ${appointmentTime}`,
      doctor: defaultDoctor.name,
      status: "Pending",
    } as PatientEntry;

    setCrmPatients(prev => prev.map(item => item.id === patient.id ? updatedPatient : item));
    setSelPatient(updatedPatient);
    addPatientAppointment({
      patientName: patient.name,
      phone: patient.phone,
      service: patient.condition,
      doctor: defaultDoctor.name,
      date: appointmentDate,
      time: appointmentTime,
      status: "Confirmed",
    });
    sendAppointmentSms({
      fullName: patient.name,
      phone: patient.phone,
      service: patient.condition,
      doctorId: defaultDoctor.id,
      date: appointmentDate,
      time: appointmentTime,
    });
    setBookingSmsStatus("Appointment booked for the patient and confirmation SMS prepared.");
  };

  const handleCreateNewPatient = () => {
    if (!crmNewPatientData.name.trim() || !crmNewPatientData.phone.trim() || !crmNewPatientData.condition.trim() || !crmNewPatientData.date || !crmNewPatientData.time) {
      setBookingSmsStatus("Please complete all patient and appointment fields.");
      return;
    }

    const selectedDoctor = DOCTORS.find(d => d.id === crmNewPatientData.doctorId) ?? DOCTORS[0];
    const newPatient: PatientEntry = {
      id: Date.now(),
      name: crmNewPatientData.name.trim(),
      phone: crmNewPatientData.phone.trim(),
      condition: crmNewPatientData.condition.trim(),
      lastVisit: "Just added",
      nextAppt: `${crmNewPatientData.date} · ${crmNewPatientData.time}`,
      doctor: selectedDoctor.name,
      status: "Pending",
      balance: 0,
      products: [crmNewPatientData.condition.trim()],
    };

    setCrmPatients(prev => [newPatient, ...prev]);
    setSelPatient(newPatient);
    addPatientAppointment({
      patientName: newPatient.name,
      phone: newPatient.phone,
      service: newPatient.condition,
      doctor: selectedDoctor.name,
      date: crmNewPatientData.date,
      time: crmNewPatientData.time,
      status: "Confirmed",
    });
    sendAppointmentSms({
      fullName: newPatient.name,
      phone: newPatient.phone,
      service: newPatient.condition,
      doctorId: selectedDoctor.id,
      date: crmNewPatientData.date,
      time: crmNewPatientData.time,
    });
    setBookingSmsStatus("New patient created and appointment confirmation SMS prepared.");
    setCrmNewPatientData({ name:"", phone:"", condition:"", doctorId: DOCTORS[0].id, date:"", time:"" });
    setCrmNewPatientOpen(false);
  };

  const advanceBooking = () => {
    if (!canContinue) return;
    if (bookingStep < 4) {
      setBookingStep(s => s + 1);
      return;
    }

    const confirmedBooking = { ...booking };
    const selectedDoctorName = DOCTORS.find(d => d.id === booking.doctorId)?.name ?? "Dr. Osei";
    const isTelemedicine = /telemedicine/i.test(confirmedBooking.service || "");

    if (isTelemedicine) {
      createCallCentreEntry({
        fullName: confirmedBooking.fullName,
        phone: confirmedBooking.phone,
        service: confirmedBooking.service,
        date: confirmedBooking.date,
        time: confirmedBooking.time,
        notes: confirmedBooking.notes,
      });
      setBookingSmsStatus("Telemedicine request received and routed to the Call Centre.");
      setBookingDone(true);
      setBookingStep(0);
      setBooking({ ...EMPTY_BOOKING });
      return;
    }

    const newPatient: PatientEntry = {
      id: Date.now(),
      name: booking.fullName.trim() || "New Patient",
      phone: booking.phone.trim() || "+233 24 000 0000",
      condition: booking.service || "New Booking",
      lastVisit: "Just booked",
      nextAppt: booking.date ? `${booking.date} · ${booking.time}` : "Pending",
      doctor: selectedDoctorName,
      status: "Pending",
      balance: 0,
      products: booking.service ? [booking.service] : [],
    };

    setCrmPatients(prev => {
      const nextPatients = [newPatient, ...prev];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("eduCrmPatients", JSON.stringify(nextPatients));
      }
      return nextPatients;
    });
    setSelPatient(newPatient);
    addPatientAppointment({
      patientName: confirmedBooking.fullName.trim() || "New Patient",
      phone: confirmedBooking.phone.trim() || "+233 24 000 0000",
      service: confirmedBooking.service || "New Booking",
      doctor: selectedDoctorName,
      date: confirmedBooking.date || "Pending",
      time: confirmedBooking.time || "Pending",
      status: "Confirmed",
    });
    sendAppointmentSms(confirmedBooking);
    setBookingSmsStatus("Appointment confirmation SMS prepared for the patient.");
    setBookingDone(true);
    setBookingStep(0);
    setBooking({ ...EMPTY_BOOKING });
  };

  const INVENTORY_SAFETY_THRESHOLD = 35;
  const lowStock        = inventoryItems.filter(i => i.stock < INVENTORY_SAFETY_THRESHOLD);
  const followUpCount   = crmPatients.filter(p => p.status === "Follow-up" || p.status === "Pending").length;
  const callbackReviewCount = callLogEntries.filter(c => c.status === "unresolved").length;

  const normalizeDateString = (dateStr: string) => {
    if (!dateStr) return null;
    const parsed = Date.parse(dateStr);
    return Number.isFinite(parsed) ? new Date(parsed) : null;
  };

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const weekStart = (() => {
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  })();

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const paymentsWithDate = patientPayments
    .map(payment => ({
      ...payment,
      parsedDate: normalizeDateString(payment.date) || normalizeDateString(payment.createdAt),
    }))
    .filter(payment => payment.parsedDate !== null);

  const paymentsToday = paymentsWithDate.filter(payment => payment.parsedDate?.toISOString().split("T")[0] === todayDate);
  const paymentsYesterday = paymentsWithDate.filter(payment => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return payment.parsedDate?.toISOString().split("T")[0] === yesterday.toISOString().split("T")[0];
  });
  const paymentsThisWeek = paymentsWithDate.filter(payment =>
    payment.parsedDate! >= weekStart && payment.parsedDate! <= today
  );
  const paymentsLastWeek = paymentsWithDate.filter(payment => {
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(weekStart.getDate() - 7);
    const lastWeekEnd = new Date(weekStart);
    lastWeekEnd.setDate(weekStart.getDate() - 1);
    return payment.parsedDate! >= lastWeekStart && payment.parsedDate! <= lastWeekEnd;
  });
  const paymentsThisMonth = paymentsWithDate.filter(payment =>
    payment.parsedDate! >= monthStart && payment.parsedDate! <= monthEnd
  );

  const totalRevenue = (payments: typeof paymentsWithDate) => payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const todayRevenue = totalRevenue(paymentsToday);
  const yesterdayRevenue = totalRevenue(paymentsYesterday);
  const weekRevenue = totalRevenue(paymentsThisWeek);
  const lastWeekRevenue = totalRevenue(paymentsLastWeek);
  const monthRevenue = totalRevenue(paymentsThisMonth);

  const revenueChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? "No change" : "New sales";
    const diff = current - previous;
    const percentage = Math.round((diff / previous) * 100);
    return `${diff >= 0 ? "+" : ""}${percentage}% vs ${previous === todayRevenue ? "yesterday" : "last week"}`;
  };

  const paymentsThisMonthByDay = paymentsThisMonth.reduce<Record<string, number>>((acc, payment) => {
    const date = payment.parsedDate!.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + (payment.amount || 0);
    return acc;
  }, {});

  const bestDayEntry = Object.entries(paymentsThisMonthByDay).sort((a, b) => b[1] - a[1])[0];
  const bestDay = bestDayEntry ? new Date(bestDayEntry[0]).toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
  const bestDayAvg = bestDayEntry ? Math.round(bestDayEntry[1] / 1) : 0;

  const consultationsThisMonth = patientAppointments.filter(appt => {
    const parsed = normalizeDateString(appt.date);
    return parsed ? parsed >= monthStart && parsed <= monthEnd : false;
  }).length;

  const topSellingProducts = (() => {
    const totals: Record<string, { sold: number; revenue: number }> = PRODUCTS.reduce((acc, product) => {
      acc[product.name] = { sold: 0, revenue: 0 };
      return acc;
    }, {} as Record<string, { sold: number; revenue: number }>);

    patientOrders.forEach(order => {
      order.items.forEach(item => {
        if (!totals[item.name]) {
          totals[item.name] = { sold: 0, revenue: 0 };
        }
        totals[item.name].sold += item.quantity;
        totals[item.name].revenue += item.price * item.quantity;
      });
    });

    const ranked = Object.entries(totals)
      .map(([name, stats]) => ({ name, sold: stats.sold, revenue: stats.revenue }))
      .sort((a, b) => b.sold - a.sold || b.revenue - a.revenue);

    if (ranked.every(item => item.sold === 0)) {
      return TOP_PRODUCTS_DATA;
    }

    return ranked.slice(0, 5);
  })();

  const selectedTopSellingProduct = selectedTopSellingProductName
    ? PRODUCTS.find(product => product.name === selectedTopSellingProductName) || null
    : null;

  const selectedTopSellingProductData = selectedTopSellingProductName
    ? topSellingProducts.find(item => item.name === selectedTopSellingProductName) || { name: selectedTopSellingProductName, sold: 0, revenue: 0 }
    : null;

  const selectedTopSellingProductInventory = selectedTopSellingProductName
    ? inventoryItems.find(item => item.item === selectedTopSellingProductName) || null
    : null;

  const selectedTopSellingProductOrders = selectedTopSellingProductName
    ? patientOrders.filter(order => order.items.some(item => item.name === selectedTopSellingProductName))
    : [];

  const selectedTopSellingProductLastOrder = selectedTopSellingProductOrders
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.date || "No recent orders";

  const generateMonthlyReport = () => {
    const monthKey = today.toLocaleDateString("en-US", { month: "long" });
    const year = today.getFullYear();
    const reportDate = new Date();

    const ordersForMonth = patientOrders.filter(order => {
      const parsed = normalizeDateString(order.date);
      return parsed ? parsed >= monthStart && parsed <= monthEnd : false;
    });

    const totals = ordersForMonth.reduce((acc, order) => {
      acc.totalRevenue += order.amount;
      acc.totalOrders += 1;
      order.items.forEach(item => {
        const existing = acc.productTotals[item.name] || { sold: 0, revenue: 0 };
        acc.productTotals[item.name] = {
          sold: existing.sold + item.quantity,
          revenue: existing.revenue + item.price * item.quantity,
        };
        acc.totalUnits += item.quantity;
      });
      return acc;
    }, {
      totalRevenue: 0,
      totalOrders: 0,
      totalUnits: 0,
      productTotals: {} as Record<string, { sold: number; revenue: number }>,
    });

    const soldProducts = Object.entries(totals.productTotals)
      .map(([name, stats]) => ({ name, sold: stats.sold, revenue: stats.revenue }))
      .sort((a, b) => b.sold - a.sold || b.revenue - a.revenue);

    const topProduct = soldProducts[0] || { name: "No sales", sold: 0, revenue: 0 };
    const lowStockCount = inventoryItems.filter(item => item.stock < INVENTORY_SAFETY_THRESHOLD).length;

    const report: MonthlyReport = {
      id: Date.now(),
      month: monthKey,
      year,
      generatedAt: reportDate.toISOString(),
      totalRevenue: totals.totalRevenue,
      totalOrders: totals.totalOrders,
      totalUnits: totals.totalUnits,
      topProduct: topProduct.name,
      topProductUnits: topProduct.sold,
      topProductRevenue: topProduct.revenue,
      lowStockCount,
      productsSold: soldProducts,
    };

    setMonthlyReports(prev => [report, ...prev]);
    return report;
  };

  const formatCurrency = (value: number) => `GHS ${value.toLocaleString()}`;

  const downloadCsvFile = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportReportToCsv = (report: MonthlyReport) => {
    const rows = [
      ["Monthly Report", `${report.month} ${report.year}`],
      ["Generated At", new Date(report.generatedAt).toLocaleString()],
      ["Total Revenue", formatCurrency(report.totalRevenue)],
      ["Total Orders", String(report.totalOrders)],
      ["Total Units Sold", String(report.totalUnits)],
      ["Top Product", report.topProduct],
      ["Top Product Units", String(report.topProductUnits)],
      ["Top Product Revenue", formatCurrency(report.topProductRevenue)],
      ["Low Stock Count", String(report.lowStockCount)],
      [],
      ["Product", "Units Sold", "Revenue"],
      ...report.productsSold.map(product => [product.name, String(product.sold), formatCurrency(product.revenue)]),
    ];

    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadCsvFile(`monthly-report-${report.month.toLowerCase()}-${report.year}.csv`, csv);
  };

  const exportReportHistoryToCsv = (reports: MonthlyReport[]) => {
    const rows = ["Month,Year,Generated At,Total Revenue,Total Orders,Total Units,Top Product,Top Product Units,Top Product Revenue,Low Stock Count"];
    reports.forEach(report => {
      rows.push([
        report.month,
        String(report.year),
        new Date(report.generatedAt).toLocaleString(),
        String(report.totalRevenue),
        String(report.totalOrders),
        String(report.totalUnits),
        report.topProduct,
        String(report.topProductUnits),
        String(report.topProductRevenue),
        String(report.lowStockCount),
      ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","));
    });
    downloadCsvFile(`monthly-report-history.csv`, rows.join("\n"));
  };

  const latestMonthlyReport = monthlyReports[0] || null;

  const filteredPatients = crmPatients.filter(p =>
    p.name.toLowerCase().includes(searchCRM.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchCRM.toLowerCase())
  );
  const filteredCalls = callLogEntries.filter(c => {
    const searchValue = searchCalls.toLowerCase().trim();
    const matchesSearch = !searchValue || `${c.patient} ${c.phone} ${c.note || ""}`.toLowerCase().includes(searchValue);
    const isPlaceholder = ["unknown caller", "new enquiry"].includes((c.patient || "").toLowerCase());
    return matchesSearch && !isPlaceholder;
  });
  const callStats = {
    incoming: callLogEntries.filter(c => c.type === "incoming").length,
    missed: callLogEntries.filter(c => c.type === "missed").length,
    returned: callLogEntries.filter(c => c.type === "returned").length,
  };

  const todayAppointments = patientAppointments
    .filter(appt => appt.date === todayDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  const patientsTodayCount = todayAppointments.length;
  const newPatientsCount = crmPatients.filter(p =>
    p.lastVisit === "Just added" || p.status === "Pending"
  ).length;
  const revenueTodayTotal = patientPayments
    .filter(payment => payment.date === todayDate || payment.createdAt.startsWith(todayDate))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const missedAppointments = callStats.missed;

  const saveCallNote = (callId: number) => {
    const note = (callNotes[callId] || "").trim();
    if (!note) return;
    setCallLogEntries(prev => prev.map(call => call.id === callId ? { ...call, note } : call));
    setCallNotes(prev => {
      const next = { ...prev };
      delete next[callId];
      return next;
    });
    setEditingCallNoteId(null);
  };

  const startEditingCallNote = (callId: number) => {
    const existingCall = callLogEntries.find(call => call.id === callId);
    if (existingCall) {
      setCallNotes(prev => ({ ...prev, [callId]: existingCall.note || "" }));
      setEditingCallNoteId(callId);
    }
  };

  const toggleCallStatus = (callId: number) => {
    const currentCall = callLogEntries.find(call => call.id === callId);
    if (!currentCall || !currentCall.note) return;
    const nextStatus = currentCall.status === "resolved" ? "unresolved" : "resolved";
    setCallLogEntries(prev => prev.map(call => call.id === callId ? { ...call, status: nextStatus } : call));
    setEditingCallNoteId(null);
  };

  const openInventoryRestock = (itemName: string) => {
    const existingItem = inventoryItems.find(item => item.item === itemName);
    const matchingProduct = PRODUCTS.find(product => product.name === itemName);
    setSelectedInventoryItem(itemName);
    setInventoryFormOpen(true);
    setInventoryFormData({
      item: itemName,
      category: existingItem?.category || matchingProduct?.category || inventoryFormData.category || "General",
      stock: "0",
      min: String(existingItem?.min ?? matchingProduct?.min ?? 5),
      unit: existingItem?.unit || "units",
    });
  };

  const handleInventorySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const itemName = inventoryFormData.item.trim();
    const category = inventoryFormData.category.trim();
    const stock = Number(inventoryFormData.stock);
    const min = Number(inventoryFormData.min);
    const unit = inventoryFormData.unit.trim() || "units";
    if (!itemName) return;

    setInventoryItems(prev => {
      const existing = prev.find(entry => entry.item.toLowerCase() === itemName.toLowerCase());
      if (existing) {
        return prev.map(entry => entry.item.toLowerCase() === itemName.toLowerCase() ? {
          ...entry,
          category: category || entry.category,
          stock: entry.stock + (Number.isFinite(stock) ? stock : 0),
          min: Number.isFinite(min) ? min : entry.min,
          unit: unit || entry.unit,
        } : entry);
      }

      return [{ item: itemName, category: category || "General", stock: Number.isFinite(stock) ? stock : 0, min: Number.isFinite(min) ? min : 0, unit }, ...prev];
    });

    setInventoryFormOpen(false);
    setInventoryFormData({ item: itemName, category, stock: "0", min: String(min || 5), unit });
  };

  const updateHeroDraftSlide = (index: number, field: "badge" | "eyebrow" | "title" | "description" | "panelTitle" | "panelSubtitle" | "overlayText" | "subText" | "smallText", value: string) => {
    setHeroDraftSlides(prev => prev.map((slide, slideIndex) => slideIndex === index ? { ...slide, [field]: value } : slide));
  };

  const updateBlogDraftPost = (index: number, field: keyof BlogPostData, value: string) => {
    setBlogDraftPosts(prev => prev.map((post, postIndex) => postIndex === index ? { ...post, [field]: value } : post));
  };

  const openHeroEditor = () => {
    setHeroDraftSlides(heroSlides.map(slide => ({ ...slide })));
    setHeroEditorOpen(true);
    setBlogEditorOpen(false);
  };

  const openBlogEditor = () => {
    setBlogDraftPosts(blogPosts.map(post => ({ ...post })));
    setBlogEditorOpen(true);
    setHeroEditorOpen(false);
  };

  const submitHeroChanges = () => {
    setHeroSlides(heroDraftSlides);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("eduHeroSlides", JSON.stringify(heroDraftSlides));
    }
    setHeroSaveMessage("Hero carousel updated successfully.");
    setHeroEditorOpen(false);
    setBlogEditorOpen(false);
  };

  const submitBlogChanges = () => {
    setBlogPosts(blogDraftPosts);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("eduBlogPosts", JSON.stringify(blogDraftPosts));
    }
    setBlogSaveMessage("Blog post updates saved successfully.");
    setHeroEditorOpen(false);
    setBlogEditorOpen(false);
  };

  const cancelHeroChanges = () => {
    setHeroDraftSlides(heroSlides.map(slide => ({ ...slide })));
    setHeroEditorOpen(false);
    setBlogEditorOpen(false);
  };

  const cancelBlogChanges = () => {
    setBlogDraftPosts(blogPosts.map(post => ({ ...post })));
    setHeroEditorOpen(false);
    setBlogEditorOpen(false);
  };

  const addBlogPost = () => {
    setBlogDraftPosts(prev => [
      ...prev,
      {
        title: "New clinic update",
        category: "Updates",
        date: "Today",
        readTime: "3 min",
        excerpt: "Add a fresh update for your audience.",
        image: news6,
      },
    ]);
  };

  const removeBlogPost = (index: number) => {
    setBlogDraftPosts(prev => prev.filter((_, postIndex) => postIndex !== index));
  };

  const handlePortalBack = () => {
    if (heroEditorOpen || blogEditorOpen) {
      setHeroEditorOpen(false);
      setBlogEditorOpen(false);
      setAdminTab("overview");
      return;
    }

    if (view === "admin" && adminTab !== "overview") {
      setAdminTab("overview");
      return;
    }

    if (view === "patient") {
      setView("public");
      return;
    }

    if (view === "admin") {
      setAdminAuthenticated(false);
      setAdminUsername("");
      setAdminPassword("");
      setAdminLoginError("");
      setHeroEditorOpen(false);
      setBlogEditorOpen(false);
      setAdminTab("overview");
      setView("public");
    }
  };

  // ── Logo ────────────────────────────────────────────────────────────────

  const Logo = ({ size = 44, ring = true }: { size?: number; ring?: boolean }) => (
    <ImageWithFallback
      src={clinicLogo}
      alt="Edu Herbal Clinic – EDHEC logo"
      className={`rounded-full object-contain bg-white${ring ? " ring-2 ring-[#1C7A3A]/30" : ""}`}
      style={{ width: size, height: size }}
    />
  );

  // ── Portal header ────────────────────────────────────────────────────────

  const PortalHeader = ({ title, sub, onBack }: { title: string; sub: string; onBack?: () => void }) => (
    <header style={{ background: G }} className="text-white px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60">
          <Logo size={36} ring={false} />
        </button>
        <div>
          <p className="font-bold text-sm leading-none">{title}</p>
          <p className="text-green-200 text-xs mt-0.5">{sub}</p>
        </div>
      </div>
    </header>
  );

  // ════════════════════════════════════════════════════════════════════════
  // PATIENT PORTAL
  // ════════════════════════════════════════════════════════════════════════

  if (view === "patient") {
    const displayPatient = crmPatients[0] || { name: "Patient", phone: "", condition: "", lastVisit: "", nextAppt: "", doctor: "", status: "Active", balance: 0, products: [], id: 0 };
    const ptabs = [
      { id:"orders",       label:"Order Meds",   icon:ShoppingBag },
    ];
    const selectedOrderItems = Object.entries(cart)
      .map(([id, quantity]) => {
        const product = PRODUCTS.find(p => p.id === Number(id));
        return product ? { ...product, quantity } : null;
      })
      .filter((item): item is (typeof PRODUCTS[number] & { quantity: number }) => Boolean(item));
    const cartTotal = selectedOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const combinedMedicineOrders = patientOrders.reduce<Array<{ name: string; quantity: number; price: number }>>((acc, order) => {
      order.items.forEach(item => {
        const existing = acc.find(entry => entry.name === item.name);
        if (existing) {
          existing.quantity += item.quantity;
          existing.price = item.price;
        } else {
          acc.push({ name: item.name, quantity: item.quantity, price: item.price });
        }
      });
      return acc;
    }, []);

    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f9fafb] text-slate-900"}`}>
        <PortalHeader title="Edu Herbal Clinic" sub="Patient Portal" onBack={() => setView("public")} darkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {ptabs.map(t => (
              <button key={t.id} onClick={() => setPatientTab(t.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={ patientTab === t.id
                  ? { background:G, color:W }
                  : { background:W, color:"#374151", border:`1px solid ${G}30` }
                }>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </div>

          {/* APPOINTMENTS TAB */}
          {patientTab === "appointments" && null}

          {/* ORDER MEDS TAB */}
          {patientTab === "orders" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-4 text-white shadow-lg sm:p-5" style={{ background: G }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-sm font-semibold sm:text-base">
                      {selectedOrderItems.length > 0 ? `${selectedOrderItems.length} product(s) in cart` : "No products selected yet"}
                    </span>
                    <p className="mt-1 text-sm text-white/80">Review your order and continue to checkout.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-base font-bold sm:text-lg" style={{ color: "#fed7aa" }}>GHS {cartTotal}</span>
                    <button onClick={() => selectedOrderItems.length > 0 ? openPaymentPrompt(paymentMethod) : setCheckoutMessage("Add a product to your cart before checking out.")} className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: OR }}>
                      Checkout
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {selectedOrderItems.length > 0 ? (
                    selectedOrderItems.map(item => (
                      <div key={item.id} className="flex flex-col gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <span>{item.name}</span>
                          <span className="ml-2 text-white/70">× {item.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                          <span className="font-semibold">GHS {item.price * item.quantity}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.id)} className="rounded bg-white/20 px-2 py-1 transition-colors hover:bg-white/30">−</button>
                            <button onClick={() => addToCart(item.id)} className="rounded bg-white/20 px-2 py-1 transition-colors hover:bg-white/30">+</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-white/10 px-3 py-3 text-sm text-white/80">
                      Add a product from the catalogue to see your order summary here.
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-3 sm:p-4">
                  <p className="mb-2 text-sm font-semibold text-white/90">Payment method</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(["Mobile Money", "Telecel Cash"] as const).map(method => (
                      <button key={method} onClick={() => openPaymentPrompt(method)} className="rounded-full border px-3 py-2 text-sm font-semibold transition-colors" style={paymentMethod === method ? { borderColor: OR, background: `${OR}12`, color: OR } : { borderColor: "#ffffff33", color: "#ffffff" }}>
                        {method}
                      </button>
                    ))}
                  </div>
                  {paymentRecipientName && paymentRecipientNumber && (
                    <div className="mt-3 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm">
                      <p className="font-semibold">{paymentRecipientName}</p>
                      <p className="text-white/80">{paymentRecipientNumber}</p>
                    </div>
                  )}
                  {checkoutMessage && (
                    <p className="mt-3 text-sm text-white/90">{checkoutMessage}</p>
                  )}
                  <p className="mt-2 text-xs text-white/70">We only accept Mobile Money or Telecel Cash for medicine checkout.</p>
                </div>

                {paymentPromptOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
                    <div className="w-full max-w-md rounded-2xl bg-white p-5 text-gray-900 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">Confirm payment details</h4>
                        <button onClick={() => setPaymentPromptOpen(false)} className="text-sm font-semibold text-gray-500">Close</button>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Enter the name and phone number for {paymentPromptMethod || "your selected payment"}.</p>
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-700">Full name</label>
                          <input value={paymentPromptName} onChange={(e) => setPaymentPromptName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ama Boateng" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-700">Phone number</label>
                          <input value={paymentPromptNumber} onChange={(e) => setPaymentPromptNumber(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0241234567" />
                        </div>
                        {paymentPromptError && <p className="text-sm text-red-600">{paymentPromptError}</p>}
                      </div>
                      <div className="mt-5 flex justify-end gap-2">
                        <button onClick={() => setPaymentPromptOpen(false)} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">Cancel</button>
                        <button onClick={confirmPaymentDetails} className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: OR }}>Confirm</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // ADMIN DASHBOARD
  // ════════════════════════════════════════════════════════════════════════

  if (view === "admin") {
    if (!adminAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ background:`${G}15` }}>
                <LogIn className="h-8 w-8" style={{ color:G }} />
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color:OR }}>Administrative Access</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-gray-900">Staff Login</h1>
              <p className="mt-2 text-sm text-gray-500">Use the secure admin portal to access staff tools.</p>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Username</label>
                <input
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                  placeholder="Enter password"
                />
              </div>
              {adminLoginError ? <p className="text-sm font-medium text-red-600">{adminLoginError}</p> : null}
              <button
                onClick={handleAdminLogin}
                className="w-full rounded-full px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background:G }}
              >
                Sign In
              </button>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              Demo credentials: username <span className="font-semibold text-gray-600">admin</span> · password <span className="font-semibold text-gray-600">1234</span>
            </div>
          </div>
        </div>
      );
    }

    const atabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
      { id:"overview",   label:"Overview",     icon:Home      },
      { id:"crm",        label:"CRM",          icon:Users     },
      { id:"callcentre", label:"Call Centre",  icon:PhoneCall },
      { id:"sales",      label:"Sales",        icon:TrendingUp},
      { id:"inventory",  label:"Inventory",    icon:Package   },
      { id:"staff",      label:"Staff",        icon:UserCheck },
    ];

    if (heroEditorOpen || blogEditorOpen) {
      const isHeroEditor = heroEditorOpen && !blogEditorOpen;
      return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-slate-900"}`}>
          <PortalHeader title={isHeroEditor ? "Hero Carousel Manager" : "Blog Manager"} sub={isHeroEditor ? "Edit the hero cards shown on the website" : "Edit the blog posts shown on the website"} showExit={false} onBack={handlePortalBack} darkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-6xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color:OR }}>{isHeroEditor ? "Carousel Controls" : "Blog Controls"}</p>
                  <h1 className="font-display text-3xl font-bold text-gray-900">{isHeroEditor ? "Manage Hero Cards" : "Manage Blog Posts"}</h1>
                  <p className="text-gray-400 mt-1">{isHeroEditor ? "Edit the content below and the public website carousel updates instantly." : "Edit the content below and the public website blog section updates instantly."}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-sm">
                    <button onClick={() => { setHeroEditorOpen(true); setBlogEditorOpen(false); }} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${heroEditorOpen ? "text-white shadow-sm" : "text-gray-600"}`} style={heroEditorOpen ? { background:G } : {}}>
                      Hero Cards
                    </button>
                    <button onClick={() => { setHeroEditorOpen(false); setBlogEditorOpen(true); }} className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${blogEditorOpen ? "text-white shadow-sm" : "text-gray-600"}`} style={blogEditorOpen ? { background:OR } : {}}>
                      Blog Posts
                    </button>
                  </div>
                  <button onClick={isHeroEditor ? cancelHeroChanges : cancelBlogChanges} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md">
                    Cancel
                  </button>
                  <button onClick={isHeroEditor ? submitHeroChanges : submitBlogChanges} className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90" style={{ background:G }}>
                    Submit
                  </button>
                </div>
              </div>

              {isHeroEditor ? (
                <>
                  <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#f0faf3] via-white to-[#fff7ed] p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color:OR }}>Live preview</p>
                        <p className="mt-1 text-sm text-gray-500">This preview reflects the same hero content used on the website carousel.</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {heroDraftSlides.map((slide, index) => (
                        <button
                          key={`${slide.panelTitle}-${index}`}
                          onClick={() => setSelectedHeroPreviewIndex(index)}
                          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${selectedHeroPreviewIndex === index ? "text-white shadow-sm" : "bg-white text-gray-600"}`}
                          style={selectedHeroPreviewIndex === index ? { background: slide.panelAccent } : { border: "1px solid #e5e7eb" }}
                        >
                          {slide.panelTitle}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-[#1C7A3A] via-[#2f8f4c] to-[#0f3f22] p-6 text-white shadow-lg">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-green-100">{heroDraftSlides[selectedHeroPreviewIndex]?.badge}</p>
                      <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{heroDraftSlides[selectedHeroPreviewIndex]?.title}</h2>
                      <p className="mt-3 max-w-xl text-sm text-green-50/90">{heroDraftSlides[selectedHeroPreviewIndex]?.description}</p>
                      <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                        <p className="text-sm font-semibold">{heroDraftSlides[selectedHeroPreviewIndex]?.panelTitle}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-green-100">{heroDraftSlides[selectedHeroPreviewIndex]?.panelSubtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {heroDraftSlides.map((slide, index) => (
                      <div key={`${slide.panelTitle}-${index}`} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl" style={{ background: slide.panelAccent }} />
                          <div>
                            <p className="font-semibold text-gray-900">{slide.panelTitle}</p>
                            <p className="text-sm text-gray-400">{slide.panelSubtitle}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Card Title
                            <input value={slide.panelTitle} onChange={(e) => updateHeroDraftSlide(index, "panelTitle", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700">
                            Card Subtitle
                            <input value={slide.panelSubtitle} onChange={(e) => updateHeroDraftSlide(index, "panelSubtitle", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700">
                            Heading
                            <input value={slide.title} onChange={(e) => updateHeroDraftSlide(index, "title", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700">
                            Description
                            <textarea value={slide.description} onChange={(e) => updateHeroDraftSlide(index, "description", e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color:OR }}>From Our Clinic Blog</p>
                      <p className="mt-1 text-sm text-gray-500">Manage the posts shown in the public blog carousel.</p>
                    </div>
                    <button onClick={addBlogPost} className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md">
                      Add post
                    </button>
                  </div>

                  <div className="mb-6 rounded-[1.75rem] border border-gray-100 bg-gradient-to-br from-[#f0faf3] via-white to-[#fff7ed] p-5 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color:OR }}>Preview</p>
                        <p className="mt-1 text-sm text-gray-500">Review the selected post before publishing updates.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {blogDraftPosts.map((post, index) => (
                          <button
                            key={`${post.title}-${index}`}
                            onClick={() => setSelectedBlogPreviewIndex(index)}
                            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${selectedBlogPreviewIndex === index ? "text-white shadow-sm" : "bg-gray-100 text-gray-700"}`}
                            style={selectedBlogPreviewIndex === index ? { background:G } : {}}
                          >
                            {post.title || `Post ${index + 1}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sm">
                      <div className="relative h-56 w-full">
                        <img
                          src={blogDraftPosts[selectedBlogPreviewIndex]?.image || news6}
                          alt={blogDraftPosts[selectedBlogPreviewIndex]?.title || "Blog preview"}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur">
                            {blogDraftPosts[selectedBlogPreviewIndex]?.category || "Updates"}
                          </div>
                          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-white">
                            {blogDraftPosts[selectedBlogPreviewIndex]?.title || "Your new blog post title"}
                          </h3>
                          <p className="mt-2 text-sm text-white/80">
                            {blogDraftPosts[selectedBlogPreviewIndex]?.date || "Today"} • {blogDraftPosts[selectedBlogPreviewIndex]?.readTime || "3 min read"}
                          </p>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-sm leading-7 text-gray-600">
                          {blogDraftPosts[selectedBlogPreviewIndex]?.excerpt || "Add a compelling excerpt to preview how your post will appear to visitors."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {blogDraftPosts.map((post, index) => (
                      <div key={`${post.title}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-900">{post.title || `Blog post ${index + 1}`}</p>
                          {blogDraftPosts.length > 1 ? (
                            <button onClick={() => removeBlogPost(index)} className="text-sm font-semibold text-red-600">Remove</button>
                          ) : null}
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Title
                            <input value={post.title} onChange={(e) => updateBlogDraftPost(index, "title", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700">
                            Category
                            <input value={post.category} onChange={(e) => updateBlogDraftPost(index, "category", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700">
                            Date
                            <input value={post.date} onChange={(e) => updateBlogDraftPost(index, "date", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700">
                            Read Time
                            <input value={post.readTime} onChange={(e) => updateBlogDraftPost(index, "readTime", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700 md:col-span-2">
                            Excerpt
                            <textarea value={post.excerpt} onChange={(e) => updateBlogDraftPost(index, "excerpt", e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                          <label className="block text-sm font-semibold text-gray-700 md:col-span-2">
                            Image URL
                            <input value={post.image} onChange={(e) => updateBlogDraftPost(index, "image", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PortalHeader title="Staff Dashboard" sub="Edu Herbal Clinic — Admin Panel" showExit={false} onBack={handlePortalBack} darkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-5 px-3 gap-1 shadow-sm flex-shrink-0">
            <button
              onClick={() => {
                setAdminAuthenticated(false);
                setAdminUsername("");
                setAdminPassword("");
                setAdminLoginError("");
                setHeroEditorOpen(false);
                setBlogEditorOpen(false);
                setAdminTab("overview");
                setView("admin");
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
              style={{ color:R }}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" /> Logout
            </button>
            {atabs.map(t => (
              <button key={t.id} onClick={() => setAdminTab(t.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={ adminTab === t.id
                  ? { background:G, color:W }
                  : { color:"#374151" }
                }
                onMouseEnter={e => { if(adminTab !== t.id)(e.currentTarget as HTMLElement).style.background="#f0faf3"; }}
                onMouseLeave={e => { if(adminTab !== t.id)(e.currentTarget as HTMLElement).style.background=""; }}>
                <t.icon className="w-4 h-4 flex-shrink-0" />{t.label}
              </button>
            ))}
            <div className="flex-1" />
            <div className="rounded-xl px-3 py-2.5 text-xs border" style={{ background: lowStock.length > 0 ? "#7f1d1d" : "#111827", borderColor: lowStock.length > 0 ? "#fca5a5" : "#374151", color: "#fff" }}>
              <p className="font-bold flex items-center gap-1 mb-0.5"><AlertTriangle className="w-3 h-3" /> Low Stock</p>
              <p>{lowStock.length > 0 ? `${lowStock.length} item${lowStock.length>1?"s":""} need restock` : "No low stock alerts"}</p>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* ── OVERVIEW ── */}
            {adminTab === "overview" && (<>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-gray-900">Good morning, Grace 👋</h1>
                  <p className="text-gray-400 mt-1">Tuesday, 8 July 2025 · Accra Branch</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setAdminTab("crm"); setCrmNewPatientOpen(true); }}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" style={{ color:G }} /> New Patient
                  </button>
                  <button
                    onClick={() => setAdminTab("callcentre")}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <PhoneCall className="h-4 w-4" style={{ color:OR }} /> Review Calls
                  </button>
                  <button
                    onClick={() => setAdminTab("inventory")}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Package className="h-4 w-4" style={{ color:R }} /> Check Stock
                  </button>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#f0faf3] via-white to-[#fff7ed] p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color:OR }}>Operations Snapshot</p>
                      <h2 className="mt-2 font-display text-2xl font-bold text-gray-900">Daily operations are trending well</h2>
                      <p className="mt-2 text-sm text-gray-500">Stay on top of the queue, stock pressure points, and follow-up tasks without leaving the dashboard.</p>
                    </div>
                    <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm">
                      Live
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" style={{ color:G }} />
                    <p className="text-sm font-semibold text-gray-900">Priority focus</p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" style={{ color:G }} /> {followUpCount > 0 ? `${followUpCount} patient follow-up${followUpCount === 1 ? "" : "s"} due today` : "No patient follow-ups due today"}</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" style={{ color:OR }} /> {callbackReviewCount > 0 ? `${callbackReviewCount} call${callbackReviewCount === 1 ? "" : "s"} need callback review` : "All calls are up to date"}</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" style={{ color:R }} /> {lowStock.length > 0 ? `${lowStock.length} inventory item${lowStock.length === 1 ? "" : "s"} need restock attention` : "Inventory stock looks healthy"}</li>
                  </ul>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label:"Patients Today", value: patientsTodayCount.toString(), icon:Users, color:G, delta:"+4", onClick: () => setAdminTab("crm") },
                  { label:"New Patients", value: newPatientsCount.toString(), icon:Plus, color:OR, delta:"+2", onClick: () => setAdminTab("crm") },
                  { label:"Revenue Today", value: `GHS ${revenueTodayTotal.toLocaleString()}`, icon:TrendingUp, color:G, delta:"+12%", onClick: () => setAdminTab("sales") },
                  { label:"Missed Appts", value: missedAppointments.toString(), icon:AlertTriangle, color:R, delta:"–1", onClick: () => setAdminTab("callcentre") },
                ].map(k => (
                  <button
                    key={k.label}
                    type="button"
                    onClick={k.onClick}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:k.color+"18" }}>
                        <k.icon className="w-5 h-5" style={{ color:k.color }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color:G }}>{k.delta}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
                  </button>
                ))}
              </div>

              {heroSaveMessage ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow-sm">
                  {heroSaveMessage}
                </div>
              ) : null}
              {blogSaveMessage ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow-sm">
                  {blogSaveMessage}
                </div>
              ) : null}

              <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#f0faf3] via-white to-[#fff7ed] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color:OR }}>Content Management</p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-gray-900">Manage website content</h2>
                    <p className="mt-2 text-sm text-gray-500">Use the editor below to update the homepage hero carousel or the blog section.</p>
                  </div>
                  <button onClick={openHeroEditor} className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90" style={{ background:G }}>
                    Open Editor
                  </button>
                </div>
              </div>

              {/* Charts row */}
              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="font-semibold text-gray-900 mb-4">Revenue — 7 months (GHS)</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={SALES_DATA}>
                      <defs>
                        <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={G} stopOpacity={0.18} />
                          <stop offset="95%" stopColor={G} stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" tick={{ fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:12, border:"1px solid #e5e7eb", fontSize:12 }} />
                      <Area type="monotone" dataKey="revenue" stroke={G} strokeWidth={2.5} fill="url(#gfill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="font-semibold text-gray-900 mb-4">Conditions</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                        {PIE_DATA.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {PIE_DATA.map(d => (
                      <div key={d.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:d.color }} />
                        <span className="text-gray-400 flex-1">{d.name}</span>
                        <span className="font-bold text-gray-800">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Today's schedule */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="font-semibold text-gray-900 mb-4">Today's Schedule</p>
                <div className="space-y-2">
                  {todayAppointments.length > 0 ? todayAppointments.map((a,i) => {
                    const statusLabel = a.status === "Pending" ? "Waiting" : a.status;
                    const sc = a.status === "Completed"
                      ? { bg: "#dcfce7", text: "#15803d" }
                      : a.status === "Confirmed"
                        ? { bg: "#dbeafe", text: "#1d4ed8" }
                        : a.status === "Pending"
                          ? { bg: "#fef9c3", text: "#854d0e" }
                          : { bg: "#f3f4f6", text: "#6b7280" };
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setView("patient");
                          setPatientTab("orders");
                        }}
                        className="flex items-center gap-4 w-full text-left py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xs font-medium text-gray-400 w-20">{a.time}</span>
                        <span className="flex-1 text-sm"><span className="font-semibold text-gray-900">{a.patientName}</span><span className="text-gray-400 ml-2">· {a.doctor} · {a.service}</span></span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: sc.bg, color: sc.text }}>{statusLabel}</span>
                      </button>
                    );
                  }) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                      No appointments scheduled for today.
                    </div>
                  )}
                </div>
              </div>
            </>)}

            {/* ── CRM ── */}
            {adminTab === "crm" && (<>
              <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-bold text-gray-900">Patient CRM</h1>
                <button
                  onClick={() => setCrmNewPatientOpen(true)}
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                  style={{ background:G }}
                >
                  <Plus className="w-4 h-4" /> New Patient
                </button>
              </div>
              {crmNewPatientOpen && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Create patient and booking</p>
                      <p className="text-sm text-gray-500">Add a new patient and schedule their first appointment.</p>
                    </div>
                    <button onClick={() => setCrmNewPatientOpen(false)} className="text-sm font-semibold text-gray-500">Cancel</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input value={crmNewPatientData.name} onChange={e => setCrmNewPatientData(prev => ({ ...prev, name: e.target.value }))} placeholder="Patient full name" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                    <input value={crmNewPatientData.phone} onChange={e => setCrmNewPatientData(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                    <input value={crmNewPatientData.condition} onChange={e => setCrmNewPatientData(prev => ({ ...prev, condition: e.target.value }))} placeholder="Condition / service" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                    <select value={crmNewPatientData.doctorId} onChange={e => setCrmNewPatientData(prev => ({ ...prev, doctorId: Number(e.target.value) }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                      {DOCTORS.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}
                    </select>
                    <input type="date" value={crmNewPatientData.date} onChange={e => setCrmNewPatientData(prev => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                    <input type="time" value={crmNewPatientData.time} onChange={e => setCrmNewPatientData(prev => ({ ...prev, time: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleCreateNewPatient} className="text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background:G }}>Save Patient & Book</button>
                  </div>
                </div>
              )}
              {bookingSmsStatus && (
                <p className="text-sm font-semibold text-green-700 mt-2">{bookingSmsStatus}</p>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={searchCRM} onChange={e => setSearchCRM(e.target.value)} placeholder="Search patient name or condition…"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none shadow-sm"
                  style={{ outlineColor:G }} />
              </div>
              <div className="grid lg:grid-cols-5 gap-5">
                <div className="lg:col-span-2 space-y-4">
                  {[
                    { label: "Active", patients: filteredPatients.filter(p => p.status === "Active") },
                    { label: "Follow-up", patients: filteredPatients.filter(p => p.status === "Follow-up") },
                    { label: "Pending", patients: filteredPatients.filter(p => p.status === "Pending") },
                  ].map(group => (
                    <div key={group.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                        <span className="text-xs text-gray-400">{group.patients.length} {group.patients.length === 1 ? "patient" : "patients"}</span>
                      </div>
                      <div className="space-y-2">
                        {group.patients.map(p => {
                          const ss = statusStyle(p.status);
                          return (
                            <button key={p.id} onClick={() => setSelPatient(p)}
                              className="w-full text-left rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:border-gray-200"
                              style={{ background: selPatient?.id===p.id ? "#f0fdf4" : "#ffffff" }}>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background:G }}>
                                  {p.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                                  <p className="text-xs text-gray-400 truncate">{p.condition}</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background:ss.bg, color:ss.text }}>{p.status}</span>
                              </div>
                            </button>
                          );
                        })}
                        {group.patients.length === 0 && (
                          <p className="text-xs text-gray-400">No {group.label.toLowerCase()} patients.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-3">
                  {selPatient ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 text-white" style={{ background:G }}>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background:OR }}>
                            {selPatient.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{selPatient.name}</p>
                            <p className="text-green-200 text-sm">{selPatient.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-3 text-sm">
                        {([
                          ["Condition",         selPatient.condition ],
                          ["Assigned Doctor",   selPatient.doctor    ],
                          ["Last Visit",        selPatient.lastVisit ],
                          ["Next Appointment",  selPatient.nextAppt  ],
                          ["Outstanding Balance",selPatient.balance>0?`GHS ${selPatient.balance}`:"Settled"],
                          ["Products Purchased",selPatient.products.join(", ")],
                        ] as [string,string][]).map(([k,v]) => (
                          <div key={k} className="flex justify-between items-start border-b border-gray-50 pb-2 last:border-0">
                            <span className="text-gray-400">{k}</span>
                            <span className="font-semibold text-right max-w-xs"
                              style={{ color: k==="Outstanding Balance"&&selPatient.balance>0 ? R : "#111827" }}>{v}</span>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2 flex-wrap">
                          <button
                            onClick={() => handleAdminBookAppointment(selPatient)}
                            className="flex-1 min-w-[140px] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                            style={{ background:G }}
                          >
                            Confirm Appointment
                          </button>
                          <button
                            onClick={() => openPatientWhatsApp(selPatient.phone, selPatient.name)}
                            className="flex-1 min-w-[120px] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                            style={{ background:"#25D366" }}
                          >
                            WhatsApp
                          </button>
                        </div>
                        {bookingSmsStatus && (
                          <p className="mt-2 text-sm font-semibold text-green-700">{bookingSmsStatus}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-64 flex items-center justify-center text-gray-300 text-sm">
                      Select a patient to view their profile
                    </div>
                  )}
                </div>
              </div>
            </>)}

            {/* ── CALL CENTRE ── */}
            {adminTab === "callcentre" && (<>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="font-display text-3xl font-bold text-gray-900">Call Centre</h1>
                <div className="flex gap-3">
                  {[
                    { icon:Inbox,          label:"Incoming", count:callStats.incoming, color:G  },
                    { icon:PhoneMissed,    label:"Missed",   count:callStats.missed, color:R  },
                    { icon:PhoneForwarded, label:"Returned", count:callStats.returned, color:OR },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm flex items-center gap-2">
                      <s.icon className="w-4 h-4" style={{ color:s.color }} />
                      <span className="text-sm font-bold text-gray-900">{s.count}</span>
                      <span className="text-xs text-gray-400">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={searchCalls} onChange={e => setSearchCalls(e.target.value)} placeholder="Search patient or number…"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none shadow-sm" />
              </div>
              <div className="space-y-3">
                {filteredCalls.map(call => {
                  const CallIcon = call.type==="incoming" ? PhoneCall : call.type==="missed" ? PhoneMissed : PhoneForwarded;
                  const clr = call.type==="incoming" ? G : call.type==="missed" ? R : OR;
                  return (
                    <div key={call.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:clr+"18" }}>
                          <CallIcon className="w-5 h-5" style={{ color:clr }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p><span className="font-semibold text-gray-900">{call.patient}</span><span className="text-sm text-gray-400 ml-2">{call.phone}</span></p>
                            <span className="text-xs text-gray-400 flex-shrink-0">{call.time} · {call.duration}</span>
                          </div>
                          {editingCallNoteId === call.id ? (
                            <div className="mt-2 space-y-1.5">
                              <textarea placeholder="Add or edit call note…" rows={3} value={callNotes[call.id] || ""}
                                onChange={e => setCallNotes(n => ({ ...n, [call.id]:e.target.value }))}
                                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
                              <button onClick={() => saveCallNote(call.id)} className="text-xs text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity" style={{ background:G }}>
                                {call.note ? "Update Note" : "Save Note"}
                              </button>
                            </div>
                          ) : call.note ? (
                            <div className="mt-2 rounded-lg px-3 py-2 text-sm text-gray-700 border-l-4" style={{ background:"#f0faf3", borderColor:G }}>
                              <div className="flex items-start justify-between gap-2">
                                <p className="flex-1">{call.note}</p>
                                <button onClick={() => startEditingCallNote(call.id)} className="text-xs font-semibold text-gray-600">Edit</button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2 space-y-1.5">
                              <textarea placeholder="Add or edit call note…" rows={3} value={callNotes[call.id] || ""}
                                onChange={e => setCallNotes(n => ({ ...n, [call.id]:e.target.value }))}
                                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
                              <button onClick={() => saveCallNote(call.id)} className="text-xs text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity" style={{ background:G }}>
                                Save Note
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            <button
                              onClick={() => initiatePatientCall(call.phone, call.patient)}
                              className="rounded-full text-white px-2.5 py-1 text-[11px] font-semibold transition-opacity hover:opacity-90"
                              style={{ background:G }}
                            >
                              Call
                            </button>
                            {call.note ? (
                              <button
                                onClick={() => toggleCallStatus(call.id)}
                                className="rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-opacity hover:opacity-90"
                                style={call.status === "resolved"
                                  ? { borderColor:"#86efac", background:"#f0fdf4", color:"#15803d" }
                                  : { borderColor:"#fda4af", background:"#fff1f2", color:R }}
                              >
                                {call.status === "resolved" ? "Resolved" : "Unresolved"}
                              </button>
                            ) : null}
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                              style={ call.status==="resolved" ? { background:"#dcfce7",color:"#15803d" } : { background:"#fee2e2",color:"#dc2626" }}>
                              {call.status}
                            </span>
                          </div>
                          {call.note && /telemedicine/i.test(call.note) ? (
                            <div className="flex items-center gap-2 self-start">
                              <button
                                onClick={() => openPatientWhatsApp(call.phone, call.patient)}
                                className="flex items-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#f0fdf4] px-3 py-2 text-sm font-semibold text-[#25D366] shadow-sm transition-opacity hover:opacity-90"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Open WhatsApp
                              </button>
                              <button
                                onClick={() => markQrScanned(call.id, call.patient, call.phone)}
                                className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-2 hover:opacity-90 transition-opacity"
                              >
                                <img src={getWhatsAppQrUrl(call.phone)} alt="WhatsApp QR" className="w-20 h-20 rounded-lg border border-gray-200 bg-white p-1" />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>)}

            {/* ── SALES ── */}
            {adminTab === "sales" && (<>
              <h1 className="font-display text-3xl font-bold text-gray-900">Sales Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label:"Today",      value:`GHS ${todayRevenue.toLocaleString()}`,  sub: revenueChange(todayRevenue, yesterdayRevenue) },
                  { label:"This Week",  value:`GHS ${weekRevenue.toLocaleString()}`,   sub: revenueChange(weekRevenue, lastWeekRevenue) },
                  { label:"This Month", value:`GHS ${monthRevenue.toLocaleString()}`, sub:`${consultationsThisMonth} consultations` },
                  { label:"Best Day",   value:bestDay,     sub:`Avg GHS ${bestDayAvg.toLocaleString()}` },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color:G }}>{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
                  <p className="font-semibold text-gray-900 mb-4">Monthly Revenue (GHS)</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={SALES_DATA} barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" tick={{ fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:12, border:"1px solid #e5e7eb", fontSize:12 }} />
                      <Bar dataKey="revenue" fill={G} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:w-[360px]">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Monthly Close</p>
                      <p className="text-xs text-gray-400">Generate the month-end sales report.</p>
                    </div>
                    <button
                      type="button"
                      onClick={generateMonthlyReport}
                      className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                    >
                      Close Month
                    </button>
                  </div>
                  {latestMonthlyReport ? (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                        <p className="text-xs uppercase tracking-[0.18em] text-green-700">Latest report</p>
                        <p className="mt-2 font-semibold text-gray-900">{latestMonthlyReport.month} {latestMonthlyReport.year}</p>
                        <p className="text-sm text-gray-600">Generated: {new Date(latestMonthlyReport.generatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Revenue</p>
                          <p className="mt-2 text-lg font-bold text-gray-900">GHS {latestMonthlyReport.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Orders</p>
                          <p className="mt-2 text-lg font-bold text-gray-900">{latestMonthlyReport.totalOrders}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Units sold</p>
                          <p className="mt-2 text-lg font-bold text-gray-900">{latestMonthlyReport.totalUnits}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Low stock</p>
                          <p className="mt-2 text-lg font-bold text-gray-900">{latestMonthlyReport.lowStockCount}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400">Reports are saved in history and can be exported at any time.</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => exportReportToCsv(latestMonthlyReport)}
                              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                              Export Report
                            </button>
                            <button
                              type="button"
                              onClick={() => exportReportHistoryToCsv(monthlyReports)}
                              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                              Export History
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReportHistoryOpen(prev => !prev)}
                          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                          {reportHistoryOpen ? "Hide history" : "Show history"}
                        </button>
                      </div>
                      {reportHistoryOpen && (
                        <div className="mt-4 rounded-2xl border border-gray-100 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-gray-900">Report history</p>
                            <p className="text-xs text-gray-500">{monthlyReports.length} report{monthlyReports.length === 1 ? "" : "s"}</p>
                          </div>
                          {monthlyReports.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-left text-sm text-gray-600">
                                <thead>
                                  <tr>
                                    <th className="px-3 py-2 font-semibold text-gray-900">Month</th>
                                    <th className="px-3 py-2 font-semibold text-gray-900">Revenue</th>
                                    <th className="px-3 py-2 font-semibold text-gray-900">Orders</th>
                                    <th className="px-3 py-2 font-semibold text-gray-900">Units</th>
                                    <th className="px-3 py-2 font-semibold text-gray-900">Top product</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {monthlyReports.map(report => (
                                    <tr key={report.id} className="border-t border-gray-200">
                                      <td className="px-3 py-2">{report.month} {report.year}</td>
                                      <td className="px-3 py-2">{formatCurrency(report.totalRevenue)}</td>
                                      <td className="px-3 py-2">{report.totalOrders}</td>
                                      <td className="px-3 py-2">{report.totalUnits}</td>
                                      <td className="px-3 py-2">{report.topProduct}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No closed month reports available yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                      No monthly report generated yet. Click “Close Month” to create one.
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mt-4">
                <p className="font-semibold text-gray-900 mb-4">Top-Selling Products</p>
                <div className="space-y-4">
                  {topSellingProducts.map((p,i) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedTopSellingProductName(p.name)}
                      className={`w-full rounded-2xl p-4 text-left transition-all ${selectedTopSellingProductName === p.name ? "border border-green-200 bg-green-50" : "border border-transparent hover:border-gray-200 hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-300 w-5">{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-semibold text-gray-900">{p.name}</span>
                            <span className="font-bold" style={{ color:OR }}>GHS {p.revenue.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width:`${Math.min(100, Math.round((p.sold / Math.max(...topSellingProducts.map(item => item.sold), 1)) * 100))}%`, background:G }} />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{p.sold} units sold</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mt-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Payment tracker</p>
                    <h2 className="font-bold text-xl text-gray-900">Paid orders & mobile money numbers</h2>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    {patientPayments.filter(payment => payment.status === "Paid").length} paid
                  </span>
                </div>
                <div className="space-y-3">
                  {patientPayments.filter(payment => payment.status === "Paid").length > 0 ? (
                    patientPayments
                      .filter(payment => payment.status === "Paid")
                      .slice(0, 8)
                      .map(payment => (
                        <div key={payment.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{payment.description}</p>
                              <p className="text-sm text-gray-500">{payment.date} • {payment.method}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">GHS {payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{payment.method === "Mobile Money" || payment.method === "Telecel Cash" ? payment.description : "—"}</p>
                            </div>
                          </div>
                          <div className="mt-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">Customer:</span> {payment.recipientName || "Not recorded"}
                            <br />
                            <span className="font-semibold text-gray-900">Mobile money number:</span> {payment.recipientNumber || "Not recorded"}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                      No paid orders have been recorded yet.
                    </div>
                  )}
                </div>
              </div>
              {selectedTopSellingProductData && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mt-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Selected product</p>
                      <h2 className="font-bold text-xl text-gray-900">{selectedTopSellingProductData.name}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTopSellingProductName(null)}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Units ordered</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedTopSellingProductData.sold}</p>
                      <p className="text-xs text-gray-500 mt-1">Total quantity across orders</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">GHS {selectedTopSellingProductData.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Total revenue from this product</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Last order</p>
                      <p className="text-base font-semibold text-gray-900">{selectedTopSellingProductLastOrder}</p>
                      <p className="text-xs text-gray-500 mt-1">Most recent purchase date</p>
                    </div>
                  </div>
                  {selectedTopSellingProductInventory && (
                    <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Inventory status</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs text-gray-400">Stock</p>
                          <p className="text-xl font-bold text-gray-900">{selectedTopSellingProductInventory.stock}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs text-gray-400">Min threshold</p>
                          <p className="text-xl font-bold text-gray-900">{selectedTopSellingProductInventory.min}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs text-gray-400">Category</p>
                          <p className="text-xl font-bold text-gray-900">{selectedTopSellingProductInventory.category}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>)}

            {/* ── INVENTORY ── */}
            {adminTab === "inventory" && (<>
              <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-bold text-gray-900">Inventory</h1>
                <button
                  onClick={() => setInventoryFormOpen(prev => !prev)}
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ background:G }}
                >
                  <Plus className="w-4 h-4" /> Add Stock
                </button>
              </div>
              {inventoryFormOpen && (
                <form onSubmit={handleInventorySubmit} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Product</label>
                      <select
                        value={inventoryFormData.item}
                        onChange={(e) => {
                          const selected = PRODUCTS.find(product => product.name === e.target.value);
                          setInventoryFormData(prev => ({ ...prev, item: e.target.value, category: selected?.category || prev.category }));
                        }}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                      >
                        {PRODUCTS.map(product => <option key={product.id} value={product.name}>{product.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Category</label>
                      <input
                        value={inventoryFormData.category}
                        onChange={(e) => setInventoryFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                        placeholder="e.g. Capsules"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Stock Added</label>
                      <input
                        type="number"
                        min="0"
                        value={inventoryFormData.stock}
                        onChange={(e) => setInventoryFormData(prev => ({ ...prev, stock: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Min Level</label>
                      <input
                        type="number"
                        min="0"
                        value={inventoryFormData.min}
                        onChange={(e) => setInventoryFormData(prev => ({ ...prev, min: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Unit</label>
                    <input
                      value={inventoryFormData.unit}
                      onChange={(e) => setInventoryFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-32 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                      placeholder="units"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background:G }}>
                      Save Stock
                    </button>
                    <button type="button" onClick={() => setInventoryFormOpen(false)} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {lowStock.length > 0 && (
                <div className="rounded-2xl p-4 border" style={{ background:"#fff1f2", borderColor:"#fca5a5" }}>
                  <p className="flex items-center gap-2 font-semibold text-sm mb-2" style={{ color:R }}><AlertTriangle className="w-4 h-4" /> Low Stock Alerts ({lowStock.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {lowStock.map(i => (
                      <button
                        key={i.item}
                        type="button"
                        onClick={() => openInventoryRestock(i.item)}
                        className="text-xs px-3 py-1 rounded-full transition hover:bg-red-100"
                        style={{ background:"#fee2e2", color:R }}
                      >
                        {i.item} — {i.stock} {i.unit}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-gray-400" style={{ background:"#f9fafb" }}>
                    <tr>
                      {["Item","In Stock","Min Level","Status"].map(h => (
                        <th key={h} className="px-5 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {inventoryItems.map(item => {
                      const isLow = item.stock < INVENTORY_SAFETY_THRESHOLD;
                      return (
                        <tr
                          key={item.item}
                          role="button"
                          onClick={() => openInventoryRestock(item.item)}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-3 font-semibold text-gray-900">{item.item}</td>
                          <td className="px-5 py-3 font-bold text-gray-900">{item.stock} {item.unit}</td>
                          <td className="px-5 py-3 text-gray-400">{item.min} {item.unit}</td>
                          <td className="px-5 py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                              style={ isLow ? { background:"#fee2e2", color:R } : { background:"#dcfce7", color:"#15803d" }}>
                              {isLow ? "Insufficient" : "Sufficient"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>)}

            {/* ── STAFF ── */}
            {adminTab === "staff" && (<>
              <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-bold text-gray-900">Staff Portal</h1>
                <button className="text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background:OR }}>
                  Post Announcement
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label:"Present", value: STAFF_LIST.filter(m => m.status === "Present").length, status: "Present", color:G },
                  { label:"On Leave", value: STAFF_LIST.filter(m => m.status === "Leave").length, status: "Leave", color:OR },
                  { label:"Remote", value: STAFF_LIST.filter(m => m.status === "Remote").length, status: "Remote", color:R },
                ].map(s => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setStaffFilter(prev => prev === s.status ? null : s.status)}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center transition hover:shadow-md"
                    style={{ borderColor: staffFilter === s.status ? s.color : "#e5e7eb" }}
                  >
                    <p className="text-3xl font-bold" style={{ color:s.color }}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-gray-400" style={{ background:"#f9fafb" }}>
                    <tr>{["Name","Role","Department","Schedule","Status"].map(h=><th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredStaff.map(s => {
                      const ss = statusStyle(s.status);
                      return (
                        <tr key={s.name} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background:G }}>
                                {s.name.split(" ").slice(-1)[0][0]}
                              </div>
                              <span className="font-semibold text-gray-900">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-400">{s.role}</td>
                          <td className="px-5 py-3 text-gray-400">{s.dept}</td>
                          <td className="px-5 py-3 font-semibold text-gray-900">{s.schedule}</td>
                          <td className="px-5 py-3"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background:ss.bg,color:ss.text }}>{s.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>)}

          </main>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // PUBLIC WEBSITE
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>

      {/* ─ Topbar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#8B2E1A] via-[#C45A1F] to-[#1C7A3A] px-1.5 py-1 text-white sm:px-4 sm:py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 text-[8px] font-semibold uppercase tracking-[0.15em] sm:justify-between sm:gap-3 sm:text-[11px]">
          <span className="ml-auto flex min-w-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-sm sm:ml-0 sm:gap-1.5 sm:px-3 sm:py-1.5"><Phone className="w-3 h-3 shrink-0" /> <span className="truncate">+233 055 837 9545</span></span>
          <span className="mr-auto flex min-w-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-1.5 py-1 shadow-sm backdrop-blur-sm sm:mr-0 sm:gap-1.5 sm:px-3 sm:py-1.5"><Mail className="w-3 h-3 shrink-0" /> <span className="truncate">Edhecman2@gmail.com</span></span>
          <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 shadow-sm backdrop-blur-sm"><Clock className="w-3 h-3" /> Mon–Fri 8AM–6PM · Sat 9AM–3PM</span>
        </div>
      </div>

      {/* ─ Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <button
            type="button"
            onClick={() => {
              if (view === "patient") {
                setView("public");
                setMenuOpen(false);
                return;
              }
              if (menuOpen) {
                setMenuOpen(false);
                return;
              }
              const homeSection = document.getElementById("home");
              homeSection?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex items-center gap-3 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-2 ring-emerald-100">
              <ImageWithFallback src={clinicLogo} alt="Edu Herbal Clinic logo"
                className="h-10 w-10 rounded-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-extrabold leading-tight tracking-tight" style={{ color:G }}>Edu Herbal Clinic</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color:R }}>Your Good Health Is Our Concern</p>
            </div>
          </button>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-6 rounded-full border border-gray-100 bg-gray-50/80 px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm">
            {[["#services","Services"],["#book","Book Now"],["#products","Products"],["#blog","Blog"],["#faq","FAQ"],["#contact","Contact"]].map(([href,lbl]) => (
              <a key={href} href={href} className="transition-colors hover:text-[#1C7A3A]">{lbl}</a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setView("patient")} className={`hidden rounded-full border px-4 py-2 text-sm font-semibold sm:flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isDarkMode ? "border-slate-700 bg-slate-800 text-slate-100" : "border-emerald-100 bg-white text-gray-700"}`} style={{ color: isDarkMode ? undefined : G }}>
              <LogIn className="w-4 h-4" /> Patient Portal
            </button>
            <a href="#book" className="hidden rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:inline-flex" style={{ background:`linear-gradient(90deg, ${OR}, ${R})` }}>
              Book Now
            </a>
          </div>

          <button className="lg:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {menuOpen && (
          <div className={`lg:hidden border-t px-4 py-4 shadow-lg flex flex-col gap-3 ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-gray-100 bg-white"}`}>
            {[["#services","Services"],["#book","Book Now"],["#products","Products"],["#blog","Blog"],["#faq","FAQ"],["#contact","Contact"]].map(([href,lbl]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className={`text-sm font-semibold py-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{lbl}</a>
            ))}
            <button onClick={() => { setView("patient"); setMenuOpen(false); }} className={`text-sm font-semibold text-left py-1 ${isDarkMode ? "text-slate-200" : "text-gray-700"}`} style={{ color:isDarkMode ? undefined : G }}>Patient Portal</button>
            <a href="#book" onClick={() => setMenuOpen(false)} className="w-full rounded-full px-4 py-2.5 text-center text-sm font-bold text-white" style={{ background:`linear-gradient(90deg, ${OR}, ${R})` }}>Book Now</a>
          </div>
        )}
      </nav>

      {/* ─ Hero ─────────────────────────────────────────────────────────── */}
      <section id="home" className="relative overflow-hidden">
        <div className="overflow-hidden">
          <div
            className={`flex ${isHeroTransitioning ? "transition-transform duration-700 ease-out" : "transition-none"}`}
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
          >
            {[...heroSlides, heroSlides[0]].map((slide, index) => (
              <HeroSlide key={`${slide.title}-${index}`} slide={slide} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroIndex(index)}
              className={`h-2.5 rounded-full transition-all ${index === (heroIndex % heroSlides.length) ? "w-8 bg-green-600" : "w-2.5 bg-white/70"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length + 1) % (heroSlides.length + 1))} className="rounded-full border border-white/40 bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setHeroIndex((prev) => (prev + 1) % (heroSlides.length + 1))} className="rounded-full border border-white/40 bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ─ Colour stripe ─────────────────────────────────────────────── */}
      <div className="h-2" style={{ background:`linear-gradient(to right,${R},${OR},${G})` }} />

      {/* ─ Services ──────────────────────────────────────────────────── */}
      <section id="services" className={`py-16 px-4 sm:py-24 ${isDarkMode ? "bg-slate-900" : "bg-[#f9fafb]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>What We Offer</p>
            <h2 className={`font-display text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Integrated Healthcare Services</h2>
            <p className={`mt-3 max-w-xl mx-auto ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>We provide you with safe and effective herbal medicines for our patients, Edu herbal Clinic believes in fast delivery of our products without causing any delays so that our patient can get their hands on the product as soon as possible.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title} className={`group overflow-hidden rounded-[1.75rem] border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-gray-100 bg-white"}`}>
                <div className="relative h-56 overflow-hidden rounded-b-[1.25rem]">
                  <ImageWithFallback src={s.image} alt={`${s.title} service preview`} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background:`${s.color}15` }}>
                    <s.icon className="w-6 h-6" style={{ color:s.color }} />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>{s.desc}</p>
                  <div className="flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all" style={{ color:s.color }}>
                    Learn more <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 px-4 sm:py-24 ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>What We Treat</p>
            <h2 className={`font-display text-3xl sm:text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Explore the conditions we support</h2>
            <p className={`mt-3 max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Swipe through our most requested areas of care, from kidney and prostate concerns to chronic conditions such as diabetes and hypertension.</p>
          </div>
          <div className="relative">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {WHAT_WE_DO_CARDS.map((card, index) => (
                  <CarouselItem key={card.title} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                    <div className={`h-full rounded-[1.5rem] border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-gray-100 bg-[#fcfcfc]"}`}>
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: index % 2 === 0 ? G : OR }}>
                        {index + 1}
                      </div>
                      <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{card.title}</h3>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>{card.desc}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex border-0 bg-white/90 shadow-md hover:bg-white" />
              <CarouselNext className="hidden sm:flex border-0 bg-white/90 shadow-md hover:bg-white" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* ─ Booking ───────────────────────────────────────────────────── */}
      <section id="book" className={`py-16 px-4 sm:py-24 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>Book Online</p>
            <h2 className={`font-display text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Book an Appointment</h2>
            <p className={`mt-3 ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>No calls needed — choose your doctor and preferred time in minutes.</p>
          </div>

          {bookingDone ? (
            <div className={`rounded-3xl p-12 text-center border ${isDarkMode ? "bg-slate-950" : "bg-white"}`} style={{ borderColor:`${G}30` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background:G }}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl text-gray-900 mb-2">Appointment Successful!</h3>
              <p className="text-gray-400 mb-6">Your appointment request was received successfully. We’ll confirm it via SMS and WhatsApp shortly.</p>
              {bookingSmsStatus ? (
                <p className="mb-4 text-sm font-semibold text-green-700">{bookingSmsStatus}</p>
              ) : null}
              <button onClick={() => setBookingDone(false)} className="text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity" style={{ background:G }}>
                Back to Booking
              </button>
            </div>
          ) : (
            <div className={`rounded-3xl border shadow-xl p-4 sm:p-8 ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-gray-100 bg-white"}`}>
              {/* Step indicator */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {["Service","Doctor","Details","Date & Time","Confirm"].map((step,i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={ i < bookingStep ? { background:G, color:W }
                             : i === bookingStep ? { background:OR, color:W, boxShadow:`0 0 0 4px ${OR}25` }
                             : { background:"#f3f4f6", color:"#9ca3af" }}>
                      {i < bookingStep ? <CheckCircle className="w-4 h-4" /> : i+1}
                    </div>
                    <span className="text-xs font-semibold hidden sm:block"
                      style={{ color: i===bookingStep ? OR : i<bookingStep ? G : "#9ca3af" }}>{step}</span>
                    {i<4 && <div className="w-6 h-0.5 hidden sm:block" style={{ background: i<bookingStep ? G : "#e5e7eb" }} />}
                  </div>
                ))}
              </div>

              {/* Step 0 */}
              {bookingStep===0 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Select a Service</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {["Herbal Consultation","Laboratory Tests","Telemedicine (Video)","Follow-up Visit","Prescription Refill","Skin & Dermatology"].map(s => (
                      <button key={s} onClick={() => setBooking(b => ({ ...b, service:s }))}
                        className="px-4 py-3.5 rounded-xl border-2 text-sm font-semibold text-left transition-all"
                        style={ booking.service===s
                          ? { borderColor:G, background:`${G}0e`, color:G }
                          : { borderColor:"#e5e7eb", color:"#374151" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 */}
              {bookingStep===1 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Choose Your Doctor</p>
                  <div className="space-y-3">
                    {DOCTORS.map(d => (
                      <button key={d.id} onClick={() => setBooking(b => ({ ...b, doctorId:d.id }))}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all"
                        style={ booking.doctorId===d.id ? { borderColor:G, background:`${G}0a` } : { borderColor:"#e5e7eb" }}>
                        <div className="w-11 h-11 rounded-full text-white font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ background:G }}>{d.initials}</div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-gray-900">{d.name}</p>
                          <p className="text-sm text-gray-400">{d.specialty}</p>
                        </div>
                        {booking.doctorId===d.id && <CheckCircle className="w-5 h-5" style={{ color:G }} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {bookingStep===2 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Tell Us About You</p>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500 mb-2 block">Full Name</label>
                      <input value={booking.fullName} onChange={e => setBooking(b => ({ ...b, fullName:e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors"
                        style={{ background:"#f9fafb" }} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor="#e5e7eb"} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-500 mb-2 block">Phone Number</label>
                        <input value={booking.phone} onChange={e => setBooking(b => ({ ...b, phone:e.target.value }))}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors"
                          style={{ background:"#f9fafb" }} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor="#e5e7eb"} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500 mb-2 block">Email Address</label>
                        <input type="email" value={booking.email} onChange={e => setBooking(b => ({ ...b, email:e.target.value }))}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors"
                          style={{ background:"#f9fafb" }} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor="#e5e7eb"} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500 mb-2 block">Additional Note</label>
                      <textarea value={booking.notes} onChange={e => setBooking(b => ({ ...b, notes:e.target.value }))}
                        rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors resize-none"
                        style={{ background:"#f9fafb" }} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor="#e5e7eb"} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {bookingStep===3 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Select Date & Time</p>
                  <div className="mb-5">
                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Preferred Date</label>
                    <input type="date" value={booking.date} min={new Date().toISOString().split("T")[0]}
                      onChange={e => setBooking(b => ({ ...b, date:e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-colors"
                      style={{ background:"#f9fafb" }}
                      onFocus={e => e.currentTarget.style.borderColor=G}
                      onBlur={e => e.currentTarget.style.borderColor="#e5e7eb"} />
                  </div>
                  <label className="text-sm font-semibold text-gray-500 mb-3 block">Available Times</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(DOCTORS.find(d=>d.id===booking.doctorId)||DOCTORS[0]).slots.map(t => (
                      <button key={t} onClick={() => setBooking(b => ({ ...b, time:t }))}
                        className="py-3 rounded-xl border-2 text-sm font-bold transition-all"
                        style={ booking.time===t
                          ? { borderColor:OR, background:OR, color:W }
                          : { borderColor:"#e5e7eb", color:"#374151" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {bookingStep===4 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Confirm Your Booking</p>
                  <div className="rounded-2xl p-5 space-y-3 mb-5 border" style={{ background:`${G}0a`, borderColor:`${G}25` }}>
                    {[
                      ["Service", booking.service],
                      ["Doctor",  DOCTORS.find(d=>d.id===booking.doctorId)?.name||"—"],
                      ["Full Name", booking.fullName||"—"],
                      ["Phone", booking.phone||"—"],
                      ["Email", booking.email||"—"],
                      ["Additional Note", booking.notes||"—"],
                      ["Date",    booking.date||"—"],
                      ["Time",    booking.time||"—"],
                    ].map(([k,v]) => (
                      <div key={k} className="flex justify-between text-sm gap-3">
                        <span className="text-gray-400">{k}</span>
                        <span className="font-bold text-gray-900 text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    A confirmation is sent via SMS and WhatsApp immediately. An automatic reminder is sent 24 hours before your appointment.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {bookingStep > 0 && (
                  <button onClick={() => setBookingStep(s => s-1)} className="px-5 py-3 rounded-full border-2 border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                )}
                <button onClick={advanceBooking}
                  disabled={!canContinue}
                  className="flex-1 text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background:G, boxShadow:`0 6px 20px ${G}30` }}>
                  {bookingStep<4 ? "Continue" : "Confirm Appointment"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─ Products ──────────────────────────────────────────────────── */}
      <section id="products" className={`py-16 px-4 sm:py-24 ${isDarkMode ? "bg-slate-900" : "bg-[#f9fafb]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col items-center text-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>Our Products</p>
              <h2 className={`font-display text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Herbal Products Catalogue</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(p => (
              <div key={p.id} className={`rounded-2xl overflow-hidden border shadow-sm group hover:shadow-xl transition-all hover:-translate-y-1 ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-gray-100 bg-white"}`}>
                <div className="relative h-72 overflow-hidden" style={{ background:`${G}12` }}>
                  <img src={p.img} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                </div>
                <div className="p-5">
                  <h3 className={`font-bold mb-1.5 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{p.name}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>{p.desc}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-2xl font-bold" style={{ color:G }}>GHS {p.price}</span>
                    <div className="flex items-center gap-2">
                      {cart[p.id] ? (
                        <button onClick={() => removeFromCart(p.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100">
                          Remove
                        </button>
                      ) : null}
                      <button onClick={() => addToCart(p.id)}
                        className="flex items-center gap-1.5 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
                        style={{ background:OR }}>
                        <ShoppingBag className="w-3.5 h-3.5" /> {cart[p.id] ? `Add (${cart[p.id]})` : "Order"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {Object.keys(cart).length > 0 && (
            <div className="mt-8 rounded-2xl p-5 text-white shadow-lg" style={{ background:G }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{Object.keys(cart).length} product(s) in cart</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg" style={{ color:"#fed7aa" }}>GHS {Object.entries(cart).reduce((s,[id,qty]) => s+((PRODUCTS.find(p=>p.id===Number(id))?.price||0)*qty), 0)}</span>
                  <button onClick={handleCheckout} className="text-white px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ background:OR }}>Checkout</button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(cart).map(([id, qty]) => {
                  const product = PRODUCTS.find(p => p.id === Number(id));
                  if (!product) return null;
                  return (
                    <div key={product.id} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm">
                      <div className="flex-1">
                        <span>{product.name}</span>
                        <span className="ml-2 text-white/70">× {qty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(product.id)} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors">−</button>
                        <span className="w-8 text-center">{qty}</span>
                        <button onClick={() => addToCart(product.id)} className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─ Testimonials ──────────────────────────────────────────────── */}
      <section className={`py-16 px-4 sm:py-24 ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>Patient Stories</p>
            <h2 className={`font-display text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Results That Speak</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="rounded-2xl p-6 border hover:shadow-md transition-shadow" style={{ background:`${G}08`, borderColor:`${G}18` }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length:t.rating }).map((_,j) => <Star key={j} className="w-4 h-4" style={{ fill:OR, color:OR }} />)}
                </div>
                <p className={`leading-relaxed mb-5 italic text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor:`${G}18` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background:G }}>
                    {t.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{t.name}</p>
                    <p className="text-xs font-semibold" style={{ color:R }}>{t.condition} · {t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─ Colour stripe ─────────────────────────────────────────────── */}
      <div className="h-1.5" style={{ background:`linear-gradient(to right,${G},${OR},${R})` }} />

      {/* ─ Blog ──────────────────────────────────────────────────────── */}
      <section id="blog" className={`py-16 px-4 sm:py-24 ${isDarkMode ? "bg-slate-900" : "bg-[#f9fafb]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>Health Education</p>
              <h2 className={`font-display text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>From Our Clinic Blog</h2>
            </div>
          </div>

          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
            <div className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-gradient-to-br from-white via-green-50/70 to-orange-50/60">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${blogIndex * 100}%)` }}
                onMouseEnter={() => setBlogAutoPlaying(false)}
                onMouseLeave={() => setBlogAutoPlaying(true)}
              >
                {blogPosts.map((b, i) => (
                  <article key={i} className="w-full shrink-0 lg:grid lg:grid-cols-[1.05fr_0.95fr] items-center">
                    <div className="relative h-64 lg:h-[420px] overflow-hidden">
                      <img src={b.image}
                        alt={b.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent" />
                      <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white" style={{ background:R }}>
                        {b.category}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-8 sm:p-10">
                      <div className="inline-flex w-fit items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color:G }}>
                        Next update
                      </div>
                      <h3 className={`mt-4 font-display text-2xl sm:text-3xl ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{b.title}</h3>
                      <div className={`mt-3 flex items-center gap-2 text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                        <span>{b.date}</span><span>·</span><span>{b.readTime} read</span>
                      </div>
                      <p className={`mt-4 text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>{b.excerpt}</p>
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold" style={{ color:G }}>
                        Explore article <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {blogPosts.map((b, index) => (
              <button key={b.title} onClick={() => setBlogIndex(index)} className={`h-2.5 rounded-full transition-all duration-300 ${index === blogIndex ? "w-8 bg-green-600" : "w-2.5 bg-gray-300"}`} aria-label={`Go to ${b.title}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ─ Awards / Recognition ─────────────────────────────────────── */}
      <section className={`pt-2 pb-12 px-4 ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>Clinic Recognition</p>
            <h2 className={`font-display text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Awards & Achievements</h2>
            <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>A polished showcase of the recognition, professionalism and trusted care that define Edu Herbal Clinic.</p>
          </div>

          <div className="rounded-[2rem] border border-gray-200 shadow-xl bg-gray-50 p-3 sm:p-4">
            <div className="overflow-hidden rounded-[1.5rem]">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${awardIndex * (100 / slidesPerView)}%)` }}
              >
                {[...AWARD_GALLERY, ...AWARD_GALLERY].map((item, index) => (
                  <div key={`${item.title}-${index}`} className="shrink-0 px-2" style={{ width: `${100 / slidesPerView}%` }}>
                    <div className="group relative h-64 overflow-hidden rounded-[1.2rem] border border-gray-200 bg-white shadow-sm">
                      <ImageWithFallback
                        src={item.src}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: OR }}>Recognition</p>
                        <h4 className="mt-1 text-sm font-semibold">{item.title}</h4>
                        <p className="mt-1 text-xs text-gray-100">{item.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {AWARD_GALLERY.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setAwardIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${index === awardIndex ? "w-8 bg-green-600" : "w-2.5 bg-gray-300"}`}
                  aria-label={`Go to ${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─ FAQ ───────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 px-4 sm:py-24" style={{ background:G }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>Common Questions</p>
            <h2 className="font-display text-4xl text-white mt-2">Frequently Asked</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq,i) => (
              <div key={i} className="rounded-xl overflow-hidden border" style={{ background:"rgba(255,255,255,0.1)", borderColor:"rgba(255,255,255,0.15)" }}>
                <button onClick={() => setActiveFaq(activeFaq===i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
                  <span className="font-semibold text-white text-sm">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" style={{ color:OR, transform:activeFaq===i?"rotate(180deg)":"" }} />
                </button>
                {activeFaq===i && (
                  <div className="px-5 pb-4">
                    <p className="text-green-100 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─ Contact ───────────────────────────────────────────────────── */}
      <section id="contact" className={`py-16 px-4 sm:py-24 ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color:OR }}>Find Us</p>
            <h2 className={`font-display text-4xl mt-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Contact & Directions</h2>
          </div>
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {/* WhatsApp */}
              <a href="https://wa.me/2330558379545" className="w-full text-white rounded-2xl p-5 flex items-center gap-4 hover:opacity-90 transition-opacity" style={{ background:"#25D366" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"rgba(255,255,255,0.2)" }}>
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">WhatsApp Chat</p>
                  <p className="text-green-100 text-xs">Instant reply from our team</p>
                  <p className="font-bold mt-0.5">+233 055 837 9545</p>
                </div>
              </a>

              {/* Info rows */}
              {[
                { icon:Phone, label:"Main Line",      value:"+233 055 837 9545",          color:G  },
                { icon:Mail,  label:"Email",           value:"Edhecman2@gmail.com",  color:OR },
                { icon:MapPin,label:"Address",         value:"Odorkor Official Town & Mankessim - Bafikrom", color:R },
                { icon:Clock, label:"Opening Hours",   value:"Mon–Fri 8AM–6PM · Sat 9AM–3PM", color:G },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:`${item.color}15` }}>
                    <item.icon className="w-4 h-4" style={{ color:item.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Locations */}
            <div className="lg:col-span-3 grid gap-4 md:grid-cols-2">
              {locationCards.map((location) => (
                <div key={location.title} className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-[0_16px_45px_rgba(0,0,0,0.08)] flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full shadow-sm" style={{ background: `${location.accent}15` }}>
                      <MapPin className="h-5 w-5" style={{ color: location.accent }} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{location.title}</p>
                      <p className="text-sm text-gray-500">{location.subtitle}</p>
                    </div>
                  </div>
                  <div className="rounded-[1rem] border border-gray-100 bg-gray-50 p-3">
                    <div className="overflow-hidden rounded-[0.9rem] border border-gray-100">
                      <iframe
                        title={`${location.title} map preview`}
                        src={location.embedUrl}
                        className="h-32 w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-700">{location.address}</p>
                  </div>
                  <button type="button" onClick={() => { setActiveMapLocation(location); setMapModalOpen(true); }} className="mt-auto inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity" style={{ background: location.accent }}>
                    {location.buttonLabel} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {mapModalOpen && activeMapLocation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-3 py-4 sm:px-6" onClick={() => { setMapModalOpen(false); setActiveMapLocation(null); }}>
          <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: OR }}>Directions</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-gray-900">{activeMapLocation.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{activeMapLocation.address}</p>
              </div>
              <button type="button" onClick={() => { setMapModalOpen(false); setActiveMapLocation(null); }} className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="overflow-hidden rounded-[1.25rem] border border-gray-100">
                <iframe
                  title={`${activeMapLocation.title} location map`}
                  src={activeMapLocation.embedUrl}
                  className="h-[420px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-4 rounded-[1.1rem] border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">{activeMapLocation.address}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{activeMapLocation.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─ Careers banner ────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:py-20" style={{ background: `linear-gradient(135deg, ${G} 0%, ${OR} 55%, ${R} 100%)` }}>
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-7 lg:p-9">
            <div className="flex flex-col gap-5 lg:items-center lg:justify-between">
              <div className="max-w-3xl text-center">
                <h3 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">Skilled - Traditional Herbal Experts are Always Available to Assist You</h3>
                <p className="mt-3 text-sm leading-relaxed text-orange-50 sm:text-base">We bring together compassionate professionals, herbal specialists, and supportive care teams to guide every patient with dedication and experience.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Dr Edu Mohammed",
                  desc: "Specialists who combine traditional knowledge with modern care principles.",
                  image: service5Image,
                },
                {
                  title: "Skilled Clinical Team",
                  desc: "Nurses, lab technicians and caregivers working together for better outcomes.",
                  image: service4Image,
                },
                {
                  title: "Supportive Admin Staff",
                  desc: "Friendly professionals helping patients book, follow up and feel cared for.",
                  image: skilled3Image,
                  imageClass: "h-full w-full object-cover object-center scale-110 transition-transform duration-500 hover:scale-[1.25]",
                  imageStyle: { objectPosition: 'center 20%' },
                },
              ].map((card) => (
                <div key={card.title} className="overflow-hidden rounded-[1.45rem] border border-white/40 bg-white/95 shadow-[0_20px_55px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(0,0,0,0.22)]">
                  <div className="relative mx-3 mt-3 h-56 overflow-hidden rounded-[1.15rem] sm:h-64">
                    <ImageWithFallback
                      src={card.image}
                      alt={card.title}
                      className={card.imageClass ?? "h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"}
                      style={card.imageStyle}
                    />
                    <div className="absolute inset-0 rounded-[1.15rem] bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-20 rounded-b-[1.15rem] bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="px-4 pb-4 pt-3 text-center">
                    <h4 className="font-display text-base font-semibold text-gray-900">{card.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─ Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 px-4 py-10 text-gray-400 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full" style={{ border:`2px solid ${G}50` }}>
                <ImageWithFallback src={clinicLogo} alt="EDHEC logo" className="h-full w-full object-contain bg-white p-0.5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold leading-none text-white">Edu Herbal Clinic</p>
                <p className="mt-0.5 text-[11px]" style={{ color:OR }}>EDHEC</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">Evidence-based herbal medicine rooted in tradition, validated by science.</p>
          </div>
          {[
            { heading:"Patient Services", links:["Book Appointment","Patient Portal","Prescriptions","Lab Results","Order Products","Refill Request"] },
            { heading:"Clinic", links:["About Us","Our Doctors","Services","Blog","FAQ","Careers","Complaints Portal"] },
          ].map(col => (
            <div key={col.heading}>
              <p className="mb-3 text-sm font-bold text-white">{col.heading}</p>
              <ul className="space-y-2 text-sm">
                {col.links.map(l => (
                  <li key={l}>
                    <button className="text-left transition-colors hover:text-white" style={{ color:"inherit" }}>{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="mb-3 text-sm font-bold text-white">Contact</p>
            <ul className="mb-4 space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-emerald-300" /> <span>+233 055 837 9545</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-emerald-300" /> <span>Edhecman2@gmail.com</span></li>
            </ul>
            <p className="mb-3 text-sm font-bold text-white">Follow</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                { label:"Facebook", href:"https://web.facebook.com/profile.php?id=61550356619830", icon:(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M13.5 22v-9h3l.5-3h-3.5V4.5c0-.9.3-1.5 1.5-1.5H17V.1C16.4.1 15.4 0 14.1 0 11.8 0 10 1.6 10 4.6V10H7v3h3v9h3.5Z" /></svg>) },
                { label:"Twitter", href:"https://twitter.com", icon:(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M18.9 2H22l-6.7 7.7L23.4 22h-5.8l-4.6-6-5.2 6H1.2l7.1-8.1L.6 2h5.9l4.2 5.5L18.9 2Zm-1 18h1.1L6.2 4H5.1l12.8 16Z" /></svg>) },
                { label:"Instagram", href:"https://instagram.com", icon:(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.2-3.7a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Z" /></svg>) },
                { label:"YouTube", href:"https://youtube.com", icon:(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M23.5 6.4a3 3 0 0 0-2.1-2.1C19.6 3.7 12 3.7 12 3.7s-7.6 0-9.4.6A3 3 0 0 0 .5 6.4 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.6 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.6ZM9.7 15.8V8.2l6.5 3.8-6.5 3.8Z" /></svg>) },
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  onClick={() => {
                    if (social.label === "Facebook") {
                      setFacebookModalOpen(true);
                    } else {
                      window.open(social.href, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-all hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 Edu Herbal Clinic (EDHEC). All rights reserved.</span>
        </div>
      </footer>

      {facebookModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Edu Herbal Clinic on Facebook</p>
                <p className="text-xs text-gray-500">Embedded Facebook profile page</p>
              </div>
              <button type="button" onClick={() => setFacebookModalOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[80vh] bg-gray-100">
              <iframe
                title="Edu Herbal Clinic Facebook"
                src="https://web.facebook.com/profile.php?id=61550356619830"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─ Floating action buttons ────────────────────────────────────── */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-40">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          style={{ background: isDarkMode ? OR : G }}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <a href="https://wa.me/2330558379545" target="_blank" rel="noreferrer"
          className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          style={{ background:"#25D366" }} title="WhatsApp">
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* ─ AI Chat widget ─────────────────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 z-50">
        {chatOpen ? (
          <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height:420 }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ background:G }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:OR }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">EduBot</p>
                  <p className="text-green-200 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#4ade80", display:"inline-block" }} /> Online 24/7
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-green-200 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background:"#f9fafb" }}>
              {chatMessages.map((m,i) => (
                <div key={i} className={`flex ${m.role==="user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={ m.role==="user"
                      ? { background:G, color:W, borderBottomRightRadius:4 }
                      : { background:W, color:"#111827", borderBottomLeftRadius:4, border:"1px solid #e5e7eb" }
                    }>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&sendChat()}
                placeholder="Ask me anything…"
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none" />
              <button onClick={sendChat} className="w-9 h-9 rounded-xl text-white flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0" style={{ background:G }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setChatOpen(true)}
            className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform relative"
            style={{ background:G }}>
            <Bot className="w-7 h-7" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white animate-pulse" style={{ background:OR }} />
          </button>
        )}
      </div>
    </div>
  );
}
