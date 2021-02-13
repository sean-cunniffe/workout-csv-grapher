export class Log {

  constructor(public date: Date,
              public workoutName: string,
              public exerciseName: string,
              public setOrder: number,
              public weight: number,
              public reps: number,
              public distance: number,
              public seconds: number,
              public notes: string,
              public workoutNotes: string) {
  }

  toString(): string {
    return (`${this.date} ${this.workoutName} ${this.exerciseName} ${this.setOrder} ${this.weight} ${this.distance}
     ${this.seconds} ${this.notes} ${this.workoutNotes}`);
  }


}
