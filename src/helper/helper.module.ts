import { Module } from '@nestjs/common';
import { Helper } from './helper.service';

@Module({
  providers: [Helper],
  exports: [Helper],
})
export class HelperModule {}
