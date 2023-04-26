const isPastDate = (date: Date): boolean => {
    const currentDate = new Date();
    return date < currentDate;
}

const isFutureDate = (date: Date): boolean => {
    const currentDate = new Date();
    return date > currentDate;
}

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

const isSameMonth = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth();
}

const isSameYear = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear();
}

const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
}

const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
    return date >= startDate && date <= endDate;
}

export {
    isPastDate,
    isFutureDate,
    isSameDay,
    isSameMonth,
    isSameYear,
    isLeapYear,
    isValidDate,
    isDateInRange
}