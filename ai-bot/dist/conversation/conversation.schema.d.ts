import { Document, Types } from 'mongoose';
export type ConversationDocument = Conversation & Document;
export declare class Conversation {
    conversationId: string;
    tenantSlug: string;
    leadMetadata: {
        fullName: string | null;
        phone: string | null;
        email: string | null;
        capturedStatus: string;
    };
    messages: Array<{
        role: string;
        content: string;
        timestamp: Date;
    }>;
    aiSummary: string;
    isArchived: boolean;
}
export declare const ConversationSchema: import("mongoose").Schema<Conversation, import("mongoose").Model<Conversation, any, any, any, (Document<unknown, any, Conversation, any, import("mongoose").DefaultSchemaOptions> & Conversation & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Conversation, any, import("mongoose").DefaultSchemaOptions> & Conversation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Conversation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, Conversation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    conversationId?: import("mongoose").SchemaDefinitionProperty<string, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tenantSlug?: import("mongoose").SchemaDefinitionProperty<string, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leadMetadata?: import("mongoose").SchemaDefinitionProperty<{
        fullName: string | null;
        phone: string | null;
        email: string | null;
        capturedStatus: string;
    }, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    messages?: import("mongoose").SchemaDefinitionProperty<{
        role: string;
        content: string;
        timestamp: Date;
    }[], Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aiSummary?: import("mongoose").SchemaDefinitionProperty<string, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isArchived?: import("mongoose").SchemaDefinitionProperty<boolean, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Conversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Conversation>;
