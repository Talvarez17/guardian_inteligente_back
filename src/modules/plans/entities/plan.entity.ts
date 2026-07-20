import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { PlanFeature } from "../../plan-feature/entities/plan-feature.entity";

@Entity('plans')
export class Plan {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column('float')
    amount: number;

    @Column()
    currency: string;

    @Column()
    frequency: string;

    @Column()
    trial: number;

    @Column()
    tries: number;

    @Column()
    comments: string;

    @ManyToMany(() => PlanFeature)
    @JoinTable({
        name: 'plan_features_relations',
        joinColumn: { name: 'plan_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'feature_id', referencedColumnName: 'id' },
    })
    features: PlanFeature[];

    @Column({ default: true })
    status: boolean;
}
