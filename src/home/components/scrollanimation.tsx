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
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${sections.length * 100}%`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        slides.forEach((slide, index) => {
          const content = slide.querySelector(".slide-content");
          const imageWrap = slide.querySelector(".slide-image-wrap");
          const nextSlide = slides[index + 1] as HTMLElement;

          if (index === 0) {
            gsap.set(slide, { autoAlpha: 1, zIndex: 10 });
          } else {
            gsap.set(slide, { autoAlpha: 0 });
          }

          if (nextSlide) {
            const nextContent = nextSlide.querySelector(".slide-content");
            const nextImageWrap = nextSlide.querySelector(".slide-image-wrap");

            tl.to(
              content,
              {
                xPercent: -40,
                opacity: 0,
                duration: 1,
                ease: "power3.inOut",
              },
              index
            )
              .to(
                imageWrap,
                {
                  xPercent: -15,
                  scale: 0.94,
                  opacity: 0,
                  filter: "blur(12px)",
                  duration: 1,
                  ease: "power3.inOut",
                },
                index
              )
              .set(slide, { autoAlpha: 0 }, index + 0.8)
              .set(nextSlide, { autoAlpha: 1, zIndex: 20 + index }, index + 0.15)
              .fromTo(
                nextContent,
                {
                  xPercent: 35,
                  opacity: 0,
                },
                {
                  xPercent: 0,
                  opacity: 1,
                  duration: 1,
                  ease: "power3.out",
                },
                index + 0.15
              )
              .fromTo(
                nextImageWrap,
                {
                  xPercent: 20,
                  scale: 1.06,
                  opacity: 0,
                  filter: "blur(18px)",
                },
                {
                  xPercent: 0,
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 1.2,
                  ease: "power3.out",
                },
                index + 0.1
              );
          }
        });
      });

      mm.add("(max-width: 1023px)", () => {
        slides.forEach((slide) => {
          const image = slide.querySelector(".slide-image-wrap");
          const content = slide.querySelector(".slide-content");

          gsap.fromTo(
            image,
            {
              opacity: 0,
              y: 60,
              scale: 0.94,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: slide,
                start: "top 85%",
                end: "top 45%",
                scrub: 0.5,
              },
            }
          );

          gsap.fromTo(
            content,
            {
              opacity: 0,
              y: 40,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: slide,
                start: "top 82%",
                end: "top 50%",
                scrub: 0.4,
              },
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
      className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-0 min-h-screen"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 sm:-top-32 right-[-30%] sm:right-[-15%] h-[26rem] w-[26rem] sm:h-[42rem] sm:w-[42rem] rounded-full bg-primary/5 blur-[100px] sm:blur-[160px]" />
        <div className="absolute bottom-[-12rem] left-[-20%] sm:left-[-10%] h-[22rem] w-[22rem] sm:h-[34rem] sm:w-[34rem] rounded-full bg-accent/10 blur-[100px] sm:blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto h-full w-full max-w-[1600px] lg:h-screen">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={cn(
              "premium-slide flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-16 lg:p-24 xl:p-32 lg:absolute lg:inset-0 lg:opacity-0 lg:invisible",
              index === 0 && "lg:opacity-100 lg:visible"
            )}
          >
            <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center gap-10 sm:gap-12 md:gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24">
              <div
                className={cn(
                  "slide-image-wrap relative order-1 mx-auto flex w-full items-center justify-center max-w-[92vw] sm:max-w-[78vw] md:max-w-[560px] lg:max-w-none",
                  index % 2 !== 0 ? "lg:order-1" : "lg:order-2"
                )}
              >
                <div className="relative aspect-[4/5] w-full max-w-[320px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[520px] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] sm:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    priority={index === 0}
                    className="slide-image object-cover scale-[1.02] transition-transform duration-[1800ms] ease-out"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 78vw, 50vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-white/5" />

                  <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 md:p-8 pt-16 lg:hidden bg-gradient-to-t from-black/90 via-black/55 to-transparent">
                    <span className="mb-2 block text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.35em] text-white/75">
                      {section.eyebrow}
                    </span>

                    <h2 className="max-w-[90%] font-serif text-[clamp(1.8rem,8vw,3rem)] leading-[1.02] tracking-[-0.03em] text-white">
                      {section.title}
                    </h2>
                  </div>

                  <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-20 hidden lg:block">
                    <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/80 backdrop-blur-md">
                      Signature Series
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-3 z-30 hidden sm:flex flex-col rounded-[1.75rem] sm:rounded-[2rem] border border-white/10 bg-background/90 p-4 sm:p-5 lg:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl lg:right-[-2rem]">
                    <div className="mb-2 flex items-center gap-2 sm:gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-primary/80">
                        Premium Pure
                      </span>
                    </div>

                    <p className="max-w-[120px] sm:max-w-[140px] text-[10px] sm:text-[11px] leading-relaxed text-muted-foreground/80">
                      Harnessing the raw essence of nature.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "slide-content order-2 flex flex-col items-center text-center lg:items-start lg:text-left w-full max-w-[92vw] sm:max-w-[80vw] md:max-w-[640px] lg:max-w-none",
                  index % 2 !== 0 ? "lg:order-2" : "lg:order-1"
                )}
              >
                <div className="hidden lg:flex flex-col items-start">
                  <div className="mb-5 flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-primary">
                      {section.eyebrow}
                    </span>
                    <div className="h-px w-10 bg-primary/20" />
                  </div>

                  <div className="mb-4 text-sm font-medium uppercase tracking-[0.55em] text-primary/30">
                    {section.id}
                  </div>

                  <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
                    {section.title.split(" ").map((word, i) => (
                      <span key={i} className="block last:text-primary/90">
                        {word}
                      </span>
                    ))}
                  </h2>
                </div>

                <div className="mt-6 lg:mt-8 flex flex-col items-center lg:items-start gap-6 sm:gap-8">
                  <p className="max-w-[32rem] text-[0.95rem] sm:text-[1rem] md:text-[1.05rem] lg:text-[1.1rem] leading-[1.9] text-white/65">
                    {section.subtitle}
                  </p>

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:gap-5">
                    <button className="group relative flex h-12 sm:h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-6 sm:px-8 lg:px-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                      <span className="relative z-10">Discover More</span>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[100%]" />
                    </button>

                    <button className="flex h-12 sm:h-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 sm:px-8 lg:px-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-white/70 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.08] hover:text-white">
                      View Ritual
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-6 xl:flex">
        {sections.map((item) => (
          <div key={item.id} className="group relative flex items-center justify-end">
            <span className="absolute right-8 opacity-0 transition-all duration-500 group-hover:right-6 group-hover:opacity-100 text-[9px] font-bold tracking-[0.35em] text-primary/60">
              {item.title.split(" ")[0]}
            </span>

            <div className="h-1.5 w-1.5 rounded-full bg-primary/15 transition-all duration-500 group-hover:scale-[2.2] group-hover:bg-primary/50" />
          </div>
        ))}
      </div>
    </section>
  );
}