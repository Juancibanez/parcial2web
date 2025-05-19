import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';

export class ResenaDto {
  @IsString()
  @IsNotEmpty()
  readonly comentario: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly calificacion: number;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsObject()
  @IsNotEmpty()
  readonly estudiante: {
    id: number;
  };

  @IsObject()
  @IsNotEmpty()
  readonly actividad: {
    id: number;
  };
}
