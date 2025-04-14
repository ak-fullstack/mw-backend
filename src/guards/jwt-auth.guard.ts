import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {
    // Allow execution of guards in the request pipeline (including custom logic in the RoleGuard).
    return super.canActivate(context);
  }
}
