import { Module } from '@nestjs/common';
import { RespuestasAbiertasService } from './respuestas-abiertas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasAbiertas } from './entities/respuestas-abiertas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RespuestasAbiertas])],
  providers: [RespuestasAbiertasService],
})
export class RespuestasAbiertasModule {}
