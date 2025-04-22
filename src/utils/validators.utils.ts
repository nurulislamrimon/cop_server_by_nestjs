import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

export const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

export const bdMobileNumberRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

@ValidatorConstraint({ name: 'IsBDMobileNumber', async: false })
export class IsBDMobileNumber implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return !value || bdMobileNumberRegex.test(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments): string {
    return 'Invalid Bangladeshi mobile number format';
  }
}
