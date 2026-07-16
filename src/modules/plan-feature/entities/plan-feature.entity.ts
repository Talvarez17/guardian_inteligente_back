import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('plan-feature')
export class PlanFeature {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string;

    @Column({ default: true })
    status: boolean
}
