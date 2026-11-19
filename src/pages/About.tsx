import { useEffect, useRef, useState } from "react";
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

    const scrollCards = (direction: number) => {
        const track = trackRef.current;

        if (!track) return;

        const card = track.querySelector<HTMLElement>(
            ".team-card"
        );

        const gap = 24;
        const distance = (card?.offsetWidth ?? 280) + gap;

        track.scrollBy({
            left: direction * distance,
            behavior: "smooth",
        });
    };

    if (!members.length) {
        return null;
    }

    return (
        <section className="team-section page-width about-reveal about-team-motion">
            <div className="team-heading">
                <h2>OUR TEAM</h2>
                <p>The People Behind AR4N Group</p>
            </div>

            <div className="team-carousel">
                <button
                    type="button"
                    className="team-nav team-nav--prev"
                    onClick={() => scrollCards(-1)}
                    aria-label="Anggota sebelumnya"
                >
                    &#8592;
                </button>

                <div
                    ref={trackRef}
                    className="team-track"
                >
                    {members.map((member, index) => (
                        <article
                            className="team-card"
                            key={member.id}
                            style={{
                                animationDelay: `${index * 90}ms`,
                            }}
                        >
                            <div className="team-card__photo-stage">
                                <div
                                    className="team-card__initial"
                                    aria-hidden="true"
                                >
                                    {member.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

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

                                    {member.certifications && (
                                        <p className="team-card__cert">
                                            {member.certifications}
                                        </p>
                                    )}

                                    {member.description && (
                                        <p className="team-card__description">
                                            {member.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <button
                    type="button"
                    className="team-nav team-nav--next"
                    onClick={() => scrollCards(1)}
                    aria-label="Anggota berikutnya"
                >
                    &#8594;
                </button>
            </div>
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

            <section className="about-page page-width about-reveal about-profile-motion">
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

            <div className="about-reveal about-testimonial-motion">
                <TestimonialSection
                    testimonials={testimonials}
                />
            </div>

            {aboutUs?.philosophy?.trim() && (
                <section className="about-page about-details page-width about-reveal about-philosophy-motion">
                    <div className="about-grid">
                        <article className="about-text">
                            <SectionTitle title="Philosophy" />
                            <p>{aboutUs.philosophy}</p>
                        </article>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
