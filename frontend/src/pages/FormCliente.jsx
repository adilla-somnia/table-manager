import { useParams } from 'react-router-dom';
import FormCustomer from '../components/FormCustomer';
import '../style/form.css';
import { Header } from '../components/Header';

export function FormCliente({ mode }) {
  const { id } = useParams();

  return (
    <div className='main'>
      <Header title='TableManager' back='clientes' />
    <div className="form-holder">
      <h1>{mode === 'add' ? 'Adicionar Cliente' : 'Editar Item'}</h1>
      <hr />
      <FormCustomer mode={mode} id={id} />
    </div>
    </div>
  );
}
