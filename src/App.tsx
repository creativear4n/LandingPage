import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";

import { updatePageSeo } from "./utils/seo";
import MainLayout from "./components/layout/MainLayout";
import { useEffect, useRef, useState } from "react";
import IntroAnimation from "./components/IntroAnimation";

import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";

import Projects, {
    ProjectDetail,
} from "./pages/Projects";


function NotFound() {
    const { pathname } = useLocation();

    useEffect(() => {
        updatePageSeo({
            title: "404 | Halaman Tidak Ditemukan - AR4N Group",
            description:
                "Halaman yang Anda cari tidak ditemukan di website AR4N Group.",
            path: pathname,
            robots: "noindex,follow",
            breadcrumbs: [],
        });
    }, [pathname]);

    return (
        <MainLayout page="about">
            <section className="page-width section-pad">
                <h1>404</h1>
                <p>Halaman tidak ditemukan.</p>
            </section>
        </MainLayout>
    );
}

function AppContent() {
    const [showIntro, setShowIntro] = useState(false);
    const introChecked = useRef(false);

    useEffect(() => {
        // Mencegah pemeriksaan ganda React StrictMode
        if (introChecked.current) return;
        introChecked.current = true;

        const introKey = "ar4n_intro_last_seen";

        // Menggunakan tanggal lokal perangkat pengunjung
        const now = new Date();
        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-");

        const lastSeen = sessionStorage.getItem(introKey);

        if (lastSeen !== today) {
            setShowIntro(true);
            sessionStorage.setItem(introKey, today);
        }
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/about" element={<About />} />

                <Route
                    path="/products"
                    element={
                        <Navigate
                            to="/products/design"
                            replace
                        />
                    }
                />

                <Route
                    path="/products/:slug"
                    element={<Products />}
                />

                <Route
                    path="/projects"
                    element={
                        <Navigate
                            to="/projects/design"
                            replace
                        />
                    }
                />

                <Route
                    path="/projects/:category/:projectId"
                    element={<ProjectDetail />}
                />

                <Route
                    path="/projects/:category"
                    element={<Projects />}
                />

                <Route
                    path="/desain"
                    element={
                        <Navigate
                            to="/products/design"
                            replace
                        />
                    }
                />

                <Route
                    path="/building"
                    element={
                        <Navigate
                            to="/products/buildings"
                            replace
                        />
                    }
                />

                <Route
                    path="/pbg-slf"
                    element={
                        <Navigate
                            to="/products/pbg-slf"
                            replace
                        />
                    }
                />

                <Route
                    path="/works"
                    element={
                        <Navigate
                            to="/projects/design"
                            replace
                        />
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Global Intro Animation */}
            {showIntro && (
                <IntroAnimation
                    onComplete={() => setShowIntro(false)}
                />
            )}
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
