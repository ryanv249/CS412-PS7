import {Component, Input, OnInit} from '@angular/core';
import {City} from "../../models/city_model";
import {CityService} from "../../services/city.service";
import {CityServiceResponse} from "../../models/api_response";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PS7';
  city_list: City[] | undefined;
  cached_marker: boolean | undefined;

  // called through event emitted by form child
  updateDisplay(reply: CityServiceResponse){
    // changing these variables causes display child to update itself
    this.city_list = reply.data;
    this.cached_marker = reply.cached;
    console.log(reply);
  }


}


