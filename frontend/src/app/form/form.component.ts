import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RestaurantService } from '../service/restaurant.service';
import { TableComponent } from '../table/table.component';
import { restaurant } from '../shared/models/restaurant';
import { yelpRest } from '../shared/models/yelpRest';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Output() showTable: EventEmitter<any> = new EventEmitter();


  lat = "";
  long = "";
  checked = false;
  public searchForm:FormGroup;
  constructor( private fb: FormBuilder, private http:HttpClient, private restService:RestaurantService) {
    // Form element defined below

    this.searchForm = this.fb.group({
      keywd: ['', Validators.required],
      dst: ['', Validators.required],
      category: ['all', Validators.required],
      locationBox: ['', Validators.required],
      lat: [''],
      long: [''],
      locationCheck: ['']
    });
  }

  submit() {
    this.restService.setDetails(false);
    if(!this.checked){
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ this.searchForm.get("locationBox")?.value+ "&key=AIzaSyClGHeQVPCpVDhOZUhhwx3YzM955N6GlsI"
      this.http.get<locFromString>(url).subscribe(data => {
        var res = data.results
        this.lat = res[0].geometry.location.lat + "";
        this.long = res[0].geometry.location.lng + "";

        this.callYelp();
      })
    } else {
      this.callYelp();
    }
  }

  callYelp(){
    console.log("here");
    var url = "https://angularapp-368104.uc.r.appspot.com/api/restaurants/search/" +
              this.searchForm.get('keywd')?.value + "/" +
              this.lat + "/" +
              this.long + "/" +
              this.searchForm.get('category')?.value + "/" +
              this.searchForm.get('dst')?.value*1609;

    console.log("in submit: %s", url);
    this.http.get<yelpRest>(url).subscribe(data => {
      console.log("response");
      var results = data.businesses;
      console.log(results)
      this.restService.setRestaurants(results)
    })
  }

  locCheck(){
    if(this.checked){
      this.checked = false;
      this.lat = "";
      this.long = "";
    }
    else {
      this.checked = true;
      this.http.get<autoLoc>('https://ipinfo.io/json?token=2747365f68142d').subscribe(data => {
          var loc = data.loc.split(",");
          this.lat = loc[0]
          this.long = loc[1]
      })
    }
    this.toggleLocation(this.checked);
  }

toggleLocation(value: boolean) {
  if(value) {
    this.searchForm.controls['locationBox'].setValue("");
    this.searchForm.controls['locationBox'].disable();
  } else {
      this.searchForm.controls['locationBox'].enable();
    }
  }

  clearForm(){
    this.searchForm.controls['locationBox'].setValue("");
    this.searchForm.controls['keywd'].setValue("");
    this.searchForm.controls['category'].setValue("all");
    this.searchForm.controls['dst'].setValue("");
    this.searchForm.controls['locationCheck'].setValue(false);
    this.searchForm.controls['locationBox'].enable();
    this.checked = false;
    this.restService.setRestaurants([]);
    this.restService.setSubmitted(false);
  }

  ngOnInit(): void {
  }


}

interface autoLoc {
  loc: string;
}

interface locFromString {
  results: {
    [key: string]: {
      geometry: {
        location: {
          lat: number;
          lng: number;
        }
      }
    }
  };
}
