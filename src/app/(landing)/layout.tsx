import AmbientBackground from "@/components/background/ambient-background";
import Intro from "@/components/common/intro";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function LandingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="fixed top-4 left-4 z-[200] -translate-y-24 bg-lime px-4 py-2 font-heading text-sm font-semibold text-background uppercase transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Intro />
      <AmbientBackground />
      <Navbar />
      <main id="main" className="relative z-10 flex-1 pt-[72px] md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
