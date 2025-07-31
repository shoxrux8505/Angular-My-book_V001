import { Pipe, PipeTransform } from '@angular/core';
import { shuffle } from 'lodash';

@Pipe({
  name: 'randomImage'
})
export class RandomImagePipe implements PipeTransform {
  transform(imageArray: any[], count: number): any[] {
    return shuffle(imageArray).slice(0, count);
  }
}
