export interface LocationData {
    latitude: number
    longitude: number
    locality: string | null
    country: string | null
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
 * Converts string coordinates to numbers and ensures consistent typing across all location-related hooks.
 * Uses the primary location if it has valid coordinates, otherwise falls back to the fallback location.
 * Returns null if neither location has valid latitude/longitude data.
 */
export function extractLocationData(
    primaryLocation?: RawLocation | null,
    fallbackLocation?: RawLocation | null
): LocationData | null {
    // Determine which location to use - treat each location as a whole unit
    const hasValidPrimary =
        primaryLocation?.latitude != null && primaryLocation?.longitude != null
    const hasValidFallback =
        fallbackLocation?.latitude != null && fallbackLocation?.longitude != null

    const location = hasValidPrimary
        ? primaryLocation
        : hasValidFallback
          ? fallbackLocation
          : null

    if (!location) {
        return null
    }

    return {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        locality: location.locality != null ? location.locality : null,
        country: location.country != null ? location.country : null,
    }
}

/**
 * Formats location string from locality and country.
 * Returns a formatted string or null if neither is available.
 */
export function formatLocationString(
    locality: string | null,
    country: string | null
): string | null {
    if (locality && country) {
        return `${locality}, ${country}`
    }
    if (locality) {
        return locality
    }
    if (country) {
        return country
    }
    return null
}
