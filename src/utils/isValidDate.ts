export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString.replace(/\//g, '-'));
    const originalDate = dateString.split(/[-T:/.]/).slice(0, 3).join('-');
    const parsedDate = date.toISOString().split('T')[0];

    return originalDate === parsedDate;
};