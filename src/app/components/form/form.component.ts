import {Component, EventEmitter, Output} from '@angular/core';
import {City} from "../../models/city_model";
import {CityService} from "../../services/city.service";
import {CityServiceResponse} from "../../models/api_response";
import {FormBuilder, Validators} from "@angular/forms";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Output() fetcher: EventEmitter<CityServiceResponse> = new EventEmitter<CityServiceResponse>();
  countryIds!: string;
  minPopulation!: number;

  input_form_group = this.form.group({
    id_control: ['CA,US,MX', Validators.pattern('([A-Z][A-Z],)*([A-Z][A-Z])')],
    pop_control: [10000, Validators.min(1000)],
  });
  getCities(): void {
    this.countryIds = this.input_form_group.get('id_control')?.value ?? 'US';
    this.minPopulation = this.input_form_group.get('pop_control')?.value ?? 10000;

    // emit event containing backend response
    this.cityService.getCities(this.countryIds, this.minPopulation)
      .subscribe(fetched => {
        this.fetcher.emit(fetched)
      })
  }
  constructor(
    private cityService: CityService,
    private form: FormBuilder) {

  }
}
