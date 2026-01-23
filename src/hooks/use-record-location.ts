import {useQuery} from "attio/client"
import getCompanyLocationById, {
    type GetCompanyLocationByIdQuery,
} from "../graphql/get-company-location-by-id.graphql"
import getPersonLocationById, {
    type GetPersonLocationByIdQuery,
} from "../graphql/get-person-location-by-id.graphql"
import {extractLocationData, formatLocationString, type LocationData} from "../utils/location"

/**
 * Interface for person location data.
 */
interface PersonLocation extends LocationData {
    person: GetPersonLocationByIdQuery["person"]
}

/**
 * Interface for company location data.
 *
 * Contains the geographic coordinates and administrative area information
 * for a company's primary location.
 */
interface CompanyLocation extends LocationData {
    /**
     * The full company data from the GraphQL query.
     */
    company: GetCompanyLocationByIdQuery["company"]
}

/**
 * Custom React hook to fetch and format person location data.
 *
 * This hook retrieves location information for a person record from the Attio GraphQL API,
 * with fallback to their company's location if the person has no direct location.
 */
export function usePersonLocation(recordId: string): PersonLocation | null {
    const {person} = useQuery(getPersonLocationById, {recordId})

    const locationData = extractLocationData(
        person?.primary_location,
        person?.company?.primary_location
    )

    if (!locationData) {
        return null
    }

    return {
        ...locationData,
        person,
    }
}

/**
 * Custom React hook to fetch and format company location data.
 *
 * This hook retrieves location information for a company record from the Attio GraphQL API
 * and returns it in a consistent, easy-to-use format.
 */
export function useCompanyLocation(recordId: string): CompanyLocation | null {
    const {company} = useQuery(getCompanyLocationById, {recordId})

    const locationData = extractLocationData(company?.primary_location)

    if (!locationData) {
        return null
    }

    return {
        ...locationData,
        company,
    }
}

/**
 * Result type for useRecordLocation hook
 */
export interface RecordLocationResult {
    latitude: number | null
    longitude: number | null
    locality: string | null
    country: string | null
    hasValidLocation: boolean
    location: string | null
}

/**
 * Custom React hook to fetch location data for any record type (person or company).
 *
 * This hook automatically selects the appropriate location data based on the object type
 * and returns it in a consistent format with validation and formatted location string.
 *
 * Note: Both hooks are called to comply with React's Rules of Hooks, but the GraphQL
 * layer should cache and optimize these graphql.
 */
export function useRecordLocation(object: string, recordId: string): RecordLocationResult {
    // Both hooks must be called unconditionally (Rules of Hooks)
    const personLocation = usePersonLocation(recordId)
    const companyLocation = useCompanyLocation(recordId)

    const isPeopleInformation = object === "people"

    // Get the appropriate location data based on object type
    const locationData = isPeopleInformation ? personLocation : companyLocation

    const hasValidLocation = Boolean(locationData?.latitude && locationData?.longitude)
    const formattedLocation = locationData
        ? formatLocationString(locationData.locality, locationData.country)
        : null
    // Fallback to coordinates if we have valid lat/lng but no locality/country
    const location = formattedLocation
        ?? (hasValidLocation ? `${locationData?.latitude}, ${locationData?.longitude}` : null)

    return {
        ...(locationData ?? {
            latitude: null,
            longitude: null,
            locality: null,
            country: null,
        }),
        hasValidLocation,
        location,
    }
}
