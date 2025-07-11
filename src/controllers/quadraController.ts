import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Quadra } from "../models/quadra";

const quadraRepository = AppDataSource.getRepository(Quadra);

export class QuadraController {
    async list(req: Request, res: Response) {
        const Quadra = await quadraRepository.find();
        res.json(Quadra);
        return
    }

    async create(req: Request, res: Response) {
        const { nome, cep, modalidade } = req.body;

        if (!nome || !cep || !modalidade) {
            res.status(400).json({ message: "Todos os campos são necessários!" })
            return
        }

        const Quadraa = new Quadra( nome, cep, modalidade)
        const newQuadra = await quadraRepository.create(Quadraa)
        await quadraRepository.save(newQuadra)

        res.status(201).json({ message: "Quadra Adicionada com Sucesso", quadra: newQuadra })
        return
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const quadra = await quadraRepository.findOneBy({ id: Number(id) });

        if (!quadra) {
            res.status(404).json({ message: 'Quadra não encontrado' });
            return
        }

        res.json(quadra);
        return
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, cep, modalidade } = req.body;

        const quadra = await quadraRepository.findOneBy({ id: Number(id) });

        if (!quadra) {
            res.status(404).json({ message: 'Quadra não encontrado' });
            return
        }

        quadra.nome = nome;
        quadra.cep = cep;
        quadra.modalidade = modalidade;

        await quadraRepository.save(quadra);

        res.json(quadra);
        return
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const quadra = await quadraRepository.findOneBy({ id: Number(id) });

        if (!quadra) {
            res.status(404).json({ message: 'Quadra não encontrado' });
            return
        }

        await quadraRepository.remove(quadra);

        res.status(204).send();
        return
    }
}