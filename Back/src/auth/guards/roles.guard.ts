import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import constants from '../../shared/security/constants';
import { Role } from '../../shared/security/role.enum';
import { UserService } from '../../user/user.service';

@Injectable()
export class RoleGuard extends PassportStrategy(Strategy) implements CanActivate{
  constructor(private reflector: Reflector, private jwtservice : JwtService, private userService: UserService
    ) { super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.JWT_SECRET,

  });}

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username , roles: payload.roles};
}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    const requireRolesG = this.reflector.getAllAndOverride<Role[]>("rolesGlobales", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requireRolesG) {
      requireRoles.push(...requireRolesG);
    }

    if (!requireRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(" ")[1];
    const user = this.jwtservice.verify(token, { secret: constants.JWT_SECRET });
    const roles = await this.userService.findbyusername(user.username);
    return requireRoles.some((role) => roles.roles.includes(role));
}
}