import { DateItem, DateRangeItem, DateSingleItem, DateMarkGroup, DateItemType } from "../types/date-planner.type";

export function isDateRangeItem(item: DateItem): item is DateRangeItem {
    return (
        typeof item.value === 'object' &&
        item.value !== null &&
        'start' in item.value &&
        'end' in item.value &&
        typeof item.value.start === 'string' &&
        typeof item.value.end === 'string'
    );
}

export function isDateSingleItem(item: DateItem): item is DateSingleItem {
    return typeof item.value === 'string';
}

export function isDateGroupItem(item: DateItem): item is DateMarkGroup {
    return Array.isArray(item.value) && item.value.every(val => typeof val === 'string');
}
export function getDateItemType(item: DateItem): DateItemType {
    if (isDateRangeItem(item)) {
        return DateItemType.Range;
    }
    if (isDateGroupItem(item)) {
        return DateItemType.Group;
    }
    if (isDateSingleItem(item)) {
        return DateItemType.Single;
    }
    return DateItemType.Unknown;
}
