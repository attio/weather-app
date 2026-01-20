/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Formats a unix timestamp to a human-readable date format
 */
export function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000)

    // @TODO: Once Intl object is exposed in Attio's JS Runtime, switch to using:
    // const formatter = new Intl.DateTimeFormat("en-GB", {
    //     weekday: "short",
    //     day: "numeric",
    //     month: "short",
    // })
    // return formatter.format(date)

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    const weekday = weekdays[date.getUTCDay()]
    const day = date.getUTCDate()
    const month = months[date.getUTCMonth()]

    return `${weekday}, ${day} ${month}`
}
