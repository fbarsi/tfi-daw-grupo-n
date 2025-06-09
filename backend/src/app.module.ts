import { Module } from '@nestjs/common';
import { EncuestasModule } from './encuestas/encuestas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasModule } from './respuestas/respuestas.module';
import { PreguntasModule } from './preguntas/preguntas.module';
import { OpcionesModule } from './opciones/opciones.module';
import { RespuestasOpcionesModule } from './respuestas-opciones/respuestas-opciones.module';
import { RespuestasAbiertasModule } from './respuestas-abiertas/respuestas-abiertas.module';
import { Preguntas } from './preguntas/entities/preguntas.entity';
import { Respuestas } from './respuestas/entities/respuestas.entity';
import { Encuestas } from './encuestas/entities/encuestas.entity';
import { Opciones } from './opciones/entities/opciones.entity';
import { RespuestasAbiertas } from './respuestas-abiertas/entities/respuestas-abiertas.entity';
import { RespuestasOpciones } from './respuestas-opciones/entities/respuestas-opciones.entity';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    })
    ,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'syra123',
      database: 'encuestas',
      entities: [
        Encuestas, 
        Preguntas, 
        Respuestas, 
        Opciones, 
        RespuestasAbiertas, 
        RespuestasOpciones
      ],
      synchronize: false
    }),
    EncuestasModule, 
    OpcionesModule, 
    PreguntasModule, 
    RespuestasModule, 
    RespuestasAbiertasModule,
    RespuestasOpcionesModule,
    EmailModule], 
})
export class AppModule {}
