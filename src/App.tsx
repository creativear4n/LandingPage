
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import { useState } from "react";
import IntroAnimation from "./components/IntroAnimation";

import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";

import Projects, {
    ProjectDetail,
} from "./pages/Projects";

function HomeWithIntro() {
    const [showIntro, setShowIntro] = useState(true);

    return (
        <>
            <Home />
            {showIntro && (
                <IntroAnimation onComplete={() => setShowIntro(false)} />
            )}
        </>
    );
}

function NotFound() {
    return (
        <MainLayout page="about">
            <main className="page-width section-pad">
                <h1>404</h1>
                <p>Halaman tidak ditemukan.</p>
            </main>
        </MainLayout>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeWithIntro />} />

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
        </BrowserRouter>
    );
}
