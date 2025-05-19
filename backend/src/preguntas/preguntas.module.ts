import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preguntas } from './entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { PreguntasController } from './preguntas.controller';
import { OpcionesService } from 'src/opciones/opciones.service';
import { OpcionesModule } from 'src/opciones/opciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Preguntas, Opciones]),
    OpcionesModule
  ], //debe importar Opciones tambien?
  controllers: [PreguntasController],
  providers: [PreguntasService, OpcionesService],
  exports: [PreguntasService]
})
export class PreguntasModule {}
