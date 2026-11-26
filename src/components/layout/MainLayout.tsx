import type { ReactNode } from "react";
import Header, { type SitePage } from "./Header";
import Footer from "./Footer";
import WhatsAppWidget from "./WhatsAppWidget";

interface MainLayoutProps {
    page: SitePage;
    children: ReactNode;
    headerOverlay?: boolean;
}

export default function MainLayout({
    page,
    children,
    headerOverlay = false,
}: MainLayoutProps) {
    return (
        <div className="site-shell">
            {page !== "home" && (
                headerOverlay ? (
                    <div className="site-header-overlay">
                        <Header page={page} />
                    </div>
                ) : (
                    <Header page={page} />
                )
            )}

            <main id="main-content">
                {children}
            </main>

            <div id="contact">
                <Footer />
            </div>

            <WhatsAppWidget />
        </div>
    );
}