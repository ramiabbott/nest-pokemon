import { IsString, IsInt, IsOptional, IsPositive, MinLength, Min } from 'class-validator';

export class CreatePokemonDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

  
}
