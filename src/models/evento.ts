import { Entity, PrimaryGeneratedColumn, Column,ManyToOne } from "typeorm";
import { User } from "./User";

@Entity('evento')
export class Evento{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "enum", enum: ['Amistoso', 'Peneira', 'Varzea'], nullable: false})
    tipo: string //USAR CHECK

    @Column({type: "varchar", length: 255, nullable: false})
    nome: string

    @Column({type: "varchar", length: 255})
    desc: string    

    @Column({type: "smallint", length: 255, nullable: false})
    cep: number //USAR API PARA VERIFICAR

    @Column({type: "enum", enum: ['Basquete', 'Futebol', 'Volei','Handebol'], nullable: false})
    modalidade: string //USAR CHECK

    
    @ManyToOne(() => User, (user:User) => user.eventos,{ nullable: true })
    user!:User|null;

    //IDCLUBE E IDUSUARIO

    constructor(tipo: string,nome: string,desc: string ,cep: number, modalidade: string){
        this.tipo = tipo
        this.nome = nome
        this.desc = desc
        this.cep = cep
        this.modalidade = modalidade
    }
}