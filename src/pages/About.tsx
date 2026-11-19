import {
    useEffect,
    useId,
    useRef,
    useState
} from "react";
import {
    createPortal
} from "react-dom";
import {
    ChevronDown
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import TestimonialSection from "../components/sections/TestimonialSection";
import {
    getAboutUs,
    getTestimonials,
    getImageUrl,
} from "../services/api";
import type {
    ApiAboutUs,
    ApiTestimonial,
    AboutUs,
    AboutTeamMember,
} from "../types";

const fallbackImages = {
    hero: "/assets/home/image_1.png",
    profile: "/assets/home/image_2.png",
};

function normalizeAboutUs(
    data: ApiAboutUs | null
): AboutUs | null {
    if (!data) {
        return null;
    }

    return {
        id: data.id,
        profile_title: data.profile_title,
        description: data.description,
        philosophy: data.philosophy,
        hero_image_url: getImageUrl(data.hero_image),
        profile_image_url: getImageUrl(data.profile_image),
        team_members: (data.team_members ?? [])
            .filter((member) => member.is_active)
            .sort(
                (a, b) => a.sort_order - b.sort_order
            )
            .map((member) => ({
                ...member,
                photo_url: getImageUrl(
                    member.photo_url || member.photo_path
                ),
            })),
    };
}

function InnerHero({
    image,
}: {
    image: string | null;
}) {
    const [imageSrc, setImageSrc] = useState(
        image || fallbackImages.hero
    );

    useEffect(() => {
        setImageSrc(image || fallbackImages.hero);
    }, [image]);

    return (
        <section className="inner-hero about-hero-motion">
            <img
                src={imageSrc}
                alt="AR4N Group About Us"
                onError={() => {
                    if (imageSrc !== fallbackImages.hero) {
                        setImageSrc(fallbackImages.hero);
                    }
                }}
            />

            <div className="inner-hero-shade" />

            <h1>ABOUT US</h1>
        </section>
    );
}

function SectionTitle({
    title,
}: {
    title: string;
}) {
    return (
        <h2 className="lined-title">
            {title}
            <span />
        </h2>
    );
}

function PhilosophyAccordion({
    content,
}: {
    content: string;
}) {
    const [isOpen, setIsOpen] =useState(false);
    const panelId = `about-philosophy-${useId().replace(/:/g, "")}`;

    return (
        <section className="products-explanation-section page-width about-philosophy-section about-scroll-reveal about-philosophy-motion">
            <div className="products-explanation-heading">
                <p>OUR PHILOSOPHY</p>

                <h2>Principles That Guide Us</h2>

                <span>
                    Nilai dan prinsip yang menjadi landasan
                    setiap langkah AR4N Group.
                </span>
            </div>

            <div className="products-explanation-groups">
                <div className={`products-explanation-group ${
                    isOpen ? "is-open" : ""
                }`}
                >
                    <button
                        type="button"
                        className="products-explanation-toggle"
                        onClick={() => setIsOpen((previous) => !previous)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                    >
                        <span className="products-explanation-number">
                            03
                        </span>
                        
                        <span className="products-explanation-title-wrap">
                            <strong className="products-explanation-title">
                                Philosophy AR4N Group
                            </strong>

                            <span className="products-explanation-subtitle">
                                Nilai, Prinsip dan Cara Pandang
                                dalam setiap Pekerjaan.
                            </span>
                        </span>

                        <span className="products-explanation-toggle-icon">
                            <ChevronDown
                                size={22}
                                strokeWidth={1.7}
                            />
                        </span>
                    </button>
                    {isOpen && (
                        <div
                            id={panelId}
                            className="products-explanation-panel about-philosophy-panel"
                            >
                                <div className="about-philosophy-copy">
                                    <p>{content}</p>
                                </div>
                            </div>
                    )

                    }

                </div>
                
            </div>
        </section>
    );
}

function ProfileImage({
    image,
}: {
    image: string | null;
}) {
    const [imageSrc, setImageSrc] = useState(
        image || fallbackImages.profile
    );

    useEffect(() => {
        setImageSrc(image || fallbackImages.profile);
    }, [image]);

    return (
        <img
            src={imageSrc}
            alt="AR4N Group Profile"
            onError={() => {
                if (imageSrc !== fallbackImages.profile) {
                    setImageSrc(fallbackImages.profile);
                }
            }}
        />
    );
}

function TeamCarousel({
    members,
}: {
    members: AboutTeamMember[];
}) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [selectedMember, setSelectedMember] =
        useState<AboutTeamMember | null>(null);

    const scrollCards = (direction: number) => {
        const track = trackRef.current;

        if (!track) return;

        const card = track.querySelector<HTMLElement>(
            ".team-card"
        );

        const distance = (card?.offsetWidth ?? 280) + 28;

        track.scrollBy({
            left: direction * distance,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (!selectedMember) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedMember(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedMember]);

    if (!members.length) {
        return null;
    }

    return (
        <section className="team-section page-width about-scroll-reveal about-team-motion">
            <div className="team-heading">
                <h2>OUR TEAM</h2>
                <p>01 The People Behind AR4N Group</p>
            </div>

            <div className="team-carousel">
                {members.length > 1 && (
                    <button
                        type="button"
                        className="team-nav team-nav--prev"
                        onClick={() => scrollCards(-1)}
                        aria-label="Anggota sebelumnya"
                    >
                        <span aria-hidden="true">‹</span>
                    </button>
                )}

                <div
                    ref={trackRef}
                    className={`team-track ${
                        members.length === 1
                            ? "team-track--single"
                            : ""
                    }`}
                >
                    {members.map((member, index) => (
                        <button
                            type="button"
                            className="team-card"
                            key={member.id}
                            style={{
                                animationDelay: `${index * 90}ms`,
                            }}
                            onClick={() => setSelectedMember(member)}
                            aria-label={`Lihat profil ${member.name}`}
                        >
                            <div className="team-card__photo-stage">
                                {!member.photo_url && (
                                    <div
                                        className="team-card__initial"
                                        aria-hidden="true"
                                    >
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {member.photo_url && (
                                    <img
                                        src={member.photo_url}
                                        alt={member.name}
                                        className="team-card__photo"
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                )}

                                <div className="team-card__vertical">
                                    AR4N GROUP
                                </div>

                                <div className="team-card__info">
                                    <h3>{member.name}</h3>

                                    {member.position && (
                                        <p className="team-card__position">
                                            {member.position}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {members.length > 1 && (
                    <button
                        type="button"
                        className="team-nav team-nav--next"
                        onClick={() => scrollCards(1)}
                        aria-label="Anggota berikutnya"
                    >
                        <span aria-hidden="true">›</span>
                    </button>
                )}
            </div>

            {selectedMember &&
                createPortal(
                    <div
                        className="team-modal"
                        onClick={() => setSelectedMember(null)}
                    >
                        <div
                            className="team-modal__dialog"
                            role="dialog"
                            aria-modal="true"
                            aria-label={`Profil ${selectedMember.name}`}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="team-modal__close"
                                onClick={() => setSelectedMember(null)}
                                aria-label="Tutup profil"
                            >
                                ×
                            </button>

                            <div className="team-modal__photo">
                                {selectedMember.photo_url ? (
                                    <img
                                        src={selectedMember.photo_url}
                                        alt={selectedMember.name}
                                    />
                                ) : (
                                    <span>
                                        {selectedMember.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="team-modal__content">
                                <span className="team-modal__eyebrow">
                                    AR4N GROUP · TEAM PROFILE
                                </span>

                                <h3>{selectedMember.name}</h3>

                                {selectedMember.position && (
                                    <p className="team-modal__position">
                                        {selectedMember.position}
                                    </p>
                                )}

                                {selectedMember.certifications && (
                                    <div className="team-modal__detail">
                                        <span>Certification</span>
                                        <p>{selectedMember.certifications}</p>
                                    </div>
                                )}

                                {selectedMember.description && (
                                    <div className="team-modal__detail">
                                        <span>About</span>
                                        <p>{selectedMember.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
}

export default function About() {
    const [aboutUs, setAboutUs] = useState<AboutUs | null>(
        null
    );

    const [testimonials, setTestimonials] = useState<
        ApiTestimonial[]
    >([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "About Us | AR4N Group";

        let active = true;

        async function loadAboutPage() {
            try {
                setLoading(true);
                setError(null);

                const [aboutData, testimonialData] =
                    await Promise.all([
                        getAboutUs(),
                        getTestimonials(),
                    ]);

                if (!active) {
                    return;
                }

                setAboutUs(normalizeAboutUs(aboutData));

                setTestimonials(
                    [...testimonialData]
                        .filter((item) => item.is_active)
                        .sort(
                            (a, b) =>
                                a.sort_order - b.sort_order
                        )
                );
            } catch (reason) {
                if (!active) {
                    return;
                }

                setError(
                    reason instanceof Error
                        ? reason.message
                        : "Gagal mengambil data halaman About Us."
                );
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadAboutPage();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (loading) return;

        const elements = document.querySelectorAll<HTMLElement>(
            ".about-scroll-reveal"
        );

        if (!elements.length) return;

        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) =>
                element.classList.add("is-visible")
            );
            return;
        }

        document.documentElement.classList.add("about-reveal-ready");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
            document.documentElement.classList.remove(
                "about-reveal-ready"
            );
        };
    }, [loading]);

    if (loading) {
        return (
            <MainLayout page="about" headerOverlay>
                <InnerHero image={null} />

                <section className="about-page page-width">
                    <p>Memuat informasi AR4N Group...</p>
                </section>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout page="about" headerOverlay>
                <InnerHero image={null} />

                <section className="about-page page-width">
                    <h2>Konten belum dapat dimuat</h2>
                    <p>{error}</p>

                    <button
                        className="outline-button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Coba lagi
                    </button>
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout page="about" headerOverlay>
            <InnerHero
                image={aboutUs?.hero_image_url ?? null}
            />

            <section className="about-page page-width about-scroll-reveal about-profile-motion">
                <div className="profile-block">
                    <ProfileImage
                        image={
                            aboutUs?.profile_image_url ?? null
                        }
                    />

                    <div>
                        <SectionTitle title="Profile" />

                        <h3>
                            {aboutUs?.profile_title ||
                                "AR4N GROUP"}
                        </h3>

                        <p>
                            {aboutUs?.description ||
                                "Informasi profil AR4N Group akan segera diperbarui."}
                        </p>
                    </div>
                </div>
            </section>

            <TeamCarousel
                members={aboutUs?.team_members ?? []}
            />

            <div className="about-scroll-reveal about-testimonial-motion">
                <TestimonialSection
                    testimonials={testimonials}
                />
            </div>

            {aboutUs?.philosophy?.trim() && (
                <PhilosophyAccordion
                    content={aboutUs.philosophy}

                />
            )}
        </MainLayout>
    );
}
