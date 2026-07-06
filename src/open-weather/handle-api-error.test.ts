import {beforeEach, describe, expect, it, vi} from "vitest"
import {handleApiError} from "./handle-api-error"

function makeResponse(status: number, body?: unknown): Response {
    return new Response(body === undefined ? "not json" : JSON.stringify(body), {status})
}

describe(handleApiError, () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => undefined)
    })

    it("throws a rate limit message for 429 responses", async () => {
        await expect(handleApiError(makeResponse(429))).rejects.toThrow(
            "Weather service rate limit exceeded. Please try again later."
        )
    })

    it("throws an unavailable message for 5xx responses", async () => {
        await expect(handleApiError(makeResponse(503))).rejects.toThrow(
            "Weather service temporarily unavailable. Please try again later."
        )
    })

    it("surfaces the Open-Meteo error reason when present", async () => {
        await expect(
            handleApiError(makeResponse(400, {error: true, reason: "Invalid latitude"}))
        ).rejects.toThrow("Weather API error: Invalid latitude")
    })

    it("falls back to a generic message when the body is not JSON", async () => {
        await expect(handleApiError(makeResponse(400))).rejects.toThrow(
            "Weather service error (400)"
        )
    })
})
