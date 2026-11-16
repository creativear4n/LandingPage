import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Play,
    X,
} from "lucide-react";
import type { ApiTestimonial } from "../../types";

interface TestimonialSectionProps {
    testimonials: ApiTestimonial[];
}

export default function TestimonialSection({
    testimonials,
}: TestimonialSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [videoOpen, setVideoOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const activeTestimonial = testimonials[activeIndex];

    useEffect(() => {
        setImageError(false);
    }, [activeIndex]);

    useEffect(() => {
        if (!videoOpen) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setVideoOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.classList.add("modal-open");

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.classList.remove("modal-open");
        };
    }, [videoOpen]);

    const showPrevious = () => {
        setActiveIndex((current) =>
            current === 0
                ? testimonials.length - 1
                : current - 1
        );
    };

    const showNext = () => {
        setActiveIndex((current) =>
            current === testimonials.length - 1
                ? 0
                : current + 1
        );
    };

    if (testimonials.length === 0) {
        return (
            <section className="testimonial-section">
                <div className="page-width">
                    <div className="testimonial-heading">
                        <p className="section-kicker">
                            02 / Client stories
                        </p>

                        <h2>What Our Clients Say</h2>

                        <p>
                            Stories and experiences from our
                            clients.
                        </p>
                    </div>

                    <div className="testimonial-empty">
                        Testimonial akan ditampilkan setelah
                        konten ditambahkan melalui CMS.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="testimonial-section">
            <div className="page-width">
                <div className="testimonial-heading">
                    <p className="section-kicker">
                        02 / Client stories
                    </p>

                    <h2>What Our Clients Say</h2>

                    <p>
                        Stories and experiences from our
                        clients.
                    </p>
                </div>

                <div className="testimonial-content">
                    <div className="testimonial-media">
                        {activeTestimonial.thumbnail_url &&
                        !imageError ? (
                            <img
                                src={activeTestimonial.thumbnail_url}
                                alt={activeTestimonial.title}
                                onError={() =>
                                    setImageError(true)
                                }
                            />
                        ) : (
                            <div className="testimonial-placeholder">
                                <span>AR4N GROUP</span>
                            </div>
                        )}

                        {activeTestimonial.video_url && (
                            <button
                                className="testimonial-play"
                                onClick={() =>
                                    setVideoOpen(true)
                                }
                                aria-label="Play testimonial video"
                            >
                                <Play
                                    size={21}
                                    fill="currentColor"
                                />
                            </button>
                        )}
                    </div>

                    <div className="testimonial-detail">
                        <p className="testimonial-number">
                            TESTIMONIAL{" "}
                            {String(activeIndex + 1).padStart(
                                2,
                                "0"
                            )}
                            {" / "}
                            {String(testimonials.length).padStart(
                                2,
                                "0"
                            )}
                        </p>

                        <h3>{activeTestimonial.title}</h3>

                        <p className="testimonial-description">
                            {activeTestimonial.description}
                        </p>

                        <div className="testimonial-author">
                            <strong>
                                {activeTestimonial.author_name}
                            </strong>

                            {activeTestimonial.author_position && (
                                <span>
                                    {activeTestimonial.author_position}
                                </span>
                            )}
                        </div>
                    </div>

                    {testimonials.length > 1 && (
                        <div className="testimonial-controls">
                            <button
                                onClick={showPrevious}
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft size={21} />
                            </button>

                            <button
                                onClick={showNext}
                                aria-label="Next testimonial"
                            >
                                <ChevronRight size={21} />
                            </button>
                        </div>
                    )}
                </div>

                {testimonials.length > 1 && (
                    <div className="testimonial-indicators">
                        {testimonials.map((testimonial, index) => (
                            <button
                                key={testimonial.id}
                                className={
                                    activeIndex === index
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setActiveIndex(index)
                                }
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {videoOpen && activeTestimonial.video_url && (
                <div
                    className="testimonial-video-modal"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            setVideoOpen(false);
                        }
                    }}
                >
                    <div className="testimonial-video-container">
                        <button
                            className="testimonial-video-close"
                            onClick={() =>
                                setVideoOpen(false)
                            }
                            aria-label="Close video"
                        >
                            <X size={23} />
                        </button>

                        <video
                            src={activeTestimonial.video_url}
                            controls
                            autoPlay
                            playsInline
                        />
                    </div>
                </div>
            )}
        </section>
    );
}