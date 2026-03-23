import { AboutHero } from "@/src/features/(website)/about-us/components/about-hero";
import { TrustBar } from "@/src/features/(website)/about-us/components/trust-bar";
import { AudienceSection } from "@/src/features/(website)/about-us/components/audience-section";
import { StatsStrip } from "@/src/features/(website)/about-us/components/stats-strip";
import { AdvisorVisual, StudentVisual, ParentVisual, PracticeVisual } from "@/src/features/(website)/about-us/components/visuals";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8]">
      <AboutHero />
      <TrustBar />
      
      {/* Advisors Section */}
      <AudienceSection
        id="advisors"
        eyebrow="Guidance & Pastoral Teams"
        title="Supporting Guidance Teams Who Know the Realities"
        lead="You work at the intersection of aspiration and a system that rarely acknowledges structural inequality. You don't have to navigate these challenges alone."
        quote="Effective guidance isn't about managing expectations downward — it's about reframing preparation, protecting wellbeing, and building genuine self-knowledge alongside academic profiles."
        cite="Guide 4: Supporting Aspirational Students Without Burning Them Out"
        badge="For Career Advisors"
        visual={<AdvisorVisual />}
        formType="advisors"
      />

      <div className="max-w-[1220px] mx-auto px-5 md:px-14">
        <StatsStrip />
      </div>

      {/* Students Section */}
      <AudienceSection
        id="students"
        eyebrow="Dental Aspirants"
        title="Realistic Pathways for Your Dental Aspirations"
        lead="The road to dental school isn't always straight. Early setbacks don't define you — and there are more ways in than most people tell you across all three routes."
        quote="For every student who follows a textbook A-level route, others resit, discover dentistry later, or apply multiple times. What matters far more is the quality of your preparation."
        cite="Guide 1: The Hidden Pathways into Dentistry for UK Students"
        badge="For Students"
        visual={<StudentVisual />}
        flip={true}
        bg="bg-[#F5F2EB]"
        formType="students"
        pathwayPills={["BDS", "Dental Hygiene / Therapy", "Dental Nursing"]}
      />

      {/* Parents Section */}
      <AudienceSection
        id="parents"
        eyebrow="Families & Guardians"
        title="Empowering Families Through Realistic Support"
        lead="The anxiety parents carry in this process is real and rarely acknowledged. You want to protect your child without discouraging them. Both feelings are valid."
        quote="Aspirants perform better when families can hold ambition and realism simultaneously — when home conversations acknowledge difficulty without amplifying it."
        cite="Guide 4: Family & Wellbeing Perspectives"
        badge="For Parents & Families"
        visual={<ParentVisual />}
        formType="parents"
      />

      {/* Practices Section */}
      <AudienceSection
        id="practices"
        eyebrow="Work Experience Partners"
        title="Building Fair Access Through Prepared Placements"
        lead="Work experience in dentistry is currently shaped more by social networks than genuine readiness. You can help change that — without adding to your workload."
        quote="We don't send students who need orienting on the day. We send students who arrive ready to contribute — and leave with meaningful, reflective experience to articulate at interview."
        cite="Guide 3: Work Experience in Dentistry: A Fair Access Framework"
        badge="For NHS Practices"
        visual={<PracticeVisual />}
        flip={true}
        isDark={true}
        bg="bg-[#0D3D2B]"
        formType="practices"
      />
    </main>
  );
}
