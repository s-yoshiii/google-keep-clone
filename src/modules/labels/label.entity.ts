export class Label {
  id!: string;
  userId!: string;
  name!: string;
  color!: string;
  constructor(data: Label) {
    Object.assign(this, data);
  }
}
