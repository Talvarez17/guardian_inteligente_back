import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstablishmentChecklistItem } from './entities/establishment-checklist-item.entity';
import { UpsertEstablishmentChecklistItemDto } from './dto/upsert-establishment-checklist-item.dto';
import { EstablishmentService } from '../establishment/establishment.service';
import { ChecklistItemTypeService } from '../checklist-item-type/checklist-item-type.service';
import { StorageService } from '../../common/storage/storage.service';

const STORAGE_FOLDER = 'establishment-checklist-items';

@Injectable()
export class EstablishmentChecklistItemService {

  constructor(
    @InjectRepository(EstablishmentChecklistItem) private readonly checklistItemRepository: Repository<EstablishmentChecklistItem>,
    private readonly establishmentService: EstablishmentService,
    private readonly checklistItemTypeService: ChecklistItemTypeService,
    private readonly storageService: StorageService,
  ) { }

  async findChecklistForEstablishment(establishmentId: string) {
    await this.establishmentService.findOneEstablishment(establishmentId);

    const [itemTypes, items] = await Promise.all([
      this.checklistItemTypeService.findAllActiveChecklistItemTypes(),
      this.checklistItemRepository.find({
        where: { establishment: { id: establishmentId } },
        relations: { item_type: true },
      }),
    ]);

    return itemTypes.map((itemType) => {
      const item = items.find((i) => i.item_type.id === itemType.id);

      return {
        item_type: itemType,
        completed: item?.completed ?? false,
        document_url: item?.document_url ?? null,
        completed_at: item?.completed_at ?? null,
      };
    });
  }

  async upsertChecklistItem(
    establishmentId: string,
    itemTypeId: number,
    dto: UpsertEstablishmentChecklistItemDto,
    file?: Express.Multer.File,
  ): Promise<EstablishmentChecklistItem> {
    const establishment = await this.establishmentService.findOneEstablishment(establishmentId);
    const item_type = await this.checklistItemTypeService.findOneChecklistItemType(itemTypeId);

    let item = await this.checklistItemRepository.findOne({
      where: { establishment: { id: establishmentId }, item_type: { id: itemTypeId } },
    });

    if (!item) {
      item = this.checklistItemRepository.create({ establishment, item_type });
    }

    item.completed = dto.completed;
    item.completed_at = dto.completed ? new Date() : undefined;

    const previousDocumentUrl = item.document_url;
    let newDocumentUrl: string | undefined;

    if (file) {
      newDocumentUrl = await this.storageService.uploadFile(file, STORAGE_FOLDER);
      item.document_url = newDocumentUrl;
    }

    try {
      const saved = await this.checklistItemRepository.save(item);

      if (newDocumentUrl && previousDocumentUrl) {
        await this.storageService.deleteFile(previousDocumentUrl);
      }

      return saved;
    } catch (error) {
      if (newDocumentUrl) {
        await this.storageService.deleteFile(newDocumentUrl);
      }

      throw error;
    }
  }
}
