import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

   @ManyToOne(() => User, (user) => user.id)
  userId:User;

    //RELACIONAR CRIADO POR


    constructor(nome: string,cep: number, modalidade: string){
        this.nome = nome
        this.cep = cep
        this.modalidade = modalidade
    }
}