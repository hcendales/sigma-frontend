export interface IEntityService<T> {
    get(idEntity:number): Promise<any>;
    update(entity:T): any;
    create(entity:T): any;
    delete(idEntity:number): any;
    list(condition:string): T[];
}