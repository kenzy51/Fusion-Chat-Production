import { Document } from 'mongoose';
export type ChatSessionDocument = ChatSession & Document;
export declare class ChatSession {
    tenantId: string;
    sessionId: string;
    endUserIp: string;
    summary: string;
    transcript: string;
    status: string;
    fullName: string | null;
    phone: string | null;
    email: string | null;
    leadMetadata: {
        fullName: string | null;
        phone: string | null;
        email: string | null;
        capturedStatus: string;
    };
}
export declare const ChatSessionSchema: import("mongoose").Schema<ChatSession, import("mongoose").Model<ChatSession, any, any, any, (Document<unknown, any, ChatSession, any, import("mongoose").DefaultSchemaOptions> & ChatSession & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, ChatSession, any, import("mongoose").DefaultSchemaOptions> & ChatSession & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, ChatSession>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatSession, Document<unknown, {}, ChatSession, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sessionId?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endUserIp?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    summary?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    transcript?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fullName?: import("mongoose").SchemaDefinitionProperty<string | null, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string | null, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | null, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
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
    }, ChatSession, Document<unknown, {}, ChatSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ChatSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ChatSession>;
