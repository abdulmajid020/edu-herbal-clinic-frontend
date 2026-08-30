import { useState, useRef, useEffect } from "react";
import {
  Calendar, Phone, MapPin, MessageCircle, ShoppingBag,
  ChevronDown, ChevronLeft, Star, Clock, Users, TrendingUp, Package,
  Leaf, Stethoscope, AlertTriangle, Search, CheckCircle,
  ArrowRight, Menu, X, LogIn, PhoneCall, PhoneMissed, PhoneForwarded,
  Send, Plus, Mail, Shield, ChevronRight, Bot, LogOut,
  Inbox, Microscope, Moon, Sun, Trash2, Megaphone, Pencil,
  FlaskConical, Footprints, BedDouble, Ambulance, Home, UserCheck
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/app/components/ui/carousel";
import { AuthService, getAuthToken, StaffUser, ProductService, InventoryService, AppointmentService, PatientService, CallService, CallLog, StaffService, StaffMember, StaffAnnouncement, OrderService, PaymentService, ChatService } from "@/services";
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
  status: "Paid" | "Pending" | "Refunded";
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

type PatientChatMessage = {
  role: "user" | "bot";
  text: string;
  createdAt: string;
  phone?: string;
  patientName?: string;
  sender?: "patient" | "edubot" | "staff";
  handoverRequested?: boolean;
  handoverHandled?: boolean;
  handoverClosed?: boolean;
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
    stats: [["24/7", "Support", G], ["Same Day", "Appointments", OR], ["Just A", "Call Away", R]],
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
  services:     "We offer herbal consultations, laboratory tests, herbal products, online booking, diagnostic scans, telemedicine, physiotherapy, private and general wards, and community clinic-on-wheels services.",
  location:     "We are at Odorkor Official Town & Mankessim - Bafikrom. Branches in Tema and Kumasi. 📍",
  located:     "We are at Odorkor Official Town & Mankessim - Bafikrom. Branches in Tema and Kumasi. 📍",
  ceo:          "The CEO of Edu Herbal Clinic is Dr. Edu Mohammed.",
  open:         "We are open Mon–Fri 8 AM–6 PM and Saturday 9 AM–3 PM. Closed Sundays. 🕗",
  hours:        "Opening hours: Mon–Fri 8 AM–6 PM · Saturday 9 AM–3 PM · Sunday Closed.",
  consultation: "Initial consultation: GHS 250 (adults) · GHS 180 (children under 12). Follow-ups: GHS 150.",
  fee:          "Initial consultation: GHS 250 (adults) · GHS 180 (children). Follow-ups: GHS 150.",
  price:        "Herbal products range GHS 35–85. Consultations start at GHS 150.",
  cost:         "Initial consultation: GHS 250 (adults) · GHS 180 (children). Follow-ups: GHS 150.",
  book:         "Book online via our booking form on this page, or WhatsApp +233 055 837 9545. 📅",
  appointment:  "Use our online booking form above, or WhatsApp +233 055 837 9545. 📅",
  need:         "An appointment is recommended so a practitioner can review your needs, but you can contact us for guidance and availability.",
  kidney:       "We provide assessment and herbal care support for kidney and prostate concerns. Please consult a practitioner for an individual treatment plan.",
  prostate:     "We provide assessment and herbal care support for kidney and prostate concerns. Please consult a practitioner for an individual treatment plan.",
  infertility:  "We provide consultations for infertility and sexual weakness. A practitioner will assess the individual situation and recommend appropriate care.",
  sexual:       "We provide consultations for infertility and sexual weakness. A practitioner will assess the individual situation and recommend appropriate care.",
  sciatica:     "Yes, we offer care for sciatica and related pain, including physiotherapy support. Please book a consultation for an assessment.",
  malaria:      "Yes, malaria is one of the conditions we support. If symptoms are severe or urgent, seek immediate medical care as well as contacting the clinic.",
  asthma:       "We offer consultations for asthma and respiratory concerns. Please seek urgent medical care for severe breathing difficulty.",
  diabetes:     "We offer herbal care support for Type 2 Diabetes. A practitioner should review your condition and current medicines before recommending a plan.",
  stroke:       "We offer post-stroke rehabilitation support. Stroke symptoms can be an emergency, so seek urgent medical care immediately for new or worsening symptoms.",
  hypertension: "We offer herbal care support for hypertension. A practitioner should review your readings and current medicines before recommending a plan.",
  cancer:       "We offer supportive consultations for people living with cancer, but our products should not replace oncology treatment. Please speak with your medical team and our practitioner.",
  herbal:      `We have ${PRODUCTS.map(product => product.name).join(", ")}. You can ask me to add a product to your cart, remove it, or clear the cart.`,
  safe:         "Our herbal products are made with natural ingredients and quality controls, but safety depends on your health and medicines. Please consult a practitioner before use.",
  treatment:    "Treatment length depends on your condition, assessment, and response. The practitioner will explain the expected plan during consultation.",
  without:     "Yes. You can order available products through this chat without visiting first. I can add them to your cart for checkout.",
  deliver:     "Yes, delivery can be arranged. Delivery availability and timing depend on your location.",
  delivery:    "Delivery charges depend on your location. The clinic team will confirm the exact fee before fulfillment.",
  contact:     "You can contact the doctor or herbal practitioner through WhatsApp at +233 055 837 9545 or call the clinic for assistance.",
  insurance:    "Just a call away — our team is ready to help with your care and appointment needs.",
  default:      "Thank you! For detailed queries our team will assist through WhatsApp at +233 055 837 9545. 🌿",
};

const encodeChatBytes = (bytes: Uint8Array) => {
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

const decodeChatBytes = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0));

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

  const getStoredCallLogs = (): CallLog[] => {
    return CALLS as unknown as CallLog[];
  };

  const getStoredPatientChat = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("eduPatientChatAdmin");
        const parsed = stored ? JSON.parse(stored) : null;
        if (Array.isArray(parsed)) {
          return (parsed as PatientChatMessage[]).map(message => ({
            ...message,
            text: message.text.replace(/\+233\s*30\s*123\s*4567/g, "+233 055 837 9545"),
          }));
        }
      } catch {
        // fall back to an empty chat log
      }
    }
    return [] as PatientChatMessage[];
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
  const [callLogEntries, setCallLogEntries] = useState<CallLog[]>(getStoredCallLogs);
  const [chatOpen,      setChatOpen     ] = useState(false);
  const [chatInput,     setChatInput    ] = useState("");
  const [chatMessages,  setChatMessages ] = useState([{ role:"bot", text:"Hello! I am EduBot, your 24/7 assistant at Edu Herbal Clinic. How can I help you today? 🌿" }]);
  const [patientChat, setPatientChat] = useState<PatientChatMessage[]>(getStoredPatientChat);
  const [chatAuthenticated, setChatAuthenticated] = useState(false);
  const [chatPatientName, setChatPatientName] = useState("");
  const [chatPhone, setChatPhone] = useState("");
  const [chatPhoneInput, setChatPhoneInput] = useState("");
  const [chatAuthError, setChatAuthError] = useState("");
  const [chatFlow, setChatFlow] = useState<"idle" | "appointment-service" | "appointment-name" | "appointment-date" | "appointment-time" | "order-product" | "order-quantity" | "remove-product" | "remove-quantity">("idle");
  const [chatAppointment, setChatAppointment] = useState({ service:"", fullName:"", date:"", time:"" });
  const [chatOrderProduct, setChatOrderProduct] = useState<typeof PRODUCTS[number] | null>(null);
  const [chatEncryptionReady, setChatEncryptionReady] = useState(false);
  const [adminChatDrafts, setAdminChatDrafts] = useState<Record<string, string>>({});
  const [adminTab,      setAdminTab     ] = useState<AdminTab>("overview");
  const [adminMobileMenuOpen, setAdminMobileMenuOpen] = useState(false);
  const [patientTab,    setPatientTab   ] = useState("orders");
  const [cart,          setCart         ] = useState<Record<number,number>>({});
  const [staffMembers,  setStaffMembers ] = useState<StaffMember[]>(() => STAFF_LIST.map((s, idx) => ({ id: idx + 1, ...s, department: s.dept, status: s.status as "Present" | "Leave" | "Remote" })));
  const [staffAnnouncements, setStaffAnnouncements] = useState<StaffAnnouncement[]>([
    {
      id: 1,
      title: "Monthly All-Staff Clinical Briefing",
      message: "Reminder: All clinical and dispensary staff are requested to attend the monthly patient care review this Friday at 4:30 PM.",
      author: "Dr. Edu Mohammed",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "Clinical",
    schedule: "8AM–5PM",
    status: "Present" as "Present" | "Leave" | "Remote",
  });
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: "",
    message: "",
    date: "",
    time: "",
  });
  const [staffFilter,   setStaffFilter  ] = useState<"Present" | "Leave" | "Remote" | null>(null);
  const [staffSearch,   setStaffSearch  ] = useState("");
  const filteredStaff = staffMembers.filter(member => {
    const matchesFilter = !staffFilter || member.status === staffFilter;
    const query = staffSearch.toLowerCase().trim();
    const matchesSearch = !query || `${member.name} ${member.role} ${member.department || member.dept || ""} ${member.phone || ""}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
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
  const [crmBookModalOpen, setCrmBookModalOpen] = useState(false);
  const [crmBookPatient, setCrmBookPatient] = useState<PatientEntry | null>(null);
  const [crmBookFormData, setCrmBookFormData] = useState({
    doctorId: DOCTORS[0].id,
    service: "Herbal Consultation",
    date: "",
    time: "10:00 AM",
  });
  const [inventoryItems, setInventoryItems] = useState<any[]>(INVENTORY);
  const [inventoryLoading, setInventoryLoading] = useState(false);
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
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(null);
  const [adminMode, setAdminMode] = useState<"login" | "signup" | "reset">("login");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [adminResetPassword, setAdminResetPassword] = useState("");
  const [adminResetConfirmPassword, setAdminResetConfirmPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [activeMapLocation, setActiveMapLocation] = useState<{ title:string; subtitle:string; address:string; desc:string; buttonLabel:string; accent:string; embedUrl:string } | null>(null);
  const [socialModal, setSocialModal] = useState<{ label: string; href: string } | null>(null);
  const chatEncryptionKeyRef = useRef<CryptoKey | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const chatBroadcastRef = useRef<BroadcastChannel | null>(null);

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

  const scrollToChatBottom = (smooth = true) => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
    chatEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "nearest" });
  };

  useEffect(() => {
    if (chatOpen && chatAuthenticated) {
      scrollToChatBottom(false);
      const timer = window.setTimeout(() => scrollToChatBottom(true), 80);
      return () => window.clearTimeout(timer);
    }
  }, [chatMessages, chatOpen, chatAuthenticated]);

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

    // Verify existing token on initial mount
    const token = getAuthToken();
    if (token) {
      AuthService.getMe()
        .then((res) => {
          if (res.success && res.user) {
            setCurrentStaffUser(res.user);
            setAdminAuthenticated(true);
          }
        })
        .catch(() => {
          AuthService.logout();
          setCurrentStaffUser(null);
          setAdminAuthenticated(false);
        });
    }

    // Live fetch of Products and Inventory from backend
    InventoryService.getInventory()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setInventoryItems(res.data);
        }
      })
      .catch(err => console.warn("[INVENTORY] Live fetch error, using default inventory:", err));

    ProductService.getProducts()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Synchronize products data with backend
        }
      })
      .catch(err => console.warn("[PRODUCTS] Live fetch error, using default products:", err));

    // Live fetch of Call Centre Logs from backend
    CallService.getCalls()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCallLogEntries(res.data);
        }
      })
      .catch(err => console.warn("[CALLS] Live fetch error, using default calls:", err));

    // Live fetch of Patients CRM from backend
    PatientService.getPatients()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCrmPatients(res.data.map(p => ({
            id: p.id,
            name: p.name,
            phone: p.phone,
            condition: p.condition,
            lastVisit: p.lastVisit || "Active",
            nextAppt: p.nextAppt || "Pending",
            doctor: p.assignedDoctorName || "Dr. Edu Mohammed",
            status: p.status,
            balance: p.balance || 0,
            products: p.products || [p.condition],
          })));
        }
      })
      .catch(err => console.warn("[PATIENTS] Live fetch error, using default patients:", err));

    // Live fetch of Appointments from backend
    AppointmentService.getAppointments()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPatientAppointments(res.data.map(a => ({
            id: a.id,
            patientName: a.patientName,
            phone: a.phone,
            service: a.service,
            doctor: a.doctorName,
            date: a.date,
            time: a.time,
            status: (a.status === "Cancelled" ? "Pending" : a.status) as PatientAppointment["status"],
            createdAt: a.createdAt || new Date().toISOString(),
          })));
        }
      })
      .catch(err => console.warn("[APPOINTMENTS] Live fetch error, using default appointments:", err));

    // Live fetch of Staff List and Announcements from backend
    StaffService.getStaffList()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setStaffMembers(res.data);
          if (Array.isArray(res.announcements) && res.announcements.length > 0) {
            setStaffAnnouncements(res.announcements);
          }
        }
      })
      .catch(err => console.warn("[STAFF] Live fetch error, using default staff:", err));

    // Live fetch of Orders and Payments from backend
    OrderService.getOrders()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPatientOrders(res.data.map(o => ({
            id: o.id,
            description: o.description,
            amount: o.amount,
            date: o.date,
            method: o.method,
            items: o.items || [],
            createdAt: o.createdAt || new Date().toISOString(),
          })));
        }
      })
      .catch(err => console.warn("[ORDERS] Live fetch error, using default orders:", err));

    PaymentService.getPayments()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPatientPayments(res.data.map(p => ({
            id: p.id,
            description: p.description,
            amount: p.amount,
            date: p.date,
            method: p.method,
            status: p.status as "Paid" | "Pending" | "Refunded",
            recipientName: p.recipientName,
            recipientNumber: p.recipientNumber,
            createdAt: p.createdAt || new Date().toISOString(),
          })));
        }
      })
      .catch(err => console.warn("[PAYMENTS] Live fetch error, using default payments:", err));

    // Live fetch of Chat conversations from backend
    ChatService.getAdminConversations()
      .then(res => {
        if (res.success && Array.isArray(res.conversations) && res.conversations.length > 0) {
          const flatMessages = res.conversations.flatMap(c => c.messages || []);
          if (flatMessages.length > 0) {
            setPatientChat(flatMessages.map(m => ({
              role: m.role,
              text: m.text,
              createdAt: m.createdAt,
              phone: m.phone,
              patientName: m.patientName || undefined,
              sender: m.sender,
              handoverRequested: m.handoverRequested,
              handoverHandled: m.handoverHandled,
              handoverClosed: m.handoverClosed,
            })));
          }
        }
      })
      .catch(err => console.warn("[CHAT] Live fetch error, using local chat store:", err));
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
    if (typeof window === "undefined" || !window.crypto?.subtle) return;
    void window.crypto.subtle.generateKey({ name:"AES-GCM", length:256 }, true, ["encrypt", "decrypt"])
      .then(key => {
        chatEncryptionKeyRef.current = key;
        setChatEncryptionReady(true);
      });
  }, []);

  useEffect(() => {
    if (!chatEncryptionReady || !chatEncryptionKeyRef.current || typeof window === "undefined") return;
    const saveEncryptedChat = async () => {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(JSON.stringify(patientChat));
      const encrypted = await window.crypto.subtle.encrypt({ name:"AES-GCM", iv }, chatEncryptionKeyRef.current!, encoded);
      window.localStorage.setItem("eduPatientChat", JSON.stringify({ iv:encodeChatBytes(iv), data:encodeChatBytes(new Uint8Array(encrypted)) }));
    };
    void saveEncryptedChat();
  }, [patientChat, chatEncryptionReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("eduPatientChatAdmin", JSON.stringify(patientChat));
  }, [patientChat]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const refreshPatientChat = () => {
      const nextMessages = getStoredPatientChat();
      if (Array.isArray(nextMessages) && nextMessages.length > 0) {
        setPatientChat(nextMessages);
        if (chatAuthenticated && chatPhone) {
          const conversationMessages = nextMessages
            .filter(message => message.phone === chatPhone)
            .map(message => ({ role: message.role, text: message.text }));
          if (conversationMessages.length > 0) {
            setChatMessages(prev => {
              if (conversationMessages.length >= prev.length) {
                return conversationMessages;
              }
              return prev;
            });
          }
        }
      }
    };
    window.addEventListener("storage", refreshPatientChat);
    return () => {
      window.removeEventListener("storage", refreshPatientChat);
    };
  }, [chatAuthenticated, chatPhone]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel("edu-patient-chat");
    chatBroadcastRef.current = channel;
    channel.onmessage = () => {
      const nextMessages = getStoredPatientChat();
      if (Array.isArray(nextMessages) && nextMessages.length > 0) {
        setPatientChat(nextMessages);
        if (chatAuthenticated && chatPhone) {
          const conversationMessages = nextMessages
            .filter(message => message.phone === chatPhone)
            .map(message => ({ role: message.role, text: message.text }));
          if (conversationMessages.length > 0) {
            setChatMessages(prev => {
              if (conversationMessages.length >= prev.length) {
                return conversationMessages;
              }
              return prev;
            });
          }
        }
      }
    };
    return () => {
      channel.close();
      chatBroadcastRef.current = null;
    };
  }, [chatAuthenticated, chatPhone]);



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

  const authenticateChatPhone = () => {
    const normalizedName = chatPatientName.trim().replace(/\s+/g, " ");
    const normalizedPhone = normalizeDialPhone(chatPhoneInput);
    if (normalizedName.length < 2) {
      setChatAuthError("Enter your full name to continue.");
      return;
    }
    if (!/^\+233\d{9}$/.test(normalizedPhone)) {
      setChatAuthError("Enter a valid Ghana phone number, for example 0241234567.");
      return;
    }
    setChatPatientName(normalizedName);
    setChatPhone(normalizedPhone);
    setChatAuthenticated(true);
    setChatPhoneInput("");
    setChatAuthError("");
    const storedMessages = getStoredPatientChat();
    const matchingMessages = storedMessages.filter(message => message.phone === normalizedPhone);
    const identifiedMessages = storedMessages.map(message =>
      message.phone === normalizedPhone && !message.patientName
        ? { ...message, patientName: normalizedName }
        : message
    );
    const welcomeMessage: PatientChatMessage = {
      role: "bot",
      text: `Welcome, ${normalizedName}. You are verified for this private chat. How can I help you today?`,
      createdAt: new Date().toISOString(),
      phone: normalizedPhone,
      patientName: normalizedName,
      sender: "edubot",
    };
    const nextMessages = matchingMessages.length > 0
      ? identifiedMessages
      : [...identifiedMessages, welcomeMessage];
    if (typeof window !== "undefined") {
      window.localStorage.setItem("eduPatientChatAdmin", JSON.stringify(nextMessages));
      chatBroadcastRef.current?.postMessage({ type: "chat-updated", phone: normalizedPhone });
    }
    setPatientChat(nextMessages);
    const existingConversation = nextMessages
      .filter(message => message.phone === normalizedPhone)
      .map(message => ({ role: message.role, text: message.text }));
    setChatMessages(existingConversation);

    // Sync with backend API
    ChatService.authenticate(normalizedName, normalizedPhone)
      .then(res => {
        if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
          const apiMessages: PatientChatMessage[] = res.messages.map(m => ({
            role: m.role,
            text: m.text,
            createdAt: m.createdAt,
            phone: m.phone,
            patientName: m.patientName || normalizedName,
            sender: m.sender,
            handoverRequested: m.handoverRequested,
            handoverHandled: m.handoverHandled,
            handoverClosed: m.handoverClosed,
          }));
          setPatientChat(prev => {
            const others = prev.filter(p => p.phone !== normalizedPhone);
            return [...others, ...apiMessages];
          });
          setChatMessages(apiMessages.map(m => ({ role: m.role, text: m.text })));
        }
      })
      .catch(err => console.warn("[CHAT AUTH API ERROR, using local state]:", err));
  };

  const appendAdminChatMessage = (message: PatientChatMessage) => {
    if (typeof window === "undefined") return;
    const existingMessages = getStoredPatientChat();
    const filtered = existingMessages.filter(m => !(m.phone === message.phone && m.text === message.text && m.createdAt === message.createdAt));
    const nextList = [...filtered, message];
    window.localStorage.setItem("eduPatientChatAdmin", JSON.stringify(nextList));
    chatBroadcastRef.current?.postMessage({ type: "chat-updated", phone: message.phone });
  };

  const sendChat = () => {
    if (!chatAuthenticated || !chatInput.trim()) return;
    const msg = chatInput.trim();
    const lowerMessage = msg.toLowerCase();
    setChatInput("");
    const createdAt = new Date().toISOString();
    const requestsHandover = /\b(talk|speak|chat|connect|contact)\b.*\b(someone|person|human|agent|staff|doctor|practitioner|admin|administrator|clinic team)\b|\b(someone|person|human|agent|staff|doctor|practitioner|admin|administrator|clinic team)\b.*\b(talk|speak|chat|connect|contact)\b/i.test(lowerMessage);
    const handoverActive = patientChat.some(message => message.phone === chatPhone && message.handoverRequested && !message.handoverClosed);
    const patientMessage: PatientChatMessage = { role:"user", text:msg, createdAt, phone:chatPhone, patientName:chatPatientName, sender:"patient", handoverRequested:requestsHandover };
    
    // Immediately display user message in chat
    setChatMessages(messages => [...messages, { role:"user", text:msg }]);
    setPatientChat(messages => [...messages, patientMessage]);
    appendAdminChatMessage(patientMessage);

    // Sync message with backend API
    ChatService.sendMessage({
      phone: chatPhone,
      patientName: chatPatientName,
      text: msg,
    }).catch(err => console.warn("[CHAT SEND API ERROR, preserved locally]:", err));

    let reply: string | null = null;
    if (requestsHandover) {
      setChatFlow("idle");
      setChatOrderProduct(null);
      reply = "I have handed your chat over to our clinic team. A staff member will review your message and contact you using the authenticated details provided.";
    } else if (handoverActive) {
      setChatFlow("idle");
      setChatOrderProduct(null);
    } else if (chatFlow === "appointment-service") {
      setChatAppointment(previous => ({ ...previous, service:msg }));
      setChatFlow("appointment-name");
      reply = "What is your full name?";
    } else if (chatFlow === "appointment-name") {
      setChatAppointment(previous => ({ ...previous, fullName:msg }));
      setChatFlow("appointment-date");
      reply = "What date would you prefer? Use YYYY-MM-DD.";
    } else if (chatFlow === "appointment-date") {
      setChatAppointment(previous => ({ ...previous, date:msg }));
      setChatFlow("appointment-time");
      reply = "What time would you prefer? For example, 10:00 AM.";
    } else if (chatFlow === "appointment-time") {
      const appointment = { ...chatAppointment, time:msg };
      addPatientAppointment({ patientName:appointment.fullName, phone:chatPhone, service:appointment.service, doctor:DOCTORS[0].name, date:appointment.date, time:appointment.time, status:"Pending" });
      createCallCentreEntry({ fullName:appointment.fullName, phone:chatPhone, service:appointment.service, date:appointment.date, time:appointment.time, notes:"Appointment requested through EduBot." });
      setChatAppointment({ service:"", fullName:"", date:"", time:"" });
      setChatFlow("idle");
      reply = `Thank you, ${appointment.fullName}. Your appointment request for ${appointment.service} on ${appointment.date} at ${appointment.time} has been sent to the clinic.`;
    } else if (chatFlow === "order-product") {
      const product = PRODUCTS.find(item => lowerMessage.includes(item.name.toLowerCase()));
      if (!product) {
        reply = `I could not find that product. Please choose one of: ${PRODUCTS.map(item => item.name).join(", ")}.`;
      } else {
        setChatOrderProduct(product);
        setChatFlow("order-quantity");
        reply = `How many units of ${product.name} would you like?`;
      }
    } else if (chatFlow === "order-quantity") {
      const quantity = Number(lowerMessage.match(/\d+/)?.[0] || 0);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99 || !chatOrderProduct) {
        reply = "Please enter a quantity from 1 to 99.";
      } else {
        for (let index = 0; index < quantity; index += 1) addToCart(chatOrderProduct.id);
        reply = `${quantity} unit${quantity === 1 ? "" : "s"} of ${chatOrderProduct.name} has been added to your cart. You can review it in the Products section.`;
        setChatOrderProduct(null);
        setChatFlow("idle");
      }
    } else if (chatFlow === "remove-product") {
      const product = PRODUCTS.find(item => lowerMessage.includes(item.name.toLowerCase()));
      if (!product) {
        reply = "I could not find that product. Please name the product you want to remove.";
      } else if (!cart[product.id]) {
        reply = `${product.name} is not currently in your cart.`;
        setChatFlow("idle");
      } else {
        setChatOrderProduct(product);
        setChatFlow("remove-quantity");
        reply = `How many units of ${product.name} should I remove?`;
      }
    } else if (chatFlow === "remove-quantity") {
      const quantity = Number(lowerMessage.match(/\d+/)?.[0] || 0);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99 || !chatOrderProduct) {
        reply = "Please enter a quantity from 1 to 99.";
      } else {
        const currentQuantity = cart[chatOrderProduct.id] || 0;
        const removedQuantity = Math.min(quantity, currentQuantity);
        for (let index = 0; index < removedQuantity; index += 1) removeFromCart(chatOrderProduct.id);
        reply = removedQuantity > 0
          ? `${removedQuantity} unit${removedQuantity === 1 ? "" : "s"} of ${chatOrderProduct.name} ${removedQuantity === 1 ? "has" : "have"} been removed from your cart.`
          : `${chatOrderProduct.name} is not currently in your cart.`;
        setChatOrderProduct(null);
        setChatFlow("idle");
      }
    } else if (/\b(book|appointment|schedule)\b/i.test(lowerMessage)) {
      setChatFlow("appointment-service");
      reply = "I can help with that. What service would you like to book?";
    } else if (/\b(can i buy|without coming|do you deliver|delivery cost|how much does delivery)\b/i.test(lowerMessage)) {
      const key = /\b(delivery cost|how much does delivery)\b/i.test(lowerMessage)
        ? "delivery"
        : /\bdo you deliver\b/i.test(lowerMessage)
          ? "deliver"
          : "without";
      reply = CHAT_KEYS[key];
    } else if (/\b(order|buy|purchase|add|product)\b/i.test(lowerMessage)) {
      const product = PRODUCTS.find(item => lowerMessage.includes(item.name.toLowerCase()));
      if (product) {
        setChatOrderProduct(product);
        setChatFlow("order-quantity");
        reply = `How many units of ${product.name} would you like?`;
      } else {
        setChatFlow("order-product");
        reply = `Which product would you like? Options: ${PRODUCTS.map(item => item.name).join(", ")}.`;
      }
    } else if (/\b(remove|delete|take out|clear)\b/i.test(lowerMessage)) {
      if (/\b(clear|empty)\b.*\b(cart|basket)\b/i.test(lowerMessage)) {
        setCart({});
        reply = "Your cart has been cleared.";
      } else {
        setChatFlow("remove-product");
        reply = "Which product would you like to remove from your cart?";
      }
    } else {
      const key = Object.keys(CHAT_KEYS).find(k => lowerMessage.includes(k)) || "default";
      reply = CHAT_KEYS[key];
    }

    if (reply) {
      window.setTimeout(() => {
        const botMessage: PatientChatMessage = { role:"bot", text:reply, createdAt:new Date().toISOString(), phone:chatPhone, patientName:chatPatientName, sender:"edubot", handoverRequested:requestsHandover };
        setChatMessages(messages => [...messages, { role:"bot", text:reply }]);
        appendAdminChatMessage(botMessage);
        setPatientChat(messages => [...messages, botMessage]);
      }, 400);
    }
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

  const handleAdminLogin = async () => {
    const cleanedEmail = adminEmail.trim().toLowerCase();
    const cleanedPhone = adminPhone.trim();
    const trimmedPassword = adminPassword.trim();

    if (!cleanedEmail || !cleanedPhone || !trimmedPassword) {
      setAdminLoginError("Enter your email, phone number, and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setAdminLoginError("Enter a valid email address.");
      return;
    }

    try {
      setAdminAuthLoading(true);
      setAdminLoginError("");
      const res = await AuthService.login({
        email: cleanedEmail,
        phone: cleanedPhone,
        password: trimmedPassword,
      });

      if (res.success && res.user) {
        setCurrentStaffUser(res.user);
        setAdminAuthenticated(true);
        setAdminLoginError("");
        setAdminMode("login");
        setAdminPassword("");
      }
    } catch (err: any) {
      setAdminLoginError(err.message || "Invalid email, phone number, or password.");
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleAdminSignup = async () => {
    const cleanedEmail = adminEmail.trim().toLowerCase();
    const cleanedPhone = adminPhone.trim();
    const trimmedPassword = adminPassword.trim();

    if (!cleanedEmail || !cleanedPhone || !trimmedPassword) {
      setAdminLoginError("Email, phone number, and password are required to sign up.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setAdminLoginError("Enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setAdminLoginError("Password must be at least 6 characters long.");
      return;
    }

    if (adminPassword !== adminConfirmPassword) {
      setAdminLoginError("Passwords do not match.");
      return;
    }

    try {
      setAdminAuthLoading(true);
      setAdminLoginError("");
      const fallbackName = cleanedEmail.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const res = await AuthService.signup({
        name: fallbackName,
        email: cleanedEmail,
        phone: cleanedPhone,
        password: trimmedPassword,
        confirmPassword: adminConfirmPassword.trim(),
        role: "Staff",
        department: "Clinical",
      });

      if (res.success) {
        setAdminLoginError("Registration successful! You can now sign in with your credentials.");
        setAdminMode("login");
        setAdminPassword("");
        setAdminConfirmPassword("");
      }
    } catch (err: any) {
      setAdminLoginError(err.message || "Failed to register staff account.");
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleAdminReset = async () => {
    const cleanedEmail = adminEmail.trim().toLowerCase();
    const cleanedPhone = adminPhone.trim();

    if (!cleanedEmail || !cleanedPhone) {
      setAdminLoginError("Enter both your email and phone number to reset the password.");
      return;
    }

    try {
      setAdminAuthLoading(true);
      setAdminLoginError("");
      const res = await AuthService.resetRequest({
        email: cleanedEmail,
        phone: cleanedPhone,
      });

      if (res.success) {
        setAdminMode("reset");
        setAdminLoginError(res.message || `Password reset authorized for ${cleanedEmail}. Set a new password below.`);
        setAdminPassword("");
        setAdminConfirmPassword("");
      }
    } catch (err: any) {
      setAdminLoginError(err.message || "No matching staff account was found for that email and phone number.");
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleAdminPasswordReset = async () => {
    const cleanedEmail = adminEmail.trim().toLowerCase();
    const cleanedPhone = adminPhone.trim();
    const newPassword = adminResetPassword.trim();

    if (!cleanedEmail || !cleanedPhone || !newPassword) {
      setAdminLoginError("Enter your email, phone number, and a new password to continue.");
      return;
    }

    if (newPassword.length < 6) {
      setAdminLoginError("New password must be at least 6 characters long.");
      return;
    }

    if (adminResetPassword !== adminResetConfirmPassword) {
      setAdminLoginError("New passwords do not match.");
      return;
    }

    try {
      setAdminAuthLoading(true);
      setAdminLoginError("");
      const res = await AuthService.resetConfirm({
        email: cleanedEmail,
        phone: cleanedPhone,
        newPassword,
        confirmPassword: adminResetConfirmPassword.trim(),
      });

      if (res.success) {
        setAdminMode("login");
        setAdminPassword("");
        setAdminConfirmPassword("");
        setAdminResetPassword("");
        setAdminResetConfirmPassword("");
        setAdminLoginError("Password reset successful! You can now sign in with your new password.");
      }
    } catch (err: any) {
      setAdminLoginError(err.message || "Failed to reset password.");
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await AuthService.logout();
    setCurrentStaffUser(null);
    setAdminAuthenticated(false);
    setAdminEmail("");
    setAdminPhone("");
    setAdminPassword("");
    setAdminConfirmPassword("");
    setAdminResetPassword("");
    setAdminResetConfirmPassword("");
    setAdminLoginError("");
    setHeroEditorOpen(false);
    setBlogEditorOpen(false);
    setAdminTab("overview");
    setAdminMobileMenuOpen(false);
    setView("admin");
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

    // Persist to backend database
    OrderService.checkout({
      items: selectedItems.map(item => ({
        productId: item.product?.id,
        name: item.product?.name || "Medicine",
        quantity: item.quantity,
        price: item.product?.price || 0,
      })),
      paymentMethod: selectedMethod,
      recipientName: selectedName,
      recipientNumber: selectedNumber,
    })
      .then(res => {
        if (res.success) {
          InventoryService.getInventory().then(invRes => {
            if (invRes.success && Array.isArray(invRes.data)) {
              setInventoryItems(invRes.data);
            }
          }).catch(() => null);
        }
      })
      .catch(err => console.warn("[ORDER CHECKOUT API ERROR]", err));
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
    const hospitalNumber = "+233 055 837 9545";
    const message = `Hello ${fullName}, we have received and confirmed your appointment at Edu Herbal Clinic. Your appointment with ${doctorName} is scheduled for ${appointmentDate} at ${appointmentTime}. For questions call ${hospitalNumber}.`;

    // ─── SMS protocol launcher disabled / commented out for now ──────────
    // const encodedMessage = encodeURIComponent(message);
    // const target = (bookingData.phone || "").trim() ? `sms:${(bookingData.phone || "").trim()}?body=${encodedMessage}` : `sms:?body=${encodedMessage}`;
    // const smsWindow = window.open(target, "_blank", "noopener,noreferrer");
    // if (!smsWindow) {
    //   window.location.href = target;
    // }

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
      await CallService.logCall({
        patientName: patientName || "Patient",
        phone: cleanedPhone,
        mode: friendlyMode,
        attemptedAt,
      });
      setBookingSmsStatus(`${friendlyMode} channel opened for ${patientName || "the patient"}.`);
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

  const createCallCentreEntry = async (bookingData: { fullName?: string; phone?: string; service?: string; date?: string; time?: string; notes?: string }) => {
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
    const note = noteParts.join(" ");

    try {
      await CallService.logCall({
        patientName,
        phone,
        mode: isTelemedicine ? "WhatsApp" : "Phone",
        attemptedAt: `${dateLabel} ${timeLabel}`,
        note,
        type: "incoming",
        status: "unresolved",
      } as any);
    } catch (err) {
      console.warn("[CREATE CALL API ERROR]", err);
    }

    setCallLogEntries(prev => [{
      id: Date.now(),
      patient: patientName,
      phone,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      type: "incoming",
      duration: "0:00",
      status: "unresolved",
      note,
    }, ...prev]);
  };

  const openAdminBookAppointmentModal = (patient: PatientEntry) => {
    const defaultDoctor = DOCTORS.find(d => d.name === patient.doctor) ?? DOCTORS[0];
    let initialDate = "";
    let initialTime = "10:00 AM";

    if (patient.nextAppt && patient.nextAppt.includes("·")) {
      const [d, t] = patient.nextAppt.split("·").map(part => part.trim());
      initialDate = d || "";
      initialTime = t || "10:00 AM";
    }

    setCrmBookPatient(patient);
    setCrmBookFormData({
      doctorId: defaultDoctor.id,
      service: patient.condition || "Herbal Consultation",
      date: initialDate || new Date().toISOString().split("T")[0],
      time: initialTime || "10:00 AM",
    });
    setCrmBookModalOpen(true);
  };

  const handleAdminBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmBookPatient) return;
    const { doctorId, service, date, time } = crmBookFormData;
    if (!date || !time) return;

    const assignedDoctor = DOCTORS.find(d => d.id === Number(doctorId)) ?? DOCTORS[0];
    const updatedPatient = {
      ...crmBookPatient,
      nextAppt: `${date} · ${time}`,
      doctor: assignedDoctor.name,
      condition: service || crmBookPatient.condition,
      status: "Active",
    } as PatientEntry;

    try {
      // 1. Create appointment in PostgreSQL database
      await AppointmentService.bookAppointment({
        service: service || crmBookPatient.condition || "Herbal Consultation",
        doctorId: assignedDoctor.id,
        fullName: crmBookPatient.name,
        phone: crmBookPatient.phone,
        date,
        time,
      });

      // 2. Update patient record in PostgreSQL CRM table
      if (crmBookPatient.id && typeof crmBookPatient.id === "number") {
        await PatientService.updatePatient(crmBookPatient.id, {
          nextAppt: `${date} · ${time}`,
          condition: service || crmBookPatient.condition,
          status: "Active",
        }).catch(() => null);
      }
    } catch (apiErr) {
      console.warn("[ADMIN BOOK APPT API ERROR]", apiErr);
    }

    setCrmPatients(prev => prev.map(item => item.id === crmBookPatient.id ? updatedPatient : item));
    if (selPatient?.id === crmBookPatient.id) {
      setSelPatient(updatedPatient);
    }
    addPatientAppointment({
      patientName: crmBookPatient.name,
      phone: crmBookPatient.phone,
      service: service || crmBookPatient.condition,
      doctor: assignedDoctor.name,
      date,
      time,
      status: "Confirmed",
    });
    sendAppointmentSms({
      fullName: crmBookPatient.name,
      phone: crmBookPatient.phone,
      service: service || crmBookPatient.condition,
      doctorId: assignedDoctor.id,
      date,
      time,
    });
    setBookingSmsStatus("Appointment booked for the patient and confirmation SMS prepared.");
    setCrmBookModalOpen(false);
    setCrmBookPatient(null);
  };

  const handleCreateNewPatient = async () => {
    if (!crmNewPatientData.name.trim() || !crmNewPatientData.phone.trim() || !crmNewPatientData.condition.trim() || !crmNewPatientData.date || !crmNewPatientData.time) {
      setBookingSmsStatus("Please complete all patient and appointment fields.");
      return;
    }

    const selectedDoctor = DOCTORS.find(d => d.id === crmNewPatientData.doctorId) ?? DOCTORS[0];

    try {
      await AppointmentService.bookAppointment({
        service: crmNewPatientData.condition.trim(),
        doctorId: selectedDoctor.id,
        fullName: crmNewPatientData.name.trim(),
        phone: crmNewPatientData.phone.trim(),
        date: crmNewPatientData.date,
        time: crmNewPatientData.time,
      });
    } catch (apiErr) {
      console.warn("[CRM PATIENT API] Recorded locally with fallback:", apiErr);
    }

    const newPatient: PatientEntry = {
      id: Date.now(),
      name: crmNewPatientData.name.trim(),
      phone: crmNewPatientData.phone.trim(),
      condition: crmNewPatientData.condition.trim(),
      lastVisit: "Just added",
      nextAppt: `${crmNewPatientData.date} · ${crmNewPatientData.time}`,
      doctor: selectedDoctor.name,
      status: "Active",
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

  const advanceBooking = async () => {
    if (!canContinue) return;
    if (bookingStep < 4) {
      setBookingStep(s => s + 1);
      return;
    }

    const confirmedBooking = { ...booking };
    const selectedDoctor = DOCTORS.find(d => d.id === booking.doctorId) ?? DOCTORS[0];
    const isTelemedicine = /telemedicine|video/i.test(confirmedBooking.service || "");

    // 1. Call Backend API
    try {
      await AppointmentService.bookAppointment({
        service: confirmedBooking.service,
        doctorId: selectedDoctor.id,
        fullName: confirmedBooking.fullName.trim(),
        phone: confirmedBooking.phone.trim(),
        email: confirmedBooking.email?.trim(),
        notes: confirmedBooking.notes?.trim(),
        date: confirmedBooking.date,
        time: confirmedBooking.time,
      });
    } catch (apiErr) {
      console.warn("[APPOINTMENT API] Direct booking recorded locally with fallback:", apiErr);
    }

    // 2. Intelligent Routing: Telemedicine vs CRM
    if (isTelemedicine) {
      CallService.getCalls()
        .then(res => {
          if (res.success && Array.isArray(res.data)) {
            setCallLogEntries(res.data);
          }
        })
        .catch(() => {
          setCallLogEntries(prev => [{
            id: Date.now(),
            patient: confirmedBooking.fullName.trim() || "New Patient",
            phone: confirmedBooking.phone.trim() || "+233 24 000 0000",
            time: confirmedBooking.time || "Pending",
            type: "incoming",
            duration: "0:00",
            status: "unresolved",
            note: `Telemedicine request received for ${confirmedBooking.service}. Preferred slot: ${confirmedBooking.date} at ${confirmedBooking.time}. ${confirmedBooking.notes ? `Note: ${confirmedBooking.notes}` : ""}`.trim(),
          }, ...prev]);
        });
      setBookingSmsStatus("Telemedicine session requested and routed to Call Centre. WhatsApp QR code prepared.");
    } else {
      // (Herbal Consultation, Laboratory Tests, Follow-up Visit, Prescription Refill, Skin & Dermatology)
      const newPatient: PatientEntry = {
        id: Date.now(),
        name: confirmedBooking.fullName.trim() || "New Patient",
        phone: confirmedBooking.phone.trim() || "+233 24 000 0000",
        condition: confirmedBooking.service || "Herbal Consultation",
        lastVisit: "Just booked",
        nextAppt: confirmedBooking.date ? `${confirmedBooking.date} · ${confirmedBooking.time}` : "Pending",
        doctor: selectedDoctor.name,
        status: "Active",
        balance: 0,
        products: confirmedBooking.service ? [confirmedBooking.service] : [],
      };

      setCrmPatients(prev => {
        const existingIndex = prev.findIndex(p => p.phone === newPatient.phone || p.name.toLowerCase() === newPatient.name.toLowerCase());
        if (existingIndex !== -1) {
          return prev.map((p, idx) => idx === existingIndex ? {
            ...p,
            condition: newPatient.condition,
            nextAppt: newPatient.nextAppt,
            doctor: newPatient.doctor,
            status: "Active",
          } : p);
        }
        return [newPatient, ...prev];
      });
      setSelPatient(newPatient);
      addPatientAppointment({
        patientName: confirmedBooking.fullName.trim() || "New Patient",
        phone: confirmedBooking.phone.trim() || "+233 24 000 0000",
        service: confirmedBooking.service || "Herbal Consultation",
        doctor: selectedDoctor.name,
        date: confirmedBooking.date || "Pending",
        time: confirmedBooking.time || "Pending",
        status: "Confirmed",
      });
      setBookingSmsStatus("Clinical appointment confirmed and recorded in Patient CRM.");
    }

    sendAppointmentSms(confirmedBooking);
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
      return PRODUCTS.slice(0, 5).map(product => ({
        name: product.name,
        sold: 0,
        revenue: 0,
      }));
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
  const isTelemedicineCall = (c: { note?: string | null; patient?: string; service?: string }) => {
    const text = `${c.note || ""} ${c.service || ""} ${c.patient || ""}`.toLowerCase();
    return text.includes("telemedicine") || text.includes("video");
  };

  const telemedicineCalls = callLogEntries.filter(c => isTelemedicineCall(c));

  const filteredCalls = telemedicineCalls.filter(c => {
    const searchValue = searchCalls.toLowerCase().trim();
    const matchesSearch = !searchValue || `${c.patient} ${c.phone} ${c.note || ""}`.toLowerCase().includes(searchValue);
    const isPlaceholder = ["unknown caller", "new enquiry"].includes((c.patient || "").toLowerCase());
    return matchesSearch && !isPlaceholder;
  });

  const patientChatConversations = Object.values(patientChat.reduce<Record<string, PatientChatMessage[]>>((groups, message) => {
    const key = message.phone || `name:${message.patientName || "Unknown patient"}`;
    groups[key] = groups[key] || [];
    groups[key].push(message);
    return groups;
  }, {})).map(messages => ({
    key: messages[0]?.phone || `name:${messages[0]?.patientName || "Unknown patient"}`,
    name: messages.find(message => message.patientName)?.patientName || "Name unavailable",
    phone: messages.find(message => message.phone)?.phone || "Number unavailable",
    messages,
    latestPatientMessage: [...messages].reverse().find(message => message.role === "user")?.text || "No patient message yet",
    handoverActive: messages.some(message => message.handoverRequested && !message.handoverClosed),
    handoverPending: messages.some(message => message.handoverRequested && !message.handoverHandled),
  }));

  const callStats = {
    incoming: telemedicineCalls.filter(c => c.type === "incoming").length,
    missed: telemedicineCalls.filter(c => c.type === "missed").length,
    returned: telemedicineCalls.filter(c => c.type === "returned").length,
  };

  const todayAppointments = patientAppointments
    .filter(appt => appt.date === todayDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  const displaySchedule = todayAppointments.length > 0
    ? todayAppointments
    : patientAppointments.slice(0, 6);
  const patientsTodayCount = todayAppointments.length > 0 ? todayAppointments.length : patientAppointments.filter(a => a.status === "Confirmed").length;
  const newPatientsCount = crmPatients.filter(p =>
    p.lastVisit === "Just added" || p.status === "Pending" || p.status === "Active"
  ).length;
  const revenueTodayTotal = patientPayments
    .filter(payment => payment.status === "Paid" && (payment.date === todayDate || payment.createdAt.startsWith(todayDate)))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const missedAppointments = callStats.missed;

  const dynamicConditionsData = (() => {
    if (!crmPatients || crmPatients.length === 0) return [];
    const counts: Record<string, number> = {};
    crmPatients.forEach(p => {
      const cond = p.condition?.trim() || "General Consultation";
      counts[cond] = (counts[cond] || 0) + 1;
    });
    const total = crmPatients.length;
    const palette = [G, OR, R, "#2563eb", "#7c3aed", "#0d9488", "#db2777"];
    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      value: Math.round((count / total) * 100),
      count,
      color: palette[idx % palette.length],
    }));
  })();

  const dynamicSalesData = (() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIdx = d.getMonth();
      const monthName = monthNames[monthIdx];
      const year = d.getFullYear();
      const mStart = new Date(year, monthIdx, 1);
      const mEnd = new Date(year, monthIdx + 1, 0, 23, 59, 59);

      const monthlyPaymentRevenue = patientPayments
        .filter(p => {
          if (p.status !== "Paid") return false;
          const pDate = normalizeDateString(p.date) || normalizeDateString(p.createdAt);
          return pDate ? pDate >= mStart && pDate <= mEnd : false;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const monthlyOrderRevenue = patientOrders
        .filter(o => {
          const oDate = normalizeDateString(o.date) || normalizeDateString(o.createdAt);
          return oDate ? oDate >= mStart && oDate <= mEnd : false;
        })
        .reduce((sum, o) => sum + (o.amount || 0), 0);

      const reportMatch = monthlyReports.find(r => r.month.toLowerCase().startsWith(monthName.toLowerCase()) && r.year === year);
      const reportRev = reportMatch?.totalRevenue || 0;

      const totalMonthlyRev = monthlyPaymentRevenue + monthlyOrderRevenue + reportRev;

      const apptCount = patientAppointments.filter(a => {
        const aDate = normalizeDateString(a.date) || normalizeDateString(a.createdAt);
        return aDate ? aDate >= mStart && aDate <= mEnd : false;
      }).length;

      result.push({
        month: monthName,
        revenue: totalMonthlyRev,
        patients: apptCount,
      });
    }

    return result;
  })();

  const markChatConversationHandled = (conversationKey: string) => {
    setPatientChat(messages => messages.map(message => {
      const key = message.phone || `name:${message.patientName || "Unknown patient"}`;
      return key === conversationKey ? { ...message, handoverHandled: true } : message;
    }));
  };

  const closeChatHandover = (conversationKey: string) => {
    if (typeof window !== "undefined" && !window.confirm("Close this human handover and let EduBot take over again?")) return;
    const targetMsg = patientChat.find(m => (m.phone || `name:${m.patientName}`) === conversationKey);
    setPatientChat(messages => messages.map(message => {
      const key = message.phone || `name:${message.patientName || "Unknown patient"}`;
      return key === conversationKey ? { ...message, handoverClosed: true, handoverHandled: true } : message;
    }));

    if (targetMsg?.phone) {
      ChatService.closeHandover(targetMsg.phone).catch(err => console.warn("[CLOSE HANDOVER API ERROR]:", err));
    }
  };

  const sendAdminChatMessage = (conversationKey: string, patientName: string, phone: string) => {
    const text = (adminChatDrafts[conversationKey] || "").trim();
    if (!text || !phone || phone === "Number unavailable") return;
    const newMsg: PatientChatMessage = {
      role: "bot",
      text,
      createdAt: new Date().toISOString(),
      phone,
      patientName,
      sender: "staff",
      handoverHandled: true,
    };
    setPatientChat(messages => [
      ...messages.map(message => {
        const key = message.phone || `name:${message.patientName || "Unknown patient"}`;
        return key === conversationKey ? { ...message, handoverHandled: true } : message;
      }),
      newMsg,
    ]);
    setAdminChatDrafts(drafts => ({ ...drafts, [conversationKey]: "" }));

    ChatService.adminReply({
      phone,
      patientName,
      text,
    }).catch(err => console.warn("[CHAT ADMIN REPLY API ERROR]:", err));
  };

  const removeChatConversation = (conversationKey: string) => {
    if (typeof window !== "undefined" && !window.confirm("Remove this patient's entire chat conversation?")) return;
    const targetMsg = patientChat.find(m => (m.phone || `name:${m.patientName}`) === conversationKey);
    setPatientChat(messages => messages.filter(message => {
      const key = message.phone || `name:${message.patientName || "Unknown patient"}`;
      return key !== conversationKey;
    }));
    setAdminChatDrafts(drafts => {
      const next = { ...drafts };
      delete next[conversationKey];
      return next;
    });

    if (targetMsg?.phone) {
      ChatService.deleteConversation(targetMsg.phone).catch(err => console.warn("[DELETE CONVERSATION API ERROR]:", err));
    }
  };

  const saveCallNote = async (callId: number) => {
    const note = (callNotes[callId] || "").trim();
    if (!note) return;
    setCallLogEntries(prev => prev.map(call => call.id === callId ? { ...call, note } : call));
    setCallNotes(prev => {
      const next = { ...prev };
      delete next[callId];
      return next;
    });
    setEditingCallNoteId(null);

    try {
      await CallService.updateNote(callId, note);
    } catch (err) {
      console.warn("[UPDATE NOTE API ERROR]", err);
    }
  };

  const startEditingCallNote = (callId: number) => {
    const existingCall = callLogEntries.find(call => call.id === callId);
    if (existingCall) {
      setCallNotes(prev => ({ ...prev, [callId]: existingCall.note || "" }));
      setEditingCallNoteId(callId);
    }
  };

  const toggleCallStatus = async (callId: number) => {
    const currentCall = callLogEntries.find(call => call.id === callId);
    if (!currentCall || !currentCall.note) return;
    const nextStatus = currentCall.status === "resolved" ? "unresolved" : "resolved";
    setCallLogEntries(prev => prev.map(call => call.id === callId ? { ...call, status: nextStatus } : call));
    setEditingCallNoteId(null);

    try {
      await CallService.toggleStatus(callId);
    } catch (err) {
      console.warn("[TOGGLE STATUS API ERROR]", err);
    }
  };

  const [isEditingExistingStock, setIsEditingExistingStock] = useState(false);
  const openInventoryRestock = (itemName: string, isEdit = false) => {
    const existingItem = inventoryItems.find(item => item.item === itemName);
    const matchingProduct = PRODUCTS.find(product => product.name === itemName);
    setSelectedInventoryItem(itemName);
    setIsEditingExistingStock(isEdit);
    setInventoryFormOpen(true);
    setInventoryFormData({
      item: itemName,
      category: existingItem?.category || matchingProduct?.category || inventoryFormData.category || "General",
      stock: isEdit ? String(existingItem?.stock ?? 0) : "10",
      min: String(existingItem?.min ?? (matchingProduct as any)?.min ?? 5),
      unit: existingItem?.unit || "units",
    });
  };

  const handleInventorySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const itemName = inventoryFormData.item.trim();
    const category = inventoryFormData.category.trim();
    const stock = Number(inventoryFormData.stock);
    const min = Number(inventoryFormData.min) || 5;
    const unit = inventoryFormData.unit.trim() || "units";
    if (!itemName) return;

    try {
      setInventoryLoading(true);
      if (isEditingExistingStock) {
        setInventoryItems(prev => prev.map(entry => entry.item.toLowerCase() === itemName.toLowerCase() ? {
          ...entry,
          category: category || entry.category,
          stock: Number.isFinite(stock) ? stock : entry.stock,
          min: Number.isFinite(min) ? min : entry.min,
          unit: unit || entry.unit,
        } : entry));
      } else {
        const res = await InventoryService.restock({
          item: itemName,
          category: category || "General",
          stock: Number.isFinite(stock) ? stock : 0,
          min,
          unit,
        });

        if (res.success) {
          const invRes = await InventoryService.getInventory();
          if (invRes.success && Array.isArray(invRes.data)) {
            setInventoryItems(invRes.data);
          }
        }
      }
    } catch (err) {
      console.error("Inventory update failed on backend, updating locally:", err);
      setInventoryItems(prev => {
        const existing = prev.find(entry => entry.item.toLowerCase() === itemName.toLowerCase());
        if (existing) {
          return prev.map(entry => entry.item.toLowerCase() === itemName.toLowerCase() ? {
            ...entry,
            category: category || entry.category,
            stock: isEditingExistingStock ? (Number.isFinite(stock) ? stock : entry.stock) : (entry.stock + (Number.isFinite(stock) ? stock : 0)),
            min: Number.isFinite(min) ? min : entry.min,
            unit: unit || entry.unit,
          } : entry);
        }

        return [{ id: Date.now(), productId: Date.now(), item: itemName, category: category || "General", stock: Number.isFinite(stock) ? stock : 0, min: Number.isFinite(min) ? min : 0, unit, safetyThreshold: 35, isLowStock: (stock || 0) < 35 }, ...prev];
      });
    } finally {
      setInventoryLoading(false);
      setInventoryFormOpen(false);
      setIsEditingExistingStock(false);
      setInventoryFormData({ item: itemName, category, stock: "0", min: String(min || 5), unit });
    }
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
      AuthService.logout();
      setCurrentStaffUser(null);
      setAdminAuthenticated(false);
      setAdminEmail("");
      setAdminPhone("");
      setAdminPassword("");
      setAdminConfirmPassword("");
      setAdminResetPassword("");
      setAdminResetConfirmPassword("");
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

  const PortalHeader = ({ title, sub, onBack, showExit, darkMode, onToggleDarkMode }: { title: string; sub: string; onBack?: () => void; showExit?: boolean; darkMode?: boolean; onToggleDarkMode?: () => void }) => {
    const isAdminHeader = title === "Staff Dashboard";
    const adminNavItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
      { id:"overview", label:"Overview", icon:Home },
      { id:"crm", label:"CRM", icon:Users },
      { id:"callcentre", label:"Call Centre", icon:PhoneCall },
      { id:"sales", label:"Sales", icon:TrendingUp },
      { id:"inventory", label:"Inventory", icon:Package },
      { id:"staff", label:"Staff", icon:UserCheck },
    ];

    return (
    <header style={{ background: isAdminHeader ? undefined : G }} className={`${isAdminHeader ? "bg-white text-gray-900 md:bg-[#1C7A3A] md:text-white" : "text-white"} sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow sm:px-6`}>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/60">
          <Logo size={36} ring={false} />
        </button>
        <div>
          <p className="font-bold text-sm leading-none">{title}</p>
          <p className={`${isAdminHeader ? "text-gray-500 md:text-green-200" : "text-green-200"} mt-0.5 text-xs`}>{sub}</p>
        </div>
      </div>
      {isAdminHeader && (
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setAdminMobileMenuOpen((open) => !open)}
            className="rounded-full border border-gray-200 bg-white p-2 text-gray-700 shadow-sm"
            aria-label="Open admin navigation"
            aria-expanded={adminMobileMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          {adminMobileMenuOpen && (
            <div className="absolute right-0 top-12 w-52 rounded-2xl border border-gray-100 bg-white p-2 text-gray-700 shadow-xl">
              <button type="button" onClick={handleAdminLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Logout
              </button>
              {adminNavItems.map((item) => (
                <button key={item.id} type="button" onClick={() => { setAdminTab(item.id); setAdminMobileMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${adminTab === item.id ? "text-white" : "hover:bg-green-50"}`} style={adminTab === item.id ? { background:G } : {}}>
                  <item.icon className="h-4 w-4" /> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
    );
  };

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
        <div className="flex min-h-[100svh] items-center justify-center overflow-x-hidden bg-[#e9edf7] px-3 py-6 sm:px-4 sm:py-12">
          <div className="w-full max-w-md rounded-[1.5rem] border border-white/70 bg-[#e9edf7] p-5 shadow-[12px_12px_26px_rgba(163,177,198,0.55),-12px_-12px_26px_rgba(255,255,255,0.9)] sm:rounded-[2rem] sm:p-8 sm:shadow-[18px_18px_38px_rgba(163,177,198,0.55),-18px_-18px_38px_rgba(255,255,255,0.9)]">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9edf7] shadow-[5px_5px_10px_rgba(163,177,198,0.45),-5px_-5px_10px_rgba(255,255,255,0.9)] sm:h-16 sm:w-16 sm:shadow-[6px_6px_12px_rgba(163,177,198,0.45),-6px_-6px_12px_rgba(255,255,255,0.9)]">
                <LogIn className="h-7 w-7 text-green-700 sm:h-8 sm:w-8" />
              </div>
              <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700 sm:mt-5 sm:text-xs sm:tracking-[0.32em]">CRM Staff Only</p>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-black sm:mt-3 sm:text-3xl">Staff Login</h1>
              <p className="mt-2 text-sm leading-6 text-black/70 sm:mt-3">Use the secure credentials to access admin portal.</p>
            </div>

            <div className="mt-6 space-y-4 sm:mt-8">
              <div className="flex overflow-hidden rounded-full border border-white/80 bg-[#e9edf7] p-1 shadow-[inset_3px_3px_7px_rgba(163,177,198,0.35),inset_-3px_-3px_7px_rgba(255,255,255,0.85)]">
                <button
                  type="button"
                  onClick={() => setAdminMode("login")}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide text-black transition-all ${adminMode === "login" ? "bg-[#e9edf7] shadow-[3px_3px_7px_rgba(163,177,198,0.4),-3px_-3px_7px_rgba(255,255,255,0.9)]" : "opacity-60"}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAdminMode("signup")}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide text-black transition-all ${adminMode === "signup" ? "bg-[#e9edf7] shadow-[3px_3px_7px_rgba(163,177,198,0.4),-3px_-3px_7px_rgba(255,255,255,0.9)]" : "opacity-60"}`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setAdminMode("reset")}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide text-black transition-all ${adminMode === "reset" ? "bg-[#e9edf7] shadow-[3px_3px_7px_rgba(163,177,198,0.4),-3px_-3px_7px_rgba(255,255,255,0.9)]" : "opacity-60"}`}
                >
                  Reset
                </button>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-black">Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-[#e9edf7] px-4 py-3 text-sm font-medium tracking-wide text-black placeholder:font-normal placeholder:text-black/50 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] outline-none focus:border-green-600"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-black">Phone Number</label>
                <input
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-[#e9edf7] px-4 py-3 text-sm font-medium tracking-wide text-black placeholder:font-normal placeholder:text-black/50 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] outline-none focus:border-green-600"
                  placeholder="0241234567 or +233241234567"
                />
              </div>

              {adminMode === "reset" ? (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-black">New Password</label>
                    <input
                      type="password"
                      value={adminResetPassword}
                      onChange={(e) => setAdminResetPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/80 bg-[#e9edf7] px-4 py-3 text-sm font-medium tracking-wide text-black placeholder:font-normal placeholder:text-black/50 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] outline-none focus:border-green-600"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-black">Confirm New Password</label>
                    <input
                      type="password"
                      value={adminResetConfirmPassword}
                      onChange={(e) => setAdminResetConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/80 bg-[#e9edf7] px-4 py-3 text-sm font-medium tracking-wide text-black placeholder:font-normal placeholder:text-black/50 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] outline-none focus:border-green-600"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-black">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-[#e9edf7] px-4 py-3 text-sm font-medium tracking-wide text-black placeholder:font-normal placeholder:text-black/50 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] outline-none focus:border-green-600"
                    placeholder="Enter password"
                  />
                </div>
              )}

              {adminMode === "signup" ? (
                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-black">Confirm Password</label>
                  <input
                    type="password"
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-[#e9edf7] px-4 py-3 text-sm font-medium tracking-wide text-black placeholder:font-normal placeholder:text-black/50 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] outline-none focus:border-green-600"
                    placeholder="Re-enter password"
                  />
                </div>
              ) : null}

              {adminLoginError ? (
                <p
                  className={`text-sm font-medium ${
                    adminLoginError.toLowerCase().includes("successful") ||
                    adminLoginError.toLowerCase().includes("authorized") ||
                    adminLoginError.toLowerCase().includes("sent")
                      ? "text-emerald-600 font-semibold"
                      : "text-red-600"
                  }`}
                >
                  {adminLoginError}
                </p>
              ) : null}

              <button
                disabled={adminAuthLoading}
                onClick={adminMode === "login" ? handleAdminLogin : adminMode === "signup" ? handleAdminSignup : handleAdminPasswordReset}
                className="w-full rounded-xl bg-[#e9edf7] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-black shadow-[7px_7px_14px_rgba(163,177,198,0.5),-7px_-7px_14px_rgba(255,255,255,0.9)] transition-shadow hover:shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.9)] disabled:opacity-50"
              >
                {adminAuthLoading ? "Please wait..." : adminMode === "login" ? "Sign In" : adminMode === "signup" ? "Create Account" : "Reset Password"}
              </button>

              {adminMode === "login" ? (
                <button
                  type="button"
                  onClick={handleAdminReset}
                  className="w-full text-center text-xs font-bold tracking-wide text-black underline-offset-4 hover:underline"
                >
                  Reset password using email
                </button>
              ) : null}
            </div>

            <div className="mt-6 text-center text-xs leading-5 text-black/60">
              Use your registered email and phone number to access the admin portal.
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
      <div className="h-screen max-h-screen overflow-hidden bg-gray-50 flex flex-col">
        <PortalHeader title="Staff Dashboard" sub="Edu Herbal Clinic — Admin Panel" showExit={false} onBack={handlePortalBack} darkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <div className="flex flex-1 min-h-0 overflow-hidden md:flex-row">

          {/* Sidebar (Fixed & Non-scrolling) */}
          <aside className="hidden w-full flex-shrink-0 flex-col gap-1 border-b border-gray-100 bg-white px-3 py-4 shadow-sm md:flex md:w-56 md:h-full md:border-b-0 md:border-r">
            {atabs.map(t => (
              <button key={t.id} onClick={() => setAdminTab(t.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all"
                style={ adminTab === t.id
                  ? { background:G, color:W }
                  : { color:"#374151" }
                }
                onMouseEnter={e => { if(adminTab !== t.id)(e.currentTarget as HTMLElement).style.background="#f0faf3"; }}
                onMouseLeave={e => { if(adminTab !== t.id)(e.currentTarget as HTMLElement).style.background=""; }}>
                <t.icon className="w-4 h-4 flex-shrink-0" />{t.label}
              </button>
            ))}
            <div className="hidden flex-1 md:block" />
            <div className="hidden rounded-xl border px-3 py-2.5 text-xs md:block" style={{ background: lowStock.length > 0 ? "#7f1d1d" : "#111827", borderColor: lowStock.length > 0 ? "#fca5a5" : "#374151", color: "#fff" }}>
              <p className="font-bold flex items-center gap-1 mb-0.5"><AlertTriangle className="w-3 h-3" /> Low Stock</p>
              <p>{lowStock.length > 0 ? `${lowStock.length} item${lowStock.length>1?"s":""} need restock` : "No low stock alerts"}</p>
            </div>
            <button
              onClick={handleAdminLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2.5 text-left text-sm font-semibold transition-all hover:bg-red-100/70"
              style={{ color:R }}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" /> Logout
            </button>
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto space-y-6 p-4 sm:p-5 md:p-6">
            <div className="group fixed bottom-4 left-4 z-40 flex w-11 cursor-default items-center overflow-hidden rounded-full border px-3 py-2.5 text-xs shadow-lg transition-[width,border-radius] duration-300 hover:w-56 hover:rounded-xl focus-within:w-56 focus-within:rounded-xl md:hidden" style={{ background: lowStock.length > 0 ? "#7f1d1d" : "#111827", borderColor: lowStock.length > 0 ? "#fca5a5" : "#374151", color: "#fff" }} tabIndex={0}>
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <div className="ml-1.5 min-w-0 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                <p className="font-bold">Low Stock</p>
                <p>{lowStock.length > 0 ? `${lowStock.length} item${lowStock.length > 1 ? "s" : ""} need restock` : "No low stock alerts"}</p>
              </div>
            </div>

            {/* ── OVERVIEW ── */}
            {adminTab === "overview" && (<>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-gray-900">
                    {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}, {currentStaffUser?.name ? currentStaffUser.name.split(" ")[0] : "Grace"} 👋
                  </h1>
                  <p className="text-gray-500 mt-1 font-medium">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Accra Branch
                  </p>
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
                    <p className="text-sm font-bold text-gray-900">Priority focus</p>
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
                  { label:"Patients Today", value: patientsTodayCount.toString(), icon:Users, color:G, delta:`+${patientsTodayCount}`, onClick: () => setAdminTab("crm") },
                  { label:"New Patients", value: newPatientsCount.toString(), icon:Plus, color:OR, delta:`+${newPatientsCount}`, onClick: () => setAdminTab("crm") },
                  { label:"Revenue Today", value: `GHS ${revenueTodayTotal.toLocaleString()}`, icon:TrendingUp, color:G, delta: revenueTodayTotal > 0 ? "+100%" : "GHS 0", onClick: () => setAdminTab("sales") },
                  { label:"Missed Calls / Pending", value: (callbackReviewCount || missedAppointments).toString(), icon:AlertTriangle, color:R, delta: callbackReviewCount > 0 ? `–${callbackReviewCount}` : "0", onClick: () => setAdminTab("callcentre") },
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
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-gray-900">Revenue — 7 months (GHS)</p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={dynamicSalesData}>
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
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-gray-900">Patient Conditions</p>
                    <span className="text-xs text-gray-400">{crmPatients.length} registered</span>
                  </div>
                  {dynamicConditionsData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie data={dynamicConditionsData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                            {dynamicConditionsData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1.5 mt-2">
                        {dynamicConditionsData.slice(0, 5).map(d => (
                          <div key={d.name} className="flex items-center gap-2 text-xs">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:d.color }} />
                            <span className="text-gray-500 font-medium flex-1 truncate">{d.name}</span>
                            <span className="font-bold text-gray-800">{d.value}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-40 items-center justify-center text-xs text-gray-400">
                      No patient condition data registered yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Today's schedule */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">Today's Schedule</p>
                    <p className="text-xs text-gray-400">Consultations and appointments scheduled for today</p>
                  </div>
                  <button
                    onClick={() => { setAdminTab("crm"); setCrmNewPatientOpen(true); }}
                    className="text-xs font-semibold text-green-700 hover:text-green-800"
                  >
                    + Book Slot
                  </button>
                </div>
                <div className="space-y-2">
                  {todayAppointments.length > 0 ? todayAppointments.map((a) => {
                    const statusLabel = a.status === "Pending" ? "Waiting" : a.status;
                    const sc = a.status === "Completed"
                      ? { bg: "#dcfce7", text: "#15803d" }
                      : a.status === "Confirmed"
                        ? { bg: "#dbeafe", text: "#1d4ed8" }
                        : a.status === "Pending"
                          ? { bg: "#fef9c3", text: "#854d0e" }
                          : { bg: "#f3f4f6", text: "#6b7280" };
                    return (
                      <div
                        key={a.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 px-2 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md shrink-0">{a.time || "10:00 AM"}</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{a.patientName}</p>
                            <p className="text-xs text-gray-400">{a.doctor || "Dr. Edu Mohammed"} · {a.service || "Herbal Consultation"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: sc.bg, color: sc.text }}>{statusLabel}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setAdminTab("crm");
                              setSearchCRM(a.patientName);
                            }}
                            className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline ml-2"
                          >
                            View CRM
                          </button>
                        </div>
                      </div>
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
                <div className="bg-white rounded-2xl border-2 border-emerald-600/30 shadow-lg p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-semibold text-gray-900">Create patient and booking</p>
                      <p className="text-sm text-gray-500">Add a new patient and schedule their first appointment.</p>
                    </div>
                    <button type="button" onClick={() => setCrmNewPatientOpen(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900">Cancel</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Patient Full Name *</label>
                      <input value={crmNewPatientData.name} onChange={e => setCrmNewPatientData(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Ama Darko" className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Phone Number *</label>
                      <input value={crmNewPatientData.phone} onChange={e => setCrmNewPatientData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+233 24 000 0000" className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Condition / Service *</label>
                      <input value={crmNewPatientData.condition} onChange={e => setCrmNewPatientData(prev => ({ ...prev, condition: e.target.value }))} placeholder="e.g. Herbal Consultation" className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Assigned Doctor *</label>
                      <select value={crmNewPatientData.doctorId} onChange={e => setCrmNewPatientData(prev => ({ ...prev, doctorId: Number(e.target.value) }))} className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:outline-none">
                        {DOCTORS.map(doctor => <option key={doctor.id} value={doctor.id} className="text-gray-900">{doctor.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Appointment Date *</label>
                      <input type="date" value={crmNewPatientData.date} onChange={e => setCrmNewPatientData(prev => ({ ...prev, date: e.target.value }))} className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Appointment Time *</label>
                      <input type="time" value={crmNewPatientData.time} onChange={e => setCrmNewPatientData(prev => ({ ...prev, time: e.target.value }))} className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setCrmNewPatientOpen(false)} className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="button" onClick={handleCreateNewPatient} className="text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-opacity" style={{ background:G }}>Save Patient & Book</button>
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
                      <div className="relative p-5 text-white" style={{ background:G }}>
                        <button
                          type="button"
                          onClick={() => setSelPatient(null)}
                          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors font-bold text-sm cursor-pointer shadow-xs"
                          title="Close Patient Profile"
                        >
                          ✕
                        </button>
                        <div className="flex items-center gap-4 pr-10">
                          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0 shadow-sm" style={{ background:OR }}>
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
                            type="button"
                            onClick={() => openAdminBookAppointmentModal(selPatient)}
                            className="flex-1 min-w-[140px] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                            style={{ background:G }}
                          >
                            Confirm Appointment
                          </button>
                          <button
                            type="button"
                            onClick={() => openPatientWhatsApp(selPatient.phone, selPatient.name)}
                            className="flex-1 min-w-[120px] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
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
              <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                <h1 className="font-display text-3xl font-bold text-gray-900">Call Centre</h1>
                <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:gap-3">
                  {[
                    { icon:Inbox,          label:"Incoming", count:callStats.incoming, color:G  },
                    { icon:PhoneMissed,    label:"Missed",   count:callStats.missed, color:R  },
                    { icon:PhoneForwarded, label:"Returned", count:callStats.returned, color:OR },
                  ].map(s => (
                    <div key={s.label} className="flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-white px-2 py-2 shadow-sm sm:justify-start sm:gap-2 sm:px-4">
                      <s.icon className="w-4 h-4" style={{ color:s.color }} />
                      <span className="text-sm font-bold text-gray-900">{s.count}</span>
                      <span className="truncate text-xs text-gray-400">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color:G }}>Patient Chat</p>
                    <h2 className="mt-1 font-display text-xl font-bold text-gray-900">Patient conversations</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {patientChat.filter((message) => message.role === "user").length} patient message{patientChat.filter((message) => message.role === "user").length === 1 ? "" : "s"}
                  </span>
                </div>
                {patientChatConversations.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {patientChatConversations.map(conversation => (
                      <div key={conversation.key} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{conversation.name}</p>
                            <p className="mt-1 text-xs font-semibold text-gray-500">Authenticated number: {conversation.phone}</p>
                            {conversation.handoverActive && (
                              <p className="mt-2 text-xs text-gray-600"><span className="font-semibold text-gray-800">Latest patient request:</span> {conversation.latestPatientMessage}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${conversation.handoverActive ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
                              {conversation.handoverPending ? "Handover requested" : conversation.handoverActive ? "Live staff handover" : "Conversation recorded"}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeChatConversation(conversation.key)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                              aria-label={`Remove conversation with ${conversation.name}`}
                              title="Remove conversation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            {conversation.handoverPending && (
                              <button type="button" onClick={() => markChatConversationHandled(conversation.key)} className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background:G }}>
                                Confirm handover
                              </button>
                            )}
                            {conversation.handoverActive && (
                              <button
                                type="button"
                                onClick={() => closeChatHandover(conversation.key)}
                                className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700"
                              >
                                Close handover
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-72 space-y-2 overflow-y-auto p-3">
                          {conversation.messages.map((message, index) => (
                            <div key={`${message.createdAt}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${message.role === "user" ? "bg-emerald-600 text-white" : "border border-gray-200 bg-white text-gray-700"}`}>
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">{message.sender === "staff" ? "Clinic staff" : message.role === "user" ? "Patient" : "EduBot"}</p>
                                {message.handoverRequested && <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-orange-600">Human handover requested</p>}
                                <p className="break-words leading-relaxed">{message.text}</p>
                                <p className="mt-1 text-[10px] opacity-60">{new Date(message.createdAt).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 bg-white p-3">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <textarea
                              value={adminChatDrafts[conversation.key] || ""}
                              onChange={event => setAdminChatDrafts(drafts => ({ ...drafts, [conversation.key]: event.target.value }))}
                              onKeyDown={event => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                  event.preventDefault();
                                  sendAdminChatMessage(conversation.key, conversation.name, conversation.phone);
                                }
                              }}
                              rows={2}
                              placeholder={`Reply to ${conversation.name}`}
                              className="min-h-10 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                            />
                            <button type="button" onClick={() => sendAdminChatMessage(conversation.key, conversation.name, conversation.phone)} className="rounded-xl px-4 py-2 text-sm font-bold text-white sm:self-stretch" style={{ background:G }}>
                              Send reply
                            </button>
                          </div>
                          <p className="mt-1 text-[11px] text-gray-400">Replies are delivered to the patient chat using the authenticated number.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">No patient chat messages have been received yet.</p>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={searchCalls} onChange={e => setSearchCalls(e.target.value)} placeholder="Search Telemedicine patient, phone or note…"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none shadow-sm" />
              </div>
              <div className="space-y-3">
                {filteredCalls.length > 0 ? (
                  filteredCalls.map(call => {
                    const CallIcon = call.type==="incoming" ? PhoneCall : call.type==="missed" ? PhoneMissed : PhoneForwarded;
                    const clr = call.type==="incoming" ? G : call.type==="missed" ? R : OR;
                    return (
                      <div key={call.id} className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background:clr+"18" }}>
                            <CallIcon className="w-5 h-5" style={{ color:clr }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                              <p className="min-w-0 break-words"><span className="font-semibold text-gray-900">{call.patient}</span><span className="ml-2 break-all text-sm text-gray-400">{call.phone}</span></p>
                              <span className="shrink-0 text-xs text-gray-400">{call.time} · {call.duration}</span>
                            </div>
                            {editingCallNoteId === call.id ? (
                              <div className="mt-2 space-y-1.5">
                                <textarea placeholder="Add or edit telemedicine note…" rows={3} value={callNotes[call.id] || ""}
                                  onChange={e => setCallNotes(n => ({ ...n, [call.id]:e.target.value }))}
                                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
                                <button onClick={() => saveCallNote(call.id)} className="text-xs text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity" style={{ background:G }}>
                                  {call.note ? "Update Note" : "Save Note"}
                                </button>
                              </div>
                            ) : call.note ? (
                              <div className="mt-2 rounded-lg px-3 py-2 text-sm text-gray-700 border-l-4" style={{ background:"#f0faf3", borderColor:G }}>
                                <div className="flex items-start justify-between gap-2">
                                  <p className="min-w-0 flex-1 break-words">{call.note}</p>
                                  <button onClick={() => startEditingCallNote(call.id)} className="text-xs font-semibold text-gray-600">Edit</button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 space-y-1.5">
                                <textarea placeholder="Add or edit telemedicine note…" rows={3} value={callNotes[call.id] || ""}
                                  onChange={e => setCallNotes(n => ({ ...n, [call.id]:e.target.value }))}
                                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
                                <button onClick={() => saveCallNote(call.id)} className="text-xs text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity" style={{ background:G }}>
                                  Save Note
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                            <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
                              <button
                                onClick={() => initiatePatientCall(call.phone, call.patient)}
                                className="rounded-full text-white px-2.5 py-1 text-[11px] font-semibold transition-opacity hover:opacity-90"
                                style={{ background:G }}
                              >
                                Call
                              </button>
                              <button
                                onClick={() => toggleCallStatus(call.id)}
                                title={call.status === "resolved" ? "Click to mark Unresolved" : "Click to mark Resolved"}
                                className="rounded-full border px-3 py-1 text-xs font-semibold transition-all hover:shadow-sm"
                                style={call.status === "resolved"
                                  ? { borderColor:"#86efac", background:"#dcfce7", color:"#15803d" }
                                  : { borderColor:"#fda4af", background:"#fee2e2", color:"#dc2626" }}
                              >
                                {call.status === "resolved" ? "Resolved" : "Unresolved"}
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 self-start">
                              <button
                                onClick={() => openPatientWhatsApp(call.phone, call.patient)}
                                className="flex min-w-0 items-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#f0fdf4] px-3 py-2 text-sm font-semibold text-[#25D366] shadow-sm transition-opacity hover:opacity-90"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Open WhatsApp
                              </button>
                              <button
                                onClick={() => markQrScanned(call.id, call.patient, call.phone)}
                                className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-2 hover:opacity-90 transition-opacity"
                                title="Scan WhatsApp QR code"
                              >
                                <img src={getWhatsAppQrUrl(call.phone)} alt="WhatsApp QR" className="w-20 h-20 rounded-lg border border-gray-200 bg-white p-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                    <p className="text-sm font-semibold text-gray-700">No Telemedicine (Video) requests found</p>
                    <p className="text-xs text-gray-400 mt-1">When patients select "Telemedicine (Video)" on the online booking form, appointments populate here with instant WhatsApp video & QR code triage.</p>
                  </div>
                )}
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
                    <BarChart data={dynamicSalesData} barSize={30}>
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
                <form onSubmit={handleInventorySubmit} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-base text-gray-900">Restock / Add Product Stock</h3>
                    <button type="button" onClick={() => setInventoryFormOpen(false)} className="text-xs font-semibold text-gray-500 hover:text-gray-700">Close ✕</button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Product</label>
                      <select
                        value={inventoryFormData.item}
                        onChange={(e) => {
                          const selected = PRODUCTS.find(product => product.name === e.target.value);
                          setInventoryFormData(prev => ({ ...prev, item: e.target.value, category: selected?.category || prev.category }));
                        }}
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                      >
                        {PRODUCTS.map(product => <option key={product.id} value={product.name} className="text-gray-900">{product.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
                      <input
                        value={inventoryFormData.category}
                        onChange={(e) => setInventoryFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                        placeholder="e.g. Capsules"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Stock Quantity to Add</label>
                      <input
                        type="number"
                        min="0"
                        value={inventoryFormData.stock}
                        onChange={(e) => setInventoryFormData(prev => ({ ...prev, stock: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Min Safety Level</label>
                      <input
                        type="number"
                        min="0"
                        value={inventoryFormData.min}
                        onChange={(e) => setInventoryFormData(prev => ({ ...prev, min: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Unit</label>
                    <input
                      value={inventoryFormData.unit}
                      onChange={(e) => setInventoryFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-36 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                      placeholder="units"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={inventoryLoading} className="rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50" style={{ background:G }}>
                      {inventoryLoading ? "Saving..." : "Save Stock"}
                    </button>
                    <button type="button" onClick={() => setInventoryFormOpen(false)} className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
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
              <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="text-xs uppercase tracking-wide text-gray-400" style={{ background:"#f9fafb" }}>
                    <tr>
                      {["Item","Category","In Stock","Min Level","Status","Actions"].map(h => (
                        <th key={h} className="px-5 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {inventoryItems.map(item => {
                      const isLow = item.stock < (item.min || INVENTORY_SAFETY_THRESHOLD);
                      return (
                        <tr
                          key={item.item}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-5 py-3 font-semibold text-gray-900">{item.item}</td>
                          <td className="px-5 py-3 text-gray-500">{item.category || "General"}</td>
                          <td className="px-5 py-3 font-bold text-gray-900">{item.stock} {item.unit}</td>
                          <td className="px-5 py-3 text-gray-400">{item.min} {item.unit}</td>
                          <td className="whitespace-nowrap px-3 py-3 sm:px-5">
                            <span className="inline-flex max-w-full whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold"
                              style={ isLow ? { background:"#fee2e2", color:R } : { background:"#dcfce7", color:"#15803d" }}>
                              {isLow ? "Insufficient" : "Sufficient"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <button
                              type="button"
                              onClick={() => openInventoryRestock(item.item, true)}
                              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs"
                              title="Edit Stock & Minimum Threshold"
                            >
                              <Pencil className="w-3.5 h-3.5 text-gray-500" /> Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            </>)}

            {/* ── STAFF ── */}
            {adminTab === "staff" && (<>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-gray-900">Staff Portal</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Manage clinic team members, shifts, schedules and internal announcements.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAnnouncementFormData({
                        title: "",
                        message: "",
                        date: new Date().toISOString().split("T")[0],
                        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
                      });
                      setAnnouncementModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                    style={{ background:OR }}
                  >
                    <Megaphone className="w-4 h-4" /> Post Announcement
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStaffMember(null);
                      setStaffFormData({
                        name: "",
                        email: "",
                        phone: "",
                        role: "",
                        department: "Clinical",
                        schedule: "8AM–5PM",
                        status: "Present",
                      });
                      setStaffModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                    style={{ background:G }}
                  >
                    <Plus className="w-4 h-4" /> Add Staff
                  </button>
                </div>
              </div>

              {/* Announcements Section */}
              {staffAnnouncements.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Megaphone className="w-3.5 h-3.5" /> Staff Announcements ({staffAnnouncements.length})
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {staffAnnouncements.slice(0, 6).map((announcement) => (
                      <div key={announcement.id} className="rounded-xl border border-amber-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-gray-900 leading-snug">{announcement.title}</h4>
                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-semibold text-gray-700 block">
                              {new Date(announcement.createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="text-[10px] text-gray-400 block font-medium">
                              {new Date(announcement.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{announcement.message}</p>
                        {announcement.author && (
                          <div className="mt-3 flex items-center justify-between border-t border-amber-100/80 pt-2 text-[11px]">
                            <p className="font-semibold text-amber-900 flex items-center gap-1">
                              <span className="text-amber-600 font-bold">By:</span> {announcement.author}
                            </p>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                              Official Bulletin
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Metric Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label:"Present", value: staffMembers.filter(m => m.status === "Present").length, status: "Present", color:G },
                  { label:"On Leave", value: staffMembers.filter(m => m.status === "Leave").length, status: "Leave", color:OR },
                  { label:"Remote", value: staffMembers.filter(m => m.status === "Remote").length, status: "Remote", color:R },
                ].map(s => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setStaffFilter(prev => prev === s.status ? null : (s.status as "Present" | "Leave" | "Remote"))}
                    className="rounded-2xl border bg-white p-5 shadow-sm text-center transition hover:shadow-md cursor-pointer"
                    style={{ borderColor: staffFilter === s.status ? s.color : "#e5e7eb", borderWidth: staffFilter === s.status ? 2 : 1 }}
                  >
                    <p className="text-3xl font-bold" style={{ color:s.color }}>{s.value}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
                    {staffFilter === s.status && (
                      <span className="mt-1 inline-block text-[10px] font-bold text-gray-400 uppercase">Filtered</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  placeholder="Search staff by name, role, department or phone…"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none shadow-sm"
                />
              </div>

              {/* Staff Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-sm">
                    <thead className="text-xs uppercase tracking-wide text-gray-400" style={{ background:"#f9fafb" }}>
                      <tr>
                        {["Staff Member", "Role", "Department", "Schedule", "Status", "Actions"].map(h => (
                          <th key={h} className="px-5 py-3 text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map(s => {
                          const ss = statusStyle(s.status);
                          return (
                            <tr key={s.id || s.name} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ background:G }}>
                                    {s.name.split(" ").slice(-1)[0][0]}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{s.name}</p>
                                    <p className="text-xs text-gray-400">{s.phone || s.email || "No contact info"}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 font-medium text-gray-700">{s.role}</td>
                              <td className="px-5 py-3 text-gray-500">{s.department || s.dept || "Clinical"}</td>
                              <td className="px-5 py-3 font-semibold text-gray-900">{s.schedule || "8AM–5PM"}</td>
                              <td className="px-5 py-3">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const order: ("Present" | "Leave" | "Remote")[] = ["Present", "Leave", "Remote"];
                                    const nextStatus = order[(order.indexOf(s.status) + 1) % order.length];
                                    setStaffMembers(prev => prev.map(m => m.id === s.id ? { ...m, status: nextStatus } : m));
                                    try {
                                      await StaffService.updateStatus(s.id, { status: nextStatus });
                                    } catch (err) {
                                      console.warn("[UPDATE STATUS ERROR]", err);
                                    }
                                  }}
                                  title="Click to cycle status (Present → Leave → Remote)"
                                  className="px-2.5 py-1 rounded-full text-xs font-semibold transition hover:opacity-85 shadow-sm"
                                  style={{ background:ss.bg, color:ss.text }}
                                >
                                  ● {s.status}
                                </button>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingStaffMember(s);
                                      setStaffFormData({
                                        name: s.name,
                                        email: s.email || "",
                                        phone: s.phone || "",
                                        role: s.role,
                                        department: s.department || s.dept || "Clinical",
                                        schedule: s.schedule || "8AM–5PM",
                                        status: s.status,
                                      });
                                      setStaffModalOpen(true);
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
                                    title="Edit Staff Member"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (!window.confirm(`Are you sure you want to remove ${s.name} from the staff directory?`)) return;
                                      setStaffMembers(prev => prev.filter(m => m.id !== s.id));
                                      try {
                                        await StaffService.deleteStaff(s.id);
                                      } catch (err) {
                                        console.warn("[DELETE STAFF ERROR]", err);
                                      }
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                                    title="Delete Staff Member"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                            No staff members found matching "{staffSearch}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Add / Edit Staff Modal ── */}
              {staffModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                  <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{editingStaffMember ? "Edit Staff Member" : "Add New Staff Member"}</h3>
                        <p className="text-xs text-gray-500">Staff account will be synced to the clinic database.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStaffModalOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!staffFormData.name.trim() || !staffFormData.role.trim()) {
                          alert("Please fill in staff name and role.");
                          return;
                        }

                        if (editingStaffMember) {
                          const id = editingStaffMember.id;
                          setStaffMembers(prev => prev.map(m => m.id === id ? { ...m, ...staffFormData, dept: staffFormData.department } : m));
                          setStaffModalOpen(false);

                          try {
                            await StaffService.updateStaff(id, staffFormData);
                          } catch (err) {
                            console.warn("[UPDATE STAFF ERROR]", err);
                          }
                        } else {
                          const tempId = Date.now();
                          const newStaffItem: StaffMember = {
                            id: tempId,
                            ...staffFormData,
                            dept: staffFormData.department,
                          };
                          setStaffMembers(prev => [...prev, newStaffItem]);
                          setStaffModalOpen(false);

                          try {
                            const res = await StaffService.createStaff(staffFormData);
                            if (res.success && res.data) {
                              setStaffMembers(prev => prev.map(m => m.id === tempId ? res.data : m));
                            }
                          } catch (err) {
                            console.warn("[CREATE STAFF ERROR]", err);
                          }
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Full Name *</label>
                          <input
                            required
                            value={staffFormData.name}
                            onChange={e => setStaffFormData(f => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Dr. Kwame Asante"
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Role / Designation *</label>
                          <input
                            required
                            value={staffFormData.role}
                            onChange={e => setStaffFormData(f => ({ ...f, role: e.target.value }))}
                            placeholder="e.g. Senior Herbalist"
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Department</label>
                          <select
                            value={staffFormData.department}
                            onChange={e => setStaffFormData(f => ({ ...f, department: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          >
                            {["Clinical", "Laboratory", "Dispensary", "CRM", "Admin", "Operations"].map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Working Schedule</label>
                          <input
                            value={staffFormData.schedule}
                            onChange={e => setStaffFormData(f => ({ ...f, schedule: e.target.value }))}
                            placeholder="e.g. 8AM–5PM"
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Phone Number</label>
                          <input
                            value={staffFormData.phone}
                            onChange={e => setStaffFormData(f => ({ ...f, phone: e.target.value }))}
                            placeholder="+233 24 000 0000"
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                          <input
                            type="email"
                            value={staffFormData.email}
                            onChange={e => setStaffFormData(f => ({ ...f, email: e.target.value }))}
                            placeholder="staff@eduherbal.com"
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Initial Status</label>
                        <div className="mt-1.5 flex gap-3">
                          {(["Present", "Leave", "Remote"] as const).map(st => (
                            <label key={st} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="staffStatus"
                                value={st}
                                checked={staffFormData.status === st}
                                onChange={() => setStaffFormData(f => ({ ...f, status: st }))}
                                className="text-green-600 focus:ring-green-600"
                              />
                              {st}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3 border-t border-gray-100">
                        <button
                          type="submit"
                          className="rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                          style={{ background:G }}
                        >
                          {editingStaffMember ? "Update Staff Profile" : "Save Staff Member"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStaffModalOpen(false)}
                          className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ── Post Announcement Modal ── */}
              {announcementModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                  <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Megaphone className="w-5 h-5 text-amber-600" /> Post Staff Announcement
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          Posting as <span className="font-bold text-amber-800">{currentStaffUser?.name || "Dr. Edu Mohammed"}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAnnouncementModalOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!announcementFormData.title.trim() || !announcementFormData.message.trim()) {
                          alert("Please fill in announcement title and message.");
                          return;
                        }

                        let combinedIso = new Date().toISOString();
                        if (announcementFormData.date) {
                          const timePart = announcementFormData.time || "12:00";
                          const parsed = new Date(`${announcementFormData.date}T${timePart}`);
                          if (!isNaN(parsed.getTime())) {
                            combinedIso = parsed.toISOString();
                          }
                        }

                        const authorName = currentStaffUser?.name || "Dr. Edu Mohammed";
                        const newAnn: StaffAnnouncement = {
                          id: Date.now(),
                          title: announcementFormData.title.trim(),
                          message: announcementFormData.message.trim(),
                          author: authorName,
                          createdAt: combinedIso,
                        };

                        setStaffAnnouncements(prev => [newAnn, ...prev]);
                        setAnnouncementModalOpen(false);
                        setAnnouncementFormData({ title: "", message: "", date: "", time: "" });

                        try {
                          await StaffService.postAnnouncement(newAnn);
                        } catch (err) {
                          console.warn("[POST ANNOUNCEMENT ERROR]", err);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Announcement Title *</label>
                        <input
                          required
                          value={announcementFormData.title}
                          onChange={e => setAnnouncementFormData(a => ({ ...a, title: e.target.value }))}
                          placeholder="e.g. Monthly All-Staff Clinical Briefing"
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Date *</label>
                          <input
                            type="date"
                            required
                            value={announcementFormData.date}
                            onChange={e => setAnnouncementFormData(a => ({ ...a, date: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Time *</label>
                          <input
                            type="time"
                            required
                            value={announcementFormData.time}
                            onChange={e => setAnnouncementFormData(a => ({ ...a, time: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Announcement Message *</label>
                        <textarea
                          required
                          rows={4}
                          value={announcementFormData.message}
                          onChange={e => setAnnouncementFormData(a => ({ ...a, message: e.target.value }))}
                          placeholder="Write the briefing message, schedule, or reminder for clinic staff…"
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setAnnouncementModalOpen(false)}
                          className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ background:OR }}
                        >
                          Broadcast Announcement
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ── CRM Confirm & Book Appointment Modal ── */}
              {crmBookModalOpen && crmBookPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                  <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Schedule & Confirm Appointment</h3>
                        <p className="text-xs text-gray-500 font-medium">Book consultation slot for {crmBookPatient.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setCrmBookModalOpen(false); setCrmBookPatient(null); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ background:OR }}>
                        {crmBookPatient.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{crmBookPatient.name}</p>
                        <p className="text-xs text-gray-600 font-medium">{crmBookPatient.phone} · Condition: {crmBookPatient.condition || "General Consultation"}</p>
                      </div>
                    </div>

                    <form onSubmit={handleAdminBookSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Assigned Doctor / Practitioner *</label>
                          <select
                            value={crmBookFormData.doctorId}
                            onChange={e => setCrmBookFormData(prev => ({ ...prev, doctorId: Number(e.target.value) }))}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          >
                            {DOCTORS.map(doctor => (
                              <option key={doctor.id} value={doctor.id} className="text-gray-900">{doctor.name} ({doctor.specialty || "Herbal Specialist"})</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Condition / Service *</label>
                          <input
                            required
                            value={crmBookFormData.service}
                            onChange={e => setCrmBookFormData(prev => ({ ...prev, service: e.target.value }))}
                            placeholder="e.g. Herbal Consultation"
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Appointment Date *</label>
                          <input
                            type="date"
                            required
                            value={crmBookFormData.date}
                            onChange={e => setCrmBookFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Appointment Time *</label>
                          <input
                            type="time"
                            required
                            value={crmBookFormData.time}
                            onChange={e => setCrmBookFormData(prev => ({ ...prev, time: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2 justify-end">
                        <button
                          type="button"
                          onClick={() => { setCrmBookModalOpen(false); setCrmBookPatient(null); }}
                          className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ background:G }}
                        >
                          Confirm & Save Appointment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
    <>
      {isDarkMode && (
        <style>{`
          .dark .text-gray-900,
          .dark .text-gray-800,
          .dark .text-gray-700,
          .dark .text-gray-600,
          .dark .text-gray-500,
          .dark .text-gray-400,
          .dark .text-gray-300,
          .dark .text-gray-200,
          .dark .text-gray-100 {
            color: #ffffff !important;
          }
          .dark .text-slate-400,
          .dark .text-slate-500,
          .dark .text-slate-600,
          .dark .text-slate-700,
          .dark .text-slate-800 {
            color: rgba(255,255,255,0.9) !important;
          }
        `}</style>
      )}

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
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.18)] backdrop-blur sm:static">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:h-20 sm:px-6 lg:px-8">
          {/* Brand */}
          <button
            type="button"
            onClick={() => {
              if ((view as string) === "patient") {
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
            className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-2 py-1.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:gap-3 sm:px-3 sm:py-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-2 ring-emerald-100 sm:h-12 sm:w-12">
              <ImageWithFallback src={clinicLogo} alt="Edu Herbal Clinic logo"
                className="h-9 w-9 rounded-full object-contain sm:h-10 sm:w-10"
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

          <button className="lg:hidden p-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}>
            {menuOpen ? <X className="h-5 w-5 text-gray-700 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 text-gray-700 sm:h-6 sm:w-6" />}
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
                  <p className={`font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Select a Service</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {["Herbal Consultation","Laboratory Tests","Telemedicine (Video)","Follow-up Visit","Prescription Refill","Skin & Dermatology"].map(s => (
                      <button key={s} onClick={() => setBooking(b => ({ ...b, service:s }))}
                        className="px-4 py-3.5 rounded-xl border-2 text-sm font-semibold text-left transition-all"
                        style={ booking.service===s
                          ? { borderColor:G, background:`${G}0e`, color:G }
                          : { borderColor: isDarkMode ? "#475569" : "#e5e7eb", color: isDarkMode ? "#f8fafc" : "#374151", background: isDarkMode ? "rgba(15,23,42,0.45)" : "transparent" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 */}
              {bookingStep===1 && (
                <div>
                  <p className={`font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Choose Your Doctor</p>
                  <div className="space-y-3">
                    {DOCTORS.map(d => (
                      <button key={d.id} onClick={() => setBooking(b => ({ ...b, doctorId:d.id }))}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all"
                        style={ booking.doctorId===d.id
                          ? { borderColor:G, background:`${G}0a` }
                          : { borderColor: isDarkMode ? "#475569" : "#e5e7eb", background: isDarkMode ? "rgba(15,23,42,0.45)" : "transparent" }}>
                        <div className="w-11 h-11 rounded-full text-white font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ background:G }}>{d.initials}</div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{d.name}</p>
                          <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-400"}`}>{d.specialty}</p>
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
                  <p className={`font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Tell Us About You</p>
                  <div className="grid gap-4">
                    <div>
                      <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>Full Name</label>
                      <input value={booking.fullName} onChange={e => setBooking(b => ({ ...b, fullName:e.target.value }))}
                        className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors ${isDarkMode ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400" : "border-gray-200 bg-gray-50 text-gray-900"}`}
                        style={{}} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor= isDarkMode ? "#475569" : "#e5e7eb"} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>Phone Number</label>
                        <input value={booking.phone} onChange={e => setBooking(b => ({ ...b, phone:e.target.value }))}
                          className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors ${isDarkMode ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400" : "border-gray-200 bg-gray-50 text-gray-900"}`}
                          style={{}} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor= isDarkMode ? "#475569" : "#e5e7eb"} />
                      </div>
                      <div>
                        <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>Email Address</label>
                        <input type="email" value={booking.email} onChange={e => setBooking(b => ({ ...b, email:e.target.value }))}
                          className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors ${isDarkMode ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400" : "border-gray-200 bg-gray-50 text-gray-900"}`}
                          style={{}} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor= isDarkMode ? "#475569" : "#e5e7eb"} />
                      </div>
                    </div>
                    <div>
                      <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>Additional Note</label>
                      <textarea value={booking.notes} onChange={e => setBooking(b => ({ ...b, notes:e.target.value }))}
                        rows={4} className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none ${isDarkMode ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400" : "border-gray-200 bg-gray-50 text-gray-900"}`}
                        style={{}} onFocus={e => e.currentTarget.style.borderColor=G} onBlur={e => e.currentTarget.style.borderColor= isDarkMode ? "#475569" : "#e5e7eb"} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {bookingStep===3 && (
                <div>
                  <p className={`font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Select Date & Time</p>
                  <div className="mb-5">
                    <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>Preferred Date</label>
                    <input type="date" value={booking.date} min={new Date().toISOString().split("T")[0]}
                      onChange={e => setBooking(b => ({ ...b, date:e.target.value }))}
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors ${isDarkMode ? "border-slate-700 bg-slate-900 text-white" : "border-gray-200 bg-gray-50 text-gray-900"}`}
                      style={{}}
                      onFocus={e => e.currentTarget.style.borderColor=G}
                      onBlur={e => e.currentTarget.style.borderColor= isDarkMode ? "#475569" : "#e5e7eb"} />
                  </div>
                  <label className={`text-sm font-semibold mb-3 block ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>Available Times</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(DOCTORS.find(d=>d.id===booking.doctorId)||DOCTORS[0]).slots.map(t => (
                      <button key={t} onClick={() => setBooking(b => ({ ...b, time:t }))}
                        className="py-3 rounded-xl border-2 text-sm font-bold transition-all"
                        style={ booking.time===t
                          ? { borderColor:OR, background:OR, color:W }
                          : { borderColor: isDarkMode ? "#475569" : "#e5e7eb", color: isDarkMode ? "#f8fafc" : "#374151", background: isDarkMode ? "rgba(15,23,42,0.45)" : "transparent" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {bookingStep===4 && (
                <div>
                  <p className={`font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>Confirm Your Booking</p>
                  <div className="rounded-2xl p-5 space-y-3 mb-5 border" style={{ background: isDarkMode ? "rgba(15,23,42,0.6)" : `${G}0a`, borderColor:`${G}25` }}>
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
                        <span className={isDarkMode ? "text-slate-300" : "text-gray-400"}>{k}</span>
                        <span className={`font-bold text-right ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-gray-400"}`}>
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
                { label:"Twitter", href:"https://twitter.com/Eduherbal_", icon:(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M18.9 2H22l-6.7 7.7L23.4 22h-5.8l-4.6-6-5.2 6H1.2l7.1-8.1L.6 2h5.9l4.2 5.5L18.9 2Zm-1 18h1.1L6.2 4H5.1l12.8 16Z" /></svg>) },
                { label:"Instagram", href:"https://www.instagram.com/eduherbal_", icon:(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.2-3.7a1.2 1.2 0 1 1-1.2 1.2 1.2 0 0 1 1.2-1.2Z" /></svg>) },
                { label:"YouTube", href:"https://www.youtube.com/embed/_DC4GWukgFk?si=KiikZBByfeF7QBqf", icon:(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M23.5 6.4a3 3 0 0 0-2.1-2.1C19.6 3.7 12 3.7 12 3.7s-7.6 0-9.4.6A3 3 0 0 0 .5 6.4 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.6 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.6ZM9.7 15.8V8.2l6.5 3.8-6.5 3.8Z" /></svg>) },
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  onClick={() => setSocialModal({ label: social.label, href: social.href })}
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

      {socialModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6" onClick={() => setSocialModal(null)}>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Edu Herbal Clinic on {socialModal.label}</p>
                <p className="text-xs text-gray-500">Social media preview</p>
              </div>
              <button type="button" onClick={() => setSocialModal(null)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900" aria-label="Close social media preview">
                <X className="h-4 w-4" />
              </button>
            </div>
            {socialModal.label === "YouTube" ? (
              <div className="aspect-video bg-black">
                <iframe
                  title="Edu Herbal Clinic YouTube video"
                  src={socialModal.href}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center bg-gray-50 px-6 py-12 text-center">
                <p className="font-display text-2xl font-semibold leading-tight text-gray-900">Just A Click<br />To View Profile.</p>
                <a href={socialModal.href} target="_blank" rel="noreferrer" className="mt-6 rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: G }}>
                  View {socialModal.label} profile
                </a>
              </div>
            )}
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
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        {chatOpen ? (
          chatAuthenticated ? (
          <div className="w-[calc(100vw-32px)] sm:w-88 max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all" style={{ height:460 }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between shadow-xs" style={{ background:G }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs" style={{ background:OR }}>
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-tight">EduBot Assistant</p>
                  <p className="text-green-200 text-[11px] flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#4ade80", display:"inline-block" }} /> Online 24/7
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)} 
                className="text-green-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatMessagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 overscroll-contain scroll-smooth" 
              style={{ background:"#f9fafb" }}
            >
              {chatMessages.map((m,i) => (
                <div key={i} className={`flex ${m.role==="user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs"
                    style={ m.role==="user"
                      ? { background:G, color:W, borderBottomRightRadius:4 }
                      : { background:W, color:"#111827", borderBottomLeftRadius:4, border:"1px solid #e5e7eb" }
                    }>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} className="h-1 w-full shrink-0" />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyDown={e => e.key==="Enter" && sendChat()}
                placeholder="Ask me anything…"
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-600 focus:bg-white transition-colors" 
              />
              <button 
                onClick={sendChat} 
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer shadow-xs" 
                style={{ background:G }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          ) : (
            <div className="w-80 rounded-2xl border border-gray-100 bg-white p-5 text-gray-900 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">Start a private chat</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">Enter your full name and phone number so we can identify your conversation.</p>
                </div>
                <button type="button" onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-700" aria-label="Close chat"><X className="h-4 w-4" /></button>
              </div>
              <input
                value={chatPatientName}
                onChange={event => setChatPatientName(event.target.value)}
                onKeyDown={event => event.key === "Enter" && authenticateChatPhone()}
                autoComplete="name"
                placeholder="Full name"
                className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
              <input
                value={chatPhoneInput}
                onChange={event => setChatPhoneInput(event.target.value)}
                onKeyDown={event => event.key === "Enter" && authenticateChatPhone()}
                inputMode="tel"
                placeholder="0241234567"
                className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
              {chatAuthError && <p className="mt-2 text-xs font-semibold text-red-600">{chatAuthError}</p>}
              <button type="button" onClick={authenticateChatPhone} className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white" style={{ background:G }}>
                Continue securely
              </button>
            </div>
          )
        ) : (
          <button onClick={() => setChatOpen(true)}
            className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform relative"
            style={{ background:G }}>
            <Bot className="w-7 h-7" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white animate-pulse" style={{ background:OR }} />
          </button>
        )}
      </div>
    </>
  );
}
