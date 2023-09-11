import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../service/restaurant.service';
import { restaurant } from '../shared/models/restaurant';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  restaurants:restaurant[] = [];
  constructor(private restService:RestaurantService, activatedRoute:ActivatedRoute) {
    // activatedRoute.params.subscribe((params) => {

    // });
    this.restaurants = restService.getRestaurants();
  }

  ngOnInit(): void {
  }

}
