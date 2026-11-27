import { useEffect, useRef } from "react";
import "./intro-animation.css";

type IntroAnimationProps = {
    onComplete: () => void;
};

export default function IntroAnimation({
    onComplete,
}: IntroAnimationProps) {
    const onCompleteRef = useRef(onComplete);
    const completedRef = useRef(false);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const completeOnce = () => {
            if (completedRef.current) {
                return;
            }

            completedRef.current = true;
            onCompleteRef.current();
        };

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        // Langsung selesaikan intro apabila pengguna
        // mengaktifkan pengurangan animasi.
        if (reducedMotion.matches) {
            completeOnce();
            return;
        }

        const timeout = window.setTimeout(
            completeOnce,
            7800
        );

        return () => {
            window.clearTimeout(timeout);
        };
    }, []);

    return (
        <div
            className="ar4n-intro"
            role="presentation"
            aria-label="AR4N Group opening"
        >
            <div className="intro-blueprint" aria-hidden="true">
                <span className="blueprint-grid" />
                <span className="blueprint-diagonal blueprint-diagonal-one" />
                <span className="blueprint-diagonal blueprint-diagonal-two" />
                <span className="blueprint-ring" />
                <span className="blueprint-crosshair" />
                <span className="blueprint-scan" />
            </div>

            <div className="intro-composition">
                <svg
                    className="intro-outline"
                    viewBox="0 0 620 470"
                    aria-hidden="true"
                >
                    <path
                        className="outline-path"
                        d="M310 18 H594 V452 H26 V18 H310"
                    />
                    <path
                        className="outline-corner"
                        d="M26 74 V18 H82 M538 18 H594 V74 M594 396 V452 H538 M82 452 H26 V396"
                    />
                    <path
                        className="outline-center"
                        d="M310 0 V18 M310 452 V470 M8 235 H26 M594 235 H612"
                    />
                </svg>

                <div className="intro-logo-wrap">
                    <img
                        className="intro-logo intro-logo-white"
                        src="/assets/arann-white.png"
                        alt=""
                        decoding="async"
                    />

                    <img
                        className="intro-logo intro-logo-color"
                        src="/assets/arann.png"
                        alt="AR4N Group"
                        decoding="async"
                    />
                </div>

                <div className="intro-caption">
                    <span>DESIGN</span>
                    <i />
                    <span>BUILDINGS</span>
                    <i />
                    <span>EDUCATION</span>
                </div>
            </div>

            <div className="intro-counter" aria-hidden="true">
                <span>AR4N GROUP</span>
                <span>EST. 2018</span>
            </div>
        </div>
    );
}
