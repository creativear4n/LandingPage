import { useEffect, useState } from "react";
import { updatePageSeo } from "../utils/seo";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import Header from "../components/layout/Header";
import MainLayout from "../components/layout/MainLayout";
import ProjectModal from "../components/projects/ProjectModal";
import {
    getDashboard,
    getProjects,
    getImageUrl,
} from "../services/api";
import type {
    ApiDashboard,
    ApiProjectsResponse,
    Dashboard,
    Project,
} from "../types";

const images = {
    hero: "/assets/home/image_1.png",
    officeTwo: "/assets/home/image_4.png",
    officeThree:
        "https://images.pexels.com/photos/37429756/pexels-photo-37429756.png?auto=compress&cs=tinysrgb&h=650&w=940",
};

function normalizeDashboard(
    data: ApiDashboard | null
): Dashboard | null {
    if (!data) {
        return null;
    }

    return {
        id: data.id,
        hero_image_url: getImageUrl(data.hero_image),
        link_contact: data.link_contact,
        title_about: data.title_about,
        description_about: data.description_about,
        count_about: data.count_about,
        years_about: data.years_about,
        percent_about: data.percent_about,
        title_home: data.title_home,
        subtitle_home: data.subtitle_home,
        description_home: data.description_home,
        image_home_url: getImageUrl(data.image_home),
        descbutton_home: data.descbutton_home,
        linkbutton_home:
            data.linkbutton_home || data.link_contact,
    };
}

function normalizeProjects(
    data: ApiProjectsResponse
): Project[] {
    return (data.projects ?? []).map((project) => ({
        ...project,
        category: project.category ?? null,
        images: (project.images ?? [])
            .map((image) => ({
                ...image,
                image_url:
                    getImageUrl(
                        image.image_url || image.image_path
                    ) ?? "",
            }))
            .sort(
                (a, b) => a.sort_order - b.sort_order
            ),
    }));
}

export default function Home() {
    const navigate = useNavigate();
    
    useEffect(() => {
        updatePageSeo({
            title: "Jasa Arsitek, Interior & Design Build Cirebon | AR4N Group",
            description:
                "AR4N Group melayani jasa arsitektur, desain interior, design & build, konstruksi, serta pendampingan pengurusan PBG dan SLF di Cirebon.",
            path: window.location.pathname,
            image: "/assets/seo/thumbnail1.png",
        });
    }, []);
        

    const [dashboard, setDashboard] =
        useState<Dashboard | null>(null);

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [selectedProject, setSelectedProject] =
        useState<Project | null>(null);

    const [showAllGallery, setShowAllGallery] =
        useState(false);

    useEffect(() => {
        let active = true;

        async function loadHomeData() {
            try {
                setLoading(true);
                setError(null);

                const [
                    dashboardData,
                    projectData,
                ] = await Promise.all([
                    getDashboard(),
                    getProjects(),
                ]);

                if (!active) {
                    return;
                }

                setDashboard(
                    normalizeDashboard(dashboardData)
                );

                setProjects(
                    normalizeProjects(projectData)
                );
            } catch (reason) {
                if (!active) {
                    return;
                }

                setError(
                    reason instanceof Error
                        ? reason.message
                        : "Gagal mengambil data halaman Home."
                );
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadHomeData();

        return () => {
            active = false;
        };
    }, []);

    const homeProjects = projects.slice(0, 4);

    const galleryImages = projects.flatMap((project) =>
        [...(project.images ?? [])]
            .sort(
                (a, b) => a.sort_order - b.sort_order
            )
            .map((image) => ({
                ...image,
                projectTitle: project.title,
            }))
    );

    const visibleGalleryImages = showAllGallery
        ? galleryImages
        : galleryImages.slice(0, 8);

    if (loading) {
        return (
            <MainLayout page="home">
                <section className="hero">
                    <img
                        className="hero-image"
                        src={images.hero}
                        alt="AR4N Group"
                    />

                    <div className="hero-shade" />

                    <div className="hero-header">
                        <Header page="home" />
                    </div>

                    <div className="hero-content page-width">
                        <p className="eyebrow">
                            Jasa arsitektur, desain interior &amp; design build Cirebon
                        </p>

                        <h1>
                            AR4N
                            <br />
                            <span>GROUP</span>
                        </h1>

                        <p>Memuat konten...</p>
                    </div>

                    <div className="scroll-cue">
                        <span />
                        Scroll to explore
                    </div>
                </section>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout page="home">
                <section className="page-width section-pad">
                    <h2>Konten belum dapat dimuat</h2>

                    <p>{error}</p>

                    <button
                        className="outline-button"
                        onClick={() => window.location.reload()}
                    >
                        Coba lagi
                    </button>
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout page="home">
            <section className="hero">
                <img
                    className="hero-image"
                    src={
                        dashboard?.hero_image_url ||
                        images.hero
                    }
                    alt="AR4N Group"
                />

                <div className="hero-shade" />

                <div className="hero-header">
                    <Header page="home" />
                </div>

                <div className="hero-content page-width">
                    <p className="eyebrow">
                        Jasa arsitektur, desain interior &amp; design build Cirebon
                    </p>

                    <h1>
                        AR4N
                        <br />
                        <span>GROUP</span>
                    </h1>

                    <button
                        className="outline-button"
                        onClick={() => {
                            if (dashboard?.link_contact) {
                                window.open(
                                    dashboard.link_contact,
                                    "_blank",
                                    "noopener,noreferrer"
                                );
                            } else {
                                navigate("/about");
                            }
                        }}
                    >
                        Contact
                        <ArrowUpRight size={14} />
                    </button>
                </div>

                <div className="scroll-cue">
                    <span />
                    Scroll to explore
                </div>
            </section>

            <section
                className="intro section-pad"
                id="home-about"
            >
                <div className="page-width narrow-copy">
                    <p className="section-kicker">
                        01 / About us
                    </p>

                    <h2>
                        {dashboard?.title_about ||
                            "Design & Building Terpercaya di Cirebon"}
                    </h2>

                    <p className="body-copy">
                        {dashboard?.description_about ||
                            "AR4N Group adalah perusahaan jasa design & building di Cirebon yang berpengalaman, terpercaya, dan profesional sejak tahun 2018."}
                    </p>
                </div>

                <div className="section-trusted">
                    <h2>Trusted by Many Clients</h2>
                </div>

                <div className="page-width stats-row">
                    <div className="stat">
                        <strong>
                            {dashboard?.count_about || "134"}
                            <span>+</span>
                        </strong>

                        <small>Projects completed</small>
                    </div>

                    <div className="stat">
                        <strong>
                            {dashboard?.years_about || "8"}
                            <span>+</span>
                        </strong>

                        <small>Years experience</small>
                    </div>

                    <div className="stat">
                        <strong>
                            {dashboard?.percent_about || "98"}
                            <span>%</span>
                        </strong>

                        <small>Client satisfaction</small>
                    </div>
                </div>
            </section>

            <section className="work section-pad">
                <div className="page-width">
                    <div className="section-heading">
                        <div>
                            <p className="section-kicker">
                                02 / Selected work
                            </p>

                            <h2>Our projects</h2>
                        </div>

                        <button
                            className="text-link"
                            onClick={() => navigate("/works")}
                        >
                            View all work
                            <ArrowUpRight size={15} />
                        </button>
                    </div>

                    <div className="project-grid">
                        {homeProjects.map((project, index) => (
                            <article
                                className="project-card cursor-pointer"
                                key={project.id}
                                onClick={() =>
                                    setSelectedProject(project)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        setSelectedProject(project);
                                    }
                                }}
                                tabIndex={0}
                            >
                                <div className="project-image">
                                    <img
                                        src={
                                            project.images?.[0]?.image_url ||
                                            images.officeThree
                                        }
                                        alt={project.title}
                                    />

                                    <span>
                                        {String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>
                                </div>

                                <div className="project-meta">
                                    <div>
                                        <h3>{project.title}</h3>

                                        <p>
                                            {project.category?.name ||
                                                "Uncategorized"}
                                        </p>
                                    </div>

                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedProject(project);
                                        }}
                                        aria-label={`View ${project.title}`}
                                    >
                                        <Plus size={17} />
                                    </button>
                                </div>
                            </article>
                        ))}

                        {homeProjects.length === 0 && (
                            <p>
                                Belum ada proyek pilihan untuk
                                ditampilkan.
                            </p>
                        )}
                    </div>
                </div>

                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() =>
                            setSelectedProject(null)
                        }
                    />
                )}
            </section>

            <section className="feature section-pad">
                <div className="page-width feature-inner">
                    <div className="feature-image">
                        <img
                            src={
                                dashboard?.image_home_url ||
                                images.officeTwo
                            }
                            alt="Modern office with warm wood details"
                        />
                    </div>

                    <div className="feature-copy">
                        <p className="section-kicker">
                            03 /{" "}
                            {dashboard?.title_home ||
                                "The Studio"}
                        </p>

                        <h2>
                            {dashboard?.subtitle_home ||
                                "Thoughtful spaces, beautifully built."}
                        </h2>

                        <p className="body-copy">
                            {dashboard?.description_home ||
                                "Kami percaya bahwa ruang yang baik lahir dari keseimbangan antara fungsi, karakter, dan detail."}
                        </p>

                        <button
                            className="outline-button light"
                            onClick={() => {
                                const link =
                                    dashboard?.linkbutton_home;

                                if (link) {
                                    window.open(
                                        link,
                                        "_blank",
                                        "noopener,noreferrer"
                                    );
                                } else {
                                    navigate("/about");
                                }
                            }}
                        >
                            {dashboard?.descbutton_home ||
                                "Discover our approach"}

                            <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="gallery section-pad">
                <div className="page-width">
                    <div className="section-heading">
                        <div>
                            <p className="section-kicker">
                                04 / In detail
                            </p>

                            <h2>Project gallery</h2>
                        </div>

                        <p className="gallery-note">
                            A collection of spaces
                            <br />
                            we&apos;re proud to make.
                        </p>
                    </div>

                    <div className="gallery-grid">
                        {visibleGalleryImages.map(
                            (image, index) => (
                                <button
                                    className={`gallery-item gallery-${(index % 8) + 1}`}
                                    onClick={() =>
                                        navigate("/works")
                                    }
                                    key={image.id}
                                >
                                    <img
                                        src={image.image_url}
                                        alt={`${image.projectTitle} project detail`}
                                    />
                                </button>
                            )
                        )}
                    </div>

                    {galleryImages.length === 0 && (
                        <p>
                            Galeri proyek akan ditampilkan setelah
                            foto proyek ditambahkan melalui CMS.
                        </p>
                    )}

                    {galleryImages.length > 8 && (
                        <div className="center-action">
                            <button
                                className="outline-button"
                                onClick={() =>
                                    setShowAllGallery(
                                        (previous) => !previous
                                    )
                                }
                            >
                                {showAllGallery
                                    ? "Show less"
                                    : "View all projects"}

                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}