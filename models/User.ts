interface UserData {
    id?: string;
    email?: string;
    name?: string;
    password?: string;
    barcode?: string;
}
export class User {
    id: string;
    email: string;
    name: string;
    password: string;
    barcode: string;

    constructor(data: UserData = {}) {
        this.id = data.id ?? "";
        this.email = data.email ?? "";
        this.name = data.name ?? "";
        this.password = data.password ?? "";
        this.barcode = data.barcode ?? "";
    }
}
