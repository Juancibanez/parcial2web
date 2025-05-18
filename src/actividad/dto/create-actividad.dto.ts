import { IsString, MinLength, Matches } from 'class-validator';

export class CreateActividadDto {
  @IsString()
  @MinLength(15, { message: 'El título debe tener al menos 15 caracteres' })
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'El título no debe contener símbolos',
  })
  titulo: string;
}
