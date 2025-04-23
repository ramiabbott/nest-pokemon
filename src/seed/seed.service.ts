import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }

  private readonly handleErrorException: (error: any) => void = (error) => {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists in DB`);
    } else {
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
    }
  }


  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=200")
    const pokemonInsertArray: { name: string; no: number }[] = []
  
    for (const { name, url } of data.results) {
      const segment = url.split('/')
      const no: number = +segment[segment.length - 2]
      pokemonInsertArray.push({ name, no })
    }
  
    try {
      await this.pokemonModel.insertMany(pokemonInsertArray, { ordered: false })
      return "seed executed"
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Algunos pokemones ya estaban insertados (duplicados ignorados).')
      //  return "seed executed with duplicates"
      }
      this.handleErrorException(error)
    }
  }
  
}
