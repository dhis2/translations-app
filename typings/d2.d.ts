type UserSettings = {
    keyDbLocale: string;
    keyUiLocale: string;
}

type CurrentUser = {
    canUpdate: (schema: ModelDefinition) => boolean;
    userSettings: UserSettings;
};

type ModelDefinition = {
    getTranslatableProperties: () => Array<string>;
    plural: string;
    displayName: string;
    list(params: any): Promise<ModelCollection>;
};

type Model = {
    readonly modelDefinition: ModelDefinition;
    id: string;
    [index:string]: any;
};

type Models = {
    [index: string]: ModelDefinition;
    mapThroughDefinitions: <T>(mapper: Function) => T[];
}

type Translation = {
    property: string;
    locale: string;
    value: string;
}

class ModelCollection extends Map<string, Model> {
    toArray(): Model[];
}

type ApiClass = {
    getApi: () => any;
}

type D2 = {
    models: Models;
    currentUser: CurrentUser;
    Api: ApiClass;
}

type Manifest = {
    name: string;
    version: string;
    activities: {
        dhis: {
            href: string;
        },
    },
    getBaseUrl: () => string;
    manifest_generated_at: string;
};

type Config = {
    baseUrl: string;
}

class ListResponse extends ModelCollection {
    pager: Pager;
    toArray(): Model[];
}

declare const d2: {
    getInstance: () => Promise<D2>;

    init: () => Promise<D2>;
    init: (config?: { baseUrl: string }) => Promise<D2>;

    getManifest: (url: string) => Promise<Manifest>;
    config: Config;
};
declare module 'd2/lib/d2' {
    export = d2;
}