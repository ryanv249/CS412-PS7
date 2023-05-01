import {Component, Input, SimpleChanges} from '@angular/core';
import {City} from "../../models/city_model";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent {
  @Input() city_list: City[] | undefined;
  @Input() cached_marker: boolean | undefined;
  focused_city: City | undefined;
  displayCityDetail(c: City): void{
    this.focused_city = c;
  }
  ngOnChanges(changes: SimpleChanges){
    // could add if to avoid errors in console but fewer lines is prettier
    if(changes['city_list'].previousValue[0].name !== changes['city_list'].currentValue[0].name){
      // if smallest city changes, we probably fetched different results; should remove focus if so
      this.focused_city = undefined;
    }
  }

  // display is all automatically updated!
}
