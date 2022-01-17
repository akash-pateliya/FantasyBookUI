import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { NgbDatepickerModule, NgbModalModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap'; // Importing the HTTP Client Module 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  // entryComponents: []
})
export class AppModule { }
