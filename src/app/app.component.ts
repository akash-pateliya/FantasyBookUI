import { Component } from '@angular/core';
import { ViewChild } from '@angular/core'; // Importing ViewChild
import { AgGridAngular } from 'ag-grid-angular'; // Importing AgGridAngular
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FantasyBook';

  url = 'http://localhost:3000';

  TourLib = ["Big Bash League", "Pro Kabaddi"];

  @ViewChild('myGrid') agGrid: AgGridAngular; // Accessing the Instance

  model: NgbDateStruct;
  
  rowData: any;

  MaxMatchNo: number;

  TotalInvestment: number;
  TotalWinnings: number;
  TotalProfitLoss: number;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  columnDefs = [
    { headerName: 'Match No.', field: 'MatchNo', sortable: true,autoSizeAllColumns : true, filter: true, checkboxSelection: true },
    {
      headerName: 'Date Time', field: 'MatchDateTime', sortable: true,resizable: true, filter: true, width: 300
    },
    { headerName: 'Tour', field: 'Tour', sortable: true,resizable: true, filter: true },
    { headerName: 'Round', field: 'Round', sortable: true,resizable: true, filter: true },
    { headerName: 'Investment', field: 'Investment', sortable: true,resizable: true, filter: true },
    { headerName: 'Winnings', field: 'Winnings', sortable: true,resizable: true, filter: true },
    { headerName: 'Profit / Loss', field: 'ProfitOrLoss', sortable: true,resizable: true, filter: true }
  ];

  showModal: boolean;
  registerForm: FormGroup;
  submitted = false;
  show() {
    this.showModal = true; // Show-Hide Modal Check

  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  ngOnInit() {
    this.loadGridData();
    this.registerForm = this.formBuilder.group({
      tour: ['', [Validators.required]],
      round: ['', [Validators.required]],
      investment: ['', Validators.required],
      winnings: ['', Validators.required],
      profitOrLoss: ['', Validators.required],
      dateTime: [new Date().toDateString(), Validators.required]
    });
    // this.autoSizeAll();
  }

  // GetMyRow Function
  GetMyRow() {
    const selectedData = this.agGrid.api.getSelectedNodes().map(
      node => node.data
    );
    console.log(selectedData);

  }

  loadGridData() {
    this.http.get(`${environment.hostUrl}/fantasybook`).subscribe(
      data => {
        this.rowData = data
        this.agGrid.api.setRowData(this.rowData);
        this.TotalInvestment = this.getSum(data, 'Investment');
        this.TotalWinnings = Math.round(this.getSum(data, 'Winnings'));
        this.TotalProfitLoss = Math.round(this.TotalWinnings - this.TotalInvestment);
        this.MaxMatchNo = Math.max.apply(Math, this.rowData.map(function (o) { return o.MatchNo; }))
      }
    );
  }

  getSum(items, prop) {
    return items.reduce(function (a, b) {
      return a + b[prop];
    }, 0);
  }

  deleteData() {
    const selectedData = this.agGrid.api.getSelectedNodes().map(
      node => node.data
    );
    const body = {
      keyValue: "MatchNo",
      thisValue: selectedData[0].MatchNo
    }

    this.http.post(`${environment.hostUrl}/fantasybook/delete`, body).subscribe(data => {
      console.log(data);
      this.loadGridData();
    })
  }

  updateData() {
    const selectedData = this.agGrid.api.getSelectedNodes().map(
      node => node.data
    );
    this.registerForm = this.formBuilder.group({
      tour: [selectedData[0].Tour, [Validators.required]],
      round: [selectedData[0].Round, [Validators.required]],
      investment: [selectedData[0].Investment, Validators.required],
      winnings: [selectedData[0].Winnings, Validators.required],
      profitOrLoss: [selectedData[0].ProfitOrLoss, Validators.required],
      dateTime: [selectedData[0].MatchDateTime, Validators.required]
    });
    this.showModal = true;

    const body = {
      MatchNo: selectedData[0].MaxMatchNo,
      MatchDateTime: selectedData[0].MatchDateTime,
      Tour: selectedData[0].Tour,
      Round: selectedData[0].Round,
      Investment: selectedData[0].Investment,
      Winnings: selectedData[0].Winnings,
      ProfitOrLoss: selectedData[0].ProfitOrLoss
    }

    this.http.post(`${environment.hostUrl}/fantasybook/update`, body).subscribe(data => {
      console.log(data);
      this.loadGridData();
    })
  }


  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if (this.submitted) {
      const body = {
        MatchNo: this.MaxMatchNo + 1,
        MatchDateTime: this.registerForm.value.dateTime.day + '/' + this.registerForm.value.dateTime.month + '/' + this.registerForm.value.dateTime.year,
        Tour: this.registerForm.value.tour,
        Round: this.registerForm.value.round,
        Investment: this.registerForm.value.investment,
        Winnings: this.registerForm.value.winnings,
        ProfitOrLoss: this.registerForm.value.profitOrLoss
      }
      console.log(body);
      this.http.post('http://localhost:3000/fantasybook/insert', body).subscribe(obj => {
        console.log(obj);
        this.showModal = false;
        this.loadGridData();
      })
    }
  }

} 
