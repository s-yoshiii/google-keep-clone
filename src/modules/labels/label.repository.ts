import api from '../../lib/api';
import { Label } from './label.entity';

export const labelRepository = {
  async createLabel(name: string, color: string): Promise<Label> {
    const result = await api.post('/labels', { name, color });
    return new Label(result.data);
  },
};
