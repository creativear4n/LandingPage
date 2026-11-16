import { useState } from "react";

export default function Brand() {
    const [imageError, setImageError] = useState(false);

    return (
        <span className="brand">
            {imageError ? (
                <span className="brand-name">
                    AR4N
                    <br />
                    GROUP
                </span>
            ) : (
                <img
                    src="/assets/logo.png"
                    alt="AR4N Group"
                    className="brand-icon"
                    onError={() => setImageError(true)}
                />
            )}
        </span>
    );
}