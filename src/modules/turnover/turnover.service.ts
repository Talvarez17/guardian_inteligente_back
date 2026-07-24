import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTurnoverDto } from './dto/create-turnover.dto';
import { UpdateTurnoverDto } from './dto/update-turnover.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turnover } from './entities/turnover.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TurnoverService {

  constructor(@InjectRepository(Turnover) private readonly turnoverRepository: Repository<Turnover>) { }

  async createTurnover(createTurnoverDto: CreateTurnoverDto): Promise<Turnover> {
    const exists = await this.turnoverRepository.findOne({
      where: { name: createTurnoverDto.name }
    })

    if (exists) {
      throw new ConflictException('Turnover already exists');
    }

    const turnover = this.turnoverRepository.create(createTurnoverDto);

    return this.turnoverRepository.save(turnover);
  }

  async findAllTurnovers(onlyActive: boolean = false): Promise<Turnover[]> {
    return this.turnoverRepository.find({
      where: onlyActive ? { status: true } : {},
    });
  }

  async findOneTurnover(id: number): Promise<Turnover> {
    const turnover = await this.turnoverRepository.findOne({
      where: { id }
    })

    if (!turnover) {
      throw new NotFoundException('Turnover not found');
    }

    return turnover;
  }

  async updateTurnover(id: number, updateTurnoverDto: UpdateTurnoverDto): Promise<Turnover> {
    const turnover = await this.findOneTurnover(id);

    Object.assign(turnover, updateTurnoverDto);

    return this.turnoverRepository.save(turnover);
  }

  async deleteTurnover(id: number): Promise<{ message: string }> {
    const turnover = await this.findOneTurnover(id);

    turnover.status = false;

    await this.turnoverRepository.save(turnover);

    return { message: 'Turnover removed' };
  }
}
