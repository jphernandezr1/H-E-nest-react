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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ForoDto } from './foro.dto';
import { ForoEntity } from './foro.entity';
import { ForoService } from './foro.service';
import { Roles } from 'src/shared/security/roles.decorator';
@RolesGlobales(Role.FORO_T, Role.ADMIN)
@Controller('foros')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class ForoController {
  constructor(private readonly foroService: ForoService) {}
  @Roles(Role.FORO_L)
  @Get()
  async findAll() {
    return await this.foroService.findAll();
  }
  @Roles(Role.FORO_L)
  @Get(':foroId')
  async findOne(@Param('foroId') foroId: string) {
    return await this.foroService.findOne(foroId);
  }
  @Roles(Role.FORO_E)
  @Post()
  async create(@Body() foroDto: ForoDto) {
    const foro: ForoEntity = plainToInstance(ForoEntity, foroDto);
    return await this.foroService.create(foro);
  }
  @Roles(Role.FORO_E)
  @Put(':foroId')
  async update(@Param('foroId') foroId: string, @Body() foroDto: ForoDto) {
    const foro: ForoEntity = plainToInstance(ForoEntity, foroDto);
    return await this.foroService.update(foroId, foro);
  }
  @Roles(Role.FORO_D)
  @Delete(':foroId')
  @HttpCode(204)
  async delete(@Param('foroId') foroId: string) {
    return await this.foroService.delete(foroId);
  }
}
