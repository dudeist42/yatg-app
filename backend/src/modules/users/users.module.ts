import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsernameNotExistConstraint } from './constraints/username-not-exist.constraint';

@Module({
  providers: [UsersService, UsernameNotExistConstraint],
  exports: [UsersService, UsernameNotExistConstraint],
})
export class UsersModule {}
