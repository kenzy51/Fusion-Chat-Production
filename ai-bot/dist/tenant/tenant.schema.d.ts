import { Document } from 'mongoose';
export declare class ChatConfig {
    knowledgeBase: string;
    chatPrompt: string;
    greeting: string;
    primaryColor: string;
    backgroundColor: string;
    widgetTitle: string;
    logoUrl: string;
    textColor: string;
}
export declare class Tenant extends Document {
    name: string;
    slug: string;
    chatConfig: ChatConfig;
}
export declare const TenantSchema: import("mongoose").Schema<Tenant, import("mongoose").Model<Tenant, any, any, any, (Document<unknown, any, Tenant, any, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Tenant, any, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Tenant>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tenant, Document<unknown, {}, Tenant, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    chatConfig?: import("mongoose").SchemaDefinitionProperty<ChatConfig, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Tenant>;
