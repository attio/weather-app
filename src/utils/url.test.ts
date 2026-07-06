import {describe, expect, it} from "vitest"
import {buildUrl} from "./url"

describe(buildUrl, () => {
    it("returns the base URL untouched when there are no params", () => {
        expect(buildUrl("https://api.open-meteo.com/v1/forecast")).toBe(
            "https://api.open-meteo.com/v1/forecast"
        )
        expect(buildUrl("https://api.open-meteo.com/v1/forecast", {})).toBe(
            "https://api.open-meteo.com/v1/forecast"
        )
    })

    it("appends scalar params as query string values", () => {
        expect(
            buildUrl("https://example.com/api", {latitude: 51.5, unit: "celsius", flag: true})
        ).toBe("https://example.com/api?latitude=51.5&unit=celsius&flag=true")
    })

    it("appends array params as repeated keys", () => {
        expect(buildUrl("https://example.com/api", {daily: ["min", "max"]})).toBe(
            "https://example.com/api?daily=min&daily=max"
        )
    })

    it("skips null and undefined values", () => {
        expect(buildUrl("https://example.com/api", {a: null, b: undefined, c: 1})).toBe(
            "https://example.com/api?c=1"
        )
    })
})
