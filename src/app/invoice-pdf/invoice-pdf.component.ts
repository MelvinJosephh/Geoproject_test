import {Component, Input, OnInit} from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-invoice-pdf',
  templateUrl: './invoice-pdf.component.html',
  styleUrls: ['./invoice-pdf.component.scss']
})
export class InvoicePdfComponent implements OnInit {
  details: any;
  // @ts-ignore
  @Input() invoiceDetails;
  layout = {
    defaultBorder: true,
    hLineWidth: function(i: number, node: { table: { body: string | any[]; }; }) {
      return (i === 0 || i === node.table.body.length) ? 1 : 1;
    },
    vLineWidth: function(i: number, node: { table: { widths: string | any[]; }; }) {
      return (i === 0 || i === node.table.widths.length) ? 1 : 1;
    },
    hLineColor: function(i: number, node: { table: { body: string | any[]; }; }) {
      return (i === 0 || i === node.table.body.length) ? '#d6d1d1' : '#d6d1d1';
    },
    vLineColor: function(i: number, node: { table: { widths: string | any[]; }; }) {
      return (i === 0 || i === node.table.widths.length) ? '#d6d1d1' : '#d6d1d1';
    }
  };

  constructor(
    private dateFormat: DatePipe,
    private currencyPipe: CurrencyPipe) {
  }

  ngOnInit(): any {

  }


  getInvoiceDetails(): any {

    this.details = {
      pageSize: 'A4',
      // pageOrientation: 'landscape',
      content: [
        {
          columns: [
            {
              text: [
                {
                  text: 'Invoice \n',
                  bold: true,
                  fontSize: 18,
                  color: '#111b4c'
                },
                'Phone: +254702035351, \n',
                'Email: collinsme.2000@gmail.com, \n',
                'Location: 87-Uthiru\n\n',
                {
                  text: 'Bill to: \n',
                  bold: true
                },
                'Buyer/Business Name: ' + this.invoiceDetails["buyer_name"] + '\n',
                'Buyer Address: ' +this.invoiceDetails["buyer_address"] + '\n',
                'Buyer Phone Number: '+this.invoiceDetails["buyer_phone"] + '\n',
                'Buyer Email: '+this.invoiceDetails["buyer_email"]
              ],
              width: '60%',
              alignment: 'left',
              margin: [0, 5, 0, 0]
            },
            {
              text: [
                {
                  text: 'Invoice Number ',
                  bold: true,
                },
                '######' + '\n\n\n\n',
                {
                  text: 'Invoice Date ',
                  bold: true,
                },
                this.dateFormat.transform(this.invoiceDetails?.date_generated, 'mediumDate'),
                {
                  text: '\n Due Date ',
                  bold: true,
                },
                this.dateFormat.transform(this.invoiceDetails?.date_due, 'mediumDate')
              ],
              width: '*',
              alignment: 'right',
            },
          ],
        },
        {
          table: {
            widths: ['15%', '15%', '40%', '*'],
            body: this.returnInvoiceItems(this.invoiceDetails.orderDetails)
          },
          layout: this.layout,
          margin: [0, 20]
        },
        {
          table: {
            widths: ['5%', '20%', '45%', '*'],
            body: [
              [
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: 'Sub Total',
                  bold: true,
                  alignment: 'right',
                  border: [false, true, false, false],
                },
                {
                  text: '' + this.currencyPipe.transform(this.calculateTotal(), ' Ksh. ') + '\n',
                  alignment: 'right',
                  border: [false, true, false, false],
                }
              ],
              [
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: 'Tax 0.00%',
                  bold: true,
                  alignment: 'right',
                  border: [false, true, false, false],
                },
                {
                  text: '' + this.currencyPipe.transform(0, ' Ksh. ') + '\n',
                  alignment: 'right',
                  border: [false, true, false, false],
                }
              ],
              [
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: 'Fees/discounts',
                  bold: true,
                  alignment: 'right',
                  border: [false, true, false, false]
                },
                {
                  text: '' + this.currencyPipe.transform(0, ' Ksh. ') + '\n',
                  alignment: 'right',
                  border: [false, true, false, false]
                },
              ],
              [
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: 'Total',
                  bold: true,
                  alignment: 'right',
                  border: [false, true, false, false],
                  fillColor: '#f6f0f0'
                },
                {
                  text: '' + this.currencyPipe.transform(this.calculateTotal(), ' Ksh. ') + '\n',
                  alignment: 'right',
                  border: [false, true, false, false],
                  fillColor: '#f6f0f0'
                },
              ],
              [
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  text: '',
                  border: [false, false, false, false],
                },
                {
                  colSpan: 2,
                  text: '',
                  border: [false, true, false, false],
                },
                {
                  text: ''
                }
              ]
            ]
          },
          layout: this.layout,
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'justify'
        },
        underline: {
          decoration: 'underline',
          decorationStyle: 'dotted',
          decorationColor: 'gray'
        },
        section: {
          fillColor: '#E1ECEB',
          margin: [15, 0]
        }
      }
    };

    this.openPDF();
  }

  openPDF(): any {
    pdfMake.createPdf(this.details).open();
  }

  returnInvoiceItems(invoiceItemsList: []): any[] {
    const invoiceItems = [
      [
        {
          text: 'Item',
          bold: true,
          fontSize: 14,
        },
        {
          text: 'Quantity',
          bold: true,
          fontSize: 14,
        },
        {
          text: 'Price per unit',
          bold: true,
          fontSize: 14,
          alignment: 'right',
        },
        {
          text: 'Amount',
          bold: true,
          fontSize: 14,
          alignment: 'right',
        },
      ]
    ];
    let invoiceItem =
      [
        {
          text: '',
          bold: true,
          fontSize: 14,
        },
        {
          text: '',
          bold: true,
          fontSize: 14,
        },
        {
          text: '',
          bold: true,
          fontSize: 14,
        },
        {
          text: '',
          bold: true,
          fontSize: 14,
          alignment: 'right',
        },
      ];

    for (let i = 0; i < invoiceItemsList.length; i++) {
      invoiceItem = [
      
        {
          text: '' + invoiceItemsList[i]['item'],
          bold: false,
          fontSize: 13,
        },
        {
          text: '' + invoiceItemsList[i]['quantity'],
          bold: false,
          fontSize: 13,
        },
        {
          text: '' + this.currencyPipe.transform(invoiceItemsList[i]['price'], ' Ksh. '),
          bold: false,
          fontSize: 13,
          alignment: 'right',
        },
        {
          text: '' + this.currencyPipe.transform(invoiceItemsList[i]['amount'], ' Ksh. '),
          bold: false,
          fontSize: 13,
          alignment: 'right',
        },
      ];
      invoiceItems.push(invoiceItem);
    }
    return invoiceItems;
  }
  calculateTotal(){
    const total= this.invoiceDetails.orderDetails.reduce(
      (acc: number,currentItem: { amount: any; }) => {return acc + +currentItem.amount},
      0
    ) 
    return total;
  }
}
