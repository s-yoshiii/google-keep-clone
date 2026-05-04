import { Label } from '../labels/label.entity';

export class Note {
  id!: string;
  userId!: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  createdAt!: Date;
  updatedAt!: Date;
  labels: Label[] = [];
  constructor(data: Note) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.labels = data.labels.map((label) => new Label(label));
  }
}
