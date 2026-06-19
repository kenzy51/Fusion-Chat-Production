import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class ChatSession extends Document {
    tenantId: string;
    sessionId: string;
    endUserIp: string;
    endUserName: string;
    endUserEmail: string;
    summary: string;
    transcript: string;
    status: string;
    metadata: {
        totalTokensUsed: number;
        modelUsed: string;
        originDomain: string;
    };
    isFlagged: boolean;
}
export declare const ChatSessionSchema: MongooseSchema<ChatSession, import("mongoose").Model<ChatSession, any, any, any, (Document<unknown, any, ChatSession, any, import("mongoose").DefaultSchemaOptions> & ChatSession & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, ChatSession, any, import("mongoose").DefaultSchemaOptions> & ChatSession & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, ChatSession>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatSession, Document<unknown, {}, ChatSession, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tenantId?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sessionId?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endUserIp?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endUserName?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endUserEmail?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    summary?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    transcript?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<{
        totalTokensUsed: number;
        modelUsed: string;
        originDomain: string;
    }, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isFlagged?: import("mongoose").SchemaDefinitionProperty<boolean, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ChatSession>;
