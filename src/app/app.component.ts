import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'invoice-app';
  invoices: any[] = [];
  public invoiceForm: FormGroup;

  displayedColumns: string[] = ['invoice_no', 'buyer_name', 'buyer_address', 'date_generated', 'date_due', 'action'];

  constructor(private _fb: FormBuilder, private snackBar: MatSnackBar) {
    this.invoiceForm = this._fb.group({
      buyer_name: ['', Validators.required],
      buyer_address: ['', Validators.required],
      buyer_phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      buyer_email: ['', [Validators.required, Validators.email]],
      date_generated: [new Date(), Validators.required],
      date_due: ['', Validators.required],
      orderDetails: this._fb.array([this.addOrderDetailsGroup()])
    });
  }

  private addOrderDetailsGroup(): FormGroup {
    return this._fb.group({
      item: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  addOrderDetails(): void {
    const lastIndex = this.addOrderDetailsArray.length - 1;
    const lastGroup = this.addOrderDetailsArray.at(lastIndex) as FormGroup;

    if (
      lastGroup.valid &&
      lastGroup.get('item')?.value !== '' &&
      lastGroup.get('quantity')?.value !== '' &&
      lastGroup.get('price')?.value !== '' &&
      lastGroup.get('amount')?.value !== ''
    ) {
      this.addOrderDetailsArray.push(this.addOrderDetailsGroup());
    } else {
      console.log('Please fill out all order details before adding a new one.');
    }
  }

  removeOrderDetails(index: number): void {
    this.addOrderDetailsArray.removeAt(index);
  }

  get addOrderDetailsArray(): FormArray {
    return <FormArray>this.invoiceForm.get('orderDetails');
  }

  addInvoice() {
    if (this.invoiceForm.valid){
      this.invoices=[...this.invoices,...[this.invoiceForm.value]]
    
      this.snackBar.open('Invoice created successfully', 'Close', {duration: 3000, panelClass: ['success-snackbar']});
    } else {
      console.log('Please fill out all the required fields before creating Invoice');
    }
    
  }
}
