import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('checklist_item_types')
export class ChecklistItemType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string

    @Column({ default: true })
    status: boolean
}
