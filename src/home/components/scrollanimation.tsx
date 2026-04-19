"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: "01",
    eyebrow: "ONLY WHAT YOU NEED",
    title: "The Essence of Nature",
    subtitle:
      "Distilled from the world's most pristine botanical sources, captured at their peak potency.",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "02",
    eyebrow: "PURITY MEETS SCIENCE",
    title: "Advanced Bio-Science",
    subtitle:
      "Where ancient wisdom meets cutting-edge molecular research for transformative results.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "03",
    eyebrow: "RITUAL OF RADIANCE",
    title: "Luminous Transformation",
    subtitle:
      "Experience a level of radiance and clarity that defines true premium skincare.",
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=1600",
  },
];

export default function ScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".premium-slide");

      // Hide all slides except first
      gsap.set(slides, {
        autoAlpha: 0,
      });

      gsap.set(slides[0], {
        autoAlpha: 1,
      });

      slides.forEach((slide, index) => {
        const content = slide.querySelector(".slide-content");
        const imageWrap = slide.querySelector(".slide-image-wrap");
        const image = slide.querySelector(".slide-image");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${index * 100}% top`,
            end: `${(index + 1) * 100}% top`,
            scrub: 1.2,
          },
        });

        // Reveal current slide
        tl.to(
          slide,
          {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          0
        );

        // Text moves horizontally
        tl.fromTo(
          content,
          {
            x: index % 2 === 0 ? -120 : 120,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          0
        );

        // Image moves vertically
        tl.fromTo(
          imageWrap,
          {
            y: 120,
            opacity: 0,
            scale: 0.92,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          0.05
        );

        // Parallax effect on image
        if (image) {
          gsap.fromTo(
            image,
            {
              yPercent: -10,
              scale: 1.15,
            },
            {
              yPercent: 10,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: slide,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        // Hide previous slide
        if (index > 0) {
          tl.to(
            slides[index - 1],
            {
              autoAlpha: 0,
              xPercent: -10,
              duration: 0.5,
              ease: "power2.out",
            },
            0
          );
        }
      });

      // Pin whole section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${sections.length * 120}%`,
        pin: true,
        scrub: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-background"
    >
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply bg-[radial-gradient(circle_at_1px_1px,rgba(160,90,58,0.45)_1px,transparent_0)] [background-size:22px_22px]" />

      {/* Soft luxury glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-[-10%] h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-[-10%] h-[26rem] w-[26rem] rounded-full bg-accent/30 blur-[120px]" />
      </div>

      <div className="relative z-10 h-full w-full">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="premium-slide absolute inset-0 flex items-center px-6 md:px-10 lg:px-16 xl:px-24"
          >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
              {/* Content */}
              <div
                className={`slide-content order-2 text-center lg:order-1 lg:text-left ${
                  index % 2 !== 0 ? "lg:order-2" : ""
                }`}
              >
                <div className="mb-6 flex items-center justify-center gap-4 lg:justify-start">
                  <span className="text-[11px] uppercase tracking-[0.45em] text-primary">
                    {section.eyebrow}
                  </span>

                  <div className="h-px w-16 bg-primary/40" />
                </div>

                <div className="mb-4 text-xs font-light uppercase tracking-[0.5em] text-primary/60">
                  {section.id}
                </div>

                <h2 className="font-heading text-[3rem] leading-[0.9] tracking-[-0.06em] text-foreground sm:text-[4rem] md:text-[5rem] xl:text-[6rem]">
                  {section.title.split(" ").map((word, i) => (
                    <span key={i} className="block">
                      {word}
                    </span>
                  ))}
                </h2>

                <p className="mx-auto mt-8 max-w-xl text-[15px] leading-8 text-muted-foreground sm:text-lg lg:mx-0">
                  {section.subtitle}
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                  <button className="rounded-full bg-primary px-8 py-4 text-sm uppercase tracking-[0.28em] text-primary-foreground shadow-[0_18px_45px_rgba(160,90,58,0.28)] transition-all duration-500 hover:-translate-y-1 hover:brightness-95 hover:shadow-[0_28px_65px_rgba(160,90,58,0.36)]">
                    Discover More
                  </button>

                  <button className="rounded-full border border-primary/20 bg-card/60 px-8 py-4 text-sm uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/85">
                    View Ritual
                  </button>
                </div>
              </div>

              {/* Image */}
              <div
                className={`slide-image-wrap order-1 mx-auto w-full max-w-[32rem] lg:order-2 ${
                  index % 2 !== 0 ? "lg:order-1" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-card/50 shadow-[0_40px_100px_rgba(80,52,38,0.18)] backdrop-blur-2xl">
                  <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/10 via-transparent to-primary-foreground/20 dark:from-foreground/20 dark:to-primary-foreground/[0.04]" />

                  <div className="absolute left-5 top-5 z-20 rounded-full border border-primary-foreground/30 bg-card/30 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground backdrop-blur-xl">
                    Purastone
                  </div>

                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      priority={index === 0}
                      className="slide-image object-cover"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-5 right-2 rounded-[1.5rem] border border-primary/10 bg-card/80 px-5 py-4 shadow-[0_20px_60px_rgba(80,52,38,0.12)] backdrop-blur-2xl md:right-[-1.5rem]">
                  <div className="text-[10px] uppercase tracking-[0.35em] text-primary">
                    Premium Care
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Naturally refined for modern rituals.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right side progress */}
      <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 xl:flex flex-col gap-6">
        {sections.map((item) => (
          <div key={item.id} className="group flex items-center gap-3">
            <span className="translate-x-2 text-[10px] uppercase tracking-[0.45em] text-primary/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary/80">
              {item.id}
            </span>

            <div className="h-2 w-2 rounded-full bg-primary/20 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary" />
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.45em] text-primary/70">
          Scroll To Reveal
        </span>

        <div className="relative h-16 w-px overflow-hidden bg-primary/10">
          <div className="animate-scroll-line absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>

      <style jsx>{`
        .animate-scroll-line {
          animation: scrollLine 1.8s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(180%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}