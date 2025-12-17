import '../style/cards.css';
import { useRef } from 'react';

// const URL = 'http://localhost:3000/tables/';

export function CardMesa({ restrict, tables, onEdit, onDelete }) {
  const sortedTables = [...tables].sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const lockRef = useRef(false);

  const handleSafeClick = (callback) => (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (lockRef.current) return;  // evita toques duplicados
  lockRef.current = true;

  callback();
};

  lockRef.current = false

  return (
    <div className="cards-container">
      { (!tables || tables.length === 0) ? <p>Sem mesas...</p> : (sortedTables?.map((table) => (
        <div key={table.id} className="card">
          <div className='info'>
          <p>Mesa #{table.table_number}</p>
          <hr />
          <p className='info-add'>Capacidade: {table.capacity} pessoas</p>
          <p className='info-add'>Status: <span className={`${table.status === 'ATIVA' ? 'active' : 'not-active'}`}>{table.status}</span></p>
          </div>
          <div className="buttons">
            <button onClick={handleSafeClick(() => onEdit(table.id))} 
            className='button-new editButton' >Editar mesa</button>
          <button onClick={handleSafeClick(() => onDelete(table.id))} 
          className='button-new deleteButton'
          disabled={restrict.some(i => i.id === table.id)}
          >Excluir mesa</button>
          </div>

          
        </div>
      )))}
    </div>
  );
}
