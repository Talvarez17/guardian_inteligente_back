import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('document_type')
export class DocumentType {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    name:string;

    @Column()
    category_id:number;

    @Column()
    validity:number;

    @Column({default: true})
    status:boolean


}
