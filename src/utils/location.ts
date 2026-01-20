export interface LocationData {
    latitude: number
    longitude: number
    locality: string
    country: string
}

interface RawLocation {
    latitude?: string | number | null
    longitude?: string | number | null
    locality?: string | null
    country?: string | null
}

/**
 * Extracts and formats location data from a raw location object.
 *
 * Converts string coordinates to numbers, provides sensible defaults for missing data,
 * and ensures consistent typing across all location-related hooks.
 */
export function extractLocationData(
    primaryLocation?: RawLocation | null,
    fallbackLocation?: RawLocation | null
): LocationData {
    // Use primary location, falling back to fallback location if needed
    const latitude = Number(primaryLocation?.latitude ?? fallbackLocation?.latitude) || 0
    const longitude = Number(primaryLocation?.longitude ?? fallbackLocation?.longitude) || 0
    const locality = String((primaryLocation?.locality ?? fallbackLocation?.locality) || "")
    const country = String((primaryLocation?.country ?? fallbackLocation?.country) || "")

    return {
        latitude,
        longitude,
        locality,
        country,
    }
}
