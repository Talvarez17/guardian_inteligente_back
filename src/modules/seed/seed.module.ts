import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { ChecklistItemType } from '../checklist-item-type/entities/checklist-item-type.entity';
import { DocumentalArea } from '../documental-area/entities/documental-area.entity';
import { DocumentType } from '../document-type/entities/document-type.entity';
import { ClientRole } from '../client-roles/entities/client-role.entity';
import { Turnover } from '../turnover/entities/turnover.entity';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';
import { PaymentForm } from '../payment-form/entities/payment-form.entity';
import { PlanFeature } from '../plan-feature/entities/plan-feature.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Establishment } from '../establishment/entities/establishment.entity';
import { EstablishmentContact } from '../establishment-contact/entities/establishment-contact.entity';
import { EstablishmentOperation } from '../establishment-operation/entities/establishment-operation.entity';
import { EstablishmentBilling } from '../establishment-billing/entities/establishment-billing.entity';
import { EstablishmentChecklistItem } from '../establishment-checklist-item/entities/establishment-checklist-item.entity';
import { PaymentRecord } from '../payment-record/entities/payment-record.entity';
import { Document } from '../documents/entities/document.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Role,
    User,
    ChecklistItemType,
    DocumentalArea,
    DocumentType,
    ClientRole,
    Turnover,
    PaymentMethod,
    PaymentForm,
    PlanFeature,
    Plan,
    Establishment,
    EstablishmentContact,
    EstablishmentOperation,
    EstablishmentBilling,
    EstablishmentChecklistItem,
    PaymentRecord,
    Document,
  ])],
  providers: [SeedService],
})
export class SeedModule { }
