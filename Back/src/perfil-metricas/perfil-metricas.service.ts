import { Injectable } from '@nestjs/common';
import { PerfilEntity } from '../perfil/perfil.entity';
import { MetricasEntity } from '../metricas/metricas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class PerfilMetricasService {
  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,

    @InjectRepository(MetricasEntity)
    private readonly metricaRepository: Repository<MetricasEntity>,
  ) {}

  async addMetricaPerfil(
    perfilId: string,
    metricaId: string,
  ): Promise<PerfilEntity> {
    const metrica: MetricasEntity = await this.metricaRepository.findOne({
      where: { id: metricaId },
    });
    if (!metrica)
      throw new BusinessLogicException(
        'la metrica con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['metricas'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    perfil.metricas = [...perfil.metricas, metrica];
    return await this.perfilRepository.save(perfil);
  }

  async findMetricaPorPerfilIdMetricaId(
    perfilId: string,
    metricaId: string,
  ): Promise<MetricasEntity> {
    const metrica: MetricasEntity = await this.metricaRepository.findOne({
      where: { id: metricaId },
    });
    if (!metrica)
      throw new BusinessLogicException(
        'la metrica con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['metricas'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const perfilMetrica: MetricasEntity = perfil.metricas.find(
      (e) => e.id === metrica.id,
    );
    if (!perfilMetrica)
      throw new BusinessLogicException(
        'la metrica con ese id no esta asociada al perfil',
        BusinessError.PRECONDITION_FAILED,
      );
    return perfilMetrica;
  }
  async findMetricasPorPerfilId(perfilId: string): Promise<MetricasEntity[]> {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['metricas'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return perfil.metricas;
  }
  async asociarMetricasPerfil(
    perfilId: string,
    metricas: MetricasEntity[],
  ): Promise<PerfilEntity> {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['metricas'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < metricas.length; i++) {
      const metrica: MetricasEntity = await this.metricaRepository.findOne({
        where: { id: metricas[i].id },
      });
      if (!metrica)
        throw new BusinessLogicException(
          'la metrica con ese id no fue encontrada',
          BusinessError.NOT_FOUND,
        );
    }
    perfil.metricas = metricas;
    return await this.perfilRepository.save(perfil);
  }
  async deleteMetricaPerfil(perfilId: string, metricaId: string) {
    const metrica: MetricasEntity = await this.metricaRepository.findOne({
      where: { id: metricaId },
    });
    if (!metrica)
      throw new BusinessLogicException(
        'la metrica con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['metricas'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const perfilmetrica: MetricasEntity = perfil.metricas.find(
      (e) => e.id === metrica.id,
    );
    if (!perfilmetrica)
      throw new BusinessLogicException(
        'la metrica con ese id no esta asociada al perfil',
        BusinessError.PRECONDITION_FAILED,
      );

    perfil.metricas = perfil.metricas.filter((e) => e.id !== metricaId);
    await this.perfilRepository.save(perfil);
  }
}
