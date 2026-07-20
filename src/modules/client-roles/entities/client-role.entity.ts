import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('client_roles')
export class ClientRole {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string

    @Column({ default: true })
    status: boolean
}
