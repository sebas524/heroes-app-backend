import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'heroes' })
export class Hero extends Document {
  @Prop({ unique: true, index: true }) superhero: string;
  @Prop({ index: true }) publisher: string;
  @Prop({ index: true }) alterEgo: string;
  @Prop({ index: true }) firstAppearance: string;
  @Prop({ index: true }) characters: string;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
