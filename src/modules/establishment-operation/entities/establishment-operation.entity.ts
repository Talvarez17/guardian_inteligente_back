import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Establishment, EstablishmentRisk } from "../../establishment/entities/establishment.entity";

@Entity('establishment_operations')
export class EstablishmentOperation {

    @PrimaryColumn('uuid')
    establishment_id: string;

    @OneToOne(() => Establishment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @Column({ type: 'enum', enum: EstablishmentRisk })
    risk: EstablishmentRisk;

    @Column({ nullable: true })
    risk_factor?: string;

    @Column({ default: false })
    gia: boolean;

    @Column({ default: false })
    covia: boolean;

    @Column({ default: false })
    ria: boolean;

    @Column({ nullable: true })
    inactive_factor?: string;

    @Column()
    cameras: number;

    @Column({ type: 'date', nullable: true })
    closing_date?: Date;

    @Column({ type: 'date', nullable: true })
    install_date?: Date;

    @Column({ type: 'date', nullable: true })
    real_install_date?: Date;
}
