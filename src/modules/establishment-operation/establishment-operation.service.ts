import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstablishmentOperation } from './entities/establishment-operation.entity';
import { UpsertEstablishmentOperationDto } from './dto/upsert-establishment-operation.dto';
import { EstablishmentService } from '../establishment/establishment.service';

@Injectable()
export class EstablishmentOperationService {

  constructor(
    @InjectRepository(EstablishmentOperation) private readonly establishmentOperationRepository: Repository<EstablishmentOperation>,
    private readonly establishmentService: EstablishmentService,
  ) { }

  async upsertOperation(establishmentId: string, dto: UpsertEstablishmentOperationDto): Promise<EstablishmentOperation> {
    await this.establishmentService.findOneEstablishment(establishmentId);

    let operation = await this.establishmentOperationRepository.findOne({ where: { establishment_id: establishmentId } });

    if (!operation) {
      operation = this.establishmentOperationRepository.create({
        establishment_id: establishmentId,
        ...dto,
      });
    } else {
      Object.assign(operation, dto);
    }

    return this.establishmentOperationRepository.save(operation);
  }

  async findByEstablishment(establishmentId: string): Promise<EstablishmentOperation> {
    const operation = await this.establishmentOperationRepository.findOne({ where: { establishment_id: establishmentId } });

    if (!operation) {
      throw new NotFoundException('Establishment operation data not found');
    }

    return operation;
  }
}
