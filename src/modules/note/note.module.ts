import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { HelperModule } from 'src/helper/helper.module';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
  imports: [PrismaModule, HelperModule],
})
export class NoteModule {}
