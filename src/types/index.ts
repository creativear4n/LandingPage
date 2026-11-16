export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiDashboard {
    id: number;
    hero_image: string | null;
    hero_image_url?: string | null;
    link_contact: string;
    title_about: string;
    description_about: string;
    count_about: string;
    years_about: string;
    percent_about: string;
    title_home: string;
    subtitle_home: string;
    description_home: string;
    image_home: string | null;
    image_home_url?: string | null;
    descbutton_home: string;
    linkbutton_home?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ApiAboutUs {
    id: number;
    profile_title: string;
    description: string;
    philosophy: string;
    award: string;
    exhibition: string;
    team: string;
    people: string;
    hero_image: string | null;
    hero_image_url?: string | null;
    profile_image: string | null;
    profile_image_url?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ApiWork {
    id: number;
    hero_image: string | null;
    hero_image_url?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ApiProjectCategory {
    id: number;
    name: string;
    description: string | null;
}

export interface ApiProjectImage {
    id: number;
    id_project: number;
    image_path: string;
    image_url?: string | null;
    sort_order: number;
}

export interface ApiProject {
    id: number;
    id_product?: number | null;
    id_project_category: number;
    title: string;
    description: string | null;
    thumbnail_path?: string | null;
    thumbnail_url?: string | null;
    sort_order?: number;
    product?: {
        id: number;
        name_product: string;
    } | null;
    category?: ApiProjectCategory | null;
    images?: ApiProjectImage[];
}

export interface ApiProjectsResponse {
    categories: ApiProjectCategory[];
    projects: ApiProject[];
    pbg_projects?: ApiPbgProject[];
}

export interface ApiProduct {
    id: number;
    sort_order: number;
    name_product: string;
    hero_image: string | null;
    hero_image_url?: string | null;
    section_title: string;
    title: string;
    descriptions: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ApiPriceList {
    id: number;
    id_product: number;
    title: string;
    cross_price: string | null;
    real_price: string;
    description: string | null;
    link_order: string | null;
    note: string | null;
    product?: {
        id: number;
        name_product: string;
    };
}

export interface ApiBuildingPriceItem {
    id: number;
    id_section: number;
    name: string;
    width: string | null;
    height: string | null;
    price: string;
    unit: string | null;
    note: string | null;
    sort_order: number;
}

export interface ApiBuildingPriceSection {
    id: number;
    id_product: number;
    parent_id: number | null;
    name: string;
    description: string | null;
    sort_order: number;
    children: ApiBuildingPriceSection[];
    items: ApiBuildingPriceItem[];
}

export interface ApiBuildingProduct extends ApiProduct {
    building_price_list_sections: ApiBuildingPriceSection[];
}

export interface ApiPriceListResponse {
    price_lists: ApiPriceList[];
    building_price_lists: ApiBuildingProduct[];
}

export interface ApiProjectsResponse {
    categories: ApiProjectCategory[];
    projects: ApiProject[];
}

export interface Dashboard {
    id: number;
    hero_image_url: string | null;
    link_contact: string;
    title_about: string;
    description_about: string;
    count_about: string;
    years_about: string;
    percent_about: string;
    title_home: string;
    subtitle_home: string;
    description_home: string;
    image_home_url: string | null;
    descbutton_home: string;
    linkbutton_home: string;
}

export interface AboutUs {
    id: number;
    profile_title: string;
    description: string;
    philosophy: string;
    award: string;
    exhibition: string;
    team: string;
    people: string;
    hero_image_url: string | null;
    profile_image_url: string | null;
}

export interface Work {
    id: number;
    hero_image: string | null;
    hero_image_url: string | null;
}

export interface ProjectCategory {
    id: number;
    name: string;
    description: string | null;
}

export interface ProjectImage {
    id: number;
    id_project: number;
    image_path: string;
    image_url: string;
    sort_order: number;
}

export interface Project {
    id: number;
    id_project_category: number;
    title: string;
    description: string | null;
    category: ProjectCategory | null;
    images: ProjectImage[];
}

export interface ProductPriceData {
    id: number;
    id_product: number;
    title: string;
    cross_price: string | null;
    real_price: string;
    description: string | null;
    link_order: string | null;
    note: string | null;
}

export interface ProductPageData {
    id: number;
    name_product: string;
    hero_image: string | null;
    hero_image_url: string | null;
    section_title: string;
    title: string;
    descriptions: string | null;
    price_lists: ProductPriceData[];
}

export interface ApiTestimonial {
    id: number;
    title: string;
    description: string;
    author_name: string;
    author_position: string | null;
    thumbnail_path: string | null;
    thumbnail_url: string | null;
    video_path: string | null;
    video_url: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface ApiPbgProject {
    id: number;
    id_product?: number | null;
    company_name: string;
    work_area: number | string | null;
    description: string | null;
    logo_path: string | null;
    sort_order?: number;
    product?: {
        id: number;
        name_product: string;
    } | null;
}