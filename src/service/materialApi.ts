import { API } from "@/hooks/getEnv";
import axios from "axios";

export const getMaterials = async () => {
  const res = await axios.get(`${API}/material`);

  return res.data;
};

export const createMaterial = async (data: any) => {
  const res = await axios.post(`${API}/material`, data);
  return res.data;
};

export const updateMaterial = async (id: string, data: any) => {
  const res = await axios.patch(`${API}/material/${id}`, data);
  return res.data;
};

export const deleteMaterial = async (id: string) => {
  const res = await axios.delete(`${API}/material/${id}`);
  return res.data;
};
