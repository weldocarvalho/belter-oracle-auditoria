import { Module } from '@nestjs/common';
import { MagicLinkAuthController } from './magic-link-auth.controller';
import { MagicLinkAuthPublisher } from './magic-link-auth.publisher';

@Module({
  controllers: [MagicLinkAuthController],
  providers: [MagicLinkAuthPublisher],
})
export class MagicLinkAuthModule {}
