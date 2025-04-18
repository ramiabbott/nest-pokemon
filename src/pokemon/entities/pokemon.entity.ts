import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Pokemon extends Document {

    @Prop({ 
        required: true,
        unique: true,
        index: true, // crea un índice único para el campo 'name'
     })
    name: string

    @Prop({ 
        required: true, 
        unique: true, 
        index: true
     })
    no: number
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)