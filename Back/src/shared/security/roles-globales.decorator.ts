import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const RolesGlobales = (...roles: Role[]) => SetMetadata('rolesGlobales', roles);