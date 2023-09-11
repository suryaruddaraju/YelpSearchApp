export class restaurant{
  id!:string;
  alias!:string;
  name!:string;
  image_url!:string;
  is_closed!:boolean;
  url!:string;
  review_count!:number;
  categories!:category[];
  coordinates!:coors;
  rating!:number;
  transactions!:string[];
  price!:string;
  display_phone!:string;
  location!:location;
  phone!:string;
  distance!:number;
  photos!:string[]
}

export class category{
  alias!:string;
  title!:string;
}

export class location{
  address1!:string;
  address2!:string;
  address3!:string;
  city!:string;
  zip_code!:string;
  country!:string;
  state!:string;
  display_address!:string[]
}

export class coors {
  latitude!:number;
  longitude!:number;
}
