import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BookingComponent } from './booking/booking.component';
import { FormComponent } from './form/form.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [

  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component:SearchComponent },
  { path: 'bookings', component:BookingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
