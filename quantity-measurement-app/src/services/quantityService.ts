import api from './api';

export interface QuantityDTO {
  value: number;
  unit: string;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
}

export const convertQuantity = async (source: QuantityDTO, targetUnit: string): Promise<QuantityDTO> => {
  const response = await api.post(`/api/v1/quantities/convert/${encodeURIComponent(targetUnit)}`, source);
  return response.data;
};

export const compareQuantity = async (payload: QuantityInputDTO): Promise<boolean> => {
  const response = await api.post('/api/v1/quantities/compare', payload);
  return response.data;
};

export const addQuantity = async (payload: QuantityInputDTO): Promise<QuantityDTO> => {
  const response = await api.post('/api/v1/quantities/add', payload);
  return response.data;
};

export const subtractQuantity = async (payload: QuantityInputDTO): Promise<QuantityDTO> => {
  const response = await api.post('/api/v1/quantities/subtract', payload);
  return response.data;
};

export const divideQuantity = async (payload: QuantityInputDTO): Promise<number> => {
  const response = await api.post('/api/v1/quantities/divide', payload);
  return response.data;
};

export interface QuantityMeasurementEntity {
  id?: string | number;
  operand1: string;
  operation: string;
  operand2: string;
  result: string;
  status: string;
  errormessage: string;
  createdAt?: string;
}

export const getHistory = async (): Promise<QuantityMeasurementEntity[]> => {
  const response = await api.get('/api/v1/quantities/history');
  return response.data;
};
