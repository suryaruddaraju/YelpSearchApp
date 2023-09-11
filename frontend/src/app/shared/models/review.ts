export class review {
  id!:number;
  rating!:number;
  user!:user;
  text!:string;
  time_created!:string;
}

export class user {
  name!:string;
}

export class yelpReview{
  reviews!:review[];
  total!:number;
  possible_languages!:string[];
}
