import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Clientes } from './pages/Clientes.jsx';
import { FormMesa } from './pages/FormMesa.jsx';
import { FormCliente } from './pages/FormCliente.jsx';
import { FormReserva } from './pages/FormReserva.jsx';
import { Mesas } from './pages/Mesas.jsx';
import { Reservas } from './pages/Reservas.jsx';
import { TelaInicial } from './pages/TelaInicial';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/add" element={<FormCliente mode="add" />} />
          <Route path="/clientes/edit/:id" element={<FormCliente mode="edit" />} />
          <Route path="/mesas" element={<Mesas />} />
          <Route path="/mesas/add" element={<FormMesa mode="add" />} />
          <Route path="/mesas/edit/:id" element={<FormMesa mode="edit" />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/reservas/add" element={<FormReserva mode="add" />} />
          <Route path="/reservas/edit/:id" element={<FormReserva mode="edit" />} />
          <Route path="*" element={<h2> Página não encontrada (404)</h2>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
