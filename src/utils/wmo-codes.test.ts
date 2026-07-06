import {describe, expect, it} from "vitest"
import {WmoCodesMap} from "./wmo-codes"

// All WMO weather interpretation codes Open-Meteo can return
// https://open-meteo.com/en/docs#weather_variable_documentation
const openMeteoWmoCodes = [
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86,
    95, 96, 99,
]

describe("WmoCodesMap", () => {
    it("covers every WMO code Open-Meteo can return", () => {
        expect([...WmoCodesMap.keys()].sort((a, b) => a - b)).toEqual(openMeteoWmoCodes)
    })

    it("has a description and an emoji for every code", () => {
        for (const [code, entry] of WmoCodesMap) {
            expect(entry.description, `code ${code}`).not.toBe("")
            expect(entry.emoji, `code ${code}`).toMatch(/\p{Emoji}/u)
        }
    })
})
