import { useCallback, useEffect, useRef, useState } from "react";
import type * as React from "react";

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Jost', system-ui, sans-serif";

/* ── Images ─────────────────────────────────────── */

const BASE = import.meta.env.BASE_URL;

const IMG = {
  hero: `${BASE}images/imghero.jpg`,
  portrait: `${BASE}images/img1.jpg`,
  g1: `${BASE}images/img3.jpg`,
  g2: `${BASE}images/img2.jpg`,
  g3: `${BASE}images/img4.jpg`,
  g4: `${BASE}images/img5.jpg`,
  g5: `${BASE}images/img6.jpg`,
  dog: "https://images.unsplash.com/photo-1597513299114-bfab8234a241?w=500&h=500&fit=crop&auto=format",
  floral: "https://images.unsplash.com/photo-1608463026422-8f43ab4ebac0?w=1920&h=1080&fit=crop&auto=format",
  bokeh: "https://images.unsplash.com/photo-1644348178248-ab81d0c65ad0?w=1920&h=1080&fit=crop&auto=format",
};

const GALLERY_ITEMS = [
  { src: IMG.g1, alt: "Diana" },
  { src: IMG.g2, alt: "Diana" },
  { src: IMG.g3, alt: "Diana" },
  { src: IMG.g4, alt: "Diana" },
  { src: IMG.g5, alt: "Diana atmosphere" },
  { src: IMG.portrait, alt: "Diana portrait" },
];

const WISHES = [
  "Щастів", "Грошів", "Успіхів", "Псів Патронів",
  "Крутих кєнтіків", "Яскравих моментів", "Красивих сумочок",
  "баклажанів", "салатів", "Машинів", "Побільше подорожей", "Радості",
  "Можливостей", "Нових друзяшків", "Улибашок",
  "Лего Ніндзяго", "Ще там шось",
  "Евер форевер крутишкою бути",
];

/* ── Hooks ───────────────────────────────────────── */
function useFadeIn(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── FadeIn wrapper ──────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
  style = {},
  up = 26,
  scale = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  up?: number;
  scale?: boolean;
}) {
  const { ref, visible } = useFadeIn();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : `translateY(${up}px) scale(${scale ? 0.97 : 1})`,
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Ambient blobs ───────────────────────────────── */
function Blobs({ dark = false }: { dark?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {(["#C9849A", "#7B3FA0", "#2D1052"] as const).map((color, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(90px)",
            opacity: dark ? 0.14 : 0.2,
            background: color,
            width: `${280 + i * 80}px`,
            height: `${280 + i * 80}px`,
            top: i === 0 ? "-8%" : i === 1 ? "42%" : "72%",
            left: i === 0 ? "-4%" : i === 1 ? "62%" : "18%",
            animation: `floatBlob${i} ${18 + i * 6}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Intro overlay ───────────────────────────────── */
function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const doneCb = useCallback(onDone, [onDone]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 900),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(doneCb, 2900),
    ];

    return () => timers.forEach(clearTimeout);
  }, [doneCb]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#08020F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        opacity: phase >= 2 ? 0 : 1,
        transition: "opacity 0.9s ease",
        pointerEvents: phase >= 2 ? "none" : "all",
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: "clamp(8rem, 22vw, 16rem)",
          lineHeight: 1,
          background: "linear-gradient(135deg, #FAF5F7 30%, #C9849A 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? "none" : "translateY(16px)",
          transition: "opacity 1s ease, transform 1s ease",
          letterSpacing: "-0.02em",
        }}
      >
        18
      </span>

      <span
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
          color: "#E8C4D0",
          letterSpacing: "0.22em",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "none" : "translateY(10px)",
          transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
        }}
      >
        Діана
      </span>
    </div>
  );
}

/* ── Lightbox ────────────────────────────────────── */
function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: typeof GALLERY_ITEMS;
  index: number;
  onClose: () => void;
}) {
  const [cur, setCur] = useState(index);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCur((c) => Math.min(c + 1, photos.length - 1));
      if (e.key === "ArrowLeft") setCur((c) => Math.max(c - 1, 0));
    };

    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose, photos.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(8,2,15,0.94)",
        backdropFilter: "blur(14px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative px-10 max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photos[cur].src}
          alt={photos[cur].alt}
          className="w-full object-contain mx-auto"
          style={{ maxHeight: "80vh", display: "block" }}
        />

        {cur > 0 && (
          <button onClick={() => setCur((c) => c - 1)} style={navBtnStyle("left")}>
            ‹
          </button>
        )}

        {cur < photos.length - 1 && (
          <button onClick={() => setCur((c) => c + 1)} style={navBtnStyle("right")}>
            ›
          </button>
        )}

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-2.5rem",
            right: 0,
            color: "rgba(250,245,247,0.5)",
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#FAF5F7")}
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "rgba(250,245,247,0.5)")
          }
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function navBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: "-1.5rem",
    color: "rgba(250,245,247,0.5)",
    background: "none",
    border: "none",
    fontSize: "2.5rem",
    cursor: "pointer",
    lineHeight: 1,
    transition: "color 0.2s ease",
  };
}

/* ── Wish card ───────────────────────────────────── */
function WishCard({
  wish,
  number,
  delay,
}: {
  wish: string;
  number: number;
  delay: number;
}) {
  const { ref, visible } = useFadeIn(0.02);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hov
            ? "translateY(-8px) scale(1.03)"
            : "translateY(0) scale(1)"
          : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}ms, transform ${
          hov ? "0.25s" : `0.7s ease ${delay}ms`
        }`,
        flexShrink: 0,
        width: "168px",
        minHeight: "130px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: hov ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        border: `1px solid rgba(201,132,154,${hov ? 0.45 : 0.2})`,
        boxShadow: hov
          ? "0 20px 50px rgba(45,16,82,0.3), 0 0 40px rgba(201,132,154,0.1)"
          : "0 4px 20px rgba(45,16,82,0.08)",
        borderRadius: "2px",
        cursor: "default",
        scrollSnapAlign: "start",
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: "2.8rem",
          lineHeight: 1,
          color: `rgba(201,132,154,${hov ? 0.55 : 0.35})`,
          transition: "color 0.3s ease",
        }}
      >
        {number}
      </span>

      <span
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: "0.88rem",
          color: hov ? "#FAF5F7" : "rgba(250,245,247,0.8)",
          lineHeight: 1.45,
          transition: "color 0.3s ease",
        }}
      >
        {wish}
      </span>
    </div>
  );
}

/* ── Patron section ──────────────────────────────── */
function PatronSection() {
  const [bubble, setBubble] = useState(false);
  const [wagging, setWagging] = useState(false);
  const [barked, setBarked] = useState(false);

  const handleBark = () => {
    if (wagging) return;

    setWagging(true);
    setBubble(true);
    setBarked(true);
    setTimeout(() => setWagging(false), 900);
  };

  return (
    <section
      className="py-28 md:py-44 px-6 relative overflow-hidden"
      style={{ background: "#FAF5F7" }}
    >
      <Blobs />

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <p
            className="text-xs uppercase mb-5"
            style={{
              color: "#C9849A",
              fontFamily: SANS,
              fontWeight: 400,
              letterSpacing: "0.45em",
            }}
          >
            Спецпривітання
          </p>

          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              color: "#1A0A2E",
              fontSize: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            Від Пса Патрона
          </h2>
        </FadeIn>

        <FadeIn delay={150} className="max-w-2xl mx-auto">
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(201,132,154,0.2)",
              boxShadow: "0 24px 80px rgba(45,16,82,0.06)",
              padding: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  onMouseEnter={() => setBubble(true)}
                  onMouseLeave={() => !barked && setBubble(false)}
                  style={{
                    width: "164px",
                    height: "164px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #E8C4D0",
                    animation: wagging ? "wagDog 0.9s ease" : "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={IMG.dog}
                    alt="Пес Патрон"
                    className="w-full h-full object-cover"
                  />
                </div>

                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      position: "absolute",
                      fontSize: "14px",
                      opacity: 0.2,
                      userSelect: "none",
                      bottom: `${-8 + i * 22}px`,
                      left: `${56 + i * 22}px`,
                      transform: `rotate(${-10 + i * 15}deg)`,
                      pointerEvents: "none",
                    }}
                  >
                    🐾
                  </span>
                ))}

                <div
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    right: "6px",
                    background: "#2D1052",
                    color: "#FAF5F7",
                    fontFamily: SANS,
                    fontWeight: 500,
                    fontSize: "8px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    borderRadius: "1px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Твій Герой
                </div>
              </div>

              <div style={{ textAlign: "center", width: "100%" }}>
                <p
                  className="text-xs uppercase mb-5"
                  style={{
                    color: "#C9849A",
                    fontFamily: SANS,
                    fontWeight: 400,
                    letterSpacing: "0.38em",
                  }}
                >
                  Сапер · Символ · Друг
                </p>

                <div
                  style={{
                    opacity: bubble ? 1 : 0,
                    transform: bubble ? "none" : "translateY(8px) scale(0.97)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    background: "#F2E6EE",
                    border: "1px solid rgba(201,132,154,0.3)",
                    padding: "1rem 1.25rem",
                    borderRadius: "4px 4px 4px 0",
                    marginBottom: "1.25rem",
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: "#1A0A2E",
                      lineHeight: 1.55,
                    }}
                  >
                    "Гав-гав, тяптяптяп!"
                  </p>
                </div>

                <p
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "clamp(1rem, 2vw, 1.3rem)",
                    color: "#1A0A2E",
                    lineHeight: 1.55,
                    marginBottom: "0.6rem",
                  }}
                >
                  "Пес Патрон вітає тебе з повноліттям"
                </p>

                <p
                  style={{
                    fontFamily: SANS,
                    fontWeight: 300,
                    fontSize: "0.9rem",
                    color: "#7A4F6A",
                    marginBottom: "2rem",
                  }}
                >
                  Пес Патрон, пес Патрон — ві-і-ітає з твоїм дньом!
                </p>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={handleBark}
                    style={{
                      fontFamily: SANS,
                      fontWeight: 400,
                      fontSize: "0.68rem",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color: barked ? "#FAF5F7" : "#2D1052",
                      border: `1px solid ${
                        barked ? "#2D1052" : "rgba(45,16,82,0.35)"
                      }`,
                      background: barked ? "#2D1052" : "transparent",
                      padding: "0.85rem 2rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      borderRadius: "1px",
                    }}
                  >
                    Погавкати
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Surprise section ────────────────────────────── */
function SurpriseSection() {
  const [opened, setOpened] = useState(false);
  const [bursting, setBursting] = useState(false);

  const handleOpen = () => {
    setBursting(true);
    setTimeout(() => setOpened(true), 500);
  };

  return (
    <section
      className="relative py-36 md:py-52 px-6 overflow-hidden"
      style={{ background: "#1A0A2E" }}
    >
      <div className="absolute inset-0 opacity-8">
        <img
          src={IMG.bokeh}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden
          style={{ opacity: 0.07 }}
        />
      </div>

      {bursting && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: i % 4 === 0 ? "6px" : "3px",
                height: i % 4 === 0 ? "6px" : "3px",
                borderRadius: "50%",
                background:
                  i % 3 === 0 ? "#C9849A" : i % 3 === 1 ? "#E8C4D0" : "#FAF5F7",
                animation: `burst${i % 8} 1.4s ease-out forwards`,
                animationDelay: `${i * 35}ms`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeIn>
          <p
            className="text-xs uppercase mb-6"
            style={{
              color: "#C9849A",
              fontFamily: SANS,
              fontWeight: 400,
              letterSpacing: "0.45em",
            }}
          >
            Твій маленький сюрприз
          </p>

          {!opened ? (
            <>
              <h2
                className="mb-14"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  color: "#FAF5F7",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  lineHeight: 1.2,
                }}
              >
                Тут для тебе є
                <br />
                щось
              </h2>

              <button
                onClick={handleOpen}
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: "0.72rem",
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: "#FAF5F7",
                  border: "1px solid rgba(201,132,154,0.5)",
                  background: "rgba(201,132,154,0.08)",
                  backdropFilter: "blur(10px)",
                  padding: "1.1rem 3rem",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  borderRadius: "1px",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = "0 0 40px rgba(201,132,154,0.35)";
                  el.style.background = "rgba(201,132,154,0.18)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = "none";
                  el.style.background = "rgba(201,132,154,0.08)";
                }}
              >
                Відкрити сюрприз
              </button>
            </>
          ) : (
            <div
              style={{
                opacity: opened ? 1 : 0,
                transform: opened ? "none" : "scale(0.94)",
                transition: "opacity 1.1s ease, transform 1.1s ease",
              }}
            >
              <Divider />

              <p
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
                  color: "#FAF5F7",
                  lineHeight: 1.4,
                  margin: "2.5rem 0 1.5rem",
                  textShadow: "0 0 80px rgba(201,132,154,0.35)",
                }}
              >
                "А нє, нема сюрпризу"
              </p>

              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  color: "#C9849A",
                  fontSize: "0.85rem",
                  letterSpacing: "0.25em",
                }}
              >
                Chapter 18 begins now
              </p>

              <Divider />
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        margin: "1.5rem 0",
      }}
    >
      <div style={{ width: "40px", height: "1px", background: "rgba(201,132,154,0.45)" }} />
      <div
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "#C9849A",
          opacity: 0.6,
        }}
      />
      <div style={{ width: "40px", height: "1px", background: "rgba(201,132,154,0.45)" }} />
    </div>
  );
}

/* ── App ─────────────────────────────────────────── */
export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [introMounted, setIntroMounted] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const handleIntroDone = useCallback(() => {
    setIntroDone(true);
    setTimeout(() => setIntroMounted(false), 200);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!parallaxRef.current) return;
      parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.32}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes floatBlob0 {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(55px,38px) scale(1.08); }
        }

        @keyframes floatBlob1 {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(-38px,55px) scale(0.92); }
        }

        @keyframes floatBlob2 {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(28px,-48px) scale(1.06); }
        }

        @keyframes wagDog {
          0% { transform: rotate(0); }
          20% { transform: rotate(-7deg); }
          40% { transform: rotate(7deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(4deg); }
          100% { transform: rotate(0); }
        }

        @keyframes burst0 { from { opacity:0.9; } to { transform:translate(90px,-90px); opacity:0; } }
        @keyframes burst1 { from { opacity:0.9; } to { transform:translate(-70px,-110px); opacity:0; } }
        @keyframes burst2 { from { opacity:0.9; } to { transform:translate(110px,30px); opacity:0; } }
        @keyframes burst3 { from { opacity:0.9; } to { transform:translate(-95px,65px); opacity:0; } }
        @keyframes burst4 { from { opacity:0.9; } to { transform:translate(35px,110px); opacity:0; } }
        @keyframes burst5 { from { opacity:0.9; } to { transform:translate(-55px,-130px); opacity:0; } }
        @keyframes burst6 { from { opacity:0.9; } to { transform:translate(120px,-40px); opacity:0; } }
        @keyframes burst7 { from { opacity:0.9; } to { transform:translate(-110px,40px); opacity:0; } }

        html,
        body {
          scrollbar-width: none;
          overflow-x: hidden;
        }

        html::-webkit-scrollbar {
          display: none;
        }

        .photo-frame {
          position: relative;
          overflow: hidden;
          background: #08020F;
        }

        .photo-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(26px) brightness(0.55) saturate(0.9);
          transform: scale(1.12);
          opacity: 0.85;
          pointer-events: none;
        }

        .zoom-img {
          position: relative;
          z-index: 2;
          transition: transform 0.55s ease, box-shadow 0.55s ease;
          cursor: pointer;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
        }

        .zoom-img:hover {
          transform: scale(1.025);
          box-shadow: 0 24px 64px rgba(45,16,82,0.4);
        }

        .photo-wrap:hover .photo-label {
          opacity: 1 !important;
        }

        .wish-row {
          scrollbar-width: none;
        }

        .wish-row::-webkit-scrollbar {
          display: none;
        }

        .glow-btn:hover {
          box-shadow: 0 0 36px rgba(201,132,154,0.38) !important;
          background: rgba(201,132,154,0.2) !important;
        }

        @media (min-width: 768px) {
          .gallery-tall {
            grid-column: span 5 / span 5;
          }

          .gallery-right {
            grid-column: span 7 / span 7;
          }
        }
      `}</style>

      {introMounted && <IntroOverlay onDone={handleIntroDone} />}

      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: SANS }}>
        <section
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            height: "100svh",
            minHeight: "640px",
            background: "#08020F",
          }}
        >
          <div
            ref={parallaxRef}
            style={{
              position: "absolute",
              inset: 0,
              top: "-15%",
              height: "130%",
              willChange: "transform",
              overflow: "hidden",
              background: "#08020F",
            }}
          >
            <img
              src={IMG.hero}
              alt=""
              className="w-full h-full object-cover object-center"
              style={{
                position: "absolute",
                inset: 0,
                filter: "blur(24px) brightness(0.55) saturate(0.9)",
                transform: "scale(1.12)",
                opacity: 0.8,
              }}
              aria-hidden
            />

            <img
              src={IMG.hero}
              alt="Diana"
              className="w-full h-full object-contain object-center"
              style={{
                position: "relative",
                zIndex: 2,
                opacity: 0.62,
              }}
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(155deg, rgba(8,2,15,0.9) 0%, rgba(45,16,82,0.62) 55%, rgba(90,40,70,0.38) 100%)",
            }}
          />

          <Blobs dark />

          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden
          >
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: "clamp(18rem, 42vw, 34rem)",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "1px rgba(201,132,154,0.07)",
                opacity: introDone ? 1 : 0,
                transition: "opacity 2.5s ease 0.4s",
              }}
            >
              18
            </span>
          </div>

          <div
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
            style={{
              opacity: introDone ? 1 : 0,
              transform: introDone ? "none" : "translateY(22px)",
              transition: "opacity 1.3s ease 0.15s, transform 1.3s ease 0.15s",
            }}
          >
            <p
              style={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: "0.68rem",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "#C9849A",
                marginBottom: "2rem",
              }}
            >
              Тяптяптяпу
            </p>

            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                color: "#FAF5F7",
                fontSize: "clamp(2.4rem, 6.6vw, 5.8rem)",
                lineHeight: 1.07,
                marginBottom: "1.25rem",
              }}
            >
              З Днем
              <br />
              народження,
              <br />
              <em style={{ color: "#E8C4D0" }}>тяпляп</em>
            </h1>

            <p
              style={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                color: "rgba(250,245,247,0.68)",
                maxWidth: "38rem",
                margin: "0 auto 3.5rem",
                lineHeight: 1.7,
              }}
            >
              Сьогодні тобі 18 — і це кінець демоверсії життя, тепер сама шукай хавчік
            </p>

            <button
              className="glow-btn"
              onClick={() => scrollTo("tribute")}
              style={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: "0.68rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#FAF5F7",
                border: "1px solid rgba(201,132,154,0.52)",
                background: "rgba(201,132,154,0.1)",
                backdropFilter: "blur(10px)",
                padding: "1.1rem 3rem",
                borderRadius: "1px",
                cursor: "pointer",
                transition: "all 0.4s ease",
              }}
            >
              Відкрити привітання
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: introDone ? 0.38 : 0,
              transition: "opacity 2.5s ease 1.8s",
            }}
          >
            <div
              style={{
                width: "1px",
                height: "60px",
                background: "linear-gradient(to bottom, transparent, #C9849A)",
              }}
            />
          </div>
        </section>

        <section id="tribute" className="py-28 md:py-44 px-6 relative overflow-hidden">
          <Blobs />

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <FadeIn scale>
              <div style={{ position: "relative" }}>
                <div className="photo-frame" style={{ height: "560px" }}>
                  <img src={IMG.portrait} alt="" className="photo-bg" aria-hidden />

                  <img
                    src={IMG.portrait}
                    alt="Diana portrait"
                    className="zoom-img w-full"
                    style={{ display: "block" }}
                    onClick={() => setLightboxIdx(5)}
                  />
                </div>

                <div
                  style={{
                    position: "absolute",
                    zIndex: -1,
                    top: "18px",
                    left: "18px",
                    right: "-18px",
                    bottom: "-18px",
                    border: "1px solid rgba(201,132,154,0.25)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </FadeIn>

            <FadeIn delay={230}>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: "1.05rem",
                  color: "#4A2060",
                  lineHeight: 1.95,
                }}
              >
                Діанка, вітаєм тебе з Жоріком, з Днем Народження.
                <br />
                <br />
                Будь крутишкою як завжди і проживай побільше крутих моментів.
              </p>

              <div
                style={{
                  width: "52px",
                  height: "1px",
                  background: "#C9849A",
                  marginTop: "3.5rem",
                }}
              />
            </FadeIn>
          </div>
        </section>

        <section className="py-28 md:py-44 px-6" style={{ background: "#1A0A2E" }}>
          <div className="max-w-6xl mx-auto">
            <FadeIn className="text-center mb-4">
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: "0.66rem",
                  letterSpacing: "0.48em",
                  textTransform: "uppercase",
                  color: "#C9849A",
                  marginBottom: "1.25rem",
                }}
              >
                Галерея
              </p>

              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  color: "#FAF5F7",
                  fontSize: "clamp(2rem, 4vw, 3.1rem)",
                }}
              >
                Пріятності з демо версії
              </h2>
            </FadeIn>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: "12px",
              }}
            >
              <FadeIn scale delay={0} className="gallery-tall" style={{ gridColumn: "span 12" }}>
                <div
                  className="photo-wrap photo-frame"
                  style={{
                    minHeight: "520px",
                    height: "100%",
                  }}
                >
                  <img src={IMG.g1} alt="" className="photo-bg" aria-hidden />

                  <img
                    src={IMG.g1}
                    alt="Diana"
                    className="zoom-img"
                    onClick={() => setLightboxIdx(0)}
                  />
                </div>
              </FadeIn>

              <div
                className="gallery-right"
                style={{
                  gridColumn: "span 12",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {[
                  { idx: 1, src: IMG.g2, label: "", filter: "brightness(0.88)" },
                  { idx: 2, src: IMG.g3, label: "", filter: "none" },
                  { idx: 3, src: IMG.g4, label: "", filter: "none" },
                  { idx: 4, src: IMG.g5, label: "", filter: "saturate(0.6) brightness(0.72)" },
                ].map(({ idx, src, label, filter }, i) => (
                  <FadeIn key={idx} scale delay={80 + i * 70}>
                    <div
                      className="photo-wrap photo-frame"
                      style={{
                        minHeight: "254px",
                      }}
                    >
                      <img src={src} alt="" className="photo-bg" aria-hidden />

                      <img
                        src={src}
                        alt="Diana"
                        className="zoom-img"
                        style={{ filter }}
                        onClick={() => setLightboxIdx(idx)}
                      />

                      <PhotoLabel>{label}</PhotoLabel>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative py-28 md:py-44 overflow-hidden"
          style={{ background: "#2D1052" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06 }}>
            <img src={IMG.bokeh} alt="" className="w-full h-full object-cover" aria-hidden />
          </div>

          <div className="relative z-10">
            <FadeIn className="text-center mb-16 px-6">
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: "0.66rem",
                  letterSpacing: "0.48em",
                  textTransform: "uppercase",
                  color: "#C9849A",
                  marginBottom: "1.25rem",
                }}
              >
                від всього серця
              </p>

              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  color: "#FAF5F7",
                  fontSize: "clamp(2rem, 4vw, 3.1rem)",
                }}
              >
                18 побажань фор ю
              </h2>
            </FadeIn>

            <div
              className="wish-row"
              style={{
                display: "flex",
                gap: "14px",
                overflowX: "auto",
                padding: "0 clamp(1.5rem, 5vw, 5rem) 1.5rem",
                scrollSnapType: "x mandatory",
              }}
            >
              {WISHES.map((wish, i) => (
                <WishCard key={i} wish={wish} number={i + 1} delay={i * 35} />
              ))}
            </div>
          </div>
        </section>

        <PatronSection />

        <section
          className="relative py-36 md:py-56 px-6 overflow-hidden"
          style={{ background: "#2D1052" }}
        >
          <div className="absolute inset-0" style={{ opacity: 0.12 }}>
            <img
              src={IMG.floral}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden
              style={{ filter: "saturate(0.45)" }}
            />
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <FadeIn>
              <Divider />

              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: "0.66rem",
                  letterSpacing: "0.48em",
                  textTransform: "uppercase",
                  color: "#C9849A",
                  margin: "2rem 0 3.5rem",
                }}
              >
                з хепі бірздиком
              </p>

              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(1.2rem, 2.8vw, 1.9rem)",
                  color: "#FAF5F7",
                  lineHeight: 1.82,
                  marginBottom: "1.75rem",
                  textShadow: "0 0 100px rgba(201,132,154,0.18)",
                }}
              >
                "Квіточка, з 18-річчям!
                <br />
                Бажаю тобі щастя, тепла, натхнення і людей поруч, з якими легко бути
                собою.
                <br />
                Нехай цей рік принесе тобі нові мрії, красиві моменти, сміливі рішення і
                багато приколів там всяких"
              </blockquote>

              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: "1.12rem",
                  color: "#E8C4D0",
                }}
              >
                В 16 мене вигнали з дому в австралію, а ти досі в мами на шиї, негодніца
                така
              </p>

              <Divider />
            </FadeIn>
          </div>
        </section>

        <SurpriseSection />

        <section
          className="relative flex items-center justify-center overflow-hidden"
          style={{ height: "100svh", minHeight: "600px" }}
        >
          <div className="absolute inset-0 bg-primary">
            <img
              src={IMG.floral}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.28) saturate(0.45)" }}
              aria-hidden
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(45,16,82,0.18) 0%, rgba(26,10,46,0.78) 100%)",
              }}
            />
          </div>

          <FadeIn className="relative z-10 text-center px-6">
            <p
              style={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: "0.66rem",
                letterSpacing: "0.52em",
                textTransform: "uppercase",
                color: "#C9849A",
                marginBottom: "2.5rem",
              }}
            >
              Тяптяптяп · 18 яре альт
            </p>

            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                color: "#FAF5F7",
                fontSize: "clamp(3rem, 8.5vw, 7.5rem)",
                lineHeight: 1.07,
                marginBottom: "2rem",
              }}
            >
              Найкраще
              <br />
              <em style={{ color: "#E8C4D0" }}>тільки починається(мейбі канєшно)</em>
            </h2>
          </FadeIn>
        </section>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          photos={GALLERY_ITEMS}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}

/* ── Gallery photo label ─────────────────────────── */
function PhotoLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="photo-label"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "2.5rem 1rem 1rem",
        background: "linear-gradient(to top, rgba(10,3,18,0.72) 0%, transparent 100%)",
        opacity: 0,
        transition: "opacity 0.35s ease",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          fontFamily: SANS,
          fontSize: "0.6rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "#C9849A",
        }}
      >
        {children}
      </p>
    </div>
  );
}