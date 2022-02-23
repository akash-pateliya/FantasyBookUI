import { Component } from '@angular/core';
import { ViewChild } from '@angular/core'; // Importing ViewChild
import { AgGridAngular } from 'ag-grid-angular'; // Importing AgGridAngular
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FantasyBook';

  url = 'https://fantasy-book-api.herokuapp.com';
  // url = 'http://localhost:8080';

  TourLib;

  @ViewChild('myGrid') agGrid: AgGridAngular; // Accessing the Instance

  model: NgbDateStruct;

  rowData: any;

  MaxMatchNo: number;

  TotalInvestment: number;
  TotalWinnings: number;
  TotalProfitLoss: number;

  isAddModal: boolean = false;
  isUpdateModal: boolean = false;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private notifierService: NotifierService) { }

  columnDefs = [
    { headerName: 'Match No.', field: 'MatchNo', sortable: true, autoSizeAllColumns: true, filter: true, checkboxSelection: true },
    {
      headerName: 'Date Time', field: 'MatchDateTime', sortable: true, resizable: true, filter: true, width: 300
    },
    { headerName: 'Tour', field: 'Tour', sortable: true, resizable: true, filter: true },
    { headerName: 'Round', field: 'Round', sortable: true, resizable: true, filter: true },
    { headerName: 'Investment', field: 'Investment',width: 135, sortable: true, resizable: true, filter: true },
    { headerName: 'Winnings', field: 'Winnings', width: 135,sortable: true, resizable: true, filter: true },
    {
      headerName: 'Profit / Loss', field: 'ProfitOrLoss',width: 135, sortable: true, resizable: true, voaltile: true, filter: true, cellStyle: params => Number(params.value) > 0 ? { color: 'yellow', backgroundColor: 'green' } : { color: 'black', backgroundColor: 'red' }}
  ];

  showModal: boolean;
  registerForm: FormGroup;
  submitted = false;
  show() {
    this.isAddModal = true;
    this.registerForm.reset();
    this.showModal = true; // Show-Hide Modal Check
  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
    this.isAddModal = false;
    this.isUpdateModal = false;
  }

  ngOnInit() {
    this.loadTourLibData();
    this.loadGridData();
    this.registerForm = this.formBuilder.group({
      tour: ['', [Validators.required]],
      round: ['', [Validators.required]],
      investment: ['', Validators.required],
      winnings: ['', Validators.required],
      profitOrLoss: ['', Validators.required],
      dateTime: [new Date().toDateString(), Validators.required]
    });

  }

  // GetMyRow Function
  GetMyRow() {
    const selectedData = this.agGrid.api.getSelectedNodes().map(
      node => node.data
    );
    console.log(selectedData);

  }

  loadGridData() {
    this.notifierService.notify('alert', 'Data is Loading');
    this.http.get(`${this.url}/get-data`).subscribe(
      data => {
        this.rowData = data
        this.notifierService.hideAll();
        this.agGrid.api.setRowData(this.rowData);
        this.TotalInvestment = this.getSum(data, 'Investment');
        this.TotalWinnings = Math.round(this.getSum(data, 'Winnings'));
        this.TotalProfitLoss = Math.round(this.TotalWinnings - this.TotalInvestment);
        this.MaxMatchNo = Math.max.apply(Math, this.rowData.map(function (o) { return o.MatchNo; }))
        this.notifierService.hideAll();
      }
    );
  }

  loadTourLibData(){
    this.http.get(`${this.url}/get-lib-tour`).subscribe(data => {
      this.TourLib = data;
    });
  }

  getSum(items, prop) {
    return items.reduce(function (a, b) {
      return a + b[prop];
    }, 0);
  }

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
        Investment: this.findSum(this.registerForm.value.investment),
        Winnings: this.registerForm.value.winnings,
        ProfitOrLoss: this.registerForm.value.profitOrLoss
      }

      this.http.post(`${this.url}/add-data`, body).subscribe(obj => {
        this.showModal = false;
        this.notifierService.notify('success', 'Data Added !!');
        this.loadGridData();
        this.isAddModal = false;
        this.submitted = false;
      })
    }
  }

  deleteData() {
    const selectedData = this.agGrid.api.getSelectedNodes().map(
      node => node.data
    );
    const body = {
      keyValue: "MatchNo",
      thisValue: selectedData[0].MatchNo
    }

    this.http.post(`${this.url}/delete-data`, body).subscribe(data => {
      this.loadGridData();
    })
  }

  updateData() {
    const selectedData = this.agGrid.api.getSelectedNodes().map(
      node => node.data
    );
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if (this.submitted) {
      const body = {
        MatchNo: selectedData[0].MatchNo,
        MatchDateTime: this.registerForm.value.dateTime.day + '/' + this.registerForm.value.dateTime.month + '/' + this.registerForm.value.dateTime.year,
        Tour: this.registerForm.value.tour,
        Round: this.registerForm.value.round,
        Investment: this.findSum(String(this.registerForm.value.investment)),
        Winnings: Number(this.registerForm.value.winnings),
        ProfitOrLoss: this.registerForm.value.profitOrLoss
      }

      this.http.post(`${this.url}/update-data`, body).subscribe(data => {
        this.showModal = false;
        this.notifierService.notify('success', 'Data Updated !!');
        this.loadGridData();
        this.isUpdateModal = false;
        this.submitted = false;
      })
    }
  }

  updateModal(){
    this.isUpdateModal = true;
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
    this.showModal = true; // Show-Hide Modal Check
  }

  get f() { return this.registerForm.controls; }

  findSum(str) {
    let temp = "0";

    // holds sum of all numbers
    // present in the string
    let sum = 0;

    // read each character in input string
    for (let i = 0; i < str.length; i++) {
      let ch = str[i];

      // if current character is a digit
      if (!isNaN(ch - parseFloat(ch)))
        temp += ch;

      // if current character is an alphabet
      else {
        // increment sum by number found earlier
        // (if any)
        sum += parseInt(temp);

        // reset temporary string to empty
        temp = "0";
      }
    }

    // atoi(temp.c_str()) takes care of trailing
    // numbers
    return sum + parseInt(temp);
  }

  onChange() {
    const currentTotalWinnings = this.registerForm.value.winnings;
    const currentTotalInvestment = this.findSum(this.registerForm.value.investment);
    const currentProfitLoss = Math.round(currentTotalWinnings - currentTotalInvestment);
    this.registerForm.patchValue({
      profitOrLoss: currentProfitLoss
    });
  }

} 
