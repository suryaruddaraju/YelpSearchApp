import { Component, OnInit } from '@angular/core';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  hasRes = false;
  reservations = [{"rest":"none", "date":"none", "time":"none", "email":"none"}]
  constructor() {
    if(localStorage['resArr']){
      this.hasRes = true;
      this.reservations = JSON.parse(localStorage['resArr']);
    }
    else{
      this.reservations = []
    }
  }

  ngOnInit(): void {
  }

  cancelRes(ind:number){
    console.log("before cancel: " + this.reservations + "len: " + this.reservations.length)
    this.reservations.splice(ind, 1);
    console.log("after cancel: " + this.reservations + "len: " + this.reservations.length)
    if(this.reservations.length > 0)
      localStorage['resArr'] = JSON.stringify(this.reservations);
    else
      localStorage.removeItem('resArr')
    alert("Reservation canceled!")

  }

}
