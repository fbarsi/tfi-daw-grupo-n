import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preguntas } from './entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { PreguntasController } from './preguntas.controller';
import { OpcionesService } from 'src/opciones/opciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Preguntas, Opciones])], //debe importar Opciones tambien?
  controllers: [PreguntasController],
  providers: [PreguntasService, OpcionesService],
})
export class PreguntasModule {}
