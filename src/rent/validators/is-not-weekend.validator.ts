import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotWeekend(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsNotWeekend',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            value instanceof Date &&
            value.getDay() !== 0 &&
            value.getDay() !== 6
          );
        },
      },
    });
  };
}
