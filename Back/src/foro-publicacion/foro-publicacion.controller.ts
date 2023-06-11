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
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { Role } from '../shared/security/role.enum';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { PublicacionDto } from '../publicacion/publicacion.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ForoPublicacionService } from './foro-publicacion.service';
import { Roles } from '../shared/security/roles.decorator';

@RolesGlobales(Role.FORO_PUBLICACION_T, Role.ADMIN)
@Controller('foros')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class ForoPublicacionController {
  constructor(
    private readonly foroPublicacionService: ForoPublicacionService,
  ) {}
  @Roles(Role.FORO_PUBLICACION_E)
  @Post(':foroId/publicaciones/:publicacionId')
  async addpublicacionforo(
    @Param('foroId') foroId: string,
    @Param('publicacionId') publicacionId: string,
  ) {
    return await this.foroPublicacionService.addpublicacionforo(
      foroId,
      publicacionId,
    );
  }
  @Roles(Role.FORO_PUBLICACION_L)
  @Get(':foroId/publicaciones/:publicacionId')
  async findPublicaconByForoIdPublicacionId(
    @Param('foroId') foroId: string,
    @Param('publicacionId') publicacionId: string,
  ) {
    return await this.foroPublicacionService.findPublicaconByForoIdPublicacionId(
      foroId,
      publicacionId,
    );
  }
  @Roles(Role.FORO_PUBLICACION_L)
  @Get(':foroId/publicaciones')
  async findpublicacionesByforoId(@Param('foroId') foroId: string) {
    return await this.foroPublicacionService.findpublicacionesByforoId(foroId);
  }
  @Roles(Role.FORO_PUBLICACION_E)
  @Put(':foroId/publicaciones')
  async associatepublicacionesForo(
    @Body() publicacionesDto: PublicacionDto[],
    @Param('foroId') foroId: string,
  ) {
    const artworks = plainToInstance(PublicacionEntity, publicacionesDto);
    return await this.foroPublicacionService.associatepublicacionesForo(
      foroId,
      artworks,
    );
  }
  @Roles(Role.FORO_PUBLICACION_D)
  @Delete(':foroId/publicaciones/:publicacionId')
  @HttpCode(204)
  async deletePublicacionForo(
    @Param('foroId') foroId: string,
    @Param('publicacionId') publicacionId: string,
  ) {
    return await this.foroPublicacionService.deletePublicacionForo(
      foroId,
      publicacionId,
    );
  }
}
