import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { DocumentalArea } from "../../documental-area/entities/documental-area.entity";

@Entity('documents')
export class Document {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => DocumentalArea, { eager: true })
    @JoinColumn({ name: 'areaId' })
    area: DocumentalArea;

    @Column({ default: true })
    status: boolean;

    @Column()
    version: string;

    @Column({ type: 'date' })
    expirationDate: Date;

    @Column()
    url: string;

    @Column({ nullable: true })
    comments?: string;
}
