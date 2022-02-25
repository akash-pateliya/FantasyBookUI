import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { NgbDatepickerModule, NgbModalModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap'; // Importing the HTTP Client Module 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    ChartsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  // entryComponents: []
})
export class AppModule { }
