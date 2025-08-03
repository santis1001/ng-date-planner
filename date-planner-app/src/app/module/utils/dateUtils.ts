import { formatDate } from '@angular/common';

export function formatDateToString(date: Date | null) {
    if (date)
        return formatDate(date, 'dd/MM/yyyy', 'en-GB');
    return null
}

export function formatDateToISOString(date: Date | string | null) {
    if (date) {
        switch (typeof date) {
            case 'string':
                return date.split('/').reverse().join('-')
            default:
                return date.toISOString().split('T')[0];
        }
    }
    return null
}

export function parseFromString(value: string) {
    // Convert '16/06/2025' to Date
    if (value.length == 0) return null;
    if (typeof (value as any) !== 'string') return new Date(value);

    const [day, month, year] = value.split('/').map(Number);

    // console.log(value)
    // console.log([day, month, year])
    return new Date(year, month - 1, day);
}

export function parseFromISO(value: string): Date {
    // Convert '2025-06-16' to Date
    const [year, month, day] = value.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day);
}
