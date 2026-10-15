import { Hero } from "@/components/hero";
import { Statement } from "@/components/statement";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Stack } from "@/components/stack";
import { KineticBand } from "@/components/kinetic-band";
import { Workflow } from "@/components/workflow";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { projects } from "@/data/portfolio";
import { siteUrl } from "@/data/site";

export default function Home() {
  const featured = projects[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: featured.title.en,
            description: featured.description.en,
            url: featured.liveUrl,
            codeRepository: featured.repoUrl,
            programmingLanguage: ["TypeScript", "SQL"],
            runtimePlatform: "Next.js",
            keywords: featured.tags.join(", "),
            author: {
              "@type": "Person",
              name: "Ricardo Vital",
              url: siteUrl,
            },
          }),
        }}
      />
      <Hero />
      <Statement />
      <About />
      <Experience />
      <Projects />
      <Stack />
      <KineticBand />
      <Workflow />
      <Contact />
      <Footer />
    </>
  );
}
