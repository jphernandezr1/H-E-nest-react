import {Body,Controller,Delete,Get,HttpCode,Param,Post,Put,UseGuards,UseInterceptors,} from '@nestjs/common';
import { MetricasService } from './metricas.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MetricasDto } from './metricas.dto';
import { MetricasEntity } from './metricas.entity';
import { plainToInstance } from 'class-transformer';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { Role } from '../shared/security/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/security/roles.decorator';

@RolesGlobales(Role.METRICA_T, Role.ADMIN)
@Controller('metricas')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class MetricasController {
    constructor(private readonly service: MetricasService) {}
    
    @Roles(Role.METRICA_L)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Roles(Role.METRICA_L)
    @Get(':metricaId')
    async findOne(@Param('metricaId') metricaId: string) {
        return await this.service.findOne(metricaId);
    }

    @Roles(Role.METRICA_E)
    @Post()
    async create(@Body() metricasDto: MetricasDto) {
        const metrica: MetricasEntity = plainToInstance(MetricasEntity, metricasDto);
        return await this.service.create(metrica);
    }

    @Roles(Role.METRICA_E)
    @Put(':metricaId')
    async update(@Param('metricaId') metricaId: string, @Body() metricasDto: MetricasDto) {
        const metrica: MetricasEntity = plainToInstance(MetricasEntity, metricasDto);
        return await this.service.update(metricaId, metrica);
    }

    @Roles(Role.METRICA_D)
    @Delete(':metricaId')
    @HttpCode(204)
    async delete(@Param('metricaId') metricaId: string) {
        return await this.service.delete(metricaId);
    }
}
