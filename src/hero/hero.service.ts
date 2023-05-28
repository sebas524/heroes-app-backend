import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Hero } from './entities/hero.entity';
import { InjectModel } from '@nestjs/mongoose';
import { join } from 'path';

@Injectable()
export class HeroService {
  // * in order to insert heroes to db you have to:
  constructor(
    @InjectModel(Hero.name) private readonly heroModel: Model<Hero>,
  ) {}

  async create(createHeroDto: CreateHeroDto) {
    // * to save it as lowercase:
    createHeroDto.superhero = createHeroDto.superhero.toLowerCase();
    // if (createHeroDto.superhero.includes(' ')) {
    //   createHeroDto.superhero = createHeroDto.superhero.split(' ').join('-');
    // }

    // * try catch in case of error
    try {
      const hero = await this.heroModel.create(createHeroDto);
      return hero;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.heroModel.find();
  }

  async findOne(term: string) {
    let hero: Hero;

    // if (!isNaN(+term)) {
    //   hero = await this.heroModel.findOne({ num: term });
    // }

    // MongoID
    if (!hero && isValidObjectId(term)) {
      hero = await this.heroModel.findById(term);
    }

    // Name
    if (!hero) {
      hero = await this.heroModel.findOne({
        superhero: term.toLowerCase().trim(),
      });
    }

    if (!hero)
      throw new NotFoundException(
        `Hero with id, name or no "${term}" not found`,
      );

    return hero;
  }

  async update(term: string, updateHeroDto: UpdateHeroDto) {
    const hero = await this.findOne(term);

    if (updateHeroDto.superhero) {
      updateHeroDto.superhero = updateHeroDto.superhero.toLowerCase();
    }
    try {
      await hero.updateOne(updateHeroDto);
      return { ...hero.toJSON(), ...updateHeroDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.heroModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Hero with id ${id} not found`);
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Hero already exists in DB ${JSON.stringify(error.keyValue)}`,
      );
    } else {
      console.log(error);
      throw new InternalServerErrorException(
        'Unable to create hero. Check server logs...',
      );
    }
  }
}
