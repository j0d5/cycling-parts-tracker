import { Route } from '@angular/router';
import { clientFeatureDashboardRoutes } from '@cpt/client/feature-dashboard';
import { clientFeatureLoginRoutes } from '@cpt/client/feature-login';
import { clientFeatureRegisterRoutes } from '@cpt/client/feature-register';

export const appRoutes: Route[] = [
  ...clientFeatureDashboardRoutes,
  ...clientFeatureLoginRoutes,
  ...clientFeatureRegisterRoutes,
];
