import { CardCliente } from '../components/CardCliente';
import '../style/cards.css';
import '../style/button.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { deleteCustomer, getCustomers } from '../api/customers';
import { useToast } from '../context/ToastContext';
import { useState, useRef, useEffect } from 'react';



export function Clientes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const toastHandled = useRef(false);

  const fetchCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchCustomers();
    }
  });

  useEffect(() => {
    if (location.state?.toastMessage && !toastHandled.current) {
      showToast(
        location.state.toastMessage,
        location.state.toastType)

      toastHandled.current = true;
      window.history.replaceState({}, document.title)
      
    }
  }, [location.state, showToast]);

  const editarCliente = (id) => {
    navigate(`/clientes/edit/${id}`);
  }

  const excluirCliente = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast('Cliente excluído com sucesso!', 'delete');
    } catch (error) {
      console.error(error)
      showToast('Erro ao excluir mesa!', 'error')      
    }
  }

  return (
    <div className="main">
      <Header title='Clientes Cadastrados' back=''></Header>
      <div>
        <div className="page-head">
          <h2> Página de Clientes</h2>
          <button className='button-new button-desktop' onClick={() => navigate('/clientes/add')}>Adicionar Cliente</button>
          <button className="button-new add-button-round" onTouchStart={() => navigate('/clientes/add')}>
            +
          </button>
        </div>
        <hr />
        <CardCliente customers={customers || []} onEdit={editarCliente} onDelete={excluirCliente}></CardCliente>
      </div>
    </div>
  );
}
