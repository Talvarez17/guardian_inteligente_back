import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { DocumentalArea } from "../../documental-area/entities/documental-area.entity";
import { Establishment } from "../../establishment/entities/establishment.entity";

@Entity('documents')
@Unique(['establishment', 'name'])
export class Document {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Establishment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @Column()
    name: string;

    @ManyToOne(() => DocumentalArea, { eager: true })
    @JoinColumn({ name: 'area_id' })
    area: DocumentalArea;

    @Column({ default: true })
    status: boolean;

    @Column()
    version: string;

    @Column({ type: 'date' })
    expiration_date: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    comments?: string;
}
