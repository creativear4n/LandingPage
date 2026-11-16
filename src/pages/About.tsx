import { useEffect, useState } from "react";
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
        award: data.award,
        exhibition: data.exhibition,
        team: data.team,
        people: data.people,
        hero_image_url: getImageUrl(data.hero_image),
        profile_image_url: getImageUrl(data.profile_image),
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
        <section className="inner-hero">
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

function AboutText({
    title,
    text,
}: {
    title: string;
    text: string | null;
}) {
    if (!text?.trim()) {
        return null;
    }

    return (
        <article className="about-text">
            <SectionTitle title={title} />
            <p>{text}</p>
        </article>
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

            <section className="about-page page-width">
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

            <TestimonialSection
                testimonials={testimonials}
            />

            <section className="about-page about-details page-width">
                <div className="about-grid">
                    <AboutText
                        title="Philosophy"
                        text={aboutUs?.philosophy ?? null}
                    />

                    <AboutText
                        title="Award"
                        text={aboutUs?.award ?? null}
                    />

                    <AboutText
                        title="People"
                        text={aboutUs?.people ?? null}
                    />

                    <AboutText
                        title="Exhibition"
                        text={aboutUs?.exhibition ?? null}
                    />

                    <AboutText
                        title="Team"
                        text={aboutUs?.team ?? null}
                    />
                </div>
            </section>
        </MainLayout>
    );
}