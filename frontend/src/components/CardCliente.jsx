import { useRef } from "react";
import "../style/cards.css";

export function CardCliente({ restrict, customers, onEdit, onDelete }) {
  const lockRef = useRef();

  const handleSafeClick = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (lockRef.current) return;
    lockRef.current = true;

    callback();
  };

  lockRef.current = false;

  return (
    <div className="cards-container">
      {!customers || customers.length === 0 ? (
        <p>Sem clientes...</p>
      ) : (
        customers?.map((customer) => (
          <div key={customer.id} className="card">
            <div className="info">
              <p>{customer.name}</p>
              <hr />
              <p className="info-add">Telefone: {customer.phone}</p>
              <p className="info-add">
                E-mail: {customer.email ? customer.email : "não informado"}
              </p>
              <p className="info-add">id: {customer.id}</p>
            </div>
            <div className="buttons">
              <button
                onClick={handleSafeClick(() => onEdit(customer.id))}
                className="button-new editButton"
              >
                Editar cliente
              </button>
              <button
                disabled={restrict.some(i => i.id === customer.id)}
                onClick={handleSafeClick(() => onDelete(customer.id))}
                className="button-new deleteButton"
              >
                Excluir cliente
              </button>
              
            </div>
          </div>
        ))
      )}
    </div>
  );
}
