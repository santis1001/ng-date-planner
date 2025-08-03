interface IDateItem {
    name: string,
    color: string
}
interface IDateRange {
    start: string,
    end: string
}
interface IDateRangeItem extends IDateItem {
    value: IDateRange
}

interface IDateMarkItem extends IDateItem {
    value: string
}

export type DateRangeItem = IDateRangeItem
export type DateMarkItem = IDateMarkItem 

export type DateItem = DateMarkItem | DateRangeItem

export type DateList = DateItem[];
