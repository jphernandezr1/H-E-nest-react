import { Injectable } from '@nestjs/common';
import { MetricasEntity } from './metricas.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class MetricasService {
  constructor(
    @InjectRepository(MetricasEntity)
    private readonly metricasRepository: Repository<MetricasEntity>,
  ) {}
  async findAll(): Promise<MetricasEntity[]> {
    return await this.metricasRepository.find({});
  }
  async findOne(id: string): Promise<MetricasEntity> {
    const metrica: MetricasEntity = await this.metricasRepository.findOne({
      where: { id },
    });
    if (!metrica)
      throw new BusinessLogicException(
        'la metrica con ese id, no se encontro',
        BusinessError.NOT_FOUND,
      );

    return metrica;
  }
  async create(metrica: MetricasEntity): Promise<MetricasEntity> {
    return await this.metricasRepository.save(metrica);
  }
  async update(id: string, metrica: MetricasEntity): Promise<MetricasEntity> {
    const persistedMetrica: MetricasEntity =
      await this.metricasRepository.findOne({ where: { id } });
    if (!persistedMetrica)
      throw new BusinessLogicException(
        'la metrica con ese id, no se encontro',
        BusinessError.NOT_FOUND,
      );
    return await this.metricasRepository.save({
      ...persistedMetrica,
      ...metrica,
    });
  }
  async delete(id: string) {
    const metrica: MetricasEntity = await this.metricasRepository.findOne({
      where: { id },
    });
    if (!metrica)
      throw new BusinessLogicException(
        'la metrica con ese id, no se encontro',
        BusinessError.NOT_FOUND,
      );

    await this.metricasRepository.remove(metrica);
  }
}
