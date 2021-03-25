import {Injectable} from '@angular/core';
import {Log} from '../common/log';

@Injectable({
  providedIn: 'root'
})
export class GraphFactoryService {

  constructor() {
  }

  public createGraph(xValues: Date[], yValues: number[], exerciseName: string, mappingByDate: Map<number, Log[]>, lineColor: string): any {
    return {
      data: [{x: xValues, y: yValues, type: 'scatter', marker: {color: lineColor}, name: 'Total Mass Moved (KG)'}],
      layout: {width: window.innerWidth, title: exerciseName, legend: {orientation: 'h', font: {size: 18}}},
      sets: mappingByDate,
      hidden: false
    };
  }
}

