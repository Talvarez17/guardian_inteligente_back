import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Establishment } from "../../establishment/entities/establishment.entity";
import { ClientRole } from "../../client-roles/entities/client-role.entity";
import { CaseSensitive } from "../../../common/decorators/case-sensitive.decorator";

@Entity('establishment_contacts')
export class EstablishmentContact {

    @PrimaryColumn('uuid')
    establishment_id: string;

    @OneToOne(() => Establishment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @ManyToOne(() => ClientRole, { eager: true })
    @JoinColumn({ name: 'contact_role_id' })
    contact_role: ClientRole;

    @Column()
    contact_name: string;

    @Column()
    contact_number: string;

    @Column()
    @CaseSensitive()
    contact_email: string;
}
