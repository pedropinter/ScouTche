import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { UserRepository } from "../repositories/UserRepositorie"
import * as jwt from "jsonwebtoken";
import "dotenv/config";


const userRepository = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const userRepo = new UserRepository();


export const UserController = {
        async logout(req: Request, res: Response) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

    res.status(200).json({ message: "Logout successful" });
  },
  register: async (req: Request, res: Response) => {
    try {
      const { nome, email, senha, confirmarSenha, tipoConta } = req.body;

      if (!nome || !email || !senha || !confirmarSenha || !tipoConta) {
        res.status(400).json({ mensagem: 'Preencha todos os campos.' });
        return
      }

      if (senha !== confirmarSenha) {
        res.status(400).json({ mensagem: 'As senhas não coincidem.' });
        return
      }

      const existe = await userRepository.findOneBy({ email });
      if (existe) {
        res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
        return
      }

      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const novoUsuario = userRepository.create({
        nome,
        email,
        senha: senhaCriptografada,
        tipoConta,
        avatar:0
      });

      await userRepository.save(novoUsuario);
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
      return
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
      return
    }
  },

  login: async (req: Request, res: Response) => {

    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({ mensagem: 'Preencha todos os campos.' });
        return
      }

      const user = await userRepository.findOneBy({ email });
      if (!user) {
        res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        return
      }

      const senhaCorreta = await bcrypt.compare(senha, user.senha);
      if (!senhaCorreta) {
        res.status(401).json({ mensagem: 'Senha incorreta.' });
        return
      }
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      res.status(200).json({
        mensagem: 'Login bem-sucedido!',
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipoConta: user.tipoConta,
          fotoPerfil: user.fotoPerfil
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao realizar login.' });
      return
    }
  },

  atualizarPerfil: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nome, sobrenome, nascimento, bio } = req.body;

      const user = await userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        return
      }

      user.nome = nome || user.nome;
      user.sobrenome = sobrenome || user.sobrenome;
      user.nascimento = nascimento || user.nascimento;
      user.bio = bio || user.bio;

      await userRepository.save(user);
      res.status(200).json({ mensagem: 'Perfil atualizado com sucesso!', user });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao atualizar perfil.' });
      return
    }
  },

  uploadFoto: async (req: Request, res: Response) => {
    try {
      const { id} = req.params;
      const { avatar} = req.body;
   const user = await userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        return
      }
  user.avatar=avatar

      await userRepository.save(user);

      res.status(200).json({ mensagem: 'Foto de perfil atualizada com sucesso!' });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao atualizar a foto.' });
      return
    }
  },



  listarPerfil: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await userRepository.findOneBy({ id: Number(id) });

      if (!user) {
        res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        return
      }

      res.status(200).json(user);
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao buscar perfil.' });
      return
    }
  }
};