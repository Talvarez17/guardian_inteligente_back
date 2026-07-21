import 'reflect-metadata';

export const CASE_SENSITIVE_KEY = 'case_sensitive';

/**
 * Marks a column as exempt from the global uppercase-on-save standard
 * (see UppercaseSubscriber). Use it for values whose casing is meaningful:
 * emails, passwords/hashes, URLs, tokens, etc.
 */
export function CaseSensitive(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(CASE_SENSITIVE_KEY, true, target, propertyKey);
  };
}
