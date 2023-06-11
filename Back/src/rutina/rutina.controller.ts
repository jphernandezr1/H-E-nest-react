import {Body,Controller,Delete,Get,HttpCode,Param,Post,Put,UseGuards,UseInterceptors,} from '@nestjs/common';
import { RutinaService } from './rutina.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RutinaDto } from './rutina.dto';
import { RutinaEntity } from './rutina.entity';
import { plainToInstance } from 'class-transformer';
import { RolesGlobales } from 'src/shared/security/roles-globales.decorator';
import { Role } from 'src/shared/security/role.enum';
import { Roles } from 'src/shared/security/roles.decorator';


@RolesGlobales(Role.RUTINA_T, Role.ADMIN)
@Controller('rutinas')
@UseInterceptors(BusinessErrorsInterceptor)
export class RutinaController {
    constructor(private readonly service: RutinaService) {}

    @Roles(Role.RUTINA_L)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Roles(Role.RUTINA_L)
    @Get(':metricaId')
    async findOne(@Param('metricaId') metricaId: string) {
        return await this.service.findOne(metricaId);
    }


    @Roles(Role.RUTINA_E)
    @Post()
    @HttpCode(201)
    async create(@Body() metricasDto: RutinaDto) {
        const metrica: RutinaEntity = plainToInstance(RutinaEntity, metricasDto);
        return await this.service.create(metrica);
    }

    @Roles(Role.RUTINA_E)
    @Put(':metricaId')
    async update(@Param('metricaId') metricaId: string, @Body() metricasDto: RutinaDto) {
        const metrica: RutinaEntity = plainToInstance(RutinaEntity, metricasDto);
        return await this.service.update(metricaId, metrica);
    }

    @Roles(Role.RUTINA_D)
    @Delete(':metricaId')
    @HttpCode(204)
    async delete(@Param('metricaId') metricaId: string) {
        return await this.service.delete(metricaId);
    }
}
