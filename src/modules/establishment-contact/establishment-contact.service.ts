import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstablishmentContact } from './entities/establishment-contact.entity';
import { UpsertEstablishmentContactDto } from './dto/upsert-establishment-contact.dto';
import { EstablishmentService } from '../establishment/establishment.service';
import { ClientRolesService } from '../client-roles/client-roles.service';

@Injectable()
export class EstablishmentContactService {

  constructor(
    @InjectRepository(EstablishmentContact) private readonly establishmentContactRepository: Repository<EstablishmentContact>,
    private readonly establishmentService: EstablishmentService,
    private readonly clientRolesService: ClientRolesService,
  ) { }

  async upsertContact(establishmentId: string, dto: UpsertEstablishmentContactDto): Promise<EstablishmentContact> {
    await this.establishmentService.findOneEstablishment(establishmentId);

    const { contact_role_id, ...contactData } = dto;

    const contact_role = await this.clientRolesService.findOneClientRole(contact_role_id);

    let contact = await this.establishmentContactRepository.findOne({ where: { establishment_id: establishmentId } });

    if (!contact) {
      contact = this.establishmentContactRepository.create({
        establishment_id: establishmentId,
        ...contactData,
        contact_role,
      });
    } else {
      Object.assign(contact, contactData);
      contact.contact_role = contact_role;
    }

    return this.establishmentContactRepository.save(contact);
  }

  async findByEstablishment(establishmentId: string): Promise<EstablishmentContact> {
    const contact = await this.establishmentContactRepository.findOne({ where: { establishment_id: establishmentId } });

    if (!contact) {
      throw new NotFoundException('Establishment contact not found');
    }

    return contact;
  }
}
