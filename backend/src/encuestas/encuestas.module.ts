import { Module } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { EncuestasController } from './encuestas.controller';
import { Encuestas } from './entities/encuestas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Encuestas, Preguntas, Opciones])],
  controllers: [EncuestasController],
  providers: [EncuestasService],
})
export class EncuestasModule {}
