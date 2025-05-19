import {
  IsString,
  MinLength,
  Matches,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsDateString,
} from 'class-validator';

export class ActividadDto {
  @IsString()
  @MinLength(15, { message: 'El título debe tener al menos 15 caracteres' })
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'El título no debe contener símbolos',
  })
  titulo: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  cupoMaximo: number;
}
