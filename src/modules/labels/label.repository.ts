import api from '../../lib/api';
import { Label } from './label.entity';

export const labelRepository = {
  async createLabel(name: string, color: string): Promise<Label> {
    const result = await api.post('/labels', { name, color });
    return new Label(result.data);
  },
  async getLabels(): Promise<Label[]> {
    const result = await api.get('/labels');
    return result.data.map((label: Label) => new Label(label));
  },
  async deleteLabel(id: string): Promise<void> {
    await api.delete(`/labels/${id}`);
  },
};
