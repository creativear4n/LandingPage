import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    const apiTarget =
        env.VITE_DEV_API_PROXY_TARGET ||
        "http://127.0.0.1:8001";

    return {
        plugins: [react()],

        server: {
            host: "0.0.0.0",

            proxy: {
                "/api": {
                    target: apiTarget,
                    changeOrigin: true,
                },

                "/storage": {
                    target: apiTarget,
                    changeOrigin: true,
                },

                "/cms-media": {
                    target: apiTarget,
                    changeOrigin: true,
                }
            },
        },
    };
});