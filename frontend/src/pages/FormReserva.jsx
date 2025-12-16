import { useParams } from 'react-router-dom';
import FormReservation from '../components/FormReservation';
import '../style/form.css';
import { Header } from '../components/Header';

export function FormReserva({ mode }) {
  const { id } = useParams();

  return (
    <div className='main'>
      <Header title='TableManager' back='reservas' />
    <div className="form-holder">
      <h1>{mode === 'add' ? 'Adicionar Reserva' : 'Editar Reserva'}</h1>
      <hr />
      <FormReservation mode={mode} id={id} />
    </div>
    </div>
  );
}
