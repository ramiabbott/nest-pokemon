import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>;

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase()
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon
    } catch (error) {
      this.handleErrorException(error)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(id: string) {
    let pokemon: Pokemon | null = null;


    // Buscar por número
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: +id });
    }

    // Buscar por ObjectId
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    // Buscar por nombre (convertido a lowercase y trim)
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.toLowerCase().trim() });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or ObjectId "${id}" not found`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleErrorException(error)
    }
  }

  async remove(id: string) {
    
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }
   return  
  }

  private readonly handleErrorException = (error: any) => {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists in db`)
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)
  }
}
