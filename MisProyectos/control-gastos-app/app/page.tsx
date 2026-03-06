'use client'
import { useState, useEffect } from 'react'
import { 
  ShoppingCart, Sparkles, Home as HomeIcon, Package, Send, 
  MoreHorizontal, TrendingDown, TrendingUp, PlusCircle, History, 
  AlignLeft, Calendar, Clock, Truck, Receipt, Users, Download, Wallet, ArrowDownCircle, ArrowUpCircle,
  Trash2, Loader2 // <--- Añadido Loader2 para el botón de carga
} from 'lucide-react'

interface Registro {
  id: number;
  tipo: 'ingreso' | 'gasto';
  monto: number;
  categoria: string;
  concepto: string; 
  proveedor: string; 
  noSoporte: string; 
  cajero: string;   
  fechaFormateada: string;
  timestamp: number;
}

// 🚀 TU URL DE GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyW5O4tVHE7Ols9jkRn0W1IbWBEE6HXGgUww2oXNN7zrK8RWFvhkNxwbmzTRoyMqjvl/exec";

export default function Home() {
  const [tipoRegistro, setTipoRegistro] = useState<'ingreso' | 'gasto'>('gasto')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('Compras (Insumos)')
  const [concepto, setConcepto] = useState('')
  const [proveedor, setProveedor] = useState('') 
  const [noSoporte, setNoSoporte] = useState('') 
  const [cajero, setCajero] = useState('')       
  const [fechaManual, setFechaManual] = useState('')
  const [historial, setHistorial] = useState<Registro[]>([])
  
  // Estado para bloquear el botón mientras guarda
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const guardado = localStorage.getItem('brostypann_logs_v2')
    if (guardado) setHistorial(JSON.parse(guardado))
    setFechaManual(new Date().toISOString().slice(0, 16))
  }, [])

  useEffect(() => {
    localStorage.setItem('brostypann_logs_v2', JSON.stringify(historial))
  }, [historial])

  const ponerFechaActual = () => {
    setFechaManual(new Date().toISOString().slice(0, 16))
  }

  const descargarReporte = () => {
    if (historial.length === 0) return alert("No hay registros operativos para exportar.");
    const cabeceras = "FECHA,HORA,TIPO,CAJERO/TURNO,MONTO ($),CATEGORIA,DETALLE,PROVEEDOR,FACTURA/RECIBO\n";
    const filas = historial.map(item => {
      const fechaObj = new Date(item.timestamp);
      return `"${fechaObj.toLocaleDateString()}","${fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}","${item.tipo.toUpperCase()}","${item.cajero}",${item.monto},"${item.categoria}","${item.concepto.replace(/,/g, ' ')}","${item.proveedor.replace(/,/g, ' ')}","${item.noSoporte}"`;
    }).join("\n");
    const blob = new Blob([cabeceras + filas], { type: 'text/csv;charset=utf-8;' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.setAttribute('download', `Cierre_Diario_Brostypann_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }

  const eliminarRegistro = (idAEliminar: number) => {
    if (window.confirm("¿Estás seguro de anular este registro? El total de la caja se recalculará automáticamente.")) {
      setHistorial(historial.filter(item => item.id !== idAEliminar))
    }
  }

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(monto) <= 0 || !cajero) return alert("Ingrese un monto válido y el nombre del cajero.")

    setIsSubmitting(true) // Bloqueamos el botón

    const fechaObjeto = new Date(fechaManual)
    const fechaFormateada = fechaObjeto.toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    const soloFecha = fechaObjeto.toLocaleDateString()
    const soloHora = fechaObjeto.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // 1. Armamos el paquete de datos para Google Sheets
    const payload = {
      fecha: soloFecha,
      hora: soloHora,
      tipo: tipoRegistro,
      cajero: cajero,
      monto: Number(monto),
      categoria: tipoRegistro === 'ingreso' ? 'Venta de Turno' : categoria,
      concepto: tipoRegistro === 'ingreso' ? 'Ingreso por ventas de caja' : (concepto || 'Sin descripción'),
      proveedor: tipoRegistro === 'ingreso' ? 'N/A' : (proveedor || 'N/A'),
      soporte: tipoRegistro === 'ingreso' ? 'N/A' : (noSoporte || 'N/A')
    }

    try {
      // 2. Disparamos el misil hacia Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Fundamental para que Google no bloquee la petición por seguridad
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      // 3. Si todo sale bien, lo mostramos en pantalla (Dashboard local)
      const nuevoRegistro: Registro = {
        id: Date.now(),
        tipo: tipoRegistro,
        monto: payload.monto,
        categoria: payload.categoria,
        concepto: payload.concepto,
        proveedor: payload.proveedor,
        noSoporte: payload.soporte,
        cajero: payload.cajero,
        fechaFormateada,
        timestamp: fechaObjeto.getTime()
      }

      setHistorial([nuevoRegistro, ...historial])
      
      // 4. Limpiamos el formulario
      setMonto('')
      if (tipoRegistro === 'gasto') {
        setConcepto('')
        setProveedor('')
        setNoSoporte('')
      }
    } catch (error) {
      alert("Error de conexión. Revisa tu internet y vuelve a intentar.")
    } finally {
      setIsSubmitting(false) // Desbloqueamos el botón
    }
  }

  // Matemática del negocio
  const totalIngresos = historial.filter(r => r.tipo === 'ingreso').reduce((acc, item) => acc + item.monto, 0)
  const totalGastos = historial.filter(r => r.tipo === 'gasto').reduce((acc, item) => acc + item.monto, 0)
  const efectivoCaja = totalIngresos - totalGastos

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center selection:bg-red-500/30 color-scheme-dark" style={{ colorScheme: 'dark' }}>
      <div className="max-w-md w-full pb-10">
        
        <header className="mb-6 text-center space-y-2 pt-4">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-red-900/30 border-2 border-orange-400">
              <span className="text-white font-black text-2xl">B</span>
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic text-red-600">
            BROSTY<span className="text-white not-italic">PANN</span>
          </h1>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">Cierre Diario Inteligente</p>
        </header>

        {/* DASHBOARD */}
        <div className="w-full bg-slate-900 rounded-[2.5rem] p-6 mb-6 shadow-2xl border border-slate-800 flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-slate-950/50 rounded-3xl p-4 border border-green-500/20">
              <p className="text-green-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"><ArrowUpCircle size={12}/> Turnos</p>
              <p className="text-xl font-black text-white font-mono mt-1">${totalIngresos.toLocaleString()}</p>
            </div>
            <div className="flex-1 bg-slate-950/50 rounded-3xl p-4 border border-red-500/20">
              <p className="text-red-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"><ArrowDownCircle size={12}/> Gastos</p>
              <p className="text-xl font-black text-white font-mono mt-1">${totalGastos.toLocaleString()}</p>
            </div>
          </div>
          <div className={`w-full p-5 rounded-3xl border flex justify-between items-center ${efectivoCaja >= 0 ? 'bg-gradient-to-br from-green-600 to-green-800 border-green-400/20 shadow-green-900/20' : 'bg-gradient-to-br from-red-600 to-red-800 border-red-400/20 shadow-red-900/20'} shadow-xl`}>
            <div>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Efectivo Físico en Caja</p>
              <p className="text-4xl font-black text-white font-mono mt-1">${efectivoCaja.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <Wallet className="text-white" size={28} />
            </div>
          </div>
        </div>
        
        {/* FORMULARIO */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800/50 mb-8 transition-all">
          <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-800">
            <button type="button" onClick={() => setTipoRegistro('gasto')} className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${tipoRegistro === 'gasto' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <ArrowDownCircle size={14}/> Gasto
            </button>
            <button type="button" onClick={() => setTipoRegistro('ingreso')} className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${tipoRegistro === 'ingreso' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <ArrowUpCircle size={14}/> Turno (Venta)
            </button>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                <Users size={14} className={tipoRegistro === 'ingreso' ? 'text-green-500' : 'text-red-500'}/> {tipoRegistro === 'ingreso' ? 'Cajero de Turno' : 'Responsable / Cajero'}
              </label>
              <select required value={cajero} onChange={(e) => setCajero(e.target.value)} className={`w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 focus:outline-none focus:ring-1 text-sm text-white cursor-pointer ${tipoRegistro === 'ingreso' ? 'focus:border-green-500' : 'focus:border-red-500'}`}>
                <option value="">Seleccione al responsable...</option>
                <option value="Turno Mañana">Turno Mañana</option>
                <option value="Turno Tarde">Turno Tarde</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                <PlusCircle size={14} className={tipoRegistro === 'ingreso' ? 'text-green-500' : 'text-red-500'}/> Monto en Efectivo
              </label>
              <input type="number" required value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className={`w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 focus:outline-none focus:ring-1 text-3xl font-mono text-white ${tipoRegistro === 'ingreso' ? 'focus:border-green-500 focus:ring-green-500 text-green-400' : 'focus:border-red-500 focus:ring-red-500 text-red-400'}`} />
            </div>

            {tipoRegistro === 'gasto' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Categoría Operativa</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none focus:border-red-500 text-white cursor-pointer">
                    <option value="Compras (Insumos)">🛒 Compras (Insumos)</option>
                    <option value="Anticipos de Nómina">💸 Anticipos de Nómina</option>
                    <option value="Insumos de Aseo">✨ Insumos de Aseo</option>
                    <option value="Mantenimiento Locativo">🔧 Mantenimiento Locativo</option>
                    <option value="Insumos Desechables">📦 Insumos Desechables</option>
                    <option value="Gastos Locativos">🏠 Gastos Locativos</option>
                    <option value="Retiro de Saldos">💳 Retiro de Saldos</option>
                    <option value="Ventas Crédito-Consumos">📝 Ventas Crédito-Consumos</option>
                    <option value="Otros">⚙️ Otros / Varios</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                    <AlignLeft size={14} className="text-red-500"/> Concepto / Detalle
                  </label>
                  <input type="text" required value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Ej: Compra de pollo..." className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 focus:border-red-500 outline-none text-sm text-white placeholder:text-slate-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1"><Truck size={14} className="text-red-500"/> Proveedor</label>
                    <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} placeholder="Avícola Sol..." className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 focus:border-red-500 outline-none text-sm text-white placeholder:text-slate-700" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1"><Receipt size={14} className="text-red-500"/> Factura N°</label>
                    <input type="text" value={noSoporte} onChange={(e) => setNoSoporte(e.target.value)} placeholder="REC-402..." className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 focus:border-red-500 outline-none text-sm text-white placeholder:text-slate-700" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-3 ml-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Calendar size={14} className={tipoRegistro === 'ingreso' ? 'text-green-500' : 'text-red-500'}/> Fecha y Hora
                </label>
                <button type="button" onClick={ponerFechaActual} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"><Clock size={12} /> Usar Ahora</button>
              </div>
              <input type="datetime-local" required value={fechaManual} onChange={(e) => setFechaManual(e.target.value)} className={`w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none text-sm text-white color-scheme-dark ${tipoRegistro === 'ingreso' ? 'focus:border-green-500' : 'focus:border-red-500'}`} style={{ colorScheme: 'dark' }} />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center gap-2 text-white font-black py-5 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-xs mt-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${tipoRegistro === 'ingreso' ? 'bg-green-600 hover:bg-green-500 shadow-green-900/40' : 'bg-red-600 hover:bg-red-500 shadow-red-900/40'}`}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting ? 'Registrando...' : (tipoRegistro === 'ingreso' ? 'Registrar Venta en Caja' : 'Confirmar Gasto Operativo')}
            </button>
          </form>
        </div>

        {/* HISTORIAL */}
        {historial.length > 0 && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center px-2 border-b border-slate-800 pb-2">
              <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <History size={14} /> Transacciones del Día
              </h2>
              <button onClick={descargarReporte} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-700 transition-all active:scale-95">
                <Download size={12} /> Exportar
              </button>
            </div>
            
            <div className="space-y-3 pb-10 pt-2">
              {historial.map((item) => (
                <div key={item.id} className={`p-5 rounded-3xl border flex justify-between items-center group transition-all ${item.tipo === 'ingreso' ? 'bg-green-950/20 border-green-900/50' : 'bg-slate-900/40 border-slate-800/50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border ${item.tipo === 'ingreso' ? 'bg-green-950 border-green-900/50' : 'bg-slate-950 border-slate-800'}`}>
                      {item.tipo === 'ingreso' ? <TrendingUp size={18} className="text-green-500" /> : <TrendingDown size={18} className="text-red-400" />}
                    </div>
                    <div>
                      <p className={`font-mono text-2xl font-bold ${item.tipo === 'ingreso' ? 'text-green-400' : 'text-white'}`}>
                        {item.tipo === 'ingreso' ? '+' : '-'}${item.monto.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight truncate max-w-[150px]">{item.concepto}</p>
                      <p className="text-[9px] text-slate-500 italic mt-1">Cajero: {item.cajero} {item.tipo === 'gasto' && `• Soporte: ${item.noSoporte}`}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-[10px] text-slate-600 font-mono bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">{item.fechaFormateada}</p>
                    <button onClick={() => eliminarRegistro(item.id)} className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}