import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()

// 2020-04-30T04:00:00.000Z | 2020-04-30T04:00:00.000+00:00 | 2020-04-30T04:00:00.000-00:00
// Bu servis ngb-select'in kullandığı NgbDateStruct yapısı ile backend'den gelen Date string'i
// karşılıklı olarak birbirine atar.
export class CustomDateAdapter extends NgbDateAdapter<string>{

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let fullDate: string = value.substring(0,10);

      let dateParts: string[] = fullDate.split(this.DELIMITER);

      let year = dateParts[0];
      let month = dateParts[1];
      let day = dateParts[2];

      return {
        day : parseInt(day, 10),
        month : parseInt(month, 10),
        year : parseInt(year, 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (date) {
      let day: string;
      let month: string;
      let year: string = `${date.year}`;

      date.day.toString().length == 1 ? day = `0${date.day}` : day = `${date.day}`;
      date.month.toString().length == 1 ? month = `0${date.month}` : month = `${date.month}`;

      let dateString: string = `${year}${this.DELIMITER}${month}${this.DELIMITER}${day}`;

      console.log(dateString);

      return dateString;
    }
    return null;
  }
}
