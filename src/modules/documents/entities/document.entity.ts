import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { DocumentalArea } from "../../documental-area/entities/documental-area.entity";

@Entity('documents')
export class Document {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => DocumentalArea, { eager: true })
    @JoinColumn({ name: 'area_id' })
    area: DocumentalArea;

    @Column({ default: true })
    status: boolean;

    @Column()
    version: string;

    @Column({ type: 'date' })
    expiration_date: Date;

    @Column()
    url: string;

    @Column({ nullable: true })
    comments?: string;
}
