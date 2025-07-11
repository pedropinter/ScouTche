import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('participar')
export class Participar{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "enum", enum: ['Inscrito', 'Selecionado', 'Rejeitado'], nullable: false})
    status: string

    @Column({type: "timestamp", nullable: false})
    data: Date 

    //OneToMany
    constructor(status: string, data: Date){
        this.status = status
        this.data = data
    }
}