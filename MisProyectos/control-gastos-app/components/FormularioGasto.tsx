'use client'
import { useState } from 'react'

export default function FormularioGasto() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
          <input 
            type="number" 
            placeholder="Ej: 50000"
            className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-lg text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
          <select className="w-full p-3 rounded-xl border border-slate-300 bg-white outline-none text-slate-900">
            <option>Aseo</option>
            <option>Insumos</option>
            <option>Local</option>
            <option>Desechables</option>
            <option>Consignaciones</option>
            <option>Otros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Concepto</label>
          <textarea 
            placeholder="¿En qué se gastó?"
            className="w-full p-3 rounded-xl border border-slate-300 outline-none h-24 text-slate-900"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          Registrar Gasto
        </button>
      </form>
    </div>
  )
}