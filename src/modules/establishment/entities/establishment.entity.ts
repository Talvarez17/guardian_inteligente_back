import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Plan } from "../../plans/entities/plan.entity";
import { Turnover } from "../../turnover/entities/turnover.entity";
import { User } from "../../users/entities/user.entity";

export enum EstablishmentStatus {
    PROSPECTO = 'prospecto',
    ACTIVO = 'activo',
    BAJA = 'baja',
}

export enum EstablishmentRisk {
    BAJO = 'bajo',
    MEDIO = 'medio',
    ALTO = 'alto',
}

@Entity('establishments')
export class Establishment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    businessName: string;

    @Column({ unique: true })
    rfc: string;

    @ManyToOne(() => Turnover, { eager: true })
    @JoinColumn({ name: 'turnoverId' })
    turnover: Turnover;

    @Column()
    street: string;

    @Column()
    neighborhood: string;

    @Column()
    extNumber: string;

    @Column({ nullable: true })
    intNumber?: string;

    @Column()
    postalCode: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    contactName: string;

    @Column()
    contactNumber: string;

    @Column({ unique: true })
    email: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'designatedPersonId' })
    designatedPerson: User;

    @ManyToOne(() => Plan, { eager: true })
    @JoinColumn({ name: 'planId' })
    plan: Plan;

    @Column('float')
    monthlyBill: number;

    @Column()
    cameras: number;

    @Column({ type: 'enum', enum: EstablishmentStatus, default: EstablishmentStatus.PROSPECTO })
    status: EstablishmentStatus;

    @Column({ type: 'enum', enum: EstablishmentRisk })
    risk: EstablishmentRisk;

    @Column({ default: false })
    gia: boolean;

    @Column({ default: false })
    covia: boolean;

    @Column({ nullable: true })
    comment?: string;

    @Column({ default: true })
    active: boolean;
}
