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
    first_last_name:string;

    @Column({ nullable: true })
    second_last_name?:string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    @Exclude()
    password:string;

    @Column({default: true})
    status: boolean;

    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => DocumentalArea, { eager: true, nullable: true })
    @JoinColumn({ name: 'documental_area_id' })
    documental_area?: DocumentalArea;

    @CreateDateColumn()
    created_at: Date;
}
