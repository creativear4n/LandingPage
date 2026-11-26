
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import Brand from "./Brand";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="page-width footer-top">
                <div>
                    <button
                        className="brand-button"
                        onClick={() => navigate("/")}
                        aria-label="AR4N Group Home"
                    >
                        <Brand />
                    </button>

                    <p className="footer-tagline">
                        We shape spaces
                        <br />
                        that feel like home.
                    </p>
                </div>

                <div className="footer-contact">
                    <p className="section-kicker">
                        Let&apos;s work together
                    </p>

                    <a href="mailto:groupar4n@gmail.com">
                        groupar4n@gmail.com
                        <ArrowUpRight size={15} />
                    </a>

                    <a href="tel:+6285220469776">
                        +62 852-2046-9776
                    </a>
                </div>

                <div className="footer-social">
                    <p className="section-kicker">
                        Follow the work
                    </p>

                    <div className="footer-social-links">
                        <SocialIcon
                            url="https://www.instagram.com/ar4n.group/"
                            style={{
                                width: 30,
                                height: 30,
                            }}
                            bgColor="#c6a173"
                            fgColor="#1c1c1a"
                            target="_blank"
                        />
                    </div>
                </div>
            </div>

            <div className="page-width footer-bottom">
                <span>© 2026 AR4N Group</span>
                <span>Cirebon, Indonesia</span>
                <span>Designed with intention</span>
            </div>
        </footer>
    );
}