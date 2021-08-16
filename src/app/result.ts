export interface Result<T>{
    code:number;
    message:string;
    data:T;
}

export interface validator{
    code:number;
    message:string;
    count:number;
}