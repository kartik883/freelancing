"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: "01",
    eyebrow: "ONLY WHAT YOU NEED",
    title: "The Essence of Nature",
    subtitle:
      "Distilled from the world's most pristine botanical sources, captured at their peak potency for maximum skin vitality.",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "02",
    eyebrow: "PURITY MEETS SCIENCE",
    title: "Advanced Bio-Science",
    subtitle:
      "Where ancient wisdom meets cutting-edge molecular research for transformative results that defy your expectations.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "03",
    eyebrow: "RITUAL OF RADIANCE",
    title: "Luminous Transformation",
    subtitle:
      "Experience a level of radiance and clarity that defines true premium skincare, crafted for your daily ritual.",
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=1600",
  },
];

export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const slides = gsap.utils.toArray<HTMLElement>(".premium-slide");

      mm.add("(min-width: 1024px)", () => {
        // Desktop: Pinning layered scroll
        // Extended end (+0.8) to allow the last slide to stay centered longer
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${(sections.length + 0.8) * 100}%`,
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        slides.forEach((slide, index) => {
          const content = slide.querySelector(".slide-content");
          const imageWrap = slide.querySelector(".slide-image-wrap");
          const nextSlide = slides[index + 1] as HTMLElement;

          if (index === 0) {
            gsap.set(slide, { zIndex: 10, autoAlpha: 1 });
          } else {
            gsap.set(slide, { autoAlpha: 0 });
          }

          if (nextSlide) {
            // Current slide slides UP and OUT
            tl.to(content, {
              yPercent: -120,
              opacity: 0,
              ease: "power2.inOut",
            }, index)
            .to(imageWrap, {
              yPercent: -80,
              scale: 0.85,
              opacity: 0,
              filter: "blur(15px)",
              ease: "power2.inOut",
            }, index)
            .set(slide, { autoAlpha: 0 }, index + 0.7);

            // Next slide slides UP and IN from bottom
            const nextContent = nextSlide.querySelector(".slide-content");
            const nextImageWrap = nextSlide.querySelector(".slide-image-wrap");

            tl.fromTo(nextContent, {
              yPercent: 120,
              opacity: 0
            }, {
              yPercent: 0,
              opacity: 1,
              ease: "power2.out"
            }, index + 0.3)
            .fromTo(nextImageWrap, {
              yPercent: 80,
              scale: 1.15,
              opacity: 0,
              filter: "blur(25px)"
            }, {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              ease: "power2.out"
            }, index + 0.2)
            .set(nextSlide, { autoAlpha: 1, zIndex: index + 20 }, index + 0.2);
          }
        });
      });

      mm.add("(max-width: 1023px)", () => {
        // Mobile & Tablet: Revealed vertical scroll
        slides.forEach((slide) => {
          const content = slide.querySelector(".slide-content");
          const imageWrap = slide.querySelector(".slide-image-wrap");

          gsap.fromTo(content, 
            { opacity: 0, y: 60 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 1.2,
              scrollTrigger: {
                trigger: slide,
                start: "top 85%",
                end: "top 30%",
                scrub: 1,
              }
            }
          );

          gsap.fromTo(imageWrap,
            { opacity: 0, y: 80, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.5,
              scrollTrigger: {
                trigger: slide,
                start: "top 80%",
                end: "top 20%",
                scrub: 1,
              }
            }
          );
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-visible bg-background py-20 lg:py-0 min-h-screen"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(var(--primary-rgb),0.4)_1px,transparent_0)] [background-size:32px_32px]" />
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] h-[50rem] w-[50rem] rounded-full bg-primary/5 blur-[180px]" />
        <div className="absolute bottom-[-20rem] left-[-10%] h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[180px]" />
      </div>

      <div className="relative z-10 mx-auto h-full w-full max-w-[1600px] lg:h-screen">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={cn(
              "premium-slide flex flex-col items-center justify-center p-6 sm:p-10 md:p-16 lg:absolute lg:inset-0 lg:p-32 lg:opacity-0 lg:invisible",
              index === 0 && "lg:opacity-100 lg:visible"
            )}
          >
            {/* Centered Safety Container */}
            <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24 xl:gap-32">
              
              {/* Content Area */}
              <div
                className={cn(
                  "slide-content order-2 flex flex-col items-center text-center lg:items-start lg:text-left",
                  index % 2 !== 0 ? "lg:order-2" : "lg:order-1"
                )}
              >
                <div className="mb-6 flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">
                    {section.eyebrow}
                  </span>
                  <div className="h-[1px] w-10 bg-primary/20" />
                </div>

                <div className="mb-4 font-serif text-sm font-medium uppercase tracking-[0.6em] text-primary/30">
                  {section.id}
                </div>

                {/* Optimized clamp() for better mobile scale */}
                <h2 className="font-heading text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.1] tracking-tight text-foreground sm:leading-[1.05]">
                  {section.title.split(" ").map((word, i) => (
                    <span key={i} className="block last:text-primary/90">
                      {word}
                    </span>
                  ))}
                </h2>

                <p className="mt-8 max-w-md text-[clamp(0.9rem,1.1vw,1rem)] leading-relaxed text-muted-foreground/70 md:leading-loose">
                  {section.subtitle}
                </p>

                <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
                  <button className="group relative overflow-hidden rounded-full bg-primary px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground shadow-2xl transition-all duration-500 hover:shadow-primary/20 hover:-translate-y-1">
                    <span className="relative z-10">Discover More</span>
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </button>

                  <button className="rounded-full border border-primary/10 bg-background/50 px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-2xl transition-all duration-500 hover:bg-primary/5 hover:text-primary hover:-translate-y-1">
                    View Ritual
                  </button>
                </div>
              </div>

              {/* Image Area */}
              <div
                className={cn(
                  "slide-image-wrap order-1 w-full max-w-sm mx-auto lg:max-w-none flex items-center justify-center",
                  index % 2 !== 0 ? "lg:order-1" : "lg:order-2"
                )}
              >
                <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[3rem] border border-primary/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.3)]">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    priority={index === 0}
                    className="slide-image object-cover transition-transform duration-1000 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />
                  
                  <div className="absolute left-6 top-6 z-20">
                    <div className="rounded-full bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/80">
                      Signature Series
                    </div>
                  </div>

                  {/* Dynamic Badge */}
                  <div className="absolute bottom-10 right-[-1.5rem] z-30 hidden scale-90 sm:flex flex-col rounded-[2.5rem] border border-primary/5 bg-background/95 p-8 shadow-3xl backdrop-blur-3xl lg:right-[-3rem] xl:scale-95">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/80">Premium Pure</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground/80 max-w-[130px]">
                      Harnessing the raw essence of nature.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Side Progress Dots */}
      <div className="absolute right-12 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-10 lg:flex">
        {sections.map((item) => (
          <div key={item.id} className="group relative flex items-center justify-end">
            <span className="absolute right-10 opacity-0 transition-all duration-700 group-hover:right-8 group-hover:opacity-100 text-[9px] font-bold tracking-[0.4em] text-primary/60">
              {item.title.split(" ")[0]}
            </span>
            <div className="h-1 w-1 rounded-full bg-primary/10 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/40" />
          </div>
        ))}
      </div>

      {/* Centered Scroll Hint */}
      <div className="absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-5 lg:flex">
        <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-primary/40">Journey Down</span>
        <div className="h-20 w-[1px] overflow-hidden bg-primary/5">
          <div className="animate-scroll-bar h-10 w-full bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollBar {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }
        .animate-scroll-bar {
          animation: scrollBar 3s cubic-bezier(0.7, 0, 0.3, 1) infinite;
        }
      `}</style>
    </section>
  );
}