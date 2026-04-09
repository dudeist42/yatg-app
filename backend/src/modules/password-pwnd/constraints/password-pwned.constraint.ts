import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PasswordPwnedValidationService } from '../password-pwned.service';

@ValidatorConstraint({ name: 'isPasswordNotPwned', async: true })
@Injectable()
export class IsPasswordNotPwnedConstraint implements ValidatorConstraintInterface {
  constructor(private service: PasswordPwnedValidationService) {}

  async validate(password: string): Promise<boolean> {
    return this.service.validate(password);
  }

  defaultMessage() {
    return 'Password has been compromised. Please use another one.';
  }
}

export function IsPasswordNotPwned(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsPasswordNotPwnedConstraint,
    });
  };
}
