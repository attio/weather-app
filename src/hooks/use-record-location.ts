import {useQuery} from "attio/client"
import getCompanyLocationById, {
    type GetCompanyLocationByIdQuery,
} from "../graphql/get-company-location-by-id.graphql"
import getPersonLocationById, {
    type GetPersonLocationByIdQuery,
} from "../graphql/get-person-location-by-id.graphql"
import {extractLocationData, type LocationData} from "../utils/location"

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
export function usePersonLocation(recordId: string): PersonLocation {
    const {person} = useQuery(getPersonLocationById, {recordId})

    const locationData = extractLocationData(
        person?.primary_location,
        person?.company?.primary_location
    )

    return {
        ...locationData,
        person,
    }
}

/**
 * Custom React hook to fetch and format company location data.
 *
 * This hook retrieves location information for a company record from the Attio GraphQL API
 * and returns it in a consistent, easy-to-use format with sensible defaults for missing data.
 */
export function useCompanyLocation(recordId: string): CompanyLocation {
    const {company} = useQuery(getCompanyLocationById, {recordId})

    const locationData = extractLocationData(company?.primary_location)

    return {
        ...locationData,
        company,
    }
}

/**
 * Custom React hook to fetch location data for any record type (person or company).
 *
 * This hook automatically selects the appropriate location data based on the object type
 * and returns it in a consistent format.
 *
 * Note: Both hooks are called to comply with React's Rules of Hooks, but the GraphQL
 * layer should cache and optimize these graphql.
 */
export function useRecordLocation(object: string, recordId: string): LocationData {
    // Both hooks must be called unconditionally (Rules of Hooks)
    const personLocation = usePersonLocation(recordId)
    const companyLocation = useCompanyLocation(recordId)

    const isPeopleInformation = object === "people"

    // Return the appropriate location data based on object type
    return isPeopleInformation ? personLocation : companyLocation
}
