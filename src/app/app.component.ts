import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private _fb: FormBuilder) {
    this.invoiceForm = this._fb.group({
      buyer_name: ['', Validators.required],
      buyer_address: ['', Validators.required],
      buyer_phone: [],
      buyer_email: ['', [Validators.required, Validators.email]],
      date_generated: [new Date(), Validators.required],
      date_due: ['', Validators.required],
      orderDetails: this._fb.array([this.addOrderDetailsGroup()])
    });
  }

  private addOrderDetailsGroup(): FormGroup {
    return this._fb.group({
      item: [],
      quantity: [],
      price: [],
      amount: []
    });
  }

  addOrderDetails(): void {
    this.addOrderDetailsArray.push(this.addOrderDetailsGroup());

    console.log(this.addOrderDetailsArray);
  }

  removeOrderDetails(index: number): void {
    this.addOrderDetailsArray.removeAt(index);
  }

  get addOrderDetailsArray(): FormArray {
    return <FormArray>this.invoiceForm.get('orderDetails');
  }
  addInvoice() {
    this.invoices=[...this.invoices,...[this.invoiceForm.value]]
  }
}
