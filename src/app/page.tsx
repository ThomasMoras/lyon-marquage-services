import { ContentSection } from "@/components/shared/ContentSection";
import CustomCarousel from "@/components/shared/CustomCarousel";
import { PageLayout } from "@/components/shared/PageLayout";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Section Carousel plein écran */}
      {/* <section className="h-screen w-full">
        <CustomCarousel section="home" />
      </section> */}

      <PageLayout pageType="home" />

      {/* Section de contenu */}
      <section id="#toto" className="container mx-auto py-16">
        <div className="max-w-8xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">Nos Services</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Service 1</h3>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Service 2</h3>
              <p className="text-muted-foreground">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-8">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
