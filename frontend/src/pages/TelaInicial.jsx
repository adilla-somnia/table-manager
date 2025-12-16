import { Link } from 'react-router-dom';
import '../style/styles.css';

export function TelaInicial() {
  return (
    <main>
      <div className="biggerblock">
        <p>TableManager</p>
      </div>
      <div className="smallerblocks">
        <Link to="/clientes" className="no_underline hop-1">
          <div className="innersmallblock soft-1">
            <p>Consultar Clientes</p>
          </div>
        </Link>
        <Link to="/mesas" className="no_underline hop-2">
          <div className="innersmallblock soft-2">
            <p>Consultar Mesas</p>
          </div>
        </Link>
        <div className="last-block hop-3">
          <Link to="/reservas" className="no_underline">
            <div className="innersmallblock">
              <p>Consultar Reservas</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
