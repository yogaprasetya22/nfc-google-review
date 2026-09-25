/**
 * SERVERLESS ENDPOINT: Resolve ambiguous place IDs to valid Google Places IDs
 *
 * Problem: Frontend creates NAME-... IDs that Google doesn't recognize.
 * Solution: Use Google Places API (backend) to get real Place ID.
 *
 * Inputs:
 * - place_id: Either "NAME-Nama Toko", "OSM-123", "URL:...", or "ChIJ..." (valid)
 * - business_name: Business name for fallback search
 *
 * Returns:
 * - placeId: Valid Google Places ID (ChIJ...)
 * - writeReviewUrl: Complete review URL ready to use
 * - confidence: How sure we are about the match
 */

export const config = {
    runtime: "nodejs",
    maxDuration: 10,
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ success: false, error: "Method not allowed" });
    }

    const { place_id, business_name } = req.body;

    if (!place_id && !business_name) {
        return res.status(400).json({
            success: false,
            error: "Provide either place_id or business_name",
        });
    }

    try {
        const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!googleApiKey) {
            console.warn("GOOGLE_PLACES_API_KEY not configured");
            // Fallback: generate search URL (not ideal but works)
            const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business_name || "restaurant")}`;
            return res.status(200).json({
                success: true,
                placeId: null,
                writeReviewUrl: fallbackUrl,
                confidence: "low",
                warning:
                    "Google Places API key not configured, using search fallback",
            });
        }

        // Case 1: Already a valid ChIJ... Place ID
        if (place_id && place_id.startsWith("ChIJ")) {
            const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${place_id}`;
            return res.status(200).json({
                success: true,
                placeId: place_id,
                writeReviewUrl: writeReviewUrl,
                confidence: "very_high",
            });
        }

        // Case 2: URL prefix (already resolved)
        if (place_id && place_id.startsWith("URL:")) {
            const writeReviewUrl = place_id.replace("URL:", "");
            return res.status(200).json({
                success: true,
                placeId: null,
                writeReviewUrl: writeReviewUrl,
                confidence: "high",
                type: "direct_url",
            });
        }

        // Case 3: NAME-... or OSM-... (need to resolve via Google Places API)
        const searchTerm =
            business_name ||
            (place_id && place_id.startsWith("NAME-")
                ? decodeURIComponent(place_id.replace("NAME-", ""))
                : business_name);

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                error: "Cannot determine search term",
            });
        }

        // Hit Google Places Text Search API
        const textSearchUrl = new URL(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
        );
        textSearchUrl.searchParams.append("query", searchTerm);
        textSearchUrl.searchParams.append("key", googleApiKey);

        const searchRes = await fetch(textSearchUrl.toString());
        const searchData = await searchRes.json();

        if (!searchData.results || searchData.results.length === 0) {
            // Fallback to Google Maps search URL
            const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}`;
            return res.status(200).json({
                success: true,
                placeId: null,
                writeReviewUrl: fallbackUrl,
                confidence: "medium",
                warning: `No exact match found for "${searchTerm}", using search URL`,
            });
        }

        // Get first result
        const topResult = searchData.results[0];
        const resolvedPlaceId = topResult.place_id;
        const resolvedName = topResult.name;

        // Verify it's actually a review-able place by doing a Place Details call
        const detailsUrl = new URL(
            "https://maps.googleapis.com/maps/api/place/details/json",
        );
        detailsUrl.searchParams.append("place_id", resolvedPlaceId);
        detailsUrl.searchParams.append(
            "fields",
            "place_id,name,business_status",
        );
        detailsUrl.searchParams.append("key", googleApiKey);

        const detailsRes = await fetch(detailsUrl.toString());
        const detailsData = await detailsRes.json();

        if (detailsData.result?.business_status === "CLOSED_PERMANENTLY") {
            return res.status(200).json({
                success: false,
                error: `"${resolvedName}" is permanently closed`,
                placeId: null,
                writeReviewUrl: null,
                confidence: "high",
            });
        }

        // Success! Return valid write review URL
        const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${resolvedPlaceId}`;

        return res.status(200).json({
            success: true,
            placeId: resolvedPlaceId,
            name: resolvedName,
            writeReviewUrl: writeReviewUrl,
            confidence: "high",
        });
    } catch (error) {
        console.error("Place resolution error:", error);

        // Last resort: Google Maps search URL
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business_name || "restaurant")}`;

        return res.status(200).json({
            success: true,
            placeId: null,
            writeReviewUrl: fallbackUrl,
            confidence: "low",
            error: error.message,
            warning: "Using Google Maps search as fallback",
        });
    }
}
