import {
    CanActivate,
    ExecutionContext,
    Inject
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/users/auth.service';

export class AuthGuard implements CanActivate {
    constructor(@Inject(AuthService) private authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return new Promise(async (resolve, reject) => {
            const request = context.switchToHttp().getRequest();
            const canActivate = await this.authService.validateToken(request.headers.token);
            resolve(canActivate);
        });
    }
}