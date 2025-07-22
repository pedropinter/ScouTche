import {Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad, BeforeInsert, BeforeUpdate,} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Evento } from './evento';
import { Quadra } from './quadra';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  senha!: string;

  @Column({ nullable: true })
  tipoConta!: string;

  @Column({ nullable: true })
  sobrenome?: string;

  @Column({ type: 'date', nullable: true })
  nascimento?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fotoPerfil?: string | null;

   @OneToMany(() => Evento, evento => evento.user,{ nullable: true })
   eventos:Evento[];

   @OneToMany(() => Quadra, quadra => quadra.user,{ nullable: true })
   quadras:Quadra[];
}
/*
  private originalPassword!: string;

  @AfterLoad()
  setOriginalPassword() {
    this.originalPassword = this.senha;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Se a senha foi modificada e não está hashada, gera o hash
    if (this.senha !== this.originalPassword) {
      if (!this.senha.startsWith('$2a$') && !this.senha.startsWith('$2b$') && !this.senha.startsWith('$2y$')) {
        this.senha = await bcrypt.hash(this.senha, 10);
      }
    }
  }
*/