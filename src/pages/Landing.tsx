import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCampus } from "@/store/campusStore";
import {
  ShoppingBag,
  Clock,
  MapPin,
  Users,
  Store,
  UtensilsCrossed,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import heroImg from "@/assets/landing-hero.jpg";

export default function Landing() {
  const { vendors, menu } = useCampus();

  const modules = [
    { title: "User Management", desc: "Register & sign in as Student, Vendor, or Admin.", icon: Users, to: "/users" },
    { title: "Vendor Management", desc: "Onboard campus vendors with location & contact.", icon: Store, to: "/vendors" },
    { title: "Menu Management", desc: "Add, update, and remove menu items per vendor.", icon: UtensilsCrossed, to: "/menu" },
    { title: "Order Management", desc: "Place orders and track Pending → Preparing → Completed.", icon: ClipboardList, to: "/orders" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur bg-background/80 border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold flex items-center justify-center">CE</div>
            <span className="font-bold text-lg">Campus Eats</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#how" className="text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#modules" className="text-muted-foreground hover:text-foreground">Modules</a>
            <a href="#vendors" className="text-muted-foreground hover:text-foreground">Vendors</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm"><Link to="/signup">Get started <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
            <GraduationCap className="h-3.5 w-3.5" /> Built for students
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Skip the line. <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Pick up on campus.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Campus Eats is the on-campus pickup network — order ahead from your favorite student vendors, then grab it on the way to class. No delivery fees, no waiting.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/student">Order now <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/vendor">List your stall</Link></Button>
          </div>
          <div className="flex gap-6 pt-4 text-sm">
            <Stat n={vendors.length} label="Campus vendors" />
            <Stat n={menu.length} label="Menu items" />
            <Stat n="<5m" label="Avg pickup" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-primary-glow/20 blur-3xl rounded-full" />
          <img
            src={heroImg}
            alt="Campus food spread for student pickup"
            width={1536}
            height={1024}
            className="relative rounded-3xl shadow-[var(--shadow-glow)] object-cover aspect-[4/3]"
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-secondary/40 border-y">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Pickup in three steps</h2>
            <p className="text-muted-foreground mt-3">Designed around the campus rhythm — between lectures, before practice, after the library.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { i: ShoppingBag, t: "1. Browse & order", d: "Pick items from any campus vendor and confirm your order." },
              { i: Clock, t: "2. Vendor prepares", d: "Track status as it moves from Pending → Preparing → Completed." },
              { i: MapPin, t: "3. Pick it up", d: "Walk over to the vendor's stall and grab your bag. Done." },
            ].map((s) => (
              <Card key={s.t} className="border-0 shadow-[var(--shadow-soft)]">
                <CardContent className="p-6 space-y-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center">
                    <s.i className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Everything the system manages</h2>
            <p className="text-muted-foreground mt-2">Four core modules, exactly as defined in the process spec.</p>
          </div>
          <Button asChild variant="outline"><Link to="/dashboard">Go to dashboard <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m) => (
            <Link key={m.title} to={m.to}>
              <Card className="h-full hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] transition">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Vendors */}
      <section id="vendors" className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-16 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold">Run a stall on campus?</h2>
            <p className="opacity-80 max-w-lg">List your menu, take pickup orders, and fulfill them with a simple status workflow. Reports for sales, vendor performance, and user activity included.</p>
            <ul className="space-y-2">
              {["Per-vendor menu CRUD", "Live order queue", "Sales & performance reports"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary-glow" /> {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Button asChild><Link to="/vendors">Become a vendor</Link></Button>
              <Button asChild variant="outline" className="bg-transparent border-background/30 text-background hover:bg-background hover:text-foreground"><Link to="/reports">View reports</Link></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vendors.slice(0, 4).map((v) => {
              const items = menu.filter((m) => m.vendorId === v.id);
              return (
                <Card key={v.id} className="bg-background/5 border-background/10 text-background">
                  <CardContent className="p-5">
                    <div className="text-xs opacity-60">{v.location}</div>
                    <div className="font-semibold mt-1">{v.name}</div>
                    <div className="text-xs opacity-70 mt-2">{items.length} items</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Campus Eats — student pickup network.</div>
          <div className="flex gap-4">
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link to="/reports" className="hover:text-foreground">Reports</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{n}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}