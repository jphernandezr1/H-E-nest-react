import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PerfilMetricasService } from './perfil-metricas.service';
import { MetricasDto } from '../metricas/metricas.dto';
import { MetricasEntity } from '../metricas/metricas.entity';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { Role } from '../shared/security/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/security/roles.decorator';

@RolesGlobales(Role.PERFIL_METRICA_T, Role.ADMIN)
@Controller('perfil')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class PerfilMetricasController {
constructor(
    private readonly service: PerfilMetricasService,
) {}

@Roles(Role.PERFIL_METRICA_E)
@Post(':perfilId/metricas/:metricaId')
async addMetricaPerfil(
    @Param('perfilId') perfilId: string,
    @Param('metricaId') metricaId: string,
) {
    return await this.service.addMetricaPerfil(
    perfilId,
    metricaId,
    );
}
@Roles(Role.PERFIL_METRICA_L)
@Get(':perfilId/metricas/:metricaId')
async findMetricaPorPerfilIdMetricaId(
    @Param('perfilId') perfilId: string,
    @Param('metricaId') metricaId: string,
) {
    return await this.service.findMetricaPorPerfilIdMetricaId(
    perfilId,
    metricaId,
    );
}
@Roles(Role.PERFIL_METRICA_L)
@Get(':perfilId/metricas')
async findMetricasPorPerfilId(@Param('perfilId') perfilId: string) {
    return await this.service.findMetricasPorPerfilId(perfilId);
}
@Roles(Role.PERFIL_METRICA_E)
@Put(':perfilId/metricas')
async asociarPublicacionPerfil(
    @Body() metricasDto: MetricasDto[],
    @Param('perfilId') foroId: string,
) {
    const metrica = plainToInstance(MetricasEntity, metricasDto);
    return await this.service.asociarMetricasPerfil(
    foroId,
    metrica,
    );
}
@Roles(Role.PERFIL_METRICA_D)
@Delete(':perfilId/metricas/:metricaId')
@HttpCode(204)
async deleteMetricaPerfil(
    @Param('perfilId') perfilId: string,
    @Param('metricaId') metricaId: string,
) {
    return await this.service.deleteMetricaPerfil(
    perfilId,
    metricaId,
    );
}
}
