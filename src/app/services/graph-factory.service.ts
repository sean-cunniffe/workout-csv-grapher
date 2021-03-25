import {Injectable} from '@angular/core';
import {Log} from '../common/log';

@Injectable({
  providedIn: 'root'
})
export class GraphFactoryService {

  constructor() {
  }

  public createGraph(xValues: Date[], yValues: number[], exerciseName: string, mappingByDate: Map<number, Log[]>): any {
    return {
      data: [{x: xValues, y: yValues, type: 'scatter', marker: {color: 'blue'}, name: 'Top Set (KG)'}],
      layout: {width: window.innerWidth, title: exerciseName, legend: {orientation: 'h'}},
      sets: mappingByDate,
      hidden: false
    };
  }
}

