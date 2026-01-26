import { model, Schema } from "mongoose";
import { TVisitorState } from "./user.interface";

const visitorSchema = new Schema<TVisitorState>(
    {
        ip: {type: String,
            required: true,
            },
        userAgent:{type: String}
        
    }, {timestamps: true}
)

export const visitor = model('Visitor', visitorSchema)