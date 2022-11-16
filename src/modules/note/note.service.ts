import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Helper } from 'src/helper/helper.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService, private helper: Helper) {}

  async createNote(body: Prisma.NotesUncheckedCreateInput) {
    const userId = this.helper.getToken();
    const note = {
      ...body,
      userId: Number(userId),
    };
    return JSON.parse(
      JSON.stringify(
        await this.prisma.notes.create({ data: note }),
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
  }

  async getNotesByUserId({ limit, page }: { limit: number; page: number }) {
    const userId = this.helper.getToken();
    const notesClause = { userId: Number(userId) };

    const offset = (page - 1) * limit;
    let notes = await this.prisma.notes.findMany({
      where: notesClause,
      skip: offset,
      take: limit,
    });
    notes = JSON.parse(
      JSON.stringify(notes, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
    return { notes, count: notes.length };
  }

  async getNoteByNoteId(noteId: number) {
    return this.prisma.notes.findUnique({ where: { noteId } });
  }

  async updateNote(noteId: number, body: Prisma.AccountUncheckedUpdateInput) {
    const updateClause = {
      noteId: BigInt(noteId),
    };
    return JSON.parse(
      JSON.stringify(
        await this.prisma.notes.update({ where: updateClause, data: body }),
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
  }

  async deleteNote(noteId: number) {
    await this.prisma.notes.delete({ where: { noteId } });
    return { message: 'Deleted Successfully' };
  }
}
