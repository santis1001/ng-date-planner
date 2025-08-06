export class StringBuilder {
    private parts: string[] = [];
    
    constructor(initialValue: string = '') {
        if (initialValue) {
            this.parts.push(initialValue);
        }
    }

    append(value: string): StringBuilder {
        this.parts.push(value);
        return this;
    }

    toString(): string {
        return this.parts.join('');
    }
}

