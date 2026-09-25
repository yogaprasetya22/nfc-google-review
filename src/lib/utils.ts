import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Konversi CID / Data Hex Google Maps ke Place ID (ChIJ...) secara langsung
export function convertHexToPlaceId(
    hex1Str: string,
    hex2Str: string,
): string | null {
    try {
        const h1 = BigInt(hex1Str);
        const h2 = BigInt(hex2Str);

        const buf = new Uint8Array(21);
        buf[0] = 0x0a; // protobuf tag: string field 1
        buf[1] = 0x12; // length: 18 bytes
        buf[2] = 0x09; // tag 1: fixed64

        // pack h1 little-endian (8 bytes)
        let temp1 = h1;
        for (let i = 0; i < 8; i++) {
            buf[3 + i] = Number(temp1 & 0xffn);
            temp1 >>= 8n;
        }

        buf[11] = 0x11; // tag 2: fixed64

        // pack h2 little-endian (8 bytes)
        let temp2 = h2;
        for (let i = 0; i < 8; i++) {
            buf[12 + i] = Number(temp2 & 0xffn);
            temp2 >>= 8n;
        }

        // binary string to base64url
        let binary = "";
        for (let i = 0; i < 20; i++) {
            binary += String.fromCharCode(buf[i]);
        }
        const b64 = btoa(binary)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
        return b64;
    } catch {
        return null;
    }
}

/**
 * Memeriksa apakah Place ID berformat resmi Google (dimulai dengan ChIJ...)
 */
export function isValidPlaceId(placeId: string): boolean {
    return /^ChIJ[a-zA-Z0-9_-]+$/.test(placeId);
}

/**
 * Menghasilkan URL Write Review resmi berbasis Place ID (ChIJ...)
 */
export function buildWriteReviewUrl(placeId: string): string {
    return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

/**
 * Ekstrak Place ID (ChIJ...) dan Nama langsung dari string URL Google Maps tanpa redirect
 */
export function parseMapsUrl(
    input: string,
): { name: string; address: string; rawUrl: string; placeId?: string } | null {
    if (!input) return null;
    const trimmed = input.trim();

    const isMapsUrl =
        trimmed.includes("google.com/maps") ||
        trimmed.includes("maps.app.goo.gl") ||
        trimmed.includes("goo.gl/maps") ||
        trimmed.includes("maps.google.") ||
        (trimmed.includes("google.com/search") && trimmed.includes("#lrd=")) ||
        trimmed.includes("search.google.com/local/writereview");

    if (!isMapsUrl) return null;

    const cleanUrl = trimmed.replace(/[.,;!?]+$/, "");
    let address = "";
    let name = "";
    let extractedPlaceId = "";

    try {
        // 1. Cek parameter placeid langsung di URL
        const directPlaceId = cleanUrl.match(/[?&]placeid=([a-zA-Z0-9_-]+)/);
        if (
            directPlaceId &&
            directPlaceId[1] &&
            isValidPlaceId(directPlaceId[1])
        ) {
            extractedPlaceId = directPlaceId[1];
        }

        // 2. Cek parameter !1s(ChIJ...)
        if (!extractedPlaceId) {
            const chijMatch = cleanUrl.match(/!1s(ChIJ[a-zA-Z0-9_-]+)/);
            if (chijMatch && chijMatch[1]) {
                extractedPlaceId = chijMatch[1];
            }
        }

        // 3. Ekstrak Hex CID dari URL (misal: 0x2e69ef7cbc211003:0xbee6892c444d0333) lalu konversi ke ChIJ
        if (!extractedPlaceId) {
            const hexMatch = cleanUrl.match(
                /(0x[0-9a-fA-F]+):(0x[0-9a-fA-F]+)/,
            );
            if (hexMatch && hexMatch[1] && hexMatch[2]) {
                const computedPlaceId = convertHexToPlaceId(
                    hexMatch[1],
                    hexMatch[2],
                );
                if (computedPlaceId) {
                    extractedPlaceId = computedPlaceId;
                }
            }
        }

        // 4. Ekstrak Nama Tempat dari URL
        const url = new URL(cleanUrl);

        // Opsi A: Ambil dari pathname (e.g. /maps/place/Rengginang+Mpo+Era/@...)
        const pathSegments = url.pathname.split("/");
        const placeIndex = pathSegments.indexOf("place");
        if (placeIndex !== -1 && pathSegments[placeIndex + 1]) {
            name = decodeURIComponent(pathSegments[placeIndex + 1])
                .replace(/\+/g, " ")
                .trim();
        }

        // Opsi B: Ambil dari query parameter `q` atau `query`
        if (!name) {
            const q =
                url.searchParams.get("q") || url.searchParams.get("query");
            if (q) {
                const decoded = decodeURIComponent(q).replace(/\+/g, " ");
                address = decoded;
                name = decoded.split(",")[0].trim();
            }
        }
    } catch {
        // Parsing error fallback
    }

    const finalUrl = extractedPlaceId
        ? buildWriteReviewUrl(extractedPlaceId)
        : cleanUrl;

    return {
        name: name || "Profil Google Bisnis",
        address: address || name || "Lokasi Terverifikasi",
        rawUrl: finalUrl,
        placeId: extractedPlaceId || undefined,
    };
}

/**
 * Mencari Place ID resmi berbasis query via API backend bawaan (Tanpa Client Redirect)
 */
export async function fetchPlaceIdByQuery(
    query: string,
): Promise<{ placeId: string; name: string; address: string } | null> {
    if (!query.trim()) return null;

    try {
        const res = await fetch(
            `/api/places/search?query=${encodeURIComponent(query)}`,
        );
        if (!res.ok) return null;

        const data = await res.json();
        if (data && data.place_id && isValidPlaceId(data.place_id)) {
            return {
                placeId: data.place_id,
                name: data.name || query,
                address: data.formatted_address || "",
            };
        }
    } catch {
        // Fallback error handling
    }

    return null;
}

// Unshorten link maps.app.goo.gl secara sync parser jika data sudah ada
export async function resolveMapsUrlAsync(
    inputUrl: string,
): Promise<{ name: string; rawUrl: string } | null> {
    const trimmed = inputUrl.trim().replace(/[.,;!?]+$/, "");

    const syncParsed = parseMapsUrl(trimmed);
    if (syncParsed?.rawUrl && syncParsed.rawUrl.includes("placeid=ChIJ")) {
        return { name: syncParsed.name, rawUrl: syncParsed.rawUrl };
    }

    if (
        trimmed.includes("maps.app.goo.gl") ||
        trimmed.includes("goo.gl/maps")
    ) {
        try {
            const res = await fetch(
                `https://unshorten.me/json/${encodeURIComponent(trimmed)}`,
            );
            if (res.ok) {
                const data = await res.json();
                const resolved = data.resolved_url || "";
                if (resolved) {
                    const parsed = parseMapsUrl(resolved);
                    if (parsed?.rawUrl) {
                        return { name: parsed.name, rawUrl: parsed.rawUrl };
                    }
                }
            }
        } catch {
            // Ignore
        }
    }

    return syncParsed
        ? { name: syncParsed.name, rawUrl: syncParsed.rawUrl }
        : null;
}
