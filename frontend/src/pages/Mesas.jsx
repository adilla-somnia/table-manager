import { useNavigate, useLocation } from 'react-router-dom';
import { CardMesa } from '../components/CardMesa';
import '../style/button.css';
import '../style/cards.css';
import { useEffect, useState, useRef } from 'react';
import { deleteTable, getTables, getRestrictTables } from '../api/tables';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/Header';

export function Mesas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [tables, setTables] = useState([]);
  const [restrictTables, setRestrictTables] = useState([]);
  const toastHandled = useRef(false);

  const fetchTables = async () => {
    const data = await getTables();
    setTables(data);
    const restrict_data = await getRestrictTables();
    setRestrictTables(restrict_data);
  }

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchTables()
  }
  });

  useEffect(() => {
    if (location.state?.toastMessage && !toastHandled.current) {
      showToast(location.state.toastMessage, location.state.toastType)
      toastHandled.current = true
      window.history.replaceState({}, document.title)
    }
  }, [location.state, showToast])

  const editarMesa = (id) => {
    navigate(`/mesas/edit/${id}`);
  }

  const excluirMesa = async (id) => {
    try {
      await deleteTable(id);
      setTables((prev) => prev.filter((u) => u.id !== id));
      showToast('Mesa excluída com sucesso!', 'delete')
    } catch (error) {
      console.error(error);
      showToast('Erro ao excluir mesa.', 'error')
    }
  };

  return (
    <div className="main">
      <Header title='Mesas Cadastradas' back=''></Header>
      <div>
      <p><i>obs.:</i> Mesas com reservas cadastradas não podem ser excluídas.</p>
        <div className="page-head">
          <h2> Página de Mesas</h2>
          <button className="button-new button-desktop" onClick={() => {
            navigate('/mesas/add');
          }}>
            Adicionar Mesa
          </button>
          <button className='add-button-round button-new' onTouchStart={() => {
            navigate('/mesas/add')
          }}>+</button>
        </div>
        <hr />
        <CardMesa restrict={restrictTables || []} tables={tables || []} onEdit={editarMesa} onDelete={excluirMesa} ></CardMesa>
      </div>
    </div>
  );
}
