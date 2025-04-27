"use client";

import Image from "next/image";
import ScrollButton from "../components/ScrollButton";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("TEST!!!");
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Check if email already exists
      const { data: existingEmails } = await supabase
        .from("waitlist")
        .select("email")
        .eq("email", email.toLowerCase())
        .single();

      if (existingEmails) {
        setError("This email is already on the waitlist!");
        return;
      }

      // Insert new email
      const { error: insertError } = await supabase
        .from("waitlist")
        .insert([{ email: email.toLowerCase() }]);

      // Send confirmation email to user that they have signed up for the waitlist
      console.log("Preparing to send email to: ", email);
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error("Failed to send confirmation email.");
      }

      if (insertError) throw insertError;

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] dark:bg-gray-900">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pt-20 pb-16">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Host a Dinner. Share a Moment.
            <br />
            Make Connections.
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Dinnit connects hosts and diners for authentic, home-cooked meals
            and unforgettable experiences.
          </p>
          <ScrollButton className="bg-[#FF6B4A] hover:bg-[#FF8266] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all">
            Join the Waitlist
          </ScrollButton>
        </div>

        {/* App Preview */}
        <div className="relative h-[400px] mb-20 flex justify-center gap-8">
          <div className="relative w-1/2">
            <Image
              src="/landingpage.png"
              alt="Dinnit App Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-1/2">
            <Image
              src="/discoverpage.png"
              alt="Dinnit App Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-1/2">
            <Image
              src="/neweventpage.png"
              alt="Dinnit App Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-1/2">
            <Image
              src="/profilepage.png"
              alt="Dinnit App Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {[
            {
              title: "Discover Unique Meals",
              description:
                "Experience authentic home-cooked dishes from diverse cultures",
              icon: "🍽️",
            },
            {
              title: "Meet New People",
              description:
                "Connect with food lovers and make lasting friendships",
              icon: "👥",
            },
            {
              title: "Host & Earn",
              description: "Share your culinary passion and earn while hosting",
              icon: "💰",
            },
            {
              title: "Safe & Secure",
              description: "Verified profiles and secure payment system",
              icon: "🔒",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            How Dinnit Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create or Find Events",
                description: "Browse dinner events or host your own gathering",
              },
              {
                step: "2",
                title: "Connect & Coordinate",
                description:
                  "Chat with hosts or guests and plan your experience",
              },
              {
                step: "3",
                title: "Share & Enjoy",
                description: "Experience memorable moments over delicious food",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#FF6B4A] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Jamie F.",
                role: "Host",
                quote:
                  "Hosting dinners has become my favorite weekend activity. I've met amazing people and shared my passion for Vietnamese cuisine!",
                avatar: "/avatars/jamie.jpeg",
              },
              {
                name: "Gautam M.",
                role: "Diner",
                quote:
                  "Through Dinnit, I've experienced authentic home-cooked meals from different cultures. It's like traveling the world from my neighborhood!",
                avatar: "/avatars/gautam.jpeg",
              },
              {
                name: "Marzia D.",
                role: "Host & Diner",
                quote:
                  "The platform is so easy to use, whether I'm hosting or joining dinners. The community is wonderful and welcoming.",
                avatar: "/avatars/marzia.jpeg",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#FFFAF5] dark:bg-gray-700 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Features */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Smart Matching",
                description:
                  "Our algorithm connects you with dinners and hosts that match your preferences and dietary requirements.",
                icon: "🎯",
              },
              {
                title: "Secure Payments",
                description:
                  "Integrated payment system with secure processing and automatic host payouts.",
                icon: "💳",
              },
              {
                title: "Verified Profiles",
                description:
                  "All users go through our verification process for a safe and trustworthy community.",
                icon: "✅",
              },
              {
                title: "Real-time Chat",
                description:
                  "Built-in messaging system to coordinate with hosts or guests before the dinner.",
                icon: "💬",
              },
              {
                title: "Reviews & Ratings & Dinner Photos",
                description:
                  "Transparent feedback system helps maintain high-quality experiences whilst allowing you to relive past dinners.",
                icon: "⭐",
              },
              {
                title: "Flexible Hosting",
                description:
                  "Set your own schedule, menu, and pricing. Host whenever it suits you.",
                icon: "📅",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
              >
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How do I become a host?",
                answer:
                  "Sign up on Dinnit, complete our verification process, and set up your host profile. You can then create dinner events with your menu, pricing, and available dates.",
              },
              {
                question: "Is it safe to dine with strangers?",
                answer:
                  "Safety is our top priority. All users undergo verification, and we have a review system in place. Hosts and guests can chat beforehand, and our secure payment system protects both parties.",
              },
              {
                question: "What are the fees?",
                answer:
                  "Dinnit takes a small service fee from each transaction to maintain the platform. Hosts receive the majority of the payment, and pricing is always transparent for both hosts and guests.",
              },
              {
                question: "Can I have dietary restrictions?",
                answer:
                  "Absolutely! Hosts list all ingredients and can accommodate dietary restrictions. You can filter dinner events based on your dietary needs.",
              },
              {
                question: "How do payments work?",
                answer:
                  "Guests pay through our secure platform when booking. Funds are held safely until after the dinner, then automatically released to the host.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold mb-2 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist Form */}
        <div id="waitlist-form" className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">
            Be the First to Experience Dinnit
          </h2>
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-full mb-4 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B4A] hover:bg-[#FF8266] disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all"
              >
                {isLoading ? "Joining..." : "Join the Waitlist"}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && (
                <p className="text-green-500 mt-2">
                  Successfully joined the waitlist!
                </p>
              )}
            </form>
            <p className="text-sm text-gray-500 mt-4">
              Be among the first to experience Dinnit and get exclusive early
              access perks!
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 py-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <Image
                src="/appstore.svg"
                alt="Download on App Store"
                width={140}
                height={42}
                className="opacity-100"
              />
              <Image
                src="/playstore.svg"
                alt="Get it on Google Play"
                width={140}
                height={42}
                className="opacity-100"
              />
            </div>
            <div className="flex gap-6 text-gray-500">
              <a href="#" className="hover:text-[#FF6B4A]">
                About
              </a>
              <a href="#" className="hover:text-[#FF6B4A]">
                Contact
              </a>
              <a href="#" className="hover:text-[#FF6B4A]">
                Privacy
              </a>
              <a href="#" className="hover:text-[#FF6B4A]">
                Terms
              </a>
            </div>
            <p className="text-gray-500">
              © 2025 Dinnit. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
