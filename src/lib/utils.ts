type DateStyle = Intl.DateTimeFormatOptions['dateStyle']

// Format a date that looks like "2023-10-18T13:39:00.000Z" as a human-readable date
export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
    const dateTime = new Date(date)
    return new Intl.DateTimeFormat(locales, { dateStyle }).format(dateTime)
}