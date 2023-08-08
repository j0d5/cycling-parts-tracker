import { Route } from '@angular/router';
import { clientFeatureDashboardRoutes } from '@cpt/client/feature-dashboard';
import { clientFeatureLoginRoutes } from '@cpt/client/feature-login';

export const appRoutes: Route[] = [
  ...clientFeatureDashboardRoutes,
  ...clientFeatureLoginRoutes,
];
