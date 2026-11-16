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

async function fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(
        `${API_BASE_URL}/${endpoint}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

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

    return result.data;
}

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

export async function getDashboard(): Promise<ApiDashboard | null> {
    return fetchApi<ApiDashboard | null>("dashboard");
}

export async function getAboutUs(): Promise<ApiAboutUs | null> {
    return fetchApi<ApiAboutUs | null>("about-us");
}

export async function getWork(): Promise<ApiWork | null> {
    return fetchApi<ApiWork | null>("works");
}

export async function getProducts(): Promise<ApiProduct[]> {
    return fetchApi<ApiProduct[]>("products");
}

export async function getPriceList(): Promise<ApiPriceListResponse> {
    return fetchApi<ApiPriceListResponse>("pricelist");
}

export async function getProjects(): Promise<ApiProjectsResponse> {
    return fetchApi<ApiProjectsResponse>("projects");
}

export async function getTestimonials(): Promise<ApiTestimonial[]> {
    return fetchApi<ApiTestimonial[]>("testimonials");
}

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
