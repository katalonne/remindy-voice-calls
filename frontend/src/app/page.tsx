"use client";

import { useRef } from "react";
import { Dashboard } from "../components/dashboard/Dashboard";
import { Hero } from "../components/landing/Hero";

export default function Home() {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <Hero onGetStarted={scrollToDashboard} />
      <div ref={dashboardRef}>
        <Dashboard />
      </div>
    </main>
  );
}
