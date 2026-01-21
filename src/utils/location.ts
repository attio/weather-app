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
 * Returns null if neither location has latitude/longitude data.
 */
export function extractLocationData(
    primaryLocation?: RawLocation | null,
    fallbackLocation?: RawLocation | null
): LocationData | null {
    // Use primary location, falling back to fallback location if needed
    const latitudeValue = primaryLocation?.latitude ?? fallbackLocation?.latitude
    const longitudeValue = primaryLocation?.longitude ?? fallbackLocation?.longitude
    const localityValue = primaryLocation?.locality ?? fallbackLocation?.locality
    const countryValue = primaryLocation?.country ?? fallbackLocation?.country

    // If neither location has latitude/longitude, don't use defaults
    if (latitudeValue == null || longitudeValue == null) {
        return null
    }

    const latitude = Number(latitudeValue)
    const longitude = Number(longitudeValue)
    const locality = localityValue != null ? String(localityValue) : null
    const country = countryValue != null ? String(countryValue) : null

    return {
        latitude,
        longitude,
        locality,
        country,
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
