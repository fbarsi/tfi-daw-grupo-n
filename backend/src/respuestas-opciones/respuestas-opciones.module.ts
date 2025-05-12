import { Module } from '@nestjs/common';
import { RespuestasOpcionesService } from './respuestas-opciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasOpciones } from './entities/respuestas-opciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RespuestasOpciones])],
  providers: [RespuestasOpcionesService],
})
export class RespuestasOpcionesModule {}
