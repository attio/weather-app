/**
 * Shared error handling utility for Open-Meteo API responses.
 *
 * @see https://open-meteo.com/en/docs#errors
 */

import {createLogger} from "../utils/logger"

const logger = createLogger("handle-api-error")

/**
 * Handles non-OK API responses by parsing the error and throwing an appropriate error.
 * Supports Open-Meteo's error format: `{error: true, reason: "..."}`
 *
 * @param response - The fetch Response object
 * @throws Error with a user-friendly message
 */
export async function handleApiError(response: Response): Promise<never> {
    // Try to parse API error response
    const errorBody = await response.json().catch(() => null)
    const apiReason = errorBody?.error && errorBody?.reason ? errorBody.reason : null

    if (response.status === 429) {
        logger.error("Rate limit exceeded")
        throw new Error("Weather service rate limit exceeded. Please try again later.")
    }

    if (response.status >= 500) {
        logger.error(`Service unavailable (${response.status})`)
        throw new Error("Weather service temporarily unavailable. Please try again later.")
    }

    if (apiReason) {
        logger.error(`API error: ${apiReason}`)
        throw new Error(`Weather API error: ${apiReason}`)
    }

    logger.error(`HTTP error: ${response.status}`)
    throw new Error(`Weather service error (${response.status})`)
}
