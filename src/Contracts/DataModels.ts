export interface Collection {
    _rid: string;
    _self: string;
    id: string;
    indexingPolicy: any;
    partitionKey: any;
    documentIds: string[];
}

export interface Database{
    _rid: string;
    _self: string;
    id: string;
    collections: Collection[];
    collectionsVisible : boolean;
}

export interface DocumentId{
    _rid: string;
    _self: string;
    id: string;
}

export interface AuthHeaders{
    "x-ms-date": string;
    authorization: string;
}

export interface KeyResource {
    Token: string;
}
