import { Routes } from '@angular/router';
import { DatePlanner } from './module/pages/date-planner/date-planner';

export const routes: Routes = [
    {
        title: 'Plannificador',
        path: 'planner',
        pathMatch: 'full',
        component: DatePlanner
    },
    {
        path: '**',
        redirectTo: 'planner'
    }
];
