import { ArrowRight, Car, ShieldCheck, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: ShieldCheck,
    title: "Trusted service",
    text: "Every booking is backed by transparent pricing, verified vehicles, and reliable support from pickup to return.",
  },
  {
    icon: Car,
    title: "Flexible rentals",
    text: "From daily commutes to weekend drives, we make it easy to find the right vehicle for every trip and plan.",
  },
  {
    icon: Users,
    title: "Customer-first approach",
    text: "We listen to your needs, simplify the process, and help you move confidently with the right car at the right time.",
  },
];

const stats = [
  { value: "10k+", label: "Happy customers" },
  { value: "250+", label: "Cars available" },
  { value: "4.8/5", label: "Average rating" },
  { value: "24/7", label: "Support" },
];

export default function About() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
              About CarRent
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
              Making every journey smoother, easier, and more memorable.
            </h1>
            <p className="mt-6 text-lg text-blue-50 max-w-2xl">
              We are a modern car rental platform built for convenience, trust,
              and flexibility—helping individuals, families, and businesses find
              the right ride in minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1000&q=80"
              alt="Car rental customer experience"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Our story
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Built for everyday mobility and extraordinary trips.
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              CarRent started with a simple idea: renting a car should feel as
              effortless as booking a ride. We created a platform that combines
              premium vehicle options, transparent rates, and customer-focused
              support—so you can focus on the road ahead.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Whether you need a compact city car for a business trip or a
              spacious SUV for a family getaway, our curated fleet is designed
              to match your plans, schedule, and budget without compromise.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-700">
              <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
                <Star className="w-4 h-4 fill-current" />
              </div>
              Rated by customers for reliability, service, and ease of booking.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why choose us
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              A better car rental experience from start to finish
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="card p-7 hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-600 rounded-3xl px-6 py-10 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
              Ready to drive?
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              Find your ideal car today.
            </h3>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Browse cars <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
