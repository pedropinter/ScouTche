import { Entity, PrimaryGeneratedColumn, Column,ManyToOne} from "typeorm";
import { User } from "./User";

@Entity('quadra')
export class Quadra{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255, nullable: false})
    nome: string

    @Column({type: "smallint", length: 255, nullable: false})
    cep: number //USAR API PARA VERIFICAR

    @Column({type: "enum", enum: ['Basquete', 'Futebol', 'Volei','Handebol'], nullable: false})
    modalidade: string //USAR CHECK


    //RELACIONAR CRIADO POR
 @ManyToOne(() => User, (user:User) => user.quadras,{ nullable: true })
    user!:User|null;

    constructor(nome: string,cep: number, modalidade: string){
        this.nome = nome
        this.cep = cep
        this.modalidade = modalidade
    }
}