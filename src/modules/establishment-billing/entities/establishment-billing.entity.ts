import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Establishment } from "../../establishment/entities/establishment.entity";
import { PaymentMethod } from "../../payment-method/entities/payment-method.entity";
import { PaymentForm } from "../../payment-form/entities/payment-form.entity";

@Entity('establishment_billing')
export class EstablishmentBilling {

    @PrimaryColumn('uuid')
    establishment_id: string;

    @OneToOne(() => Establishment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @Column('float')
    monthly_bill: number;

    @ManyToOne(() => PaymentMethod, { eager: true })
    @JoinColumn({ name: 'payment_method_id' })
    payment_method: PaymentMethod;

    @ManyToOne(() => PaymentForm, { eager: true })
    @JoinColumn({ name: 'payment_form_id' })
    payment_form: PaymentForm;
}
