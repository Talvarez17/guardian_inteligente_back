import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanFeature } from './entities/plan-feature.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanFeatureService {

  constructor(@InjectRepository(PlanFeature) private readonly planFeatureRepository: Repository<PlanFeature>) { }

  async createFeature(createPlanFeatureDto: CreatePlanFeatureDto): Promise<PlanFeature> {

    const exists = await this.planFeatureRepository.findOne({
      where: { name: createPlanFeatureDto.name }
    })

    if (exists) {
      throw new ConflictException('Feature already exists');
    }

    const feature = this.planFeatureRepository.create(createPlanFeatureDto);

    return this.planFeatureRepository.save(feature);
  }

  async findAllFeatures(onlyActive: boolean = false): Promise<PlanFeature[]> {
    return await this.planFeatureRepository.find({
      where: onlyActive ? { status: true } : {},
    });
  }

  async findOneFeature(id: number): Promise<PlanFeature> {
    const feature = await this.planFeatureRepository.findOne({
      where: { id }
    })

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    return feature;
  }

  async updateFeature(id: number, updatePlanFeatureDto: UpdatePlanFeatureDto): Promise<PlanFeature> {
    const feature = await this.findOneFeature(id);

    Object.assign(feature, updatePlanFeatureDto);

    return this.planFeatureRepository.save(feature);
  }

  async removeFeature(id: number): Promise<{ message: string }> {
    const feature = await this.findOneFeature(id);

    feature.status = false;

    await this.planFeatureRepository.save(feature);

    return { message: 'Feature removed' };
  }
}
