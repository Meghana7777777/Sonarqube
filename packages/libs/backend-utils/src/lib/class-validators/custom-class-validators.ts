import { registerDecorator, ValidationOptions } from "class-validator";

export function IsNotBlank(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isNotBlank",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === "string" && value.trim().length > 0;
                }
            }
        });
    };
}

export function IsUUIDArray(property: string, isOptional: boolean, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isUUIDArray",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (isOptional) {
                        if (value.length == 0) {
                            return true;
                        } else {
                            const testResult: Set<boolean> = new Set();
                            for (let eachUuid of value) {
                                var uuidPattern = /^([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})/;
                                testResult.add(uuidPattern.test(eachUuid))
                            }
                            return testResult.size == 1 && testResult.has(true)
                        }
                    } else {
                        const testResult: Set<boolean> = new Set();
                        for (let eachUuid of value) {
                            var uuidPattern = /^([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})/;
                            testResult.add(uuidPattern.test(eachUuid))
                        }
                        return testResult.size == 1 && testResult.has(true)
                    }
                }

            }
        });
    };
}

export class SpaceValidators {
    public getValue(value: object, defaultValue: any): any {
        if (value) {
            Object.keys(value).map(k => value[k] = typeof value[k] == 'string' ? value[k].trim() : value[k]);
            return value;
        } else {
            return defaultValue;
        }
    } 
} 

