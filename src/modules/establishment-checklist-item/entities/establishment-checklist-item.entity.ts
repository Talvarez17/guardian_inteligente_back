import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { Establishment } from "../../establishment/entities/establishment.entity";
import { ChecklistItemType } from "../../checklist-item-type/entities/checklist-item-type.entity";
import { CaseSensitive } from "../../../common/decorators/case-sensitive.decorator";

@Entity('establishment_checklist_items')
@Unique(['establishment', 'item_type'])
export class EstablishmentChecklistItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Establishment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @ManyToOne(() => ChecklistItemType, { eager: true })
    @JoinColumn({ name: 'item_type_id' })
    item_type: ChecklistItemType;

    @Column({ default: false })
    completed: boolean;

    @Column({ nullable: true })
    @CaseSensitive()
    document_url?: string;

    @Column({ type: 'timestamp', nullable: true })
    completed_at?: Date;
}
