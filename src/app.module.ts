import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-hero'),
    HeroModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
