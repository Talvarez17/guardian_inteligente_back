import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('payment_forms')
export class PaymentForm {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string

    @Column({ default: true })
    status: boolean
}
