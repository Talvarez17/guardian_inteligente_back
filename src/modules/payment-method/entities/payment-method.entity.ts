import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('payment_methods')
export class PaymentMethod {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string

    @Column({ default: true })
    status: boolean
}
