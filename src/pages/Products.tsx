import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useId,
    type CSSProperties,
    type ReactNode,
    type PointerEvent,
} from "react";

import { Link, useParams } from "react-router-dom";

import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    MessageCircle,
    Search,
    MapPin,
    FileText,
    DraftingCompass,
    Building2,
    Trees,
    Armchair,
    Cable,
    Box,
    Ruler,
    Calculator,
    FileCheck,
    ShoppingCart,
    HardHat,
    ClipboardCheck,
    House,
    Wrench,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import {
    getImageUrl,
    getProducts,
    getProjects,
    getPriceList,
} from "../services/api";

import type {
    ApiProduct,
    ApiProjectsResponse,
} from "../types";

import type { SitePage } from "../components/layout/Header";

type ProductSlug = "design" | "buildings" | "pbg-slf";

type ProductRouteConfig = {
    page: SitePage;
};

const productRoutes: Record<ProductSlug, ProductRouteConfig> = {
    design: {
        page: "desain",
    },
    buildings: {
        page: "building",
    },
    "pbg-slf": {
        page: "pbg-slf",
    },
};

type ProductProject = {
    id: number;
    id_product: number;
    title: string;
    description: string | null;
    thumbnail_path: string | null;
    thumbnail_url: string | null;
    sort_order: number;
};

type PbgProject = {
    id: number;
    id_product: number;
    company_name: string;
    work_area: string | number | null;
    description: string | null;
    logo_path: string | null;
    sort_order: number;
};

type ProjectsApiResponse = ApiProjectsResponse & {
    pbg_projects?: PbgProject[];
};

type PriceCardData = {
    id: number;
    title: string;
    cross_price: string | null;
    real_price: string;
    description: string | null;
    link_order: string | null;
    note: string | null;
};

type RawPriceList = {
    id: number;
    id_product: number;
    title: string;
    cross_price?: string | null;
    real_price?: string | null;
    description?: string | null;
    link_order?: string | null;
    note?: string | null;
};

type BuildingPriceItem = {
    id?: number;
    name?: string;
    price?: string | number | null;
    unit?: string | null;
    width?: string | number | null;
    height?: string | number | null;
    description?: string | null;
    note?: string | null;
};

type BuildingPriceSection = {
    name?: string;
    items?: BuildingPriceItem[];
    children?: BuildingPriceSection[];
};

type BuildingPriceProduct = {
    id: number;
    name_product?: string;
    hero_image?: string | null;
    section_title?: string | null;
    title?: string | null;
    descriptions?: string | null;
    building_price_list_sections?: BuildingPriceSection[];
};

type PriceListResponseData = {
    price_lists: RawPriceList[];
    building_price_lists: BuildingPriceProduct[];
};

type ProductProcessStep = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

type ProductProcessGroup = {
    id: string;
    number: string;
    title: string;
    subtitle: string;
    steps: ProductProcessStep[];
};

type ProductAdvantageItem = {
    number: string;
    title: string;
    tagline: string;
    description: string;
};

type ProductScopeItem = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

const productDescriptions: Record<
    ProductSlug,
    {
        label: string;
        title: string;
        description: string;
    }
> = {
    design: {
        label: "DESIGN",
        title: "Design Your Ideal Space",
        description:
            "Wujudkan ruang impian melalui desain arsitektur yang memadukan estetika, fungsi, dan kenyamanan. Kami membantu mengembangkan ide menjadi perencanaan yang matang dan siap direalisasikan.",
    },
    buildings: {
        label: "BUILDINGS",
        title: "Build Beyond Expectations",
        description:
            "Dari perencanaan hingga pembangunan, kami menghadirkan proses konstruksi yang terarah dengan perhatian pada kualitas, detail, dan hasil akhir sesuai kebutuhan Anda.",
    },
    "pbg-slf": {
        label: "PBG",
        title: "PBG Bukan Sekadar Izin, Tapi Fondasi Legal Bangunan Anda",
        description:
            "Persetujuan Bangunan Gedung (PBG) adalah perizinan yang dikeluarkan oleh pemerintah kepada pemilik bangunan gedung atau perwakilannya untuk memulai pembangunan, renovasi, perawatan, maupun perubahan bangunan sesuai rencana teknis. Melalui Layanan PBG AR4N Group, kami mendampingi Anda sejak tahap awal pengajuan hingga penerbitan PBG, memastikan seluruh rencana teknis memenuhi standar yang ditetapkan dalam peraturan perundang-undangan. PBG hanya dapat diterbitkan apabila rencana teknis bangunan telah melalui proses konsultasi dan pemeriksaan oleh tenaga ahli yang kompeten, baik dari unsur profesional maupun perguruan tinggi.",
    },
};

const designProcessGroups: ProductProcessGroup[] = [
    {
        id: "design-consultation",
        number: "01",
        title: "Tahap Konsultansi",
        subtitle: "Memahami kebutuhan dan kondisi proyek",
        steps: [
            {
                id: "discussion",
                title: "Diskusi",
                description:
                    "Menyampaikan kebutuhan, keinginan, dan rencana proyek.",
                icon: MessageCircle,
            },
            {
                id: "analysis",
                title: "Analisa",
                description:
                    "Mempelajari kebutuhan, fungsi, dan konsep proyek.",
                icon: Search,
            },
            {
                id: "location-survey",
                title: "Survey Lokasi",
                description:
                    "Melihat kondisi lokasi secara langsung.",
                icon: MapPin,
            },
        ],
    },
    {
        id: "design-stage",
        number: "02",
        title: "Tahap Design",
        subtitle: "Proses perencanaan hingga penyerahan dokumen",
        steps: [
            {
                id: "work-agreement",
                title: "Surat Perjanjian Kerja",
                description:
                    "Menetapkan ruang lingkup dan kesepakatan pekerjaan.",
                icon: FileText,
            },
            {
                id: "schematic-design",
                title: "Skematik Desain",
                description:
                    "Menyusun konsep awal dan tata ruang bangunan.",
                icon: DraftingCompass,
            },
            {
                id: "3d-visualization",
                title: "Visualisasi 3D",
                description:
                    "Menampilkan gambaran bentuk dan suasana bangunan.",
                icon: Box,
            },
            {
                id: "working-drawing",
                title: "Gambar Kerja",
                description:
                    "Menyusun gambar teknis sebagai acuan pelaksanaan.",
                icon: Ruler,
            },
            {
                id: "rab-structure",
                title: "Perhitungan RAB & Struktur",
                description:
                    "Menghitung estimasi biaya dan kebutuhan struktur.",
                icon: Calculator,
            },
            {
                id: "document-handover",
                title: "Serah Terima Dokumen",
                description:
                    "Menyerahkan dokumen perencanaan yang telah disepakati.",
                icon: FileCheck,
            },
        ],
    },
];

const buildingsProcessGroups: ProductProcessGroup[] = [
    {
        id: "buildings-consultation",
        number: "01",
        title: "Tahap Konsultansi",
        subtitle: "Memahami kebutuhan dan kondisi proyek",
        steps: [
            {
                id: "discussion",
                title: "Diskusi",
                description:
                    "Menyampaikan kebutuhan dan rencana pembangunan.",
                icon: MessageCircle,
            },
            {
                id: "drawing-analysis",
                title: "Analisa Gambar",
                description:
                    "Mempelajari gambar atau rancangan yang sudah tersedia.",
                icon: Search,
            },
            {
                id: "location-survey",
                title: "Survey Lokasi",
                description:
                    "Melihat kondisi lokasi dan kebutuhan pekerjaan.",
                icon: MapPin,
            },
        ],
    },
    {
        id: "construction-stage",
        number: "02",
        title: "Tahap Pembangunan",
        subtitle: "Pelaksanaan konstruksi hingga pemeliharaan",
        steps: [
            {
                id: "work-agreement",
                title: "Surat Perjanjian Kerja",
                description:
                    "Menetapkan ruang lingkup dan kesepakatan pekerjaan.",
                icon: FileText,
            },
            {
                id: "material-purchasing",
                title: "Pembelanjaan Material",
                description:
                    "Menyiapkan material sesuai kebutuhan pembangunan.",
                icon: ShoppingCart,
            },
            {
                id: "construction-work",
                title: "Pengerjaan Konstruksi",
                description:
                    "Melaksanakan pekerjaan pembangunan di lapangan.",
                icon: HardHat,
            },
            {
                id: "quality-control",
                title: "Quality Control",
                description:
                    "Memeriksa kualitas dan kesesuaian hasil pekerjaan.",
                icon: ClipboardCheck,
            },
            {
                id: "building-handover",
                title: "Serah Terima Bangunan",
                description:
                    "Menyerahkan hasil pembangunan kepada klien.",
                icon: House,
            },
            {
                id: "maintenance-period",
                title: "Masa Pemeliharaan",
                description:
                    "Melakukan pemeliharaan sesuai kesepakatan pekerjaan.",
                icon: Wrench,
            },
        ],
    },
];

const pbgSteps: ProductProcessStep[] = [
    {
        id: "data-collect",
        title: "DATA COLLECT",
        description:
            "As-built Drawing, Soil Test, Dokumen perencanaan kajian SLF (Sertifikat Laik Fungsi).",
        icon: FileText,
    },
    {
        id: "submit-simbg",
        title: "SUBMIT SIM-BG",
        description:
            "Tim akan melakukan submit ke Sistem Informasi Manajemen Bangunan Gedung (SIM-BG).",
        icon: ClipboardCheck,
    },
    {
        id: "sidang-visitasi",
        title: "SIDANG & VISITASI",
        description:
            "Tim dan dari dinas terkait melakukan sidang serta visitasi untuk final cek bangunan.",
        icon: HardHat,
    },
    {
        id: "penerbitan-skrd",
        title: "PENERBITAN SKRD",
        description:
            "Dinas terkait menerbitkan SKRD (Surat Ketetapan Retribusi Daerah).",
        icon: FileCheck,
    },
    {
        id: "pembayaran-retribusi",
        title: "PEMBAYARAN RETRIBUSI",
        description:
            "Pemohon melakukan pembayaran retribusi sesuai SKRD yang telah dikeluarkan oleh dinas terkait.",
        icon: Calculator,
    },
    {
        id: "penerbitan-pbg-slf",
        title: "PENERBITAN PBG & SLF",
        description:
            "Dinas terkait akan menerbitkan PBG setelah melakukan beberapa tahap di atas dan memenuhi klarifikasi sesuai aturan per Undang-undangan.",
        icon: FileCheck,
    },
];

const slfSteps: ProductProcessStep[] = [
    {
        id: "slf-requirements",
        title: "Memastikan Persyaratan Lengkap",
        description:
            "Pertama-tama, Anda harus mengawasi jalannya konstruksi gedung bangunan. Jika jalannya sudah hampir selesai, silakan kumpulkan satu per satu syarat pendaftaran. Ajukan pembuatan Sertifikat Laik Fungsi hanya jika konstruksi gedung bangunan telah terlaksana secara sepenuhnya.",
        icon: ClipboardCheck,
    },
    {
        id: "slf-ptsp",
        title: "Pendaftaran di PTSP",
        description:
            "Pengertian Sertifikat Laik Fungsi yaitu persyaratan yang pemenuhannya diajukan langsung ke loket PTSP yang dilakukan oleh Perwakilan konsultan.",
        icon: MapPin,
    },
    {
        id: "slf-assessment",
        title: "Penilaian Teknis dan Administratif",
        description:
            "Saat persyaratan administrasi sudah dinilai, selanjutnya pengkaji teknis akan datang ke lokasi gedung bangunan Anda guna melaksanakan uji teknis lapangan. Proses ini mungkin memakan waktu yang paling lama, apalagi jika gedung bangunan Anda terbukti perlu direnovasi.",
        icon: Search,
    },
    {
        id: "slf-issued",
        title: "SLF Diterbitkan",
        description:
            "Pemenuhan standar kelaikan fungsi akan berimbas pada Sertifikat Laik Fungsi yang diterbitkan. Tandanya, permohonan yang Anda lakukan mendapatkan respons positif dan tidak perlu melakukan permohonan ulang dari awal.",
        icon: FileCheck,
    },
    {
        id: "slf-collection",
        title: "SLF Diambil di Loket PTSP",
        description:
            "Lekas ambil Sertifikat Laik Fungsi yang telah diterbitkan pada loket PTSP sehingga manfaat sertifikatnya dapat Anda gunakan langsung untuk operasional gedung bangunan. Khusus pemohon yang menggunakan jasa, pengambilan berkas bisa diwakilkan oleh penyedia jasa. Anda cukup menunggu penyedia layanan yang datang mengantarkan Sertifikat Laik Fungsi Anda.",
        icon: FileText,
    },
];

const designAdvantages: ProductAdvantageItem[] = [
    {
        number: "01",
        title: "Pakar Tersertifikasi & Berpengalaman",
        tagline: "Perencanaan berkualitas berawal dari keahlian yang tepat.",
        description:
            "AR4N GROUP didukung oleh arsitek dan tenaga ahli utilitas bangunan bersertifikasi LPJK, serta tergabung dalam asosiasi profesi seperti IAI, PII, dan INTAKINDO. Didukung kompetensi dan pengalaman di lapangan, kami menghadirkan perencanaan yang matang, terukur, dan dapat dipertanggungjawabkan.",
    },
    {
        number: "02",
        title: "Desain dengan Karakter dan Nilai Lebih",
        tagline: "Setiap bangunan memiliki kebutuhan dan karakter tersendiri.",
        description:
            "Kami percaya desain yang baik bukan hanya tentang tampilan, tetapi juga bagaimana sebuah ruang mampu menjawab kebutuhan penggunanya. Setiap proyek dirancang dengan pendekatan khusus, mempertimbangkan karakter bangunan, kebutuhan, serta tujuan bisnis klien. Menghasilkan desain yang fungsional, memiliki identitas, dan bernilai dalam jangka panjang.",
    },
    {
        number: "03",
        title: "Komitmen yang Berlanjut",
        tagline: "Bagi kami, kerja sama tidak berhenti saat desain selesai.",
        description:
            "Mewujudkan sebuah perencanaan membutuhkan proses dan pertimbangan yang matang. Karena itu, AR4N GROUP tetap membuka ruang konsultasi dan pendampingan setelah desain diserahkan. Kami berkomitmen untuk terus mendukung klien agar setiap perencanaan dapat diwujudkan secara optimal.",
    },
    {
        number: "04",
        title: "Investasi Tepat, Kualitas Tetap Terjaga",
        tagline: "Solusi yang sesuai anggaran, tanpa mengesampingkan kualitas.",
        description:
            "Kami memahami bahwa setiap proyek memiliki kebutuhan dan anggaran yang berbeda. Oleh karena itu, kami menawarkan solusi biaya yang fleksibel dan kompetitif, dengan tetap menjaga kualitas desain, ketepatan perencanaan, serta standar profesional. Sehingga, setiap investasi memberikan nilai yang sepadan dengan kebutuhan dan hasil yang diharapkan.",
    },
];

const buildingAdvantages: ProductAdvantageItem[] = [
    {
        number: "01",
        title: "Keahlian Profesional dan Terpercaya",
        tagline: "Didukung tenaga ahli, dirancang dengan standar profesional.",
        description:
            "Setiap perencanaan ditangani oleh tim yang memiliki kompetensi di bidang arsitektur dan utilitas bangunan. Dengan dukungan tenaga ahli bersertifikasi LPJK serta pengalaman di berbagai proyek, AR4N GROUP menghadirkan perencanaan yang matang, terukur, dan dapat dipertanggungjawabkan.",
    },
    {
        number: "02",
        title: "Desain yang Menjawab Kebutuhan",
        tagline: "Bukan hanya menarik secara visual, tetapi tepat secara fungsi.",
        description:
            "Kami memahami bahwa setiap bangunan memiliki kebutuhan yang berbeda. Karena itu, setiap desain dikembangkan dengan mempertimbangkan fungsi ruang, karakter pengguna, kondisi lingkungan, dan tujuan pembangunan. Menghasilkan rancangan yang harmonis antara estetika, kenyamanan, dan efisiensi.",
    },
    {
        number: "03",
        title: "Perencanaan Menyeluruh dan Terintegrasi",
        tagline: "Setiap detail saling terhubung untuk hasil yang lebih optimal.",
        description:
            "Perencanaan bangunan membutuhkan lebih dari sekadar konsep arsitektur. Kami memperhatikan keterkaitan antara desain arsitektur, struktur, dan utilitas bangunan agar setiap elemen dapat bekerja secara selaras. Pendekatan ini membantu meminimalkan ketidaksesuaian dalam proses perencanaan maupun pelaksanaan.",
    },
    {
        number: "04",
        title: "Solusi Fleksibel dan Bernilai",
        tagline: "Perencanaan yang baik harus sejalan dengan kebutuhan dan anggaran.",
        description:
            "Kami menghadirkan solusi perencanaan yang dapat disesuaikan dengan skala proyek dan anggaran klien. Dengan tetap memperhatikan kualitas, efisiensi, dan standar profesional, AR4N GROUP membantu mewujudkan rancangan yang memberikan nilai optimal bagi setiap investasi pembangunan.",
    },
];

const pbgImportance: ProductAdvantageItem[] = [
    {
        number: "01",
        title: "Memastikan Legalitas Pembangunan",
        tagline: "Bangun dengan persetujuan yang jelas, mulai dari perencanaan yang tepat.",
        description:
            "Persetujuan Bangunan Gedung (PBG) merupakan persetujuan dari pemerintah untuk membangun baru, mengubah, memperluas, mengurangi, atau merawat bangunan gedung sesuai standar teknis yang berlaku. Memiliki PBG membantu memastikan bahwa rencana pembangunan telah melalui proses pemeriksaan dan memenuhi ketentuan yang dipersyaratkan.",
    },
    {
        number: "02",
        title: "Menjamin Keselamatan dan Kelayakan Bangunan",
        tagline: "Bangunan yang berdiri harus mampu memberikan rasa aman bagi penggunanya.",
        description:
            "Setiap bangunan perlu memenuhi standar teknis yang mencakup aspek keselamatan, kesehatan, kenyamanan, dan kemudahan. Melalui Sertifikat Laik Fungsi (SLF), kelayakan bangunan dinyatakan setelah dilakukan pemeriksaan terhadap persyaratan teknis sesuai ketentuan yang berlaku.",
    },
    {
        number: "03",
        title: "Memberikan Kepastian dalam Pemanfaatan",
        tagline: "Pastikan bangunan Anda siap digunakan sesuai fungsi dan peruntukannya.",
        description:
            "SLF menjadi bukti bahwa bangunan telah memenuhi persyaratan kelaikan fungsi untuk dimanfaatkan. Hal ini penting bagi pemilik bangunan maupun pelaku usaha agar pemanfaatan bangunan memiliki dasar kelayakan yang jelas dan sesuai dengan ketentuan penyelenggaraan bangunan gedung.",
    },
    {
        number: "04",
        title: "Melindungi Nilai Investasi Bangunan",
        tagline: "Legalitas dan kelayakan merupakan bagian dari nilai sebuah aset.",
        description:
            "Kelengkapan persyaratan administratif dan teknis membantu pemilik bangunan mengelola aset secara lebih terencana. Dengan memperhatikan ketentuan sejak awal, potensi ketidaksesuaian dokumen maupun kondisi teknis bangunan dapat diantisipasi dengan lebih baik.",
    },
];

const pbgWhyChoose: ProductAdvantageItem[] = [
    {
        number: "01",
        title: "Memahami Aspek Teknis Bangunan",
        tagline: "Bukan hanya dokumen, tetapi juga kesesuaian teknis yang diperhatikan.",
        description:
            "Didukung oleh tenaga ahli di bidang arsitektur dan utilitas bangunan, kami memperhatikan berbagai aspek teknis yang menjadi bagian dari persyaratan PBG dan SLF. Mulai dari gambar arsitektur, struktur, hingga sistem utilitas bangunan, setiap elemen diperhatikan sesuai kebutuhan proyek.",
    },
    {
        number: "02",
        title: "Pendampingan Proses yang Terarah",
        tagline: "Setiap tahapan lebih mudah dipahami dan dipersiapkan.",
        description:
            "Kami membantu mengidentifikasi kebutuhan dokumen administratif dan teknis, serta mendampingi proses pengajuan melalui Sistem Informasi Manajemen Bangunan Gedung (SIMBG). Dengan alur kerja yang terstruktur, klien dapat memahami tahapan dan persyaratan yang perlu dipenuhi.",
    },
    {
        number: "03",
        title: "Solusi Sesuai Kondisi Bangunan",
        tagline: "Setiap bangunan membutuhkan pendekatan yang berbeda.",
        description:
            "Baik untuk bangunan baru maupun bangunan eksisting, kami memahami bahwa kebutuhan pengurusannya tidak selalu sama. Karena itu, AR4N GROUP menyesuaikan pendekatan berdasarkan kondisi fisik bangunan, kelengkapan dokumen, fungsi, serta persyaratan teknis yang berlaku.",
    },
    {
        number: "04",
        title: "Komunikasi Transparan dan Profesional",
        tagline: "Informasi yang jelas memberikan kepastian dalam setiap proses.",
        description:
            "Kami mengutamakan komunikasi yang terbuka mengenai kebutuhan dokumen, tahapan pekerjaan, serta hal-hal yang perlu dipersiapkan. Dengan demikian, klien dapat mengikuti proses secara lebih terarah dan memahami perkembangan pekerjaan dengan baik.",
    },
];

const designScopes: ProductScopeItem[] = [
    {
        id: "architecture",
        title: "Desain dan Perencanaan Arsitektur",
        description:
            "Perancangan bangunan, lingkungan, dan kawasan yang mempertimbangkan fungsi, estetika, serta regulasi. Membantu klien menerjemahkan visi bisnis ke dalam desain yang relevan.",
        icon: DraftingCompass,
    },
    {
        id: "structure",
        title: "Desain dan Perencanaan Struktur",
        description:
            "Perencanaan sistem struktur yang stabil, kuat, dan efisien, dengan perhitungan yang matang untuk menjamin keselamatan, ketahanan, dan efektivitas biaya konstruksi.",
        icon: Building2,
    },
    {
        id: "landscape",
        title: "Desain dan Perencanaan Lanskap",
        description:
            "Pengkajian dan perencanaan pemanfaatan lahan untuk mendukung kebutuhan jangka panjang, termasuk aspek keberlanjutan lingkungan dan nilai estetika kawasan.",
        icon: Trees,
    },
    {
        id: "interior",
        title: "Desain dan Perencanaan Interior",
        description:
            "Perencanaan tata letak dan desain ruang dalam yang fungsional, ergonomis, serta selaras dengan identitas bangunan, baik untuk hunian maupun bangunan komersial lainnya.",
        icon: Armchair,
    },
    {
        id: "mechanical-electrical",
        title: "Mekanikal & Elektrikal (M&E)",
        description:
            "Perencanaan sistem mekanikal dan elektrikal yang terintegrasi, efisien energi, dan sesuai standar untuk mendukung operasional bangunan secara optimal.",
        icon: Cable,
    },
];

const buildingScopes: ProductScopeItem[] = [
    {
        id: "exterior-construction",
        title: "Eksterior & Konstruksi Bangunan",
        description:
            "Pelaksanaan pembangunan baru maupun renovasi bangunan, mencakup pekerjaan persiapan, struktur, dinding, atap, fasad, hingga penyelesaian eksterior. Setiap pekerjaan dilaksanakan dengan memperhatikan gambar kerja, kualitas material, dan kebutuhan proyek.",
        icon: HardHat,
    },
    {
        id: "building-interior",
        title: "Interior & Fit-Out Bangunan",
        description:
            "Pengerjaan dan penataan ruang dalam meliputi partisi, plafon, lantai, pelapis dinding, pengecatan, serta finishing interior. Menghadirkan ruang yang nyaman, fungsional, dan siap digunakan sesuai karakter serta kebutuhan penggunanya.",
        icon: House,
    },
    {
        id: "custom-furniture",
        title: "Furniture Custom & Built-In",
        description:
            "Pembuatan dan pemasangan furnitur yang disesuaikan dengan ukuran serta kebutuhan ruang, seperti kitchen set, wardrobe, kabinet, meja kerja, rak penyimpanan, dan elemen built-in lainnya.",
        icon: Armchair,
    },
];

const productScopeDescriptions: Record<
    "design" | "buildings",
    {
        title: string;
        description: string;
        items: ProductScopeItem[];
    }
> = {
    design: {
        title: "Lingkup Layanan Desain & Perencanaan",
        description:
            "Kami memiliki kompetensi menyeluruh dalam menyusun perencanaan teknis dan konseptual untuk berbagai skala dan jenis proyek, meliputi:",
        items: designScopes,
    },
    buildings: {
        title: "Lingkup Layanan Pembangunan & Penataan Bangunan",
        description:
            "Kami menghadirkan solusi pembangunan dan penyelesaian bangunan secara terarah, mulai dari pekerjaan eksterior dan konstruksi hingga pengerjaan interior serta furnitur yang disesuaikan dengan fungsi, karakter, dan kebutuhan setiap ruang.",
        items: buildingScopes,
    },
};

function getCmsMediaUrl(
    path: string | null | undefined
): string | null {
    return getImageUrl(path);
}

function normalizeProductName(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

function isMatchingProduct(
    productName: string,
    slug: ProductSlug
): boolean {
    const name = normalizeProductName(productName);
    switch (slug) {
        case "design":
            return name === "design" || name === "desain";
        case "buildings":
            return name === "building" || name === "buildings";
        case "pbg-slf":
            return name.includes("pbg") && name.includes("slf");
        default:
            return false;
    }
}

function normalizeProjects(
    response: ApiProjectsResponse,
    productId: number
): ProductProject[] {
    return (response.projects ?? [])
        .filter((project) => {
            const currentProductId =
                project.id_product ?? project.product?.id;
            return (
                currentProductId !== null &&
                currentProductId !== undefined &&
                Number(currentProductId) === Number(productId)
            );
        })
        .map((project): ProductProject => ({
            id: project.id,
            id_product: Number(
                project.id_product ?? project.product?.id
            ),
            title: project.title,
            description: project.description ?? null,
            thumbnail_path: project.thumbnail_path ?? null,
            thumbnail_url: getCmsMediaUrl(
                project.thumbnail_url ||
                project.thumbnail_path
            ),
            sort_order: project.sort_order ?? 0,
        }))
        .sort((a, b) => a.sort_order - b.sort_order);
}

function normalizePbgProjects(
    response: ProjectsApiResponse,
    productId: number
): ProductProject[] {
    return (response.pbg_projects ?? [])
        .filter(
            (project) =>
                Number(project.id_product) === Number(productId)
        )
        .map((project): ProductProject => ({
            id: project.id,
            id_product: Number(project.id_product),
            title: project.company_name,
            description: project.description ?? null,
            thumbnail_path: project.logo_path ?? null,
            thumbnail_url: getCmsMediaUrl(project.logo_path),
            sort_order: project.sort_order ?? 0,
        }))
        .sort((a, b) => a.sort_order - b.sort_order);
}

function readPriceListResponse(
    value: unknown
): PriceListResponseData {
    if (
        typeof value !== "object" ||
        value === null
    ) {
        return {
            price_lists: [],
            building_price_lists: [],
        };
    }
    const data = value as Record<string, unknown>;
    return {
        price_lists: Array.isArray(data.price_lists)
            ? data.price_lists as RawPriceList[]
            : [],
        building_price_lists: Array.isArray(
            data.building_price_lists
        )
            ? data.building_price_lists as BuildingPriceProduct[]
            : [],
    };
}

function normalizeStandardPrices(
    response: PriceListResponseData,
    productId: number
): PriceCardData[] {
    return response.price_lists
        .filter(
            (item) =>
                Number(item.id_product) === Number(productId)
        )
        .map((item) => ({
            id: item.id,
            title: item.title,
            cross_price: item.cross_price ?? null,
            real_price: item.real_price ?? "",
            description: item.description ?? null,
            link_order: item.link_order ?? null,
            note: item.note ?? null,
        }));
}

function normalizeBuildingPrices(
    response: PriceListResponseData,
    productId: number
): PriceCardData[] {
    const buildingProduct =
        response.building_price_lists.find(
            (item) => Number(item.id) === Number(productId)
        );
    if (!buildingProduct) {
        return [];
    }
    const result: PriceCardData[] = [];
    let generatedId = 0;
    function collectItems(section: BuildingPriceSection) {
        (section.items ?? []).forEach((item) => {
            const dimensions = [
                item.width,
                item.height,
            ]
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined &&
                        String(value).trim() !== ""
                )
                .join(" × ");
            const description = [
                section.name
                    ? `Kategori: ${section.name}`
                    : "",
                dimensions
                    ? `Ukuran: ${dimensions}`
                    : "",
                item.description ?? "",
            ]
                .filter(Boolean)
                .join("\n");
            result.push({
                id: Number(item.id ?? generatedId++),
                title:
                    item.name ||
                    section.name ||
                    "Item Building",
                cross_price: null,
                real_price: [
                    item.price,
                    item.unit,
                ]
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            String(value).trim() !== ""
                    )
                    .join(" "),
                description: description || null,
                link_order: null,
                note: item.note ?? null,
            });
        });
        (section.children ?? []).forEach(collectItems);
    }
    (
        buildingProduct.building_price_list_sections ?? []
    ).forEach(collectItems);
    return result;
}

function normalizePrices(
    response: unknown,
    product: ApiProduct
): PriceCardData[] {
    const priceData = readPriceListResponse(response);
    if (
        normalizeProductName(product.name_product) === "building"
    ) {
        return normalizeBuildingPrices(
            priceData,
            product.id
        );
    }
    return normalizeStandardPrices(
        priceData,
        product.id
    );
}

function getCarouselPosition(
    index: number,
    activeIndex: number,
    total: number
): number {
    let position = index - activeIndex;
    if (position > total / 2) {
        position -= total;
    }
    if (position < -total / 2) {
        position += total;
    }
    return position;
}

type ProcessConnector = {
    id: string;
    d: string;
    index: number;
};

function AnimatedProcessFlow({
    steps,
}: {
    steps: ProductProcessStep[];
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [connectors, setConnectors] = useState<ProcessConnector[]>([]);
    const markerId = `process-arrow-${useId().replace(/:/g, "")}`;
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container || steps.length <= 1) {
            setConnectors([]);
            return;
        }
        let animationFrame = 0;
        function measureConnectors() {
            const currentContainer = containerRef.current;
            if (!currentContainer) {
                return;
            }
            const containerRect =
                currentContainer.getBoundingClientRect();
            const nextConnectors: ProcessConnector[] = [];
            for (let index = 0; index < steps.length - 1; index++) {
                const currentNode = nodeRefs.current[index];
                const nextNode = nodeRefs.current[index + 1];
                if (!currentNode || !nextNode) {
                    continue;
                }
                const currentRect =
                    currentNode.getBoundingClientRect();
                const nextRect =
                    nextNode.getBoundingClientRect();
                const currentCenterX =
                    currentRect.left +
                    currentRect.width / 2 -
                    containerRect.left;
                const currentCenterY =
                    currentRect.top +
                    currentRect.height / 2 -
                    containerRect.top;
                const nextCenterX =
                    nextRect.left +
                    nextRect.width / 2 -
                    containerRect.left;
                const nextCenterY =
                    nextRect.top +
                    nextRect.height / 2 -
                    containerRect.top;
                const differenceX =
                    nextCenterX - currentCenterX;
                const differenceY =
                    nextCenterY - currentCenterY;
                let path = "";
                if (
                    Math.abs(differenceX) >=
                    Math.abs(differenceY)
                ) {
                    const movingRight = differenceX > 0;
                    const startX = movingRight
                        ? currentRect.right - containerRect.left
                        : currentRect.left - containerRect.left;
                    const startY = currentCenterY;
                    const endX = movingRight
                        ? nextRect.left - containerRect.left
                        : nextRect.right - containerRect.left;
                    const endY = nextCenterY;
                    const curveOffset = Math.max(
                        24,
                        Math.abs(endX - startX) * 0.35
                    );
                    const controlStartX =
                        startX +
                        (movingRight ? curveOffset : -curveOffset);
                    const controlEndX =
                        endX +
                        (movingRight ? -curveOffset : curveOffset);
                    path = [
                        `M ${startX} ${startY}`,
                        `C ${controlStartX} ${startY},`,
                        `${controlEndX} ${endY},`,
                        `${endX} ${endY}`,
                    ].join(" ");
                } else {
                    const movingDown = differenceY > 0;
                    const startX = currentCenterX;
                    const startY = movingDown
                        ? currentRect.bottom - containerRect.top
                        : currentRect.top - containerRect.top;
                    const endX = nextCenterX;
                    const endY = movingDown
                        ? nextRect.top - containerRect.top
                        : nextRect.bottom - containerRect.top;
                    const curveOffset = Math.max(
                        24,
                        Math.abs(endY - startY) * 0.35
                    );
                    const controlStartY =
                        startY +
                        (movingDown ? curveOffset : -curveOffset);
                    const controlEndY =
                        endY +
                        (movingDown ? -curveOffset : curveOffset);
                    path = [
                        `M ${startX} ${startY}`,
                        `C ${startX} ${controlStartY},`,
                        `${endX} ${controlEndY},`,
                        `${endX} ${endY}`,
                    ].join(" ");
                }
                nextConnectors.push({
                    id: `${steps[index].id}-${steps[index + 1].id}`,
                    d: path,
                    index,
                });
            }
            setConnectors(nextConnectors);
        }
        function scheduleMeasure() {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(measureConnectors);
        }
        scheduleMeasure();
        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(scheduleMeasure);
            resizeObserver.observe(container);
            nodeRefs.current.forEach((node) => {
                if (node) {
                    resizeObserver?.observe(node);
                }
            });
        }
        window.addEventListener("resize", scheduleMeasure);
        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver?.disconnect();
            window.removeEventListener("resize", scheduleMeasure);
        };
    }, [steps]);
    return (
        <div
            ref={containerRef}
            className="products-process-flow"
        >
            <svg
                className="products-process-connectors"
                aria-hidden="true"
            >
                <defs>
                    {connectors.map((connector) => (
                        <marker
                            key={connector.id}
                            id={`${markerId}-${connector.index}`}
                            markerWidth="12"
                            markerHeight="12"
                            refX="10"
                            refY="4"
                            orient="auto"
                            markerUnits="userSpaceOnUse"
                            className="products-process-arrowhead"
                            style={{
                                animationDelay:
                                    `${connector.index * 0.65 + 1.0}s`,
                            }}
                        >
                            <path
                                d="M0,0 L0,8 L10,4 z"
                                fill="currentColor"
                            />
                        </marker>
                    ))}
                </defs>
                {connectors.map((connector) => (
                    <path
                        key={connector.id}
                        className="products-process-connector"
                        d={connector.d}
                        pathLength="1"
                        markerEnd={`url(#${markerId}-${connector.index})`}
                        style={{
                            animationDelay:
                                `${connector.index * 0.65 + 0.35}s`,
                        }}
                    />
                ))}
            </svg>
            <div className="products-process-grid">
                {steps.map((step, index) => {
                    const row = Math.floor(index / 3);
                    const column = index % 3;
                    const isReverseRow = row % 2 === 1;
                    const gridColumn = isReverseRow
                        ? 3 - column
                        : column + 1;
                    const StepIcon = step.icon;
                    const stepStyle: CSSProperties = {
                        gridColumn,
                        gridRow: row + 1,
                        animationDelay: `${index * 0.65}s`,
                    };
                    return (
                        <div
                            key={step.id}
                            className="products-process-step"
                            style={stepStyle}
                        >
                            <div
                                ref={(element) => {
                                    nodeRefs.current[index] = element;
                                }}
                                className="products-process-step-content"
                            >
                                <div className="products-process-step-icon">
                                    <StepIcon
                                        size={48}
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="products-process-step-info">
                                    <span className="products-process-step-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="products-process-step-title">
                                        {step.title}
                                    </span>
                                    <span className="products-process-step-description">
                                        {step.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ProductAdvantagesPanel({
    label,
    title,
    description,
    items,
}: {
    label: string;
    title: string;
    description: string;
    items: ProductAdvantageItem[];
}) {
    return (
        <div className="design-advantages-content">
            <div className="design-advantages-heading">
                <span className="products-service-label">{label}</span>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className="design-advantages-grid">
                {items.map((item) => (
                    <article
                        className="design-advantage-card"
                        key={item.number}
                    >
                        <div className="design-advantage-card-top">
                            <span className="design-advantage-number">
                                {item.number}
                            </span>
                            <span className="design-advantage-line" />
                        </div>
                        <h4>{item.title}</h4>
                        <strong>{item.tagline}</strong>
                        <p>{item.description}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}

function ProductScopePanel({
    slug,
}: {
    slug: "design" | "buildings";
}) {
    const content = productScopeDescriptions[slug];
    return (
        <div className="products-scope-content">
            <div className="products-scope-heading">
                <span className="products-service-label">
                    OUR SCOPE OF SERVICES
                </span>
                <h3>{content.title}</h3>
                <p>{content.description}</p>
            </div>
            <div
                className={`products-scope-grid ${
                    slug === "buildings"
                        ? "is-buildings-scope"
                        : "is-design-scope"
                }`}
            >
                {content.items.map((item) => {
                    const ScopeIcon = item.icon;
                    return (
                        <article className="products-scope-card" key={item.id}>
                            <div className="products-scope-icon">
                                <ScopeIcon size={66} strokeWidth={1.7} />
                            </div>
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

function ProductExplanation({
    slug,
}: {
    slug: ProductSlug;
}) {
    const [openDropdowns, setOpenDropdowns] =
        useState<Set<string>>(() => new Set());
    const service = productDescriptions[slug];
    const isCertification = slug === "pbg-slf";
    const stages =
        slug === "design"
            ? designProcessGroups
            : slug === "buildings"
                ? buildingsProcessGroups
                : [];
    const dropdowns = isCertification
        ? [
            {
                id: "pbg",
                number: "01",
                title: "Apa itu PBG?",
                subtitle:
                    "Pengertian, persyaratan, dan tahapan pengurusan PBG",
            },
            {
                id: "slf",
                number: "02",
                title: "Apa itu SLF?",
                subtitle:
                    "Pengertian dan mekanisme pembuatan Sertifikat Laik Fungsi",
            },
            {
                id: "importance",
                number: "03",
                title: "Mengapa Bangunan Anda Membutuhkan PBG & SLF?",
                subtitle:
                    "Memahami pentingnya legalitas dan kelayakan fungsi bangunan",
            },
            {
                id: "why-ar4n",
                number: "04",
                title: "Mengapa Memilih AR4N GROUP untuk Pengurusan PBG & SLF?",
                subtitle:
                    "Pendampingan pengurusan PBG & SLF dengan pendekatan teknis dan profesional",
            },
        ]
        : [
            {
                id: "overview",
                number: "01",
                title: `Apa itu ${service.label}?`,
                subtitle: `Mengenal layanan ${service.label}`,
            },
            ...(stages.length > 0
                ? [
                    {
                        id: "process",
                        number: "02",
                        title: "Tahapan Pengerjaan",
                        subtitle:
                            "Lihat proses pekerjaan dari awal hingga selesai",
                    },
                ]
                : []),
            {
                id: "advantages",
                number: "03",
                title: "Mengapa Memilih AR4N GROUP?",
                subtitle:
                    slug === "buildings"
                        ? "Perencanaan bangunan dengan fungsi, karakter, dan nilai jangka panjang."
                        : "Lebih dari sekadar desain, kami hadir dengan solusi yang tepat.",
            },
            {
                id: "scope",
                number: "04",
                title: "Lingkup Layanan",
                subtitle:
                    slug === "buildings"
                        ? "Ruang lingkup pembangunan, interior, dan furniture"
                        : "Ruang lingkup desain dan perencanaan yang kami kerjakan",
            },
        ];
    function toggleDropdown(id: string) {
        setOpenDropdowns((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }
    return (
        <section className="products-explanation-section page-width">
            <div className="products-explanation-heading">
                <p>OUR SERVICES</p>
                <h2>Explore Our Services</h2>
                <span>
                    Kenali layanan dan proses pekerjaan
                    yang kami tawarkan.
                </span>
            </div>
            <div className="products-explanation-groups">
                {dropdowns.map((dropdown) => {
                    const isOpen = openDropdowns.has(dropdown.id);
                    const panelId = `product-panel-${slug}-${dropdown.id}`;
                    let panelContent: ReactNode;
                    if (isCertification && dropdown.id === "pbg") {
                        panelContent = (
                            <div className="certification-content">
                                <div className="products-service-description">
                                    <span className="products-service-label">
                                        PERSETUJUAN BANGUNAN GEDUNG
                                    </span>
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>
                                </div>
                                <section className="products-process-phase">
                                    <div className="products-process-phase-heading">
                                        <span className="products-process-phase-number">
                                            01
                                        </span>
                                        <div>
                                            <h3>Tahapan Proses PBG</h3>
                                            <p>
                                                Proses pengurusan PBG dari pengumpulan data hingga penerbitan.
                                            </p>
                                        </div>
                                    </div>
                                    <AnimatedProcessFlow
                                        key={`${slug}-pbg`}
                                        steps={pbgSteps}
                                    />
                                </section>
                            </div>
                        );
                    } else if (isCertification && dropdown.id === "slf") {
                        panelContent = (
                            <div className="certification-content">
                                <div className="products-service-description">
                                    <span className="products-service-label">
                                        SERTIFIKAT LAIK FUNGSI
                                    </span>
                                    <h3>Sertifikat Laik Fungsi (SLF)</h3>
                                    <p>
                                        Sertifikat Laik Fungsi (SLF) merupakan sertifikat yang menyatakan bahwa bangunan gedung telah memenuhi persyaratan kelaikan fungsi sebelum dimanfaatkan sesuai peruntukannya.
                                    </p>
                                </div>
                                <section className="products-process-phase">
                                    <div className="products-process-phase-heading">
                                        <span className="products-process-phase-number">
                                            01
                                        </span>
                                        <div>
                                            <h3>Mekanisme Pembuatan SLF</h3>
                                            <p>
                                                Tahapan pengurusan Sertifikat Laik Fungsi dari persiapan persyaratan hingga sertifikat diterbitkan.
                                            </p>
                                        </div>
                                    </div>
                                    <AnimatedProcessFlow
                                        key={`${slug}-slf`}
                                        steps={slfSteps}
                                    />
                                </section>
                            </div>
                        );
                    } else if (isCertification && dropdown.id === "importance") {
                        panelContent = (
                            <ProductAdvantagesPanel
                                label="BUILDING LEGALITY & FUNCTION"
                                title="Mengapa Bangunan Anda Membutuhkan PBG & SLF?"
                                description="Bangunan yang baik bukan hanya tentang bagaimana ia dibangun, tetapi juga bagaimana legalitas dan kelayakan fungsinya terpenuhi. Setiap bangunan memiliki tanggung jawab terhadap keselamatan dan kenyamanan penggunanya. Berdasarkan ketentuan penyelenggaraan bangunan gedung, aspek legalitas dan pemenuhan standar teknis menjadi bagian penting yang perlu diperhatikan, mulai dari tahap perencanaan hingga bangunan siap dimanfaatkan."
                                items={pbgImportance}
                            />
                        );
                    } else if (isCertification && dropdown.id === "why-ar4n") {
                        panelContent = (
                            <ProductAdvantagesPanel
                                label="WHY CHOOSE AR4N GROUP"
                                title="Mengapa Memilih AR4N GROUP untuk Pengurusan PBG & SLF?"
                                description="Lebih dari sekadar mengurus dokumen, kami memahami proses dan aspek teknis yang menjadi bagian penting dari legalitas bangunan Anda. Setiap bangunan memiliki karakteristik, fungsi, dan persyaratan yang berbeda. AR4N GROUP hadir untuk membantu memahami kebutuhan tersebut melalui pendekatan yang terarah, mulai dari penyiapan dokumen hingga pendampingan proses pengajuan sesuai ketentuan yang berlaku."
                                items={pbgWhyChoose}
                            />
                        );
                    } else if (dropdown.id === "overview") {
                        panelContent = (
                            <div className="products-service-description">
                                <span className="products-service-label">
                                    {service.label}
                                </span>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        );
                    } else if (dropdown.id === "advantages") {
                        panelContent = (
                            <ProductAdvantagesPanel
                                label="WHY CHOOSE AR4N GROUP"
                                title={
                                    slug === "buildings"
                                        ? "Mengapa Memilih AR4N GROUP untuk Perencanaan Bangunan?"
                                        : "Mengapa Memilih AR4N GROUP sebagai Mitra Perencanaan?"
                                }
                                description={
                                    slug === "buildings"
                                        ? "Kami tidak sekadar merancang bangunan, tetapi menghadirkan ruang yang memiliki fungsi, karakter, dan nilai jangka panjang."
                                        : "Lebih dari sekadar desain, kami hadir dengan solusi yang tepat."
                                }
                                items={slug === "buildings" ? buildingAdvantages : designAdvantages}
                            />
                        );
                    } else if (dropdown.id === "scope" && !isCertification) {
                        panelContent = (
                            <ProductScopePanel slug={slug as "design" | "buildings"} />
                        );
                    } else {
                        panelContent = (
                            stages.map((stage) => (
                                <section
                                    key={stage.id}
                                    className="products-process-phase"
                                >
                                    <div className="products-process-phase-heading">
                                        <span className="products-process-phase-number">
                                            {stage.number}
                                        </span>
                                        <div>
                                            <h3>{stage.title}</h3>
                                            <p>{stage.subtitle}</p>
                                        </div>
                                    </div>
                                    <AnimatedProcessFlow
                                        key={`${slug}-${stage.id}`}
                                        steps={stage.steps}
                                    />
                                </section>
                            ))
                        );
                    }
                    return (
                        <div
                            key={dropdown.id}
                            className={`products-explanation-group ${
                                isOpen ? "is-open" : ""
                            } ${
                                ["03", "04"].includes(dropdown.number)
                                    ? "is-fade-dropdown"
                                    : ""
                            } ${
                                dropdown.id === "overview" &&
                                (slug === "design" || slug === "buildings")
                                    ? "is-fade-overview"
                                    : ""
                            }`}
                        >
                            <button
                                type="button"
                                className="products-explanation-toggle"
                                onClick={() => toggleDropdown(dropdown.id)}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                            >
                                <span className="products-explanation-number">
                                    {dropdown.number}
                                </span>
                                <span className="products-explanation-title-wrap">
                                    <strong className="products-explanation-title">
                                        {dropdown.title}
                                    </strong>
                                    <span className="products-explanation-subtitle">
                                        {dropdown.subtitle}
                                    </span>
                                </span>
                                <span className="products-explanation-toggle-icon">
                                    <ChevronDown size={22} strokeWidth={1.7} />
                                </span>
                            </button>
                            {isOpen && (
                                <div
                                    id={panelId}
                                    className="products-explanation-panel"
                                >
                                    {panelContent}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function ProductPriceCard({
    item,
    index,
}: {
    item: PriceCardData;
    index: number;
}) {
    const orderUrl =
        item.link_order ||
        `mailto:hello@arangroup.id?subject=${encodeURIComponent(
            `Order ${item.title}`
        )}`;
    return (
        <article
            className="products-price-card"
            style={{
                animationDelay: `${Math.min(index * 100, 500)}ms`,
            }}
        >
            <div className="products-price-card-head">
                <span className="products-price-number">
                    {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <span className="products-price-line" />
            </div>
            {item.cross_price && (
                <div className="products-old-price">
                    {item.cross_price}
                </div>
            )}
            <div className="products-real-price">
                {item.real_price || "Hubungi kami"}
            </div>
            <div className="products-price-description">
                {item.description}
            </div>
            {item.note && (
                <p className="products-price-note">
                    {item.note}
                </p>
            )}
            <a
                className="products-order-button"
                href={orderUrl}
                target={item.link_order ? "_blank" : undefined}
                rel={
                    item.link_order
                        ? "noopener noreferrer"
                        : undefined
                }
            >
                ORDER PACKAGE
                <ArrowUpRight size={15} />
            </a>
        </article>
    );
}

export default function Products() {
    const { slug } = useParams();
    const productSlug = slug as ProductSlug;
    const config = productRoutes[productSlug];
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [heroImagePath, setHeroImagePath] =
        useState<string | null>(null);
    const [projects, setProjects] = useState<ProductProject[]>([]);
    const [priceCards, setPriceCards] = useState<PriceCardData[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselStep, setCarouselStep] = useState(155);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pointerStartX = useRef<number | null>(null);
    useEffect(() => {
        function updateCarouselStep() {
            if (window.innerWidth <= 640) {
                setCarouselStep(88);
            } else if (window.innerWidth <= 900) {
                setCarouselStep(120);
            } else {
                setCarouselStep(155);
            }
        }
        updateCarouselStep();
        window.addEventListener("resize", updateCarouselStep);
        return () => {
            window.removeEventListener("resize", updateCarouselStep);
        };
    }, []);
    useEffect(() => {
        if (!config) {
            setLoading(false);
            setError("Kategori produk tidak ditemukan.");
            return;
        }
        let active = true;
        async function loadProductData() {
            try {
                setLoading(true);
                setError(null);
                const [
                    productsResponse,
                    projectsResponse,
                    priceResponse,
                ] = await Promise.all([
                    getProducts(),
                    getProjects(),
                    getPriceList(),
                ]);
                if (!active) {
                    return;
                }
                const selectedProduct =
                    productsResponse.find((item) =>
                        isMatchingProduct(
                            item.name_product,
                            productSlug
                        )
                    ) ?? null;
                setProduct(selectedProduct);
                const priceListData =
                    readPriceListResponse(priceResponse);
                const pricelistProduct = selectedProduct
                    ? priceListData.building_price_lists.find(
                        (item) =>
                            Number(item.id) ===
                            Number(selectedProduct.id)
                    )
                    : null;
                setHeroImagePath(
                    pricelistProduct?.hero_image ?? null
                );
                if (selectedProduct) {
                    const projectData =
                        projectsResponse as ProjectsApiResponse;
                    const productProjects =
                        productSlug === "pbg-slf"
                            ? normalizePbgProjects(
                                projectData,
                                selectedProduct.id
                            )
                            : normalizeProjects(
                                projectsResponse,
                                selectedProduct.id
                            );
                    setProjects(productProjects);
                    setPriceCards(
                        normalizePrices(
                            priceResponse,
                            selectedProduct
                        )
                    );
                } else {
                    setProjects([]);
                    setPriceCards([]);
                }
                setActiveIndex(0);
            } catch (reason) {
                if (!active) {
                    return;
                }
                setError(
                    reason instanceof Error
                        ? reason.message
                        : "Gagal mengambil data Products."
                );
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }
        loadProductData();
        return () => {
            active = false;
        };
    }, [slug]);
    function moveCarousel(direction: number) {
        if (projects.length <= 1) {
            return;
        }
        setActiveIndex((current) => (
            current + direction + projects.length
        ) % projects.length);
    }
    function handlePointerDown(
        event: PointerEvent<HTMLDivElement>
    ) {
        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }
        pointerStartX.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
    }
    function handlePointerUp(
        event: PointerEvent<HTMLDivElement>
    ) {
        if (pointerStartX.current === null) {
            return;
        }
        const distance =
            pointerStartX.current - event.clientX;
        if (Math.abs(distance) > 45) {
            moveCarousel(distance > 0 ? 1 : -1);
        }
        pointerStartX.current = null;
    }
    function handlePointerCancel() {
        pointerStartX.current = null;
    }
    if (!config) {
        return (
            <MainLayout page="about">
                <main className="page-width section-pad">
                    <h1>Halaman Products tidak ditemukan.</h1>
                </main>
            </MainLayout>
        );
    }
    if (loading) {
        return (
            <MainLayout page={config.page}>
                <main className="products-loading">
                    <span className="products-loading-indicator" />
                    <p>Memuat data Products...</p>
                </main>
            </MainLayout>
        );
    }
    if (error) {
        return (
            <MainLayout page={config.page}>
                <main className="page-width section-pad products-error">
                    <h2>Konten belum dapat dimuat</h2>
                    <p>{error}</p>
                    <button
                        className="outline-button"
                        onClick={() => window.location.reload()}
                    >
                        Coba lagi
                    </button>
                </main>
            </MainLayout>
        );
    }
    const heroImage = getImageUrl(heroImagePath);
    return (
        <MainLayout page={config.page} headerOverlay>
            <main className="products-page">
                <section className="products-hero inner-hero">
                    {heroImage && (
                        <img
                            src={heroImage}
                            alt={
                                product?.name_product ??
                                "AR4N Group Products"
                            }
                        />
                    )}
                    <div className="inner-hero-shade" />
                    <h1>Our Works</h1>
                </section>
                <section className="products-dark-section">
                    <section className="products-project-section page-width">
                        <div className="products-project-heading">
                            <p>
                                Berikut adalah beberapa Project yang
                                sudah kami selesaikan
                            </p>
                        </div>
                        {projects.length > 0 ? (
                            <div className="products-carousel">
                                {projects.length > 1 && (
                                    <button
                                        className="products-carousel-arrow products-carousel-prev"
                                        onClick={() => moveCarousel(-1)}
                                        aria-label="Previous project"
                                    >
                                        <ChevronLeft size={58} />
                                    </button>
                                )}
                                <div
                                    className={`products-carousel-stage ${
                                        productSlug === "pbg-slf" ? "is-pbg-carousel" : ""
                                    }`}
                                    onPointerDown={handlePointerDown}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerCancel}
                                    onDragStart={(event) =>
                                        event.preventDefault()
                                    }
                                >
                                    {projects.map((project, index) => {
                                        const position =
                                            getCarouselPosition(
                                                index,
                                                activeIndex,
                                                projects.length
                                            );
                                        const distance = Math.abs(position);
                                        if (distance > 2) {
                                            return null;
                                        }
                                        const scale =
                                            distance === 0
                                                ? 1
                                                : distance === 1
                                                    ? 0.9
                                                    : 0.76;
                                        const style: CSSProperties = {
                                            transform:
                                                `translate(-50%, -50%) ` +
                                                `translateX(${position * carouselStep}px) ` +
                                                `translateY(${distance * 12}px) ` +
                                                `scale(${scale}) ` +
                                                `rotateY(${-position * 10}deg)`,
                                            zIndex: 10 - distance,
                                            animationDelay:
                                                `${distance * 100}ms`,
                                        };
                                        const thumbnail =
                                            getCmsMediaUrl(
                                                project.thumbnail_url ||
                                                project.thumbnail_path
                                            );
                                        return (
                                            <div
                                                key={project.id}
                                                className={`products-project-card ${
                                                    distance === 0 ? "is-active" : "is-side"
                                                } ${productSlug === "pbg-slf" ? "is-pbg-logo" : ""}`}
                                                style={style}
                                                aria-label={project.title}
                                            >
                                                {productSlug === "pbg-slf" ? (
                                                    <>
                                                        <div className="products-project-logo-circle">
                                                            {thumbnail ? (
                                                                <img
                                                                    src={thumbnail}
                                                                    alt={`Logo ${project.title}`}
                                                                    className="products-project-logo-image"
                                                                    draggable={false}
                                                                />
                                                            ) : (
                                                                <span className="products-project-placeholder" />
                                                            )}
                                                        </div>
                                                        <span className="products-project-logo-name">
                                                            {project.title?.trim() || "Nama perusahaan belum tersedia"}
                                                        </span>
                                                    </>
                                                ) : thumbnail ? (
                                                    <img
                                                        src={thumbnail}
                                                        alt={project.title}
                                                        draggable={false}
                                                    />
                                                ) : (
                                                    <span className="products-project-placeholder" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {projects.length > 1 && (
                                    <button
                                        className="products-carousel-arrow products-carousel-next"
                                        onClick={() => moveCarousel(1)}
                                        aria-label="Next project"
                                    >
                                        <ChevronRight size={58} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="products-project-empty">
                                Belum ada project untuk kategori ini.
                            </div>
                        )}
                        <div className="products-more-projects-wrap">
                            <Link
                                to={`/projects/${slug}`}
                                className="products-more-projects-button"
                            >
                                <span className="products-more-projects-text">
                                    EXPLORE PROJECTS
                                </span>
                                <span className="products-more-projects-arrow">
                                    <ArrowUpRight size={17} />
                                </span>
                            </Link>
                        </div>
                    </section>
                    <ProductExplanation
                        key={productSlug}
                        slug={productSlug}
                    />
                    <section className="products-price-section page-width">
                        <div className="products-price-heading">
                            <p>
                                {product?.section_title || "PRICE LIST"}
                            </p>
                            <h2>
                                {product?.title || "Paket Jasa"}
                            </h2>
                            <div>
                                {product?.descriptions}
                            </div>
                        </div>
                        {priceCards.length > 0 ? (
                            <div className="products-price-grid">
                                {priceCards.map((item, index) => (
                                    <ProductPriceCard
                                        key={item.id}
                                        item={item}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="products-price-empty">
                                Belum ada pricelist untuk kategori ini.
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </MainLayout>
    );
}
