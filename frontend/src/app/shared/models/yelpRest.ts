import { restaurant } from './restaurant';

export class yelpRest{
  businesses!:restaurant[];
  total!:number;
  region!:reg;
}

export class reg{
  center!:loc;
}

export class loc{
  longitude!:number;
  latitude!:number;
}
