import { Participar } from "../models/participar";
import { User } from "../models/User";
import { Evento } from "../models/evento";
import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";

const participantesRepository = AppDataSource.getRepository(Participar);
const userRepository = AppDataSource.getRepository(User);
const eventoRepository = AppDataSource.getRepository(Evento);

export class participanteController {
  // Entrar no evento
  async entryCamp(req: Request, res: Response) {
    const { userId, eventoId } = req.body;

    const user = await userRepository.findOneBy({ id: Number(userId) });
    if (!user) {
      res.status(400).json({ message: "Usuário não encontrado" });
      return;
    }

    const evento = await eventoRepository.findOneBy({ id: Number(eventoId) });
    if (!evento) {
      res.status(400).json({ message: "Evento não encontrado" });
      return;
    }

    // 🔹 Impede duplicados
    const participanteExistente = await participantesRepository.findOne({
      where: { userId: { id: Number(userId) }, eventoId: { id: Number(eventoId) } }
    });

    if (participanteExistente) {
      res.status(400).json({ message: "Usuário já participa deste evento" });
      return;
    }

    const participante = participantesRepository.create({
      userId: user,
      eventoId: evento,
    });

    await participantesRepository.save(participante);
    res.status(201).json(participante);
  }

  // Verificar se o usuário participa
  async verParticipacao(req: Request, res: Response) {
    const { userId, eventoId } = req.query;

    if (!userId || !eventoId) {
      res.status(400).json({ message: "userId e eventoId são obrigatórios" });
      return;
    }

    const participanteExistente = await participantesRepository.findOne({
      where: {
        userId: { id: Number(userId) },
        eventoId: { id: Number(eventoId) }
      }
    });

    res.status(200).json({ participando: !!participanteExistente });
  }

  // Sair do evento
  async sairEvento(req: Request, res: Response): Promise<void> {
    try {
      const { eventoId, userId } = req.params;

      const participante = await participantesRepository.findOne({
        where: {
          eventoId: { id: Number(eventoId) },
          userId: { id: Number(userId) }
        }
      });

      if (!participante) {
        res.status(404).json({ message: "Participação não encontrada" });
        return;
      }

      await participantesRepository.remove(participante);
      res.status(200).json({ message: "Usuário removido do evento com sucesso" });
    } catch (err) {
      console.error("Erro ao sair do evento:", err);
      res.status(500).json({ message: "Erro interno ao sair do evento" });
    }
  }
}