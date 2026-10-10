import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Workflow } from "@/components/workflow";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Workflow />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}
