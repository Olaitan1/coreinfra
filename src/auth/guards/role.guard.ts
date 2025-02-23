import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/schemas/user.schema';
import { JwtAuthService } from '../services/jwt.service';
import { JwtAuthGuard } from './jwt.guard';


@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
     jwtAuthService: JwtAuthService, 
  ) {
    super(jwtAuthService); 
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJwtValid = await super.canActivate(context);
    if (!isJwtValid) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();
    // return requiredRoles.includes(user.role);
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have the required role to access this resource',
      );
    }

    return true;
  }
}
