"use client";

import React from "react";
import Image from "next/image";
import { Home, CreditCard, CheckSquare, Bell, Key } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import MainButton from "./main-button";
import { title } from "process";

export default function LandingClient() {
  return (
    <>
      {/* HERO */}
      <section className="w-full bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="gap-12 items-center flex flex-col md:flex-row">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h1 className="text-5xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent text-6xl">
                  HouseMates
                </span>{" "}
                is everything your household needs, in one place
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                It helps people who share a house stay organised. Manage bills,
                tasks, alerts, credentials, and all your household information
                in a single shared space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-start justify-center">
                <MainButton href="/auth" className="font-semibold">
                  Create or join a house
                </MainButton>
                {/* <MainButton href="/how-it-works">How it works</MainButton> */}
              </div>
            </motion.div>

            <div className="relative w-full h-[320px] md:h-[420px]">
              <Image
                src="/images/screenshot.png"
                alt="HouseMates app preview"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN DO */}
      <section className="w-full bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What you can do with HouseMates
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage shared living, without messy group
              chats or spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center gap-4">
              <CreditCard className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Bills & payments</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Add bills, split costs between housemates, and track who has
                paid their share.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <CheckSquare className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Tasks & alerts</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Create shared tasks and alerts so nothing is forgotten in your
                home.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Key className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Shared credentials</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Keep Wi‑Fi passwords, appliance logins, and access codes in one
                secure place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-20">
            <span className="inline-block mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500">
              Simple & intuitive
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              How it works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Three simple steps to keep everyone aligned and your home running
              smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* STEP 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="absolute -top-6 left-6 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500 text-white text-lg font-bold bg-gradient-to-r from-blue-500 to-green-500">
                1
              </div>

              {/* <Home className="w-10 h-10 text-blue-500 mb-6 mt-4" /> */}

              <h3 className="text-xl font-semibold mb-3">
                Create or join a house
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Set up a new house in seconds or join an existing one using an
                invite link.
              </p>
            </motion.div>

            {/* STEP 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="absolute -top-6 left-6 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500 text-white text-lg font-bold bg-gradient-to-r from-blue-500 to-green-500">
                2
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Add everything you share
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Register bills, chores, alerts, rooms, and shared credentials in
                one central place.
              </p>
            </motion.div>

            {/* STEP 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="absolute -top-6 left-6 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500 text-white text-lg font-bold bg-gradient-to-r from-blue-500 to-green-500">
                3
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Stay organised together
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Everyone knows what to pay, what to do, and what needs
                attention.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* APP SCREENSHOTS (CAROUSEL) */}
      <section className="w-full bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A quick look at the main screens in HouseMates.
            </p>
          </div>

          <Carousel />
        </div>
      </section>

      {/* DEMO VIDEO */}
      {/* <section className="w-full bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See it in action
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Watch a quick demo of the app to see how HouseMates helps you stay
              organised.
            </p>
          </div>

          <div className="relative w-full h-[360px] md:h-[520px]">
            <video
              className="w-full h-full object-contain rounded-xl"
              autoPlay
              loop
              muted
              controls
            >
              <source src="/videos/demo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section> */}

      {/* TESTIMONIALS */}
      <section className="w-full bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by people who share a home
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real feedback from people who use HouseMates to keep their home
              organised.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-black p-6 rounded-xl shadow-sm"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                “We stopped arguing about bills. Everyone knows exactly what
                they owe and when to pay.”
              </p>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-sm text-gray-500">Shared apartment</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white dark:bg-black p-6 rounded-xl shadow-sm"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                “Having all passwords and house info in one place saved us so
                much time.”
              </p>
              <div className="font-semibold">Lucas R.</div>
              <div className="text-sm text-gray-500">
                House with 4 roommates
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white dark:bg-black p-6 rounded-xl shadow-sm"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                “Tasks, alerts, bills… everything finally feels organised. We
                actually use it every day.”
              </p>
              <div className="font-semibold">Emily T.</div>
              <div className="text-sm text-gray-500">Shared house</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section className="w-full bg-white dark:bg-black border-t border-gray-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile app coming soon
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              HouseMates will soon be available on iOS and Android. Join now and
              be the first to download the app when it launches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a aria-disabled="true" className="pointer-events-none opacity-60">
              <Image
                src="/images/appstore-badge.svg"
                alt="Download on the App Store (coming soon)"
                width={180}
                height={54}
              />
            </a>

            <a aria-disabled="true" className="pointer-events-none opacity-60">
              <Image
                src="/images/playstore-badge.svg"
                alt="Get it on Google Play (coming soon)"
                width={180}
                height={54}
              />
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500 text-center">
            Available soon on the App Store and Google Play.
          </p>
        </div>
      </section>
      {/* FINAL CTA */}
      <section className="w-full bg-blue-500  bg-gradient-to-r from-blue-500 to-green-500">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Make shared living simple
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Stop chasing messages and spreadsheets. Manage your shared home with
            clarity and confidence.
          </p>
          <Link
            href="/auth"
            className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold"
          >
            Create your account
          </Link>
        </div>
      </section>
    </>
  );
}

function Carousel() {
  const slides = [
    {
      title: "Bills",
      description: "Split costs and track payments.",
      image: "/images/bills.png",
      alt: "Bills screen",
    },
    {
      title: "Tasks",
      description: "Assign chores and keep everyone aligned.",
      image: "/images/tasks.png",
      alt: "Tasks screen",
    },
    {
      title: "Alerts",
      description: "Reminders for bills, tasks, and house events.",
      image: "/images/alerts.png",
      alt: "Alerts screen",
    },
    {
      title: "Credentials",
      description: "Store shared passwords and access codes securely.",
      image: "/images/credentials.png",
      alt: "Credentials screen",
    },
  ];

  const [index, setIndex] = React.useState(0);

  const prev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.title} className="w-full flex-shrink-0">
              <div className="relative w-full h-[320px] md:h-[420px]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 bg-white dark:bg-black">
                <h3 className="text-xl font-semibold mb-2">{slide.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-black/80 border border-gray-200 dark:border-neutral-800 p-2 shadow-sm"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-black/80 border border-gray-200 dark:border-neutral-800 p-2 shadow-sm"
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-8 rounded-full transition-all duration-200 ${
              i === index ? "bg-blue-500" : "bg-gray-300 dark:bg-neutral-700"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
