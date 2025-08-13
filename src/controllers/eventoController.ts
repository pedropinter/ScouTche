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
        const { tipo, nome, desc, cep, modalidade } = req.body;

        // Pegando o tipo de conta do usuário autenticado
        const usuario = (req as any).user;
        const tipoConta = usuario?.tipoConta?.toLowerCase();

        if (!tipoConta) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }

        // Regras de permissão por tipo de conta
        const permissoes: Record<string, string[]> = {
            atleta: ["Jogo Amador"],
            profissional: ["Torneio"],
            clube: ["Torneio", "Peneira"]
        };

        // Verifica se o tipo de evento é permitido
        if (!permissoes[tipoConta] || !permissoes[tipoConta].includes(tipo)) {
            res.status(403).json({
                message: `Usuário do tipo '${tipoConta}' não pode criar evento do tipo '${tipo}'.`
            });
            return;
        }

        // Validação de campos obrigatórios
        if (!nome || !cep || !modalidade) {
            res.status(400).json({ message: "Todos os campos são necessários!" });
            return;
        }

        // Criação do evento
        const novoEvento = eventoRepository.create(new Evento(tipo, nome, desc, cep, modalidade));
        await eventoRepository.save(novoEvento);

        res.status(201).json({
            message: "Evento criado com sucesso!",
            evento: novoEvento
        });
        return;
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
        const { id } = req.params;
        const { nome, cep, modalidade } = req.body;

        const evento = await eventoRepository.findOneBy({ id: Number(id) });

        if (!evento) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return
        }

        evento.nome = nome;
        evento.cep = cep;
        evento.modalidade = modalidade;

        await eventoRepository.save(evento);

        res.json(evento);
        return
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