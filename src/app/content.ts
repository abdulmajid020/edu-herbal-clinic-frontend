import { Calendar, Phone, Stethoscope, FlaskConical, Leaf, Microscope,
  Footprints, BedDouble, Ambulance } from "lucide-react";
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
import { G, OR, R } from "./theme";

export const SERVICES = [
  { icon: Stethoscope, title: "Consultation", desc: "Experts Who Are Qualified Conduct Consultation. Holistic Treatment Is Given To Our Patients So During Consultation, An Opportunity Is Given To Our Patients To Sit Down In A Relaxed And Supportive Environment To Have An In-Depth Conversation About Their Health Concerns. We Put Our Patients First.", color: G, image: service5Image },
  { icon: FlaskConical, title: "Laboratory Tests", desc: "At Edu Herbal Clinic We Diagnose With The Help Of Lab Results. An Expert In Medical Lab Conducts Laboratory Tests On Clinical Specimens To Obtain Information About The Health Of Our Patients And To Aid In The Diagnosis, Treatment, And Prevention Of Diseases. At Our Head Office In Mankessim-Baifikrom And Our Other Branches, Quality Care Is Provided By Our Doctors With The Help Of Their Expectations And Professionals.", color: R, image: service1Image },
  { icon: Leaf, title: "Herbal Products", desc: "We Use Organic And Natural Herbal Medicine To Treat Diseases. The FDA Has Approved Our Herbal Supplement. Therefore The Efficacy Is Very High. Precautions Are Taken To Ensure That The Body Returns To A State Of Natural Balance So That It Can Heal Itself.", color: G, image: service2Image },
  { icon: Calendar, title: "Online Booking", desc: "Schedule your appointment online at your convenience. Easily book your appointment anytime, anywhere. Securely your scheduled appointment with just a few clicks. Convenient online booking for a seamless healthcare experience 24/7.", color: OR, image: service9Image },
  { icon: Microscope, title: "Diagnostic Center", desc: "We Do Both Ultrasound And Quantum Scans That Help To Identify Affected Tissues And Also Aid In Diagnosing A Particular Disease Condition.", color: R, image: service4Image },
  { icon: Phone, title: "Telemedicine", desc: "Stay Connected To Edu Herbal Clinic Through Our Secure Telemedicine Service. Enjoy Our Flexible Virtual Appointments, Professional Medical Consultation And A Reliable Healthcare Support.", color: OR, image: service10Image },
  { icon: Footprints, title: "Physiotherapy", desc: "Edu Herbal Medicines Can Provide Soothing Relief, And They Can Reduce Pain And Inflammation When Applied To The Affected Area With Physical Massage.", color: G, image: service3Image },
  { icon: BedDouble, title: "Private & General Wards", desc: "We Provide Our Patients With Ultra Modern Private And General Wards. Our Clinic Contains Double Or Single Bed That Gives A Patient Total Privacy. We Care For Our Patient Always By Assisting Them To Recover Very Fast.", color: OR, image: service6Image },
  { icon: Ambulance, title: "Clinic On-Wheels", desc: "We Do Free Screenings For Communities, Churches, Schools, And Any Formidable Organizations When We Are Called Upon To Come And Do This Exercise As Part Of Our Responsibilities.", color: R, image: service7Image },
];

export const WHAT_WE_DO_CARDS = [
  { title: "Health Kidney and / Prostate problems", desc: "Prostatitis, Prostate enlargement and Prostate cancer are the condition that affects the prostate. kidney disease leads to severe and adverse effects, which results in loss of kidney function, Causes kidney stones which are clear indications of kidney failure." },
  { title: "Infertility / Sexual Weakness", desc: "Infertility is the inability of a person to reproduce by natural means and erectile dysfunction is a man’s inability to achieve full erection despite a man’s willingness to perform sexual act with his partner." },
  { title: "Sciatica", desc: "It is a constant pain that radiates along the path of the sciatic nerve, which branches from your lower back through your hips and buttocks and down each leg, Typically, sciatica can affect both sides of your body." },
  { title: "Malaria", desc: "Suffering from Malaria is a serious and sometimes fatal disease caused by a parasite that commonly affects a certain type of mosquito which feeds on humans." },
  { title: "Asthma", desc: "A disorder wherein a person's airways narrow, swell, and generate additional mucus, making it difficult to breathe. Airborne allergens, such as pollen, dust mites, and mold spores, are the source of this ailment." },
  { title: "Stroke Expert", desc: "We Use Organic And Natural Herbal Medicine To Treat Stroke. Stroke occurs When There Is Insufficient Blood To The Brain. Symptoms Includes: Paralysis, Numbness Or Weakness In The Arm, Face, And Leg, Especially On One Side Of The Body. Difficulty in speaking and hearing." },
  { title: "Hypertension / Diabetes", desc: "High blood pressure, often occurs alongside diabetes mellitus, including type 1, type 2, and gestational diabetes. Hypertension and type 2 diabetes are both aspects of metabolic syndrome and also causes cardiovascular disease." },
  { title: "Cancer", desc: "A category of illnesses known as \"cancer\" involve abnormal cell proliferation and have the ability to move to other body regions or invade them." },
];

export const DOCTORS = [
  { id: 1, name: "Dr. Edu Mohammed", specialty: "Special General Consultation", initials: "AO", slots: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"] },
  { id: 2, name: "Dr. Opoku", specialty: "Stroke Specialist", initials: "FA", slots: ["08:30 AM", "11:00 AM", "01:00 PM", "04:00 PM"] },
  { id: 3, name: "Mr. Eric", specialty: "Reflexology, Physiotherapy and Massage Unit", initials: "KA", slots: ["09:30 AM", "10:30 AM", "02:30 PM", "04:30 PM"] },
];

export const PRODUCTS = [
  { id: 1, name: "Edhec SM Bitters", category: "Bitters", price: 70, img: product1Image, desc: "Edhec SM Bitters is a potent herbal remedy known for effectively relieving waist pain and enhancing overall well-being. It supports a healthy libido and addresses sexual weakness, making it ideal for those seeking to boost their vitality naturally. The unique blend of herbs works to restore energy levels and promote better physical performance. Regular use can help improve circulation and reduce discomfort associated with body aches. Edhec SM Bitters is a natural solution for maintaining both physical and sexual health." },
  { id: 2, name: "Edhec Herbal Mixture", category: "Tincture", price: 40, img: product2Image, desc: "Edhec Herbal Mixture is a powerful natural solution for relieving abdominal and body pains. Its unique herbal blend works quickly to soothe discomfort, promoting faster recovery and overall well-being. Ideal for those seeking an effective, natural approach, it provides relief without side effects. Experience the healing power of Edhec Herbal Mixture for a pain-free life.." },
  { id: 3, name: "Edhec Herbal Tonic", category: "Topical", price: 40, img: product3Image, desc: "Edhec Herbal Tonic is an excellent solution for loss of appetite and anemia. Its potent blend of natural ingredients stimulates appetite and boosts iron levels, promoting overall vitality and well-being. Rediscover your energy and zest for life with this trusted tonic." },
  { id: 4, name: "Edhec Be Stronge", category: "Capsules", price: 40, img: product4Image, desc: "Edhec Be Stronge is highly effective for general body pain, offering quick and lasting relief. Its natural formulation targets pain sources to provide soothing comfort and restore mobility. Experience enhanced well-being with this trusted solution." },
  { id: 5, name: "Edhec Malacure Mixture", category: "Raw Herbs", price: 40, img: product5Image, desc: "Edhec Herbal Malacure is a powerful solution for malaria, crafted to support effective recovery. Its unique herbal blend works synergistically to combat malaria symptoms and enhance overall health. With its natural approach, you can trust Edhec Herbal Malacure to restore your well-being and vitality safely and effectively." },
  { id: 6, name: "Edhec Herbal Laxative", category: "Syrup", price: 40, img: product6Image, desc: "Edhec Herbal Laxative is highly effective for relieving constipation and menstrual disorders. Its natural formula promotes regular bowel movements and supports menstrual health. Experience comfort and balance with this trusted herbal solution.." },
  { id: 7, name: "Edhec Herbal Cough Mixture", category: "Tea", price: 30, img: product7Image, desc: "Edhec Herbal Cough Mixture is highly effective for relieving coughs. Its potent natural ingredients soothe the throat and reduce irritation, providing fast and lasting relief. Trust this herbal solution for effective cough relief." },
];

export const TESTIMONIALS = [
  { name: "Mr. Emmanual Amoako", condition: "Stroke", date: "March 2025", rating: 5, text: "I had a stroke and as a final resort, I tried herbal treatment. To my surprise, the therapies enhanced my mobility and cognitive performance in addition to relieving my symptoms. I am appreciative of Doc. Edu's comprehensive herbal approach for helping me restore my quality of life." },
  { name: "Mr. Majid", condition: "Hypertension", date: "April 2026", rating: 5, text: "Despite I had doubts about herbal medicine's ability to treat hypertension, I gave it a try out of desperation for relief. I was astounded that the customized herbal treatments not only reduced my symptoms but also markedly enhanced my general health, demonstrating the efficacy of alternative medicine." },
  { name: "Adwoa Sarpong", condition: "Low libido", date: "May 2026", rating: 5, text: "Edu Herbal medicine transformed my life by addressing my low libido. I'm grateful for the holistic healing it offers. By meeting their professional doctors, I got my value back again." },
];

export const INITIAL_BLOG_POSTS = [
  { title: "7 Herbs That Naturally Lower Blood Sugar", category: "Diabetes", date: "28 June 2025", readTime: "5 min", excerpt: "Discover scientifically-backed herbal remedies that clinical trials show can meaningfully support healthy blood glucose levels.", image: news3 },
  { title: "Managing Hypertension Without Synthetic Drugs", category: "Heart Health", date: "15 June 2025", readTime: "7 min", excerpt: "High blood pressure doesn't always demand pharmaceutical intervention. Here's what lifestyle medicine and herbal protocols achieve.", image: news4 },
  { title: "The Complete Guide to Herbal Liver Detoxification", category: "Wellness", date: "3 June 2025", readTime: "6 min", excerpt: "A well-designed herbal detox supports liver, kidneys and lymphatic function simultaneously. Here is what actually works.", image: news5 },
];

export const BLOG_POSTS = INITIAL_BLOG_POSTS;

export const FAQS = [
  { q: "Do you treat stroke and neurological conditions?", a: "Yes. We have dedicated protocols for post-stroke rehabilitation, memory disorders and peripheral neuropathy, led by Dr. Edu Mohammed." },
  { q: "Do you treat diabetes and hypertension?", a: "These are our most-treated conditions. We have well-established herbal protocols with documented clinical outcomes for both Type 2 Diabetes and essential hypertension." },
  { q: "Can I book an appointment online?", a: "Yes. Use our booking form to select your preferred doctor, date and time. Confirmation is sent instantly via SMS and WhatsApp." },
  { q: "What are your opening hours?", a: "Monday–Friday: 8:00 AM – 6:00 PM. Saturday: 9:00 AM – 3:00 PM. Sunday: Closed. Emergency WhatsApp consultations are available outside hours." },
  { q: "Where are you located?", a: "Odorkor Official Town & Mankessim - Bafikrom. We also operate branches in Greater Accra and Mankessim." },
];

export const INITIAL_HERO_SLIDES = [
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

export const AWARD_GALLERY = [
  { src: news12, title: "Patient-Centred Care", caption: "Modern herbal care with a human touch" },
  { src: news3, title: "Clinical Presence", caption: "A polished, professional clinic experience" },
  { src: news4, title: "Wellness Focus", caption: "Holistic support for long-term wellness" },
  { src: news5, title: "Herbal Expertise", caption: "Evidence-led treatment and compassionate guidance" },
  { src: skilled3Image, title: "Trusted Team", caption: "Dedicated professionals behind every visit" },
  { src: news6, title: "Community Impact", caption: "Building healthier lives through care and education" },
  { src: news7, title: "Care in Action", caption: "A closer look at the clinic atmosphere" },
];
