import { Module } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { EncuestasController } from './encuestas.controller';
import { Encuestas } from './entities/encuestas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntasService } from 'src/preguntas/preguntas.service';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { OpcionesService } from 'src/opciones/opciones.service';
import { Opciones } from 'src/opciones/entities/opciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Encuestas, Preguntas, Opciones])],
  controllers: [EncuestasController],
  providers: [EncuestasService, PreguntasService, OpcionesService],
})
export class EncuestasModule {}
