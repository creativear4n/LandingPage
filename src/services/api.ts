import type {
    ApiResponse,
    ApiDashboard,
    ApiAboutUs,
    ApiWork,
    ApiProduct,
    ApiPriceListResponse,
    ApiProjectsResponse,
    ApiTestimonial,
} from "../types";

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "/api/v1"
).replace(/\/+$/, "");

const API_ORIGIN = new URL(
    API_BASE_URL,
    window.location.origin
).origin;

const ASSET_BASE_URL = (
    import.meta.env.VITE_ASSET_BASE_URL ||
    `${API_ORIGIN}/cms-media`
).replace(/\/+$/, "");

// ========================================
// FRONTEND MEMORY CACHE
// ========================================

const API_CACHE_TTL_MS = 60 * 1000;

type ApiCacheEntry = {
    data: unknown;
    expiresAt: number;
};

const apiResponseCache = new Map<string, ApiCacheEntry>();

// Menampung request yang masih berjalan agar tidak
// terjadi request ganda ke endpoint yang sama.
const pendingApiRequests = new Map<string, Promise<unknown>>();

// Hapus cache secara manual jika diperlukan.
export function clearApiCache(endpoint?: string): void {
    if (!endpoint) {
        apiResponseCache.clear();
        return;
    }

    const normalizedEndpoint = endpoint.replace(/^\/+/, "");
    const requestUrl = `${API_BASE_URL}/${normalizedEndpoint}`;

    apiResponseCache.delete(requestUrl);
}

// ========================================
// API FETCH WITH MEMORY CACHE
// ========================================

function fetchApi<T>(endpoint: string): Promise<T> {
    const normalizedEndpoint = endpoint.replace(/^\/+/, "");
    const requestUrl = `${API_BASE_URL}/${normalizedEndpoint}`;

    // 1. Periksa cache terlebih dahulu.
    const cached = apiResponseCache.get(requestUrl);

    if (cached) {
        if (cached.expiresAt > Date.now()) {
            return Promise.resolve(cached.data as T);
        }

        // Hapus cache yang sudah kedaluwarsa.
        apiResponseCache.delete(requestUrl);
    }

    // 2. Gunakan request yang sedang berjalan jika ada.
    const pendingRequest = pendingApiRequests.get(requestUrl);

    if (pendingRequest) {
        return pendingRequest as Promise<T>;
    }

    // 3. Jalankan request baru.
    const request = (async (): Promise<T> => {
        const response = await fetch(requestUrl, {
            method: "GET",
            cache: "default",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Gagal mengambil ${endpoint}: HTTP ${response.status}`
            );
        }

        const result: ApiResponse<T> = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || `API ${endpoint} gagal diproses`
            );
        }

        // 4. Simpan hanya respons yang berhasil.
        apiResponseCache.set(requestUrl, {
            data: result.data,
            expiresAt: Date.now() + API_CACHE_TTL_MS,
        });

        return result.data;
    })().finally(() => {
        // Request selesai, hapus dari daftar request aktif.
        pendingApiRequests.delete(requestUrl);
    });

    pendingApiRequests.set(requestUrl, request);

    return request;
}

// ========================================
// IMAGE URL
// ========================================

export function getImageUrl(
    path: string | null | undefined
): string | null {
    if (!path) {
        return null;
    }

    const cleanPath = path.trim();

    if (!cleanPath) {
        return null;
    }

    // Pertahankan URL eksternal.
    if (/^(https?:)?\/\//i.test(cleanPath)) {
        return cleanPath;
    }

    const normalizedPath = cleanPath.replace(/^\/+/, "");

    // Path lama yang menggunakan Laravel public storage.
    if (normalizedPath.startsWith("storage/")) {
        return `${API_ORIGIN}/${normalizedPath}`;
    }

    // Hindari penambahan prefix dua kali.
    if (normalizedPath.startsWith("cms-media/")) {
        return `${API_ORIGIN}/${normalizedPath}`;
    }

    // Media hasil upload CMS.
    return `${ASSET_BASE_URL}/${normalizedPath}`;
}

// ========================================
// API ENDPOINTS
// ========================================

export function getDashboard(): Promise<ApiDashboard | null> {
    return fetchApi<ApiDashboard | null>("dashboard");
}

export function getAboutUs(): Promise<ApiAboutUs | null> {
    return fetchApi<ApiAboutUs | null>("about-us");
}

export function getWork(): Promise<ApiWork | null> {
    return fetchApi<ApiWork | null>("works");
}

export function getProducts(): Promise<ApiProduct[]> {
    return fetchApi<ApiProduct[]>("products");
}

export function getPriceList(): Promise<ApiPriceListResponse> {
    return fetchApi<ApiPriceListResponse>("pricelist");
}

export function getProjects(): Promise<ApiProjectsResponse> {
    return fetchApi<ApiProjectsResponse>("projects");
}

export function getTestimonials(): Promise<ApiTestimonial[]> {
    return fetchApi<ApiTestimonial[]>("testimonials");
}

// ========================================
// LANDING PAGE DATA
// ========================================

export async function getLandingPageApiData() {
    const [
        dashboard,
        aboutUs,
        work,
        products,
        priceList,
        projects,
        testimonials,
    ] = await Promise.all([
        getDashboard(),
        getAboutUs(),
        getWork(),
        getProducts(),
        getPriceList(),
        getProjects(),
        getTestimonials(),
    ]);

    return {
        dashboard,
        aboutUs,
        work,
        products,
        priceList,
        projects,
        testimonials,
    };
}
