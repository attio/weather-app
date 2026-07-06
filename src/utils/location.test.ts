import {describe, expect, it} from "vitest"
import {extractLocationData, formatLocationString} from "./location"

describe(extractLocationData, () => {
    it("returns the primary location with coordinates converted to numbers", () => {
        expect(
            extractLocationData({
                latitude: "51.5",
                longitude: "-0.12",
                locality: "London",
                country: "GB",
            })
        ).toEqual({latitude: 51.5, longitude: -0.12, locality: "London", country: "GB"})
    })

    it("falls back to the fallback location when the primary has no coordinates", () => {
        expect(
            extractLocationData(
                {latitude: null, longitude: null, locality: "Nowhere", country: null},
                {latitude: 48.85, longitude: 2.35, locality: "Paris", country: "FR"}
            )
        ).toEqual({latitude: 48.85, longitude: 2.35, locality: "Paris", country: "FR"})
    })

    it("does not mix fields between primary and fallback locations", () => {
        // Primary has valid coordinates but no locality — fallback locality must not leak in
        expect(
            extractLocationData(
                {latitude: 1, longitude: 2},
                {latitude: 3, longitude: 4, locality: "Lisbon", country: "PT"}
            )
        ).toEqual({latitude: 1, longitude: 2, locality: null, country: null})
    })

    it("ignores a location missing either coordinate", () => {
        expect(extractLocationData({latitude: 51.5, longitude: null})).toBeNull()
        expect(extractLocationData({latitude: null, longitude: -0.12})).toBeNull()
    })

    it("returns null when neither location has coordinates", () => {
        expect(extractLocationData(null, null)).toBeNull()
        expect(extractLocationData()).toBeNull()
    })
})

describe(formatLocationString, () => {
    it("joins locality and country", () => {
        expect(formatLocationString("London", "GB")).toBe("London, GB")
    })

    it("returns whichever part is available", () => {
        expect(formatLocationString("London", null)).toBe("London")
        expect(formatLocationString(null, "GB")).toBe("GB")
    })

    it("returns null when neither part is available", () => {
        expect(formatLocationString(null, null)).toBeNull()
    })
})
