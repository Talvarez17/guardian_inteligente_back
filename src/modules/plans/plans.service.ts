import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { PlanFeatureService } from '../plan-feature/plan-feature.service';

@Injectable()
export class PlansService {

  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    private readonly planFeatureService: PlanFeatureService,
  ) { }

  async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
    const exists = await this.planRepository.findOne({
      where: { name: createPlanDto.name }
    })

    if (exists) {
      throw new ConflictException('Plan already exists');
    }

    const { featureIds, ...planData } = createPlanDto;

    const features = await Promise.all(
      featureIds.map((id) => this.planFeatureService.findOneFeature(id)),
    );

    const plan = this.planRepository.create({
      ...planData,
      features,
    })

    return this.planRepository.save(plan);
  }

  async findAllPlans(onlyActive: boolean = false): Promise<Plan[]> {
    return this.planRepository.find({
      where: onlyActive ? { status: true } : {},
      relations: { features: true },
    });
  }

  async findOnePlan(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: { features: true },
    })

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOnePlan(id);

    const { featureIds, ...updateData } = updatePlanDto;

    Object.assign(plan, updateData);

    if (featureIds) {
      plan.features = await Promise.all(
        featureIds.map((featureId) => this.planFeatureService.findOneFeature(featureId)),
      );
    }

    return this.planRepository.save(plan);
  }

  async deletePlan(id: number): Promise<{ message: string }> {
    const plan = await this.findOnePlan(id);

    plan.status = false;

    await this.planRepository.save(plan);

    return { message: 'Plan removed' };
  }
}
