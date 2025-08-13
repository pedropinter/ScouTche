import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Evento } from "../models/evento";

const eventoRepository = AppDataSource.getRepository(Evento);

export class EventoController {
    async list(req: Request, res: Response) {
        const Evento = await eventoRepository.find();
        res.json(Evento);
        return
    }

    async create(req: Request, res: Response) {
        try {
            const { tipo, nome, desc, cep, modalidade } = req.body;

            const usuario = (req as any).user;
            const tipoConta = usuario?.tipoConta?.toLowerCase();

            if (!tipoConta) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const permissoes: Record<string, string[]> = {
                atleta: ["Jogo Amador"],
                profissional: ["Torneio"],
                clube: ["Torneio", "Peneira"]
            };

            if (!permissoes[tipoConta] || !permissoes[tipoConta].includes(tipo)) {
                return res.status(403).json({
                    message: `Usuário do tipo '${tipoConta}' não pode criar evento do tipo '${tipo}'.`
                });
            }

            if (!nome || !cep || !modalidade) {
                return res.status(400).json({ message: "Todos os campos são necessários!" });
            }

            // Consulta na API ViaCEP
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await viaCepResponse.json();

            if (endereco.erro) {
                return res.status(400).json({ message: "CEP inválido!" });
            }

            const novoEvento = eventoRepository.create({
                tipo,
                nome,
                desc,
                cep,
                modalidade,
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                localidade: endereco.localidade,
                uf: endereco.uf
            });

            await eventoRepository.save(novoEvento);

            res.status(201).json({
                message: "Evento criado com sucesso!",
                evento: novoEvento
            });
        } catch (error) {
            res.status(500).json({ message: "Erro interno ao criar evento", error });
        }
    }

    
    async show(req: Request, res: Response) {
        const { id } = req.params;

        const evento = await eventoRepository.findOneBy({ id: Number(id) });

        if (!evento) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return
        }

        res.json(evento);
        return
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, cep, modalidade } = req.body;

            const evento = await eventoRepository.findOneBy({ id: Number(id) });

            if (!evento) {
                return res.status(404).json({ message: 'Evento não encontrado' });
            }

            evento.nome = nome;
            evento.cep = cep;
            evento.modalidade = modalidade;

            // Atualiza endereço pelo CEP
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await viaCepResponse.json();

            if (endereco.erro) {
                return res.status(400).json({ message: "CEP inválido!" });
            }

            evento.logradouro = endereco.logradouro;
            evento.bairro = endereco.bairro;
            evento.localidade = endereco.localidade;
            evento.uf = endereco.uf;

            await eventoRepository.save(evento);

            res.json(evento);
        } catch (error) {
            res.status(500).json({ message: "Erro interno ao atualizar evento", error });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const evento = await eventoRepository.findOneBy({ id: Number(id) });

        if (!evento) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return
        }

        await eventoRepository.remove(evento);

        res.status(204).send();
        return
    }
}