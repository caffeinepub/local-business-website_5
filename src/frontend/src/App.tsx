import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  PaintbrushIcon,
  Phone,
  Sparkles,
  Star,
  Twitter,
  Users,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FaqItem, Testimonial } from "./backend.d";
import { useActor } from "./hooks/useActor";

const BUSINESS = {
  name: "ProFix Services",
  tagline: "Trusted by 500+ Happy Customers",
  phone: "+91 98765 43210",
  phoneRaw: "+919876543210",
  whatsapp: "919876543210",
  address: "Shop 12, Main Market, Nashik, Maharashtra 422001",
  city: "Nashik",
  email: "info@profixservices.in",
};

const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: 1n,
    name: "Ravi Sharma",
    rating: 5,
    review:
      "Best home service in Nashik! They fixed our plumbing issue in under 2 hours. Highly professional team.",
    timestamp: 0n,
  },
  {
    id: 2n,
    name: "Priya Mehta",
    rating: 5,
    review:
      "Amazing painting service. Our home looks brand new. Very affordable pricing and clean work.",
    timestamp: 0n,
  },
  {
    id: 3n,
    name: "Ankit Desai",
    rating: 5,
    review:
      "The AC servicing was done perfectly. They explained everything clearly and were very punctual.",
    timestamp: 0n,
  },
  {
    id: 4n,
    name: "Sunita Patil",
    rating: 4,
    review:
      "Deep cleaning service was thorough and professional. Would definitely recommend to friends and family!",
    timestamp: 0n,
  },
];

const STATIC_FAQS: FaqItem[] = [
  {
    order: 1,
    question: "What areas do you serve?",
    answer:
      "We serve all areas within Nashik city including Nashik Road, Cidco, Gangapur Road, Satpur, Ambad, and surrounding areas up to 30km radius.",
  },
  {
    order: 2,
    question: "How quickly can you respond?",
    answer:
      "We guarantee a response within 2 hours for standard service requests. For emergency plumbing or electrical issues, our team is available 24/7.",
  },
  {
    order: 3,
    question: "What are your charges?",
    answer:
      "Our charges start from \u20b9299 for basic services. We provide a detailed quote before starting any work with no hidden charges. Complex jobs are priced based on scope.",
  },
  {
    order: 4,
    question: "Do you provide warranty?",
    answer:
      "Yes! All our services come with a 30-day workmanship warranty. For materials and parts, manufacturer warranty applies (usually 1 year).",
  },
  {
    order: 5,
    question: "How do I book a service?",
    answer:
      "You can book by calling us directly, sending a WhatsApp message, or filling out the contact form on this page. We'll confirm your slot within 30 minutes.",
  },
];

const SERVICES = [
  {
    icon: Wrench,
    title: "Home Repairs",
    bullets: ["Plumbing", "Electrical Work", "Carpentry"],
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: PaintbrushIcon,
    title: "Painting",
    bullets: ["Interior Painting", "Exterior Painting", "Waterproofing"],
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Sparkles,
    title: "Cleaning",
    bullets: ["Deep Cleaning", "Sofa Cleaning", "Kitchen Cleaning"],
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Wind,
    title: "AC Service",
    bullets: ["Installation", "Servicing & Repair", "Gas Refill"],
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

const STATS = [
  { icon: Users, value: "500+", label: "Happy Customers" },
  { icon: Star, value: "4.9\u2605", label: "Google Rating" },
  { icon: Award, value: "10+", label: "Years Experience" },
  { icon: Zap, value: "Same Day", label: "Service Available" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${
            s <= rating ? "fill-star text-star" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function App() {
  const { actor } = useActor();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(STATIC_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FaqItem[]>(STATIC_FAQS);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!actor) return;
    Promise.all([
      actor.getTestimonials().catch(() => []),
      actor.getFaqs().catch(() => []),
    ]).then(([backendTestimonials, backendFaqs]) => {
      if (backendTestimonials.length > 0) {
        setTestimonials((prev) => [
          ...prev,
          ...backendTestimonials.filter(
            (bt) => !prev.find((p) => p.id === bt.id),
          ),
        ]);
      }
      if (backendFaqs.length > 0) {
        setFaqs((prev) => [
          ...prev,
          ...backendFaqs.filter(
            (bf) => !prev.find((p) => p.order === bf.order),
          ),
        ]);
      }
    });
  }, [actor]);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Unable to connect. Please call us directly.");
      return;
    }
    setSubmitting(true);
    try {
      await actor.submitContactForm(
        formData.name,
        formData.phone,
        formData.message,
      );
      toast.success("Message sent! We'll contact you within 30 minutes.");
      setFormData({ name: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Toaster />

      {/* STICKY HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Pro<span className="text-primary">Fix</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-8"
              data-ocid="main.nav"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Book Now */}
            <div className="hidden md:block">
              <Button
                onClick={scrollToContact}
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                data-ocid="header.primary_button"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="header.toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-foreground hover:text-primary py-1"
              >
                {link.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToContact();
              }}
              className="bg-primary text-white rounded-full w-full"
            >
              Book Now
            </Button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 min-h-[calc(100vh-64px)] flex items-center bg-gradient-to-br from-background to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center py-16">
            {/* Left content */}
            <div className="space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-star text-star" />
                4.9/5 \u2014 Trusted by 500+ customers in Nashik
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                Best Home Services
                <br />
                <span className="text-primary">in {BUSINESS.city}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Professional plumbing, painting, cleaning &amp; AC services at
                your doorstep. Licensed, insured, and available 7 days a week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={`tel:${BUSINESS.phoneRaw}`}>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 gap-2 transition-transform hover:scale-105 w-full sm:w-auto"
                    data-ocid="hero.primary_button"
                  >
                    <Phone className="w-4 h-4" /> Call Now
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${BUSINESS.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 transition-transform hover:scale-105 w-full sm:w-auto"
                    data-ocid="hero.secondary_button"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  {["R", "P", "A", "S"].map((initial) => (
                    <div
                      key={initial}
                      className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    327+ Reviews
                  </span>{" "}
                  on Google
                </div>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/generated/hero-professional.dim_900x700.jpg"
                  alt="Professional ProFix technician"
                  className="w-full h-[420px] md:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Response Time
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Within 2 Hours
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-star/10 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 fill-star text-star" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Avg Rating
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    4.9 / 5.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-navy py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 text-white"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground">
              4.9/5 average on Google Reviews
            </p>
            <div className="flex justify-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-star text-star" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.slice(0, 8).map((t, i) => (
              <div
                key={String(t.id)}
                className="bg-card rounded-xl shadow-card p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-300"
                data-ocid={`reviews.item.${i + 1}`}
              >
                <StarRating rating={t.rating} />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-sm text-foreground">
                    {t.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Our Services
            </h2>
            <p className="text-muted-foreground">
              Professional home services tailored for your needs
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="bg-card rounded-xl shadow-card p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                data-ocid={`services.item.${i + 1}`}
              >
                <div
                  className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center`}
                >
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {service.title}
                </h3>
                <ul className="flex flex-col gap-1.5 flex-1">
                  {service.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all group-hover:underline"
                  data-ocid={`services.button.${i + 1}`}
                >
                  Get Quote <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT + LOCATION */}
      <section id="about" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* About Card */}
            <div className="bg-card rounded-xl shadow-card p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                About ProFix Services
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                With over 10 years of trusted service in Nashik, ProFix has
                built a reputation for quality workmanship, transparent pricing,
                and unmatched customer care. Our licensed professionals handle
                every job &mdash; big or small &mdash; with the same dedication.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Verified Business (GST Registered)",
                  "Licensed & Fully Insured",
                  "Fast Response \u2014 Within 2 Hours",
                  "Affordable & Transparent Pricing",
                  "500+ Happy Customers Served",
                ].map((badge) => (
                  <div key={badge} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-primary">
                    10+
                  </div>
                  <div className="text-xs text-muted-foreground">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-primary">
                    500+
                  </div>
                  <div className="text-xs text-muted-foreground">Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-primary">
                    4.9&#9733;
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <iframe
                title="ProFix Location - Nashik"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.88!2d73.7898!3d19.9975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeba3cbe38e9b%3A0x35f8e40df65ed6b2!2sNashik%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      Our Location
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {BUSINESS.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href={`tel:${BUSINESS.phoneRaw}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {BUSINESS.phone}
                  </a>
                </div>
                <a
                  href="https://maps.google.com/?q=Nashik,Maharashtra"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg gap-2"
                    data-ocid="location.primary_button"
                  >
                    <MapPin className="w-4 h-4" /> Get Directions
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY + FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gallery */}
            <div id="gallery">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Our Work
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 rounded-xl overflow-hidden shadow-card">
                  <img
                    src="/assets/generated/gallery-1.dim_600x400.jpg"
                    alt="Home repair work"
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-card">
                  <img
                    src="/assets/generated/gallery-2.dim_600x400.jpg"
                    alt="Painting service"
                    className="w-full h-44 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-card">
                  <img
                    src="/assets/generated/gallery-3.dim_600x400.jpg"
                    alt="Cleaning service"
                    className="w-full h-44 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div id="faq">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-2"
              >
                {faqs
                  .sort((a, b) => a.order - b.order)
                  .map((faq, i) => (
                    <AccordionItem
                      key={faq.order}
                      value={`faq-${faq.order}`}
                      className="bg-background rounded-xl px-4 border border-border data-[state=open]:shadow-card"
                      data-ocid={`faq.item.${i + 1}`}
                    >
                      <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT/QUOTE SECTION */}
      <section id="contact" ref={contactRef} className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl shadow-card p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Get a Free Quote
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you within 30
                minutes
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Your Name
                </label>
                <Input
                  id="contact-name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="rounded-lg"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-phone"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Phone Number
                </label>
                <Input
                  id="contact-phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  type="tel"
                  className="rounded-lg"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Message / Service Required
                </label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell us what you need help with..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  rows={4}
                  className="rounded-lg resize-none"
                  data-ocid="contact.textarea"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="bg-primary text-white hover:bg-primary/90 rounded-full w-full mt-2"
                data-ocid="contact.submit_button"
              >
                {submitting
                  ? "Sending..."
                  : "Send Message \u2014 Get Free Quote"}
              </Button>
            </form>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-border">
              <a href={`tel:${BUSINESS.phoneRaw}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-full border-2 border-primary text-primary hover:bg-primary/5"
                  data-ocid="contact.secondary_button"
                >
                  <Phone className="w-4 h-4" /> {BUSINESS.phone}
                </Button>
              </a>
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-full border-2 border-green-500 text-green-600 hover:bg-green-50"
                  data-ocid="contact.secondary_button"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">ProFix Services</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Nashik&apos;s most trusted home services provider. Licensed,
                insured, and committed to excellence since 2014.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  data-ocid="footer.link"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  data-ocid="footer.link"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  data-ocid="footer.link"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">
                Quick Links
              </h3>
              <nav className="flex flex-col gap-2">
                {[
                  { label: "Services", href: "#services" },
                  { label: "About Us", href: "#about" },
                  { label: "Gallery", href: "#gallery" },
                  { label: "Reviews", href: "#reviews" },
                  { label: "Contact", href: "#contact" },
                  { label: "FAQ", href: "#faq" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">
                Contact Us
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" /> {BUSINESS.phone}
                </a>
                <a
                  href={`https://wa.me/${BUSINESS.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" /> WhatsApp
                  Us
                </a>
                <div className="flex items-start gap-2 text-sm text-white/70">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{BUSINESS.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock className="w-4 h-4 flex-shrink-0" /> Mon&ndash;Sun:
                  8:00 AM &ndash; 8:00 PM
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
            <span>
              &copy; {new Date().getFullYear()} ProFix Services. All rights
              reserved.
            </span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white/80 transition-colors"
            >
              Built with &#10084;&#65039; using caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
            <div className="text-white text-sm font-semibold hidden sm:block">
              Need help? We&apos;re available 24/7
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full gap-2 px-4"
                  data-ocid="sticky_cta.primary_button"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </Button>
              </a>
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial"
              >
                <Button
                  size="sm"
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full gap-2 px-4"
                  data-ocid="sticky_cta.secondary_button"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
              </a>
              <button
                type="button"
                onClick={scrollToContact}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 rounded-full gap-2 px-4"
                  data-ocid="sticky_cta.button"
                >
                  Get Quote
                </Button>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
