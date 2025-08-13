import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Participar } from "./participar";
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

    @Column({ type: "varchar", length: 8 }) // ✅ CORRETO
    cep: string;

    @Column()
    logradouro!: string;

    @Column()
    bairro!: string;

    @Column()
    localidade!: string;

    @Column()
    uf!: string;

    @Column({type: "enum", enum: ['Basquete', 'Futebol', 'Volei','Handebol'], nullable: false})
    modalidade: string //USAR CHECK

    
   @ManyToOne(() => User    , (user) => user.eventos,{ nullable: true })
    user!:User | null;

    @OneToMany(() => Participar, (participar:Participar) => participar.eventoId,{ nullable: true })
    participar!:Participar[];

    //IDCLUBE E IDUSUARIO

    constructor(tipo: string,nome: string,desc: string ,cep: string, modalidade: string){
        this.tipo = tipo
        this.nome = nome
        this.desc = desc
        this.cep = cep
        this.modalidade = modalidade
    }
}