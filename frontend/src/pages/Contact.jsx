import { Mail, MapPin, Phone, Send, Clock3 } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit us",
    text: "Car Rent , Noida Sector 44, Uttar Pradesh, India",
  },
  { icon: Phone, title: "Call us", text: "+91 98765 43210" },
  { icon: Mail, title: "Email us", text: "support@carrent.com" },
  { icon: Clock3, title: "Hours", text: "Mon - Sun: 8:00 AM - 10:00 PM" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-gray-900">
          We’re here to help.
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Have a question about booking, pricing, or a specific vehicle? Reach
          out and our team will get back to you soon.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Send us a message
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Tell us more about your request"
                className="input-field resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <button
                type="submit"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send message
              </button>
              {submitted && (
                <span className="text-sm text-green-600 font-medium">
                  Thanks! Your message has been sent.
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {contactInfo.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
