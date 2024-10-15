export class Order {
    date: string;
    part_no: string;
    order: string;
    constructor(date: string, part_no: string, order: string) {
        this.date = date;
        this.part_no = part_no;
        this.order = order;
    }
}
