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
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Role } from '../shared/security/role.enum';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { Roles } from '../shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PublicacionDto } from './publicacion.dto';
import { PublicacionEntity } from './publicacion.entity';
import { PublicacionService } from './publicacion.service';

@Controller('publicaciones')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@RolesGlobales(Role.PUBLICACION_T, Role.ADMIN)
export class PublicacionController {
  constructor(private readonly publicacionService: PublicacionService) {}
 @Roles(Role.PUBLICACION_L)
  @Get()
  async findAll() {
    return await this.publicacionService.findAll();
  }
  @Roles(Role.PUBLICACION_L)
  @Get(':publicacionId')
  async findOne(@Param('publicacionId') publicacionId: string) {
    return await this.publicacionService.findOne(publicacionId);
  }
@Roles(Role.PUBLICACION_E)
  @Post()
  async create(@Body() publicacionDto: PublicacionDto) {
    const publicacion: PublicacionEntity = plainToInstance(
      PublicacionEntity,
      publicacionDto,
    );
    return await this.publicacionService.create(publicacion);
  }
@Roles(Role.PUBLICACION_E)
  @Put(':publicacionId')
  async update(
    @Param('publicacionId') publicacionId: string,
    @Body() publicacionDto: PublicacionDto,
  ) {
    const publicacion: PublicacionEntity = plainToInstance(
      PublicacionEntity,
      publicacionDto,
    );
    return await this.publicacionService.update(publicacionId, publicacion);
  }
@Roles(Role.PUBLICACION_D)
  @Delete(':publicacionId')
  @HttpCode(204)
  async delete(@Param('publicacionId') publicacionId: string) {
    return await this.publicacionService.delete(publicacionId);
  }
}
