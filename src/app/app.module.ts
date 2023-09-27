import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatTabsModule} from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvoicePdfComponent } from './invoice-pdf/invoice-pdf.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    InvoicePdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule
  ],
  providers: [DatePipe,
  CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
