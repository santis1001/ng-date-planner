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

export type DateItem = IDateMarkItem | IDateRangeItem

export type DateList = DateItem[];
