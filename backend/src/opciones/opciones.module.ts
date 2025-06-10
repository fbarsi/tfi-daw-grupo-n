import { Module } from '@nestjs/common';
import { OpcionesService } from './opciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opciones } from './entities/opciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Opciones])],
  providers: [OpcionesService],
  exports: [OpcionesService],
})
export class OpcionesModule {}
