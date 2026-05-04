import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { AdminAuthService } from '../auth/admin-auth.service';

const redirectToLogin = () => inject(Router).createUrlTree(['/studio-login']);

export const adminAuthGuard: CanActivateFn = () => {
  const adminAuthService = inject(AdminAuthService);

  return adminAuthService.refreshSession() || redirectToLogin();
};

export const adminAuthChildGuard: CanActivateChildFn = () => {
  const adminAuthService = inject(AdminAuthService);

  return adminAuthService.refreshSession() || redirectToLogin();
};
