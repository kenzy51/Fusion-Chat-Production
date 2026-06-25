import { Document } from 'mongoose';
export type WidgetConfigDocument = WidgetConfig & Document;
export type LeadFormPolicy = 'mandatory' | 'optional' | 'disabled';
export declare class WidgetConfig {
    tenantSlug: string;
    leadFormPolicy: LeadFormPolicy;
    widgetTitle: string;
    greeting: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
}
export declare const WidgetConfigSchema: import("mongoose").Schema<WidgetConfig, import("mongoose").Model<WidgetConfig, any, any, any, (Document<unknown, any, WidgetConfig, any, import("mongoose").DefaultSchemaOptions> & WidgetConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, WidgetConfig, any, import("mongoose").DefaultSchemaOptions> & WidgetConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, WidgetConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WidgetConfig, Document<unknown, {}, WidgetConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tenantSlug?: import("mongoose").SchemaDefinitionProperty<string, WidgetConfig, Document<unknown, {}, WidgetConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leadFormPolicy?: import("mongoose").SchemaDefinitionProperty<LeadFormPolicy, WidgetConfig, Document<unknown, {}, WidgetConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    widgetTitle?: import("mongoose").SchemaDefinitionProperty<string, WidgetConfig, Document<unknown, {}, WidgetConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    greeting?: import("mongoose").SchemaDefinitionProperty<string, WidgetConfig, Document<unknown, {}, WidgetConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    primaryColor?: import("mongoose").SchemaDefinitionProperty<string, WidgetConfig, Document<unknown, {}, WidgetConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    backgroundColor?: import("mongoose").SchemaDefinitionProperty<string, WidgetConfig, Document<unknown, {}, WidgetConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    textColor?: import("mongoose").SchemaDefinitionProperty<string, WidgetConfig, Document<unknown, {}, WidgetConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WidgetConfig & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, WidgetConfig>;
