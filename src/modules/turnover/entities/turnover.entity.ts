import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('turnovers')
export class Turnover {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: true })
    status: boolean;
}
