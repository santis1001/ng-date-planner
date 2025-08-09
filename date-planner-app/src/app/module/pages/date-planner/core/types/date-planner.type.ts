
export enum DateItemType {
    Range = 'Range',
    Single = 'Single',
    Group = 'Group',
    Unknown = 'Unknown'
}

// Shared base interface for all date items
interface BaseDateItem {
    name: string;
    color: string;
}

// Specific value types
type DateRange = {
    start: string;
    end: string;
};

// Specialized date items
export interface DateRangeItem extends BaseDateItem {
    value: { start: string; end: string };
}

export interface DateSingleItem extends BaseDateItem {
    value: string;
}

export interface DateMarkGroup extends BaseDateItem {
    value: string[];
}

// Unified type for all possible date items
export type DateItem = DateRangeItem | DateSingleItem | DateMarkGroup;

// A list of date items
export type DateList = DateItem[];
