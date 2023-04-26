import {
    isPastDate,
    isFutureDate,
    isSameDay,
    isSameMonth,
    isSameYear,
    isLeapYear,
    isValidDate,
    isDateInRange,
} from '../../src/functions/dateValidations';

describe('Date validation functions', () => {
    test('isPastDate', () => {
        const pastDate = new Date('2000-01-01');
        expect(isPastDate(pastDate)).toBe(true);

        const futureDate = new Date('3000-01-01');
        expect(isPastDate(futureDate)).toBe(false);
    });

    test('isFutureDate', () => {
        const pastDate = new Date('2000-01-01');
        expect(isFutureDate(pastDate)).toBe(false);

        const futureDate = new Date('3000-01-01');
        expect(isFutureDate(futureDate)).toBe(true);
    });

    test('isSameDay', () => {
        const date1 = new Date('2023-04-25');
        const date2 = new Date('2023-04-25');
        const date3 = new Date('2023-04-26');
        expect(isSameDay(date1, date2)).toBe(true);
        expect(isSameDay(date1, date3)).toBe(false);
    });

    test('isSameMonth', () => {
        const date1 = new Date('2023-04-25');
        const date2 = new Date('2023-04-28');
        const date3 = new Date('2023-05-25');
        expect(isSameMonth(date1, date2)).toBe(true);
        expect(isSameMonth(date1, date3)).toBe(false);
    });

    test('isSameYear', () => {
        const date1 = new Date('2023-04-25');
        const date2 = new Date('2023-12-25');
        const date3 = new Date('2022-04-25');
        expect(isSameYear(date1, date2)).toBe(true);
        expect(isSameYear(date1, date3)).toBe(false);
    });

    test('isLeapYear', () => {
        expect(isLeapYear(2000)).toBe(true);
        expect(isLeapYear(2020)).toBe(true);
        expect(isLeapYear(2021)).toBe(false);
    });

    test('isValidDate', () => {
        const validDate = new Date('2023-04-25');
        const invalidDate = new Date('invalid date');
        expect(isValidDate(validDate)).toBe(true);
        expect(isValidDate(invalidDate)).toBe(false);
    });

    test('isDateInRange', () => {
        const date = new Date('2023-04-25');
        const startDate = new Date('2023-04-20');
        const endDate = new Date('2023-04-30');
        const outOfRangeDate = new Date('2023-05-01');
        expect(isDateInRange(date, startDate, endDate)).toBe(true);
        expect(isDateInRange(outOfRangeDate, startDate, endDate)).toBe(false);
    });
});
