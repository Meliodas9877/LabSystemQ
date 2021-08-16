export interface Page<T>{
    pageIndex:number;
    pageSize:number;
    total:number;
    data:T[];
}