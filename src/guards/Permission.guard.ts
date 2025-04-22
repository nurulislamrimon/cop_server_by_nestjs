/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PERMISSION_KEY } from '../decorators/AllowIf.decorator';
import { JwtPayload } from 'jsonwebtoken';
import { MemberRoleEnum } from '@prisma/client';
import { ADMINISTRATOR_PERMISSION_KEY } from '../decorators/AllowMemberOnlyIf.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // for public decorator
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    // extract user
    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();
    // authorized super admin
    if (user.role === MemberRoleEnum.super_admin) return true;
    // for permission decorator
    let requiredRules = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    // only members decorator
    const memberRequiredRules = this.reflector.get<string[]>(
      ADMINISTRATOR_PERMISSION_KEY,
      context.getHandler(),
    );
    if (memberRequiredRules?.length) {
      if (!Object.values(MemberRoleEnum).includes(user.role)) {
        return false;
      }
      requiredRules = memberRequiredRules;
    }

    if (!requiredRules || requiredRules.length === 0) return true;

    if (!user.rules || !Array.isArray(user.rules)) {
      return false;
    }
    console.log(`Checking permissions for user ${user.id}`, user.rules);
    return requiredRules.every((requiredRule) => {
      if (user.rules.includes(requiredRule)) return true;
      // if has all permission of the resource
      const requiredResource = requiredRule.split(':')?.[0];
      const allPermitted = `${requiredResource}:*`;
      return user.rules.includes(allPermitted);
    });
  }
}
