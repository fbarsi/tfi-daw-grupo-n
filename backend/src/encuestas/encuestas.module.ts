import { Module } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { EncuestasController } from './encuestas.controller';
import { Encuestas } from './entities/encuestas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { PreguntasService } from 'src/preguntas/preguntas.service';
import { OpcionesService } from 'src/opciones/opciones.service';
import { PreguntasModule } from 'src/preguntas/preguntas.module';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import { RespuestasVerdaderoFalso } from 'src/respuestas-verdadero-falso/entities/respuestas-verdadero-falso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Encuestas, Preguntas, Opciones, Respuestas, RespuestasVerdaderoFalso]),
    PreguntasModule
  ],
  controllers: [EncuestasController],
  providers: [EncuestasService, PreguntasService, OpcionesService],
  exports:[EncuestasService]
})
export class EncuestasModule {}
