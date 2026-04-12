import { User } from '../entities/user.entity';

export class UserResponse {
  data: User;

  constructor(user: User) {
    this.data = user;
  }
}
