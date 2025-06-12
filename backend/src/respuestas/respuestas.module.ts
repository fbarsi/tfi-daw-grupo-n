import { Module } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { RespuestasController } from './respuestas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respuestas } from './entities/respuestas.entity';
import { RespuestasAbiertasService } from 'src/respuestas-abiertas/respuestas-abiertas.service';
import { RespuestasOpcionesService } from 'src/respuestas-opciones/respuestas-opciones.service';
import { RespuestasAbiertasModule } from 'src/respuestas-abiertas/respuestas-abiertas.module';
import { RespuestasOpcionesModule } from 'src/respuestas-opciones/respuestas-opciones.module';
import { RespuestasVerdaderoFalsoModule } from 'src/respuestas-verdadero-falso/respuestas-verdadero-falso.module';
import { RespuestasVerdaderoFalsoService } from 'src/respuestas-verdadero-falso/respuestas-verdadero-falso.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Respuestas]),
    RespuestasAbiertasModule,
    RespuestasOpcionesModule,
    RespuestasVerdaderoFalsoModule
  ],
  controllers: [RespuestasController],
  providers: [
    RespuestasService,
    RespuestasAbiertasService,
    RespuestasOpcionesService,
    RespuestasVerdaderoFalsoService
  ],
})
export class RespuestasModule {}
