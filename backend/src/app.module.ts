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
import { RespuestasVerdaderoFalso } from './respuestas-verdadero-falso/entities/respuestas-verdadero-falso.entity';
import { RespuestasVerdaderoFalsoModule } from './respuestas-verdadero-falso/respuestas-verdadero-falso.module';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.db_user'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        synchronize: config.get('database.synchronize'),
        logging: config.get('database.logging'),
      entities: [
        Encuestas, 
        Preguntas, 
        Respuestas, 
        Opciones, 
        RespuestasAbiertas, 
        RespuestasOpciones,
        RespuestasVerdaderoFalso
      ],
    }),
    }),
    EncuestasModule, 
    OpcionesModule, 
    PreguntasModule, 
    RespuestasModule, 
    RespuestasAbiertasModule,
    RespuestasOpcionesModule,
    RespuestasVerdaderoFalsoModule,
    EmailModule],
  controllers: [EmailController],
  providers: [EmailService], 
})
export class AppModule {}
