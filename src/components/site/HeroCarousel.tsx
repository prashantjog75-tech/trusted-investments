import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import heroFamily from "@/assets/hero-family.jpg";
import heroFamilyPlanning from "@/assets/hero-family-planning.jpg";
import heroLifeGoals from "@/assets/hero-life-goals.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: heroFamily,
    alt: "A multi-generational Indian family enjoying an evening together at home",
  },
  {
    src: heroFamilyPlanning,
    alt: "An Indian family sharing a thoughtful conversation around a table",
  },
  {
    src: heroLifeGoals,
    alt: "An Indian family enjoying a peaceful moment together in their garden",
  },
] as const;

const AUTOPLAY_DELAY = 4_500;

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showPrevious = () => setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  const showNext = () => setActiveSlide((current) => (current + 1) % slides.length);

  return (
    <div
      className="animate-fade-in delay-300 relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Families and life goals"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gold/10 blur-2xl" />
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-elevated ring-1 ring-navy-foreground/10">
        {slides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={1600}
            height={1200}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            aria-hidden={index !== activeSlide}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              index === activeSlide ? "z-10 opacity-100" : "z-0 opacity-0",
            )}
          />
        ))}

        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-b from-navy-deep/45 to-transparent px-4 pt-4 pb-14">
          <div className="flex items-center gap-2" aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}>
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={cn(
                  "h-2 rounded-full border border-navy-foreground/70 transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep",
                  index === activeSlide ? "w-7 bg-gold" : "w-2 bg-navy-foreground/45 hover:bg-navy-foreground/80",
                )}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outlineLight"
              size="icon"
              onClick={showPrevious}
              aria-label="Previous image"
              className="h-8 w-8 bg-navy-deep/55 backdrop-blur"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outlineLight"
              size="icon"
              onClick={showNext}
              aria-label="Next image"
              className="h-8 w-8 bg-navy-deep/55 backdrop-blur"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
      <div className="animate-float absolute -bottom-5 left-5 z-30 rounded-2xl border border-navy-foreground/10 bg-navy-deep/90 px-5 py-4 shadow-elevated backdrop-blur md:-left-8">
        <p className="text-[11px] tracking-[0.16em] text-gold uppercase">Our promise</p>
        <p className="mt-1 max-w-[16rem] font-display text-base leading-snug">
          Helping families reach their life goals, one disciplined step at a time.
        </p>
      </div>
    </div>
  );
}