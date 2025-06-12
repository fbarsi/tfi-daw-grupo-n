import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasVerdaderoFalso } from './entities/respuestas-verdadero-falso.entity';
import { RespuestasVerdaderoFalsoService } from './respuestas-verdadero-falso.service';

@Module({
  imports: [TypeOrmModule.forFeature([RespuestasVerdaderoFalso])],
  providers: [RespuestasVerdaderoFalsoService],
})
export class RespuestasVerdaderoFalsoModule {}
