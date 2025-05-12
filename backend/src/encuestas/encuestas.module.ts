import { Module } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { EncuestasController } from './encuestas.controller';
import { Encuestas } from './entities/encuestas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Encuestas])],
  controllers: [EncuestasController],
  providers: [EncuestasService],
})
export class EncuestasModule {}
