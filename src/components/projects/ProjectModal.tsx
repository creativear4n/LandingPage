import { useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import type { Project } from "../../types";

interface ProjectModalProps {
    project: Project & {
        thumbnail_url?: string | null;
        thumbnail_path?: string | null;
    };
    onClose: () => void;
}

export default function ProjectModal({
    project,
    onClose,
}: ProjectModalProps) {
    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", closeOnEscape);
        document.body.classList.add("modal-open");

        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            document.body.classList.remove("modal-open");
        };
    }, [onClose]);

    const sortedImages = [...(project.images ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .slice(0, 20);

    const thumbnail =
        project.thumbnail_url ||
        sortedImages[0]?.image_url ||
        null;

    const galleryImages = sortedImages.filter(
        (image) => image.image_url !== thumbnail
    );

    const categoryName =
        project.category?.name || "Project";

    return (
        <div
            className="project-modal project-modal-home"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            onMouseDown={(event) => {
                if (event.currentTarget === event.target) {
                    onClose();
                }
            }}
        >
            <div className="modal-inner project-modal-inner">
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close project"
                >
                    <X size={23} />
                </button>

                <div className="project-modal-content">
                    <section className="project-modal-hero">
                        <div className="project-modal-information">
                            <div className="project-modal-breadcrumb">
                                <span>AR4N GROUP</span>
                                <span>/</span>
                                <span>PROJECT DETAIL</span>
                            </div>

                            <p className="project-modal-kicker">
                                PROJECT DETAIL /{" "}
                                {categoryName.toUpperCase()}
                            </p>

                            <h2>{project.title}</h2>

                            {project.description && (
                                <p className="project-modal-description">
                                    {project.description}
                                </p>
                            )}
                           
                        </div>

                        <div className="project-modal-featured">
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={project.title}
                                    loading="eager"
                                    decoding="async"
                                />
                            ) : (
                                <div className="project-modal-placeholder">
                                    Image not available
                                </div>
                            )}

                            <div className="project-modal-featured-overlay">
                                <span>FEATURED PROJECT</span>
                                <strong>{project.title}</strong>
                            </div>

                            <span className="project-modal-featured-number">
                                01
                            </span>
                        </div>
                    </section>

                    <section className="project-modal-gallery">
                        <div className="project-modal-gallery-heading">
                            <div>
                                <p>SELECTED PHOTOGRAPHY</p>
                                <h3>Project Gallery</h3>
                            </div>

                            <span>
                                {sortedImages.length} / 20 Photos
                            </span>
                        </div>

                        {galleryImages.length > 0 ? (
                            <div className="project-modal-gallery-grid">
                                {galleryImages.map((image, index) => (
                                    <figure
                                        className="project-modal-gallery-item"
                                        key={image.id}
                                        style={{
                                            animationDelay: `${Math.min(
                                                index * 70,
                                                700
                                            )}ms`,
                                        }}
                                    >
                                        <img
                                            src={image.image_url}
                                            alt={`${project.title} - Photo ${index + 2}`}
                                            loading="lazy"
                                            decoding="async"
                                        />

                                        <figcaption>
                                            <span>
                                                {String(index + 2).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            <ArrowUpRight size={17} />
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        ) : (
                            <div className="project-modal-gallery-empty">
                                Belum ada foto tambahan untuk project ini.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
