import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hero, HeroSchema } from './entities/hero.entity';

@Module({
  controllers: [HeroController],
  providers: [HeroService],
  imports: [
    MongooseModule.forFeature([{ name: Hero.name, schema: HeroSchema }]),
  ],
})
export class HeroModule {}
