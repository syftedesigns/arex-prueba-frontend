// Interface for Deal Object
export class ObjectDealClass {
    constructor(
        public id: number | string,
        public name: string,
        public address: string,
        public price: number,
        public type: string,
        public dueDate: Date
    ) {}
}

