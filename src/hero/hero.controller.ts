import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  create(@Body() createHeroDto: CreateHeroDto) {
    return this.heroService.create(createHeroDto);
  }

  @Get()
  findAll() {
    return this.heroService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.heroService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateHeroDto: UpdateHeroDto) {
    return this.heroService.update(term, updateHeroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroService.remove(id);
  }
}
