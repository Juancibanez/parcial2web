import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resena } from './resena.entity';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Resena])],
  controllers: [ResenaController],
  providers: [ResenaService],
})
export class ResenaModule {}