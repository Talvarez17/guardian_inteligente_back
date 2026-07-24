import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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
import { Establishment, EstablishmentStatus, EstablishmentRisk } from '../establishment/entities/establishment.entity';
import { EstablishmentContact } from '../establishment-contact/entities/establishment-contact.entity';
import { EstablishmentOperation } from '../establishment-operation/entities/establishment-operation.entity';
import { EstablishmentBilling } from '../establishment-billing/entities/establishment-billing.entity';
import { EstablishmentChecklistItem } from '../establishment-checklist-item/entities/establishment-checklist-item.entity';
import { PaymentRecord } from '../payment-record/entities/payment-record.entity';
import { Document } from '../documents/entities/document.entity';

const ADMIN_ROLE_NAME = 'admin';
const ADMIN_EMAIL = 'a@a.com';
const ADMIN_PASSWORD = '@@HOla12';

const CHECKLIST_ITEM_TYPES = [
  'Documentos',
  'Contrato',
  'Instalación',
  'Activación COVIA',
  'Activación GIA',
  'Activación RIA',
];

const DOCUMENTAL_AREAS = [
  {
    area: 'Legal',
    description: 'Área encargada de contratos y cumplimiento normativo',
    color: '#1D4ED8',
  },
  {
    area: 'Operaciones',
    description: 'Área encargada de instalación y monitoreo',
    color: '#059669',
  },
];

const DOCUMENT_TYPES = [
  { name: 'Contrato de servicio', category_id: 1, validity: 365 },
  { name: 'Identificación oficial', category_id: 2, validity: 1825 },
];

const CLIENT_ROLES = ['Representante legal', 'Gerente de operaciones'];

const TURNOVERS = ['Comercio minorista', 'Restaurante'];

const PAYMENT_METHODS = [
  'Efectivo',
  'Transferencia bancaria',
  'Tarjeta de crédito',
];

const PAYMENT_FORMS = ['PUE', 'PPD'];

const PLAN_FEATURES = [
  'Conectividad con las autoridades',
  'Plataforma de monitoreo',
  'Almacenamiento de grabación',
  'Adhesión de software con biometría',
  'Instalación de cámara',
  'Cámara Inteligente',
  'Plazo mínimo de 12 meses',
  'Entrega de reportes',
  'GIA (Aplicación de mensajería segura)',
];

const PLANS_DATA: {
  name: string;
  amount: number;
  trial: number;
  comments: string;
  features: string[];
}[] = [
  {
    name: 'Bienvenida',
    amount: 199,
    trial: 15,
    comments: 'Ideal para negocios pequeños que están comenzando.',
    features: [
      'Conectividad con las autoridades',
      'Plataforma de monitoreo',
      'GIA (Aplicación de mensajería segura)',
    ],
  },
  {
    name: 'Bienvenida Plus',
    amount: 299,
    trial: 0,
    comments: 'Para negocios en crecimiento que necesitan más respaldo.',
    features: [
      'Conectividad con las autoridades',
      'Plataforma de monitoreo',
      'Almacenamiento de grabación',
      'GIA (Aplicación de mensajería segura)',
    ],
  },
  {
    name: 'Premium',
    amount: 999,
    trial: 0,
    comments: 'Pensado para operaciones robustas con mayor exigencia.',
    features: [
      'Conectividad con las autoridades',
      'Plataforma de monitoreo',
      'Almacenamiento de grabación',
      'Adhesión de software con biometría',
      'GIA (Aplicación de mensajería segura)',
    ],
  },
  {
    name: 'Empresarial',
    amount: 3499,
    trial: 0,
    comments: 'Cobertura completa para corporativos y cadenas.',
    features: PLAN_FEATURES,
  },
];

const TEST_USER_EMAIL = 'ana.martinez@test.com';
const TEST_USER_PASSWORD = 'Prueba123!';
const TEST_ESTABLISHMENT_RFC = 'GIT010101AB1';
const TEST_CONTACT_EMAIL = 'contacto@test.com';
const TEST_DOCUMENT_URL = 'https://example.com/docs/aviso-privacidad.pdf';

function monthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ChecklistItemType)
    private readonly checklistItemTypeRepository: Repository<ChecklistItemType>,
    @InjectRepository(DocumentalArea)
    private readonly documentalAreaRepository: Repository<DocumentalArea>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(ClientRole)
    private readonly clientRoleRepository: Repository<ClientRole>,
    @InjectRepository(Turnover)
    private readonly turnoverRepository: Repository<Turnover>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(PaymentForm)
    private readonly paymentFormRepository: Repository<PaymentForm>,
    @InjectRepository(PlanFeature)
    private readonly planFeatureRepository: Repository<PlanFeature>,
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    @InjectRepository(EstablishmentContact)
    private readonly establishmentContactRepository: Repository<EstablishmentContact>,
    @InjectRepository(EstablishmentOperation)
    private readonly establishmentOperationRepository: Repository<EstablishmentOperation>,
    @InjectRepository(EstablishmentBilling)
    private readonly establishmentBillingRepository: Repository<EstablishmentBilling>,
    @InjectRepository(EstablishmentChecklistItem)
    private readonly establishmentChecklistItemRepository: Repository<EstablishmentChecklistItem>,
    @InjectRepository(PaymentRecord)
    private readonly paymentRecordRepository: Repository<PaymentRecord>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async onApplicationBootstrap() {
    const adminRole = await this.ensureNamed(
      this.roleRepository,
      ADMIN_ROLE_NAME,
    );
    const admin = await this.ensureAdminUser(adminRole);

    for (const name of CHECKLIST_ITEM_TYPES) {
      await this.ensureNamed(this.checklistItemTypeRepository, name);
    }

    const documentalAreas = await Promise.all(
      DOCUMENTAL_AREAS.map((data) => this.ensureDocumentalArea(data)),
    );

    for (const data of DOCUMENT_TYPES) {
      await this.ensureDocumentType(data);
    }

    const clientRoles = await Promise.all(
      CLIENT_ROLES.map((name) =>
        this.ensureNamed(this.clientRoleRepository, name),
      ),
    );
    const turnovers = await Promise.all(
      TURNOVERS.map((name) => this.ensureNamed(this.turnoverRepository, name)),
    );
    const paymentMethods = await Promise.all(
      PAYMENT_METHODS.map((name) =>
        this.ensureNamed(this.paymentMethodRepository, name),
      ),
    );
    const paymentForms = await Promise.all(
      PAYMENT_FORMS.map((name) =>
        this.ensureNamed(this.paymentFormRepository, name),
      ),
    );
    const planFeatures = await Promise.all(
      PLAN_FEATURES.map((name) =>
        this.ensureNamed(this.planFeatureRepository, name),
      ),
    );

    const plans = await this.ensurePlans(planFeatures);
    const testUser = await this.ensureTestUser(adminRole, documentalAreas[0]);
    const establishment = await this.ensureEstablishment(
      turnovers[0],
      testUser,
      plans[0],
    );

    await this.ensureEstablishmentContact(establishment, clientRoles[0]);
    await this.ensureEstablishmentOperation(establishment);
    await this.ensureEstablishmentBilling(
      establishment,
      paymentMethods[1],
      paymentForms[0],
    );
    await this.ensureEstablishmentChecklistItems(establishment);
    await this.ensurePaymentRecord(establishment);
    await this.ensureDocument(establishment, documentalAreas[0]);

    void admin;
  }

  private async ensureNamed<T extends { id: number | string; name: string }>(
    repository: Repository<T>,
    name: string,
  ): Promise<T> {
    const existing = await repository.findOne({ where: { name } as any });
    if (existing) return existing;

    const created = repository.create({ name } as unknown as T);
    const saved = await repository.save(created);
    this.logger.log(`${repository.metadata.name} "${name}" created`);

    return saved;
  }

  private async ensureAdminUser(role: Role): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: ADMIN_EMAIL },
    });
    if (existing) return existing;

    const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = this.userRepository.create({
      name: 'Admin',
      first_last_name: 'Admin',
      email: ADMIN_EMAIL,
      password,
      role,
    });

    const saved = await this.userRepository.save(admin);
    this.logger.log(`Admin user "${ADMIN_EMAIL}" created`);

    return saved;
  }

  private async ensureDocumentalArea(data: {
    area: string;
    description: string;
    color: string;
  }): Promise<DocumentalArea> {
    const existing = await this.documentalAreaRepository.findOne({
      where: { area: data.area },
    });
    if (existing) return existing;

    const saved = await this.documentalAreaRepository.save(
      this.documentalAreaRepository.create(data),
    );
    this.logger.log(`Documental area "${data.area}" created`);

    return saved;
  }

  private async ensureDocumentType(data: {
    name: string;
    category_id: number;
    validity: number;
  }): Promise<DocumentType> {
    const existing = await this.documentTypeRepository.findOne({
      where: { name: data.name },
    });
    if (existing) return existing;

    const saved = await this.documentTypeRepository.save(
      this.documentTypeRepository.create(data),
    );
    this.logger.log(`Document type "${data.name}" created`);

    return saved;
  }

  private async ensurePlans(planFeatures: PlanFeature[]): Promise<Plan[]> {
    const featureByName = new Map(
      planFeatures.map((feature) => [feature.name, feature]),
    );
    const plans: Plan[] = [];

    for (const data of PLANS_DATA) {
      const existing = await this.planRepository.findOne({
        where: { name: data.name },
        relations: { features: true },
      });
      if (existing) {
        plans.push(existing);
        continue;
      }

      const plan = this.planRepository.create({
        name: data.name,
        amount: data.amount,
        currency: 'MXN',
        frequency: 'Mensual',
        trial: data.trial,
        tries: 3,
        comments: data.comments,
        features: data.features.map((name) => featureByName.get(name)!),
      });

      const saved = await this.planRepository.save(plan);
      this.logger.log(`Plan "${data.name}" created`);

      plans.push(saved);
    }

    return plans;
  }

  private async ensureTestUser(
    role: Role,
    documentalArea: DocumentalArea,
  ): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: TEST_USER_EMAIL },
    });
    if (existing) return existing;

    const password = await bcrypt.hash(TEST_USER_PASSWORD, 10);
    const user = this.userRepository.create({
      name: 'Ana',
      first_last_name: 'Martínez',
      second_last_name: 'Ruiz',
      email: TEST_USER_EMAIL,
      password,
      role,
      documental_area: documentalArea,
    });

    const saved = await this.userRepository.save(user);
    this.logger.log(`Test user "${TEST_USER_EMAIL}" created`);

    return saved;
  }

  private async ensureEstablishment(
    turnover: Turnover,
    designatedPerson: User,
    plan: Plan,
  ): Promise<Establishment> {
    const existing = await this.establishmentRepository.findOne({
      where: { rfc: TEST_ESTABLISHMENT_RFC },
    });
    if (existing) return existing;

    const establishment = this.establishmentRepository.create({
      name: 'Sucursal Centro',
      business_name: 'Comercializadora de Prueba S.A. de C.V.',
      rfc: TEST_ESTABLISHMENT_RFC,
      turnover,
      street: 'Av. Reforma',
      neighborhood: 'Centro',
      ext_number: '123',
      int_number: 'A',
      postal_code: '06000',
      state: 'Ciudad de México',
      city: 'Ciudad de México',
      designated_person: designatedPerson,
      plan,
      establishment_status: EstablishmentStatus.CLIENT,
      comment: 'Establecimiento de prueba generado por la semilla',
      active: true,
    });

    const saved = await this.establishmentRepository.save(establishment);
    this.logger.log(`Establishment "Sucursal Centro" created`);

    return saved;
  }

  private async ensureEstablishmentContact(
    establishment: Establishment,
    contactRole: ClientRole,
  ): Promise<void> {
    const existing = await this.establishmentContactRepository.findOne({
      where: { establishment_id: establishment.id },
    });
    if (existing) return;

    await this.establishmentContactRepository.save(
      this.establishmentContactRepository.create({
        establishment_id: establishment.id,
        contact_role: contactRole,
        contact_name: 'María Gómez',
        contact_number: '5555555555',
        contact_email: TEST_CONTACT_EMAIL,
      }),
    );
    this.logger.log(
      `Establishment contact for "${establishment.name}" created`,
    );
  }

  private async ensureEstablishmentOperation(
    establishment: Establishment,
  ): Promise<void> {
    const existing = await this.establishmentOperationRepository.findOne({
      where: { establishment_id: establishment.id },
    });
    if (existing) return;

    await this.establishmentOperationRepository.save(
      this.establishmentOperationRepository.create({
        establishment_id: establishment.id,
        risk: EstablishmentRisk.MID,
        risk_factor: 'Zona con incidencia media',
        gia: true,
        covia: false,
        ria: true,
        cameras: 8,
        install_date: monthsAgo(6),
        real_install_date: monthsAgo(5),
      }),
    );
    this.logger.log(
      `Establishment operation for "${establishment.name}" created`,
    );
  }

  private async ensureEstablishmentBilling(
    establishment: Establishment,
    paymentMethod: PaymentMethod,
    paymentForm: PaymentForm,
  ): Promise<void> {
    const existing = await this.establishmentBillingRepository.findOne({
      where: { establishment_id: establishment.id },
    });
    if (existing) return;

    await this.establishmentBillingRepository.save(
      this.establishmentBillingRepository.create({
        establishment_id: establishment.id,
        monthly_bill: 1500,
        payment_method: paymentMethod,
        payment_form: paymentForm,
      }),
    );
    this.logger.log(
      `Establishment billing for "${establishment.name}" created`,
    );
  }

  private async ensureEstablishmentChecklistItems(
    establishment: Establishment,
  ): Promise<void> {
    const itemTypes = await this.checklistItemTypeRepository.find();

    for (const [index, itemType] of itemTypes.entries()) {
      const existing = await this.establishmentChecklistItemRepository.findOne({
        where: {
          establishment: { id: establishment.id },
          item_type: { id: itemType.id },
        },
      });
      if (existing) continue;

      const completed = index % 2 === 0;

      await this.establishmentChecklistItemRepository.save(
        this.establishmentChecklistItemRepository.create({
          establishment,
          item_type: itemType,
          completed,
          completed_at: completed ? new Date() : undefined,
        }),
      );
    }

    this.logger.log(
      `Establishment checklist items for "${establishment.name}" created`,
    );
  }

  private async ensurePaymentRecord(
    establishment: Establishment,
  ): Promise<void> {
    const existing = await this.paymentRecordRepository.findOne({
      where: { folio: 'REC-0001' },
    });
    if (existing) return;

    const now = new Date();

    await this.paymentRecordRepository.save(
      this.paymentRecordRepository.create({
        establishment,
        period_month: now.getMonth() + 1,
        period_year: now.getFullYear(),
        folio: 'REC-0001',
        amount: 1500,
      }),
    );
    this.logger.log(`Payment record "REC-0001" created`);
  }

  private async ensureDocument(
    establishment: Establishment,
    area: DocumentalArea,
  ): Promise<void> {
    const existing = await this.documentRepository.findOne({
      where: { name: 'Aviso de privacidad' },
      relations: { establishment: true },
    });
    if (existing) {
      if (!existing.establishment) {
        existing.establishment = establishment;
        await this.documentRepository.save(existing);
        this.logger.log(
          `Document "Aviso de privacidad" backfilled with establishment "${establishment.name}"`,
        );
      }
      return;
    }

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    await this.documentRepository.save(
      this.documentRepository.create({
        establishment,
        name: 'Aviso de privacidad',
        area,
        status: true,
        version: '1.0',
        expiration_date: expirationDate.toISOString().slice(0, 10),
        url: TEST_DOCUMENT_URL,
        comments: 'Documento de prueba generado por la semilla',
      }),
    );
    this.logger.log(`Document "Aviso de privacidad" created`);
  }
}
