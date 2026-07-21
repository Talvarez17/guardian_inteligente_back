import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  EntityMetadata,
} from 'typeorm';
import { CASE_SENSITIVE_KEY } from '../decorators/case-sensitive.decorator';

/**
 * Application-wide storage standard: text columns are persisted in uppercase,
 * except columns explicitly marked with @CaseSensitive() (emails, passwords,
 * URLs, tokens, etc). Runs at the persistence boundary so it applies no
 * matter which service/path writes the entity.
 */
@EventSubscriber()
export class UppercaseSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>) {
    this.applyUppercase(event.entity, event.metadata);
  }

  beforeUpdate(event: UpdateEvent<any>) {
    if (event.entity) {
      this.applyUppercase(event.entity, event.metadata);
    }
  }

  private applyUppercase(entity: any, metadata: EntityMetadata) {
    if (!entity) return;

    for (const column of metadata.columns) {
      if (column.isPrimary || column.relationMetadata || column.enum) continue;

      const propertyName = column.propertyName;
      const value = entity[propertyName];
      if (typeof value !== 'string') continue;

      const isCaseSensitive = Reflect.getMetadata(CASE_SENSITIVE_KEY, entity, propertyName);
      if (isCaseSensitive) continue;

      entity[propertyName] = value.toUpperCase();
    }
  }
}
