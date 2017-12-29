export class ResponseModel {
    data: string | any = [];
    code: number = -1;
    page?: number = -1;
    pageSize?: number = -1;
    rows?: number = -1;
    err?: any;
}
