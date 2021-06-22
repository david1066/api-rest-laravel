//importar los modulos del routing
import{ModuleWithProviders} from '@angular/core';
import{Routes, RouterModule} from '@angular/router';

//importar componentes

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { SearchComponent } from './components/search/search.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';



//array de rutas
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'inicio', component: HomeComponent},
{path: 'login', component: LoginComponent},
{path: 'nuevo-usuario', component: NewUserComponent},
{path: 'actualiza-usuario/:id', component: UpdateUserComponent},
{path: 'busqueda/:search', component: SearchComponent},
  {path: '**', component: HomeComponent},

  

];
//exportar configuracion
export const appRoutingProviders: any[]=[];
export const routing: ModuleWithProviders<any>= RouterModule.forRoot(appRoutes);
