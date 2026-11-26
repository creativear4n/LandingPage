import { useEffect, useId, useState } from "react";
import {
    Link,
    NavLink,
    useLocation,
} from "react-router-dom";

import { useLanguage } from "../../contexts/LanguageContext";

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

type DropdownType = "portfolio" | "products" | null;

export default function Header({
    page,
}: {
    page: SitePage;
}) {
    const { language, setLanguage, t } = useLanguage();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] =
        useState<DropdownType>(null);

    const navigationId = useId().replace(/:/g, "");
    const portfolioId = useId().replace(/:/g, "");
    const productsId = useId().replace(/:/g, "");

    const productActive =
        page === "desain" ||
        page === "building" ||
        page === "pbg-slf" ||
        location.pathname.startsWith("/products/");

    const projectActive =
        page === "works" ||
        location.pathname.startsWith("/projects/");

    function closeNavigation() {
        setMenuOpen(false);
        setOpenDropdown(null);
    }

    function toggleDropdown(
        type: Exclude<DropdownType, null>
    ) {
        setOpenDropdown((current) =>
            current === type ? null : type
        );
    }

    // Tutup navigasi ketika URL berubah.
    useEffect(() => {
        closeNavigation();
    }, [location.pathname]);

    // Tutup navigasi menggunakan tombol Escape.
    useEffect(() => {
        if (!menuOpen && !openDropdown) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuOpen(false);
                setOpenDropdown(null);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [menuOpen, openDropdown]);

    return (
        <header className="site-header">
            {/* BRAND */}
            <Link
                to="/"
                className="brand-button"
                aria-label="AR4N Group - Home"
                onClick={closeNavigation}
            >
                <Brand />
            </Link>

            {/* MOBILE MENU */}
            <button
                type="button"
                className="menu-toggle"
                onClick={() => {
                    setMenuOpen((current) => !current);
                    setOpenDropdown(null);
                }}
                aria-label={
                    menuOpen
                        ? t("closeMenu")
                        : t("openMenu")
                }
                aria-expanded={menuOpen}
                aria-controls={navigationId}
            >
                {menuOpen ? (
                    <X size={20} aria-hidden="true" />
                ) : (
                    <Menu size={20} aria-hidden="true" />
                )}
            </button>

            {/* MAIN NAVIGATION */}
            <nav
                id={navigationId}
                className={
                    menuOpen
                        ? "main-nav is-open"
                        : "main-nav"
                }
                aria-label={t("navigation")}
            >
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                    onClick={closeNavigation}
                >
                    {t("home")}
                </NavLink>

                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                    onClick={closeNavigation}
                >
                    {t("about")}
                </NavLink>

                {/* PORTFOLIO DROPDOWN */}
                <div className="product-nav">
                    <button
                        type="button"
                        className={
                            projectActive
                                ? "active product-trigger"
                                : "product-trigger"
                        }
                        onClick={() =>
                            toggleDropdown("portfolio")
                        }
                        aria-expanded={
                            openDropdown === "portfolio"
                        }
                        aria-controls={portfolioId}
                    >
                        {t("portfolio")}

                        <ChevronDown
                            size={12}
                            aria-hidden="true"
                        />
                    </button>

                    <div
                        id={portfolioId}
                        className={
                            openDropdown === "portfolio"
                                ? "product-dropdown is-open"
                                : "product-dropdown"
                        }
                        aria-hidden={
                            openDropdown !== "portfolio"
                        }
                    >
                        <NavLink
                            to="/projects/design"
                            onClick={closeNavigation}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            {t("design")}
                        </NavLink>

                        <NavLink
                            to="/projects/buildings"
                            onClick={closeNavigation}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            {t("buildings")}
                        </NavLink>

                        <NavLink
                            to="/projects/pbg-slf"
                            onClick={closeNavigation}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            {t("pbgSlf")}
                        </NavLink>
                    </div>
                </div>

                {/* PRODUCTS DROPDOWN */}
                <div className="product-nav">
                    <button
                        type="button"
                        className={
                            productActive
                                ? "active product-trigger"
                                : "product-trigger"
                        }
                        onClick={() =>
                            toggleDropdown("products")
                        }
                        aria-expanded={
                            openDropdown === "products"
                        }
                        aria-controls={productsId}
                    >
                        {t("products")}

                        <ChevronDown
                            size={12}
                            aria-hidden="true"
                        />
                    </button>

                    <div
                        id={productsId}
                        className={
                            openDropdown === "products"
                                ? "product-dropdown is-open"
                                : "product-dropdown"
                        }
                        aria-hidden={
                            openDropdown !== "products"
                        }
                    >
                        <NavLink
                            to="/products/design"
                            onClick={closeNavigation}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            {t("design")}
                        </NavLink>

                        <NavLink
                            to="/products/buildings"
                            onClick={closeNavigation}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            {t("buildings")}
                        </NavLink>

                        <NavLink
                            to="/products/pbg-slf"
                            onClick={closeNavigation}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            {t("pbgSlf")}
                        </NavLink>
                    </div>
                </div>
            </nav>

            {/* LANGUAGE SWITCHER */}
            <div
                className="language-switcher"
                role="group"
                aria-label={t("language")}
            >
                <button
                    type="button"
                    className={
                        language === "en" ? "is-active" : ""
                    }
                    aria-label="English"
                    aria-pressed={language === "en"}
                    onClick={() => setLanguage("en")}
                >
                    EN
                </button>

                <span aria-hidden="true">/</span>

                <button
                    type="button"
                    className={
                        language === "id" ? "is-active" : ""
                    }
                    aria-label="Bahasa Indonesia"
                    aria-pressed={language === "id"}
                    onClick={() => setLanguage("id")}
                >
                    ID
                </button>
            </div>
        </header>
    );
}