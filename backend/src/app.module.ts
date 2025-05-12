import { Module } from '@nestjs/common';
import { EncuestasModule } from './encuestas/encuestas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasModule } from './respuestas/respuestas.module';
import { PreguntasModule } from './preguntas/preguntas.module';
import { OpcionesModule } from './opciones/opciones.module';
import { RespuestasOpcionesModule } from './respuestas-opciones/respuestas-opciones.module';
import { RespuestasAbiertasModule } from './respuestas-abiertas/respuestas-abiertas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'tfi-db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    EncuestasModule, 
    OpcionesModule, 
    PreguntasModule, 
    RespuestasModule, 
    RespuestasAbiertasModule,
    RespuestasOpcionesModule], 
})
export class AppModule {}
