import { useParams } from 'react-router-dom';
import FormTable from '../components/FormTable';
import '../style/form.css';
import { Header } from '../components/Header';

export function FormMesa({ mode }) {
  const { id } = useParams();

  return (
    <div className='main'>
      <Header title='TableManager' back='mesas'></Header>
    <div className="form-holder">
      <h2>{mode === 'add' ? 'Adicionar mesa' : 'Editar mesa'}</h2>
      <hr />
      <FormTable mode={mode} id={id} />
    </div>
    </div>
  );
}
