import { useState } from "react";
import {
    MessageCircle,
    X,
} from "lucide-react";

export default function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const whatsappUrl =
        "https://wa.me/6285220469776?text=Halo%20ARAN%20Group%2C%20saya%20ingin%20konsultasi.";

    return (
        <div className="whatsapp-widget">
            <div
                className={
                    isOpen
                        ? "whatsapp-card is-open"
                        : "whatsapp-card"
                }
            >
                <div className="whatsapp-card-top">
                    <div className="whatsapp-avatar">
                        <img
                            src="/assets/smallLogo.png"
                            alt="AR4N Group"
                            className="h-[33px] w-[30px]"
                        />
                    </div>

                    <div>
                        <strong>AR4N GROUP</strong>
                        <span>ONLINE</span>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close WhatsApp message"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="whatsapp-message">
                    <span className="whatsapp-mini-avatar">
                        <span />
                    </span>

                    <p>
                        Halo, hari ini ada yang bisa kami bantu?
                        Silakan konsultasikan kebutuhan bangunan Anda.
                    </p>
                </div>

                <a
                    className="whatsapp-reply"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MessageCircle size={16} />
                    Balas
                </a>
            </div>

            <button
                className="whatsapp-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={
                    isOpen
                        ? "Close WhatsApp chat"
                        : "Open WhatsApp chat"
                }
            >
                {isOpen ? (
                    <>
                        <X size={21} />
                        <span>Tutup</span>
                    </>
                ) : (
                    <>
                        <MessageCircle size={24} />
                        <span>Chat WhatsApp</span>
                    </>
                )}
            </button>
        </div>
    );
}