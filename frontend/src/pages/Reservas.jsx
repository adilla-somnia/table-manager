import { useNavigate, useLocation } from 'react-router-dom';
import { CardReserva } from '../components/CardReserva';
import '../style/button.css';
import '../style/cards.css';
import { useEffect, useState, useRef } from 'react';
import { deleteReservation, getReservations } from '../api/reservas';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/Header';

export function Reservas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const toastHandled = useRef(false);

  const fetchReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchReservations();
    }
  });

  useEffect(() => {
    if (location.state?.toastMessage && !toastHandled.current) {
      showToast(location.state.toastMessage, location.state.toastType)
      toastHandled.current = true
      window.history.replaceState({}, document.title)
    }
  }, [location.state, showToast])

  const editarReserva = (id) => {
    navigate(`/reservas/edit/${id}`);
  }

  const excluirReserva = async (id) => {
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((u) => u.id !== id));
      showToast('Reserva excluída com sucesso!', 'delete')
    } catch (error) {
      console.error(error);
      showToast('Erro ao excluir reserva.', 'error')
    }
  };

  return (
    <div className="main">
      <Header title='Reservas Cadastradas' back=''></Header>
      <div>
        <div className="page-head">
          <h2> Página de Reservas</h2>
          <button className="button-new button-desktop" onClick={() => {
            navigate('/reservas/add');
          }}>
            Adicionar Reserva
          </button>
          <button className='add-button-round button-new' onTouchStart={() => {
            navigate('/reservas/add')
          }}>+</button>
        </div>
        <hr />
        <CardReserva reservations={reservations || []} onEdit={editarReserva} onDelete={excluirReserva} ></CardReserva>
      </div>
    </div>
  );
}
