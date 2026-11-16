import { useNavigate } from "react-router-dom";
import {
    ArrowUpRight,
    Mail,
} from "lucide-react";
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

                    <a href="mailto:hello@arangroup.id">
                        hello@arangroup.id
                        <ArrowUpRight size={15} />
                    </a>

                    <a href="tel:+622315001234">
                        +62 231 500 1234
                    </a>
                </div>

                <div className="footer-social">
                    <p className="section-kicker">
                        Follow the work
                    </p>

                    <a href="mailto:hello@arangroup.id">
                        <Mail size={16} />
                        Email us
                    </a>
                </div>
            </div>

            <div className="page-width footer-bottom">
                <span>© 2026 Aran Group</span>
                <span>Cirebon, Indonesia</span>
                <span>Designed with intention</span>
            </div>
        </footer>
    );
}