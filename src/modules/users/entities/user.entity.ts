import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { DocumentalArea } from '../../documental-area/entities/documental-area.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name:string;

    @Column()
    firstLastName:string;

    @Column({nullable: true})
    secondLastName?:string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    @Exclude()
    password:string;

    @Column({default: true})
    status: boolean;

    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @ManyToOne(() => DocumentalArea, { eager: true, nullable: true })
    @JoinColumn({ name: 'documentalAreaId' })
    documentalArea?: DocumentalArea;

    @CreateDateColumn()
    createdAt: Date;
}
