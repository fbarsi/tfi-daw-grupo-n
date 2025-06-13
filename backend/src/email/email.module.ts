import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuestas } from 'src/encuestas/entities/encuestas.entity';
import { EncuestasService } from 'src/encuestas/encuestas.service';
import { EncuestasModule } from 'src/encuestas/encuestas.module';
import { PreguntasModule } from 'src/preguntas/preguntas.module';

@Module({
  imports:[EncuestasModule,
    TypeOrmModule.forFeature([Encuestas])
  ],
  controllers: [EmailController],
  providers: [EmailService]
})
export class EmailModule {}
