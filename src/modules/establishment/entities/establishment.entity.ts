import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Plan } from "../../plans/entities/plan.entity";
import { Turnover } from "../../turnover/entities/turnover.entity";
import { User } from "../../users/entities/user.entity";

export enum EstablishmentStatus {
    PROSPECT = 'prospect',
    CLIENT = 'client',
    DEACTIVATE = 'deactivate',
}

export enum EstablishmentRisk {
    LOW = 'low',
    MID = 'mid',
    HIGH = 'high',
}

@Entity('establishments')
export class Establishment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    business_name: string;

    @Column({ unique: true })
    rfc: string;

    @ManyToOne(() => Turnover, { eager: true })
    @JoinColumn({ name: 'turnover_id' })
    turnover: Turnover;

    @Column()
    street: string;

    @Column()
    neighborhood: string;

    @Column()
    ext_number: string;

    @Column({ nullable: true })
    int_number?: string;

    @Column()
    postal_code: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'designated_person_id' })
    designated_person: User;

    @ManyToOne(() => Plan, { eager: true })
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;

    @Column({ type: 'enum', enum: EstablishmentStatus, default: EstablishmentStatus.PROSPECT })
    establishment_status: EstablishmentStatus;

    @Column({ nullable: true })
    comment?: string;

    @Column({ default: true })
    active: boolean;
}
