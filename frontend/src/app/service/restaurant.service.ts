import { EventEmitter, Injectable, Output } from '@angular/core';
import { restaurant } from '../shared/models/restaurant';
// import { samp_rest } from 'src/data'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private data:restaurant[] = [];
  private submitted:boolean = false;
  private details:boolean = false;
  @Output() updateRestaurants = new EventEmitter<string>();
  @Output() submitForm = new EventEmitter<string>();
  @Output() showDeets = new EventEmitter<string>();
  constructor() { }

  getRestaurants():restaurant[]{
    return this.data;
  }

  isSubmitted():boolean{
    return this.submitted;
  }

  setSubmitted(val:boolean){
    this.submitted = val;
  }

  getDetails():boolean{
    return this.details;
  }

  setDetails(val:boolean){
    this.details = val;
    this.showDeets.emit("CLICK SUBMIT");
  }

  showDetails(){
    this.details = true;
    this.updateRestaurants.emit("CLICK SUBMIT");
    this.showDeets.emit("CLICK SUBMIT");
  }

  setRestaurants(data:restaurant[]){
    this.submitted = true
    this.data = data;
    this.data.forEach(function (item:restaurant) {
      item.distance = Math.trunc(item.distance/1609);
    });
    this.updateRestaurants.emit("CLICK SUBMIT");
    this.submitForm.emit("CLICK SUBMIT");
  }

  retRestaurants(){
    console.log("HERE REST SERVICE")
  }
}
