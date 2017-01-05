import * as ko from "knockout";

export interface Explorer{
    selectedCollectionIds: KnockoutObservableArray<DocumentId>;
    selectedDatabase: KnockoutObservable<Database>;
    selectedCollection: KnockoutObservable<Collection>;
    selectedDocument: KnockoutObservable<any>;
    addCollectionPane: AddCollectionPane;
    databases: KnockoutObservableArray<Database>;
    databasesIds: KnockoutObservableArray<string>;
}

export interface Database {
    container: Explorer;
    rid: string;
    self: string;
    id: KnockoutObservable<string>;
}

export interface Collection {
    container: Explorer;
    rid: string;
    self: string;
    id: KnockoutObservable<string>;
    indexingPolicy: KnockoutObservable<any>;
    partitionKey: KnockoutObservable<any>;
    queryDocuments(): void;
    database: Database;
}

export interface DocumentId {
    rid: string;
    id: KnockoutObservable<string>;
}

export interface AddCollectionPane { 
    container: Explorer;
    visible: KnockoutObservable<boolean>;
    collectionId: KnockoutObservable<string>;
    partitionkey: KnockoutObservable<string>;
    newOrExisitngDatabase: KnockoutObservable<string>;
    newDatabaseName: KnockoutObservable<string>;
    selectedExisitingDatabaseName: KnockoutObservable<string>;

    submit: () => void;
}