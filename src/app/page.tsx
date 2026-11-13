import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Runtime } from "@/components/layout/Runtime";
import { SkipLink } from "@/components/layout/SkipLink";
import { Preloader } from "@/components/preloader/Preloader";
import { Aerodynamics } from "@/components/sections/Aerodynamics";
import { Finale } from "@/components/sections/Finale";
import { Hero } from "@/components/sections/Hero";
import { HotspotsSection } from "@/components/sections/HotspotsSection";
import { Interior } from "@/components/sections/Interior";
import { Performance } from "@/components/sections/Performance";
import { Precision } from "@/components/sections/Precision";
import { ShowroomSection } from "@/components/sections/ShowroomSection";

export default function Home() {
  return (
    <>
      <SkipLink />
      <Preloader />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Precision />
        <Aerodynamics />
        <ShowroomSection />
        <HotspotsSection />
        <Performance />
        <Interior />
        <Finale />
      </main>
      <Footer />
      <Runtime />
    </>
  );
}
