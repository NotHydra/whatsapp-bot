export interface GroupInterface {
    _id: number;
    remote: string;
    active: boolean;
    prefix: Array<string>;
    operator: Array<string>;
    message: Array<string>;
}
