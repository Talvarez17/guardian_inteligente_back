import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('documental_area')
export class DocumentalArea {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    area: string;

    @Column()
    description: string;

    @Column()
    color: string;

    @Column({ default: true })
    status: boolean;

}
