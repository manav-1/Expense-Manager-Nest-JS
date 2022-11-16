import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private readonly accountService: NoteService) {}

  @Post()
  create(@Body() createNote: Prisma.NotesUncheckedCreateInput) {
    return this.accountService.createNote(createNote);
  }

  @Get()
  findAll(@Query() params) {
    return this.accountService.getNotesByUserId(params);
  }

  @Get(':noteId')
  findOne(@Param('noteId') noteId: number) {
    return this.accountService.getNoteByNoteId(noteId);
  }

  @Patch(':noteId')
  update(
    @Param('noteId') noteId: number,
    @Body() updateAccountDto: Prisma.AccountUncheckedUpdateInput,
  ) {
    return this.accountService.updateNote(noteId, updateAccountDto);
  }

  @Delete(':noteId')
  remove(@Param('noteId') noteId: number) {
    return this.accountService.deleteNote(noteId);
  }
}
