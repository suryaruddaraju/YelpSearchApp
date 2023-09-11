import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '../form/form.component';
import { RestaurantService } from '../service/restaurant.service';
import { restaurant } from '../shared/models/restaurant';
import { review, yelpReview, user } from '../shared/models/review';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'
import { HttpClient } from '@angular/common/http';
import { yelpRest } from '../shared/models/yelpRest';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  restaurants:restaurant[] = [];
  subbed = false;
  details = false;
  currRest = {} as restaurant;
  ctgy:string = "";
  public resForm:FormGroup;
  currReviews = {} as review[];
  users:string[] = [];
  rating:number[] = [];
  reviewText:string[] = [];
  reviewTimes:string[] = [];
  todate = new Date().toISOString().split("T")[0];
  hasRes = false;
  currReses = [];

  mapOptions: google.maps.MapOptions = {
    center: { lat: 0, lng: 0 },
    zoom : 14
  }
  marker = {
    position: { lat: 0, lng: 0 },
  }

  constructor(private restService:RestaurantService, activatedRoute:ActivatedRoute,
              private elementRef:ElementRef, private fb: FormBuilder, private http:HttpClient) {

    this.resForm = this.fb.group({
      email:['', Validators.compose([Validators.required, Validators.email])],
      date:['', Validators.compose([Validators.required])],
      time:['', Validators.compose([Validators.required])],
    });

    this.subbed = restService.isSubmitted()
    this.details = restService.getDetails()
    this.restaurants = restService.getRestaurants();
    console.log("TABLE COMP restaurants: " + this.restaurants)
  }

  ngOnInit(): void {
    this.restService.updateRestaurants.subscribe(
      (data:string) => this.restaurants = this.restService.getRestaurants()
    );
    this.restService.submitForm.subscribe(
      (data:string) => this.subbed = this.restService.isSubmitted()
    );
    this.restService.showDeets.subscribe(
      (data:string) => this.details = this.restService.getDetails()
    );
  }

  rowClicked(id:string, rowNum:number){
    this.restService.showDetails();

    console.log(id);
    console.log(rowNum);
    var url = "https://angularapp-368104.uc.r.appspot.com/api/getRestaurants/"+this.restaurants[rowNum].alias;
    this.http.get<restaurant>(url).subscribe(data => {
      var results = data;
      console.log("raw Return: " + results);
      this.currRest = results;

      this.currRest.photos.forEach(element => {
        console.log("********************PHOTOS: " + element);
      });
      // console.log("PHOTOS: " + this.currRest.photos);

      for (let i = 0; i < this.currRest.categories.length - 1; i++) {
        this.ctgy += this.currRest.categories[i].title + "|"
      }
      this.ctgy += this.currRest.categories[this.currRest.categories.length - 1].title;
      this.mapOptions = {
        center: { lat: this.currRest.coordinates.latitude, lng: this.currRest.coordinates.longitude },
        zoom : 14
      }
      this.marker = {
        position: { lat: this.currRest.coordinates.latitude, lng: this.currRest.coordinates.longitude },
      }
      this.hasReservation();

      this.getReviews()
    });
  }

  backToTable(){
    this.restService.setDetails(false);
  }

  setRests(rests:restaurant[]){
    this.restaurants = rests;
  }

  onClick() {
    console.log("TABLE COMP LISTEN");
  }

  getReviews(){
    console.log("in get reviews");

    var url = "https://angularapp-368104.uc.r.appspot.com/api/reviews/"+this.currRest.alias;
    console.log("AFTER URL get reviews");
    console.log("review url: " + url);


    this.http.get<yelpReview>(url).subscribe(data => {
      var results = data;
      console.log("raw Return: " + results);
      this.currReviews = results.reviews;
      // console.log("currReviews: " + this.currReviews)
      // console.log(this.currReviews[0].user.name)
      this.currReviews.forEach( (value) => {
        this.users.push(value.user.name);
        this.rating.push(value.rating);
        this.reviewText.push(value.text);
        this.reviewTimes.push(value.time_created)
      })
      // this.currReviews = results as review[];
      // console.log("CURR REVIEWS:"+JSON.stringify(this.currReviews));
      // this.currReviews.forEach( function(value) {
      //   console.log(value.user.name);
      // });
    })

  }

  hasReservation(){
    // console.log("local storage: -" + JSON.parse(localStorage['resArr']) + "-")
    // console.log("local storageLen: -" + JSON.parse(localStorage['resArr']).length + "-")
    if(localStorage['resArr']){
      console.log("there are resies");
      this.currReses = JSON.parse(localStorage['resArr']);
      console.log("has Res(currResses): " + this.currReses)
      this.currReses.forEach((element:any) => {
        console.log("elem: " + JSON.stringify(element));
        console.log("elem name: " + element['rest']);
        if(element['rest'] === this.currRest.name){
          this.hasRes = true;
          return;
        }
        else {
          this.hasRes = false;
        }
      });
    } else {
      this.hasRes = false;
    }
    if(this.hasRes){
      console.log("RESERVATION EXISTS");
    } else {
      console.log("RESERVATION *************DOES NOT************** EXISTS");
    }
  }

  createRes(){
    console.log("create Rs");
    const reservation:JSON = <JSON><unknown>{
      "rest": this.currRest.name,
      "email": this.resForm.get('email')?.value,
      "date": this.resForm.get('date')?.value,
      "time": this.resForm.get('time')?.value
    }
    console.log("RESERVATION: " + JSON.stringify(reservation))
    console.log("EXISTING: " + localStorage['resArr'])
    var temp;
    if(localStorage['resArr']){
      temp = JSON.parse(localStorage['resArr']);
    } else {
      temp = [];
    }
    temp.push(reservation);
    localStorage['resArr'] = JSON.stringify(temp);
    console.log("AFTER: " + localStorage['resArr'])
    alert("Reservation created!");
    this.hasReservation();


  }

  cancelRes(){
    console.log("before cancel: " + this.currReses + "len: " + this.currReses.length)
    for (let i = 0; i < this.currReses.length; i++) {
      // console.log(JSON.stringify())
      if(this.currReses[i]['rest'] === this.currRest.name){
        this.currReses.splice(i, 1);
      }
    }
    console.log("after cancel: " + this.currReses + "len: " + this.currReses.length)
    if(this.currReses.length > 0)
      localStorage['resArr'] = JSON.stringify(this.currReses);
    else
      localStorage.removeItem('resArr')
    alert("Reservation canceled!")
    this.hasReservation();

  }

}
