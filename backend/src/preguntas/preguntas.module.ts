import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { PreguntasController } from './preguntas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preguntas } from './entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Preguntas, Opciones])], //debe importar Opciones tambien?
  controllers: [PreguntasController],
  providers: [PreguntasService],
})
export class PreguntasModule {}
