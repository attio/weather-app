/**
 * Builds a URL with query parameters.
 */
export function buildUrl(
    baseUrl: string,
    params?: Record<string, string | number | boolean | undefined | null | string[] | number[]>
): string {
    if (!params || Object.keys(params).length === 0) {
        return baseUrl
    }

    const url = new URL(baseUrl)

    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            // Append each array element as a separate parameter with the same key
            value.forEach((val) => {
                url.searchParams.append(key, String(val))
            })
        } else if (value !== null && value !== undefined) {
            url.searchParams.append(key, String(value))
        }
    }

    return url.toString()
}
