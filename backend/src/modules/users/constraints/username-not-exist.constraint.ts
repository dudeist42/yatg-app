import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'UsernameNotExist', async: true })
@Injectable()
export class UsernameNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(username: string) {
    const user = await this.usersService.findByUsername(username);
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `Username "${args.value}" is already taken`;
  }
}

export function UsernameNotExist(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: UsernameNotExistConstraint,
    });
  };
}
