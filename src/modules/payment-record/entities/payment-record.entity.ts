import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Establishment } from "../../establishment/entities/establishment.entity";

@Entity('payment_records')
export class PaymentRecord {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Establishment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @Column({ type: 'int' })
    period_month: number;

    @Column({ type: 'int' })
    period_year: number;

    @Column()
    folio: string;

    @Column('float')
    amount: number;
}
