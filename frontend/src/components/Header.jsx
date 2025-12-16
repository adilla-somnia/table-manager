 import '../style/cards.css'
 import { Link } from 'react-router-dom'
 
 export function Header(props) {
    return (
        <nav>
        <Link to={`/${props.back}`} className="go-back">
          Voltar
        </Link>
        <div className="midblock">{props.title}</div>
      </nav>
    )
 }
 
