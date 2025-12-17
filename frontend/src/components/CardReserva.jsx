import '../style/cards.css';
import { useRef } from 'react';

export function CardReserva({ reservations, onEdit, onDelete }) {

  const sortedReservations = [...reservations.sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at)
  })]

  const lockRef = useRef(false);

  const handleSafeClick = (callback) => (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (lockRef.current) return;  // evita toques duplicados
  lockRef.current = true;

  callback();
};

    function formatDate(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }

        const formattedDate = new Date(date).toLocaleDateString('pt-BR', options);

        return formattedDate;
    }

  lockRef.current = false

  return (
    <div className="cards-container">
      { (!reservations || reservations.length === 0) ? <p>Sem reservas...</p> : (sortedReservations?.map((reservation) => (
        <div key={reservation.id} className="card">
          <div className='info'>
          <p>Reserva #{reservation.id}</p>
          <hr />
          <p className='info-add'>Cliente: {reservation.name}</p>
          <p className='info-add'>Mesa #{reservation.table_number}</p>
          <p className='info-add'>Data: {formatDate(reservation.reservation_datetime)}</p> 
          <p className='info-add'>Status: <span className={`${reservation.status === 'CONFIRMADA' ? 'active' : 'not-active'}`}>{reservation.status}</span></p>
          </div>
          <div className="buttons">
            <button onClick={handleSafeClick(() => onEdit(reservation.id))} 
            className='button-new editButton' disabled={reservation.status === 'CANCELADA'}>Editar reserva</button>
          <button onClick={handleSafeClick(() => onDelete(reservation.id))} 
          className='button-new deleteButton'>Excluir reserva</button>
          </div>

        </div>
      )))}
    </div>
  );
}
