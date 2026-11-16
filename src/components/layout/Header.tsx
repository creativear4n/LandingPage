import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronDown,
    Menu,
    X,
} from "lucide-react";

import Brand from "./Brand";

export type SitePage =
    | "home"
    | "about"
    | "works"
    | "desain"
    | "building"
    | "pbg-slf";

export default function Header({
    page,
}: {
    page: SitePage;
}) {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [productMenuOpen, setProductMenuOpen] = useState(false);
    const [projectMenuOpen, setProjectMenuOpen] = useState(false);

    const productActive =
        page === "desain" ||
        page === "building" ||
        page === "pbg-slf";

    const projectActive = page === "works";

    function go(path: string) {
        navigate(path);
        setMenuOpen(false);
        setProductMenuOpen(false);
        setProjectMenuOpen(false);
    }

    return (
        <header className="site-header">
            <button
                className="brand-button"
                onClick={() => go("/")}
                aria-label="AR4N Group Home"
            >
                <Brand />
            </button>

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen((value) => !value)}
                aria-label="Toggle menu"
            >
                {menuOpen ? (
                    <X size={20} />
                ) : (
                    <Menu size={20} />
                )}
            </button>

            <nav
                className={
                    menuOpen
                        ? "main-nav is-open"
                        : "main-nav"
                }
            >
                <button
                    className={page === "home" ? "active" : ""}
                    onClick={() => go("/")}
                >
                    Home
                </button>

                <button
                    className={page === "about" ? "active" : ""}
                    onClick={() => go("/about")}
                >
                    About
                </button>

                <div className="product-nav">
                    <button
                        className={
                            projectActive
                                ? "active product-trigger"
                                : "product-trigger"
                        }
                        onClick={() => {
                            setProjectMenuOpen((value) => !value);
                            setProductMenuOpen(false);
                        }}
                        aria-expanded={projectMenuOpen}
                    >
                        Portofolio
                        <ChevronDown size={12} />
                    </button>

                    <div
                        className={
                            projectMenuOpen
                                ? "product-dropdown is-open"
                                : "product-dropdown"
                        }
                    >
                        <button
                            onClick={() => go("/projects/design")}
                        >
                            Design
                        </button>

                        <button
                            onClick={() => go("/projects/buildings")}
                        >
                            Buildings
                        </button>

                        <button
                            onClick={() => go("/projects/pbg-slf")}
                        >
                            PBG &amp; SLF
                        </button>
                    </div>
                </div>

                <div className="product-nav">
                    <button
                        className={
                            productActive
                                ? "active product-trigger"
                                : "product-trigger"
                        }
                        onClick={() => {
                            setProductMenuOpen((value) => !value);
                            setProjectMenuOpen(false);
                        }}
                        aria-expanded={productMenuOpen}
                    >
                        Our Products
                        <ChevronDown size={12} />
                    </button>

                    <div
                        className={
                            productMenuOpen
                                ? "product-dropdown is-open"
                                : "product-dropdown"
                        }
                    >
                        <button
                            onClick={() => go("/products/design")}
                        >
                            Design
                        </button>

                        <button
                            onClick={() => go("/products/buildings")}
                        >
                            Buildings
                        </button>

                        <button
                            onClick={() => go("/products/pbg-slf")}
                        >
                            PBG &amp; SLF
                        </button>
                    </div>
                </div>
            </nav>

            <button
                className="language-switcher"
                type="button"
            >
                EN <span>/</span> ID <ChevronDown size={12} />
            </button>
        </header>
    );
}