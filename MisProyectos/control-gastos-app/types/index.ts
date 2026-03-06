// types/index.ts
export interface Gasto {
  id?: string;
  created_at?: string;
  monto: number;
  categoria: 'Aseo' | 'Insumos' | 'Local' | 'Desechables' | 'Consignaciones' | 'Otros';
  concepto: string;
  fecha: string;
}