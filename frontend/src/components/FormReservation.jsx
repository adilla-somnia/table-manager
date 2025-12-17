import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    checkReservationAvailability,
  createReservation,
  getReservationById,
  updateReservation
} from "../api/reservas.jsx";
import {
    getCustomers
} from "../api/customers.jsx";
import {
    getTables
} from "../api/tables.jsx";
import "../style/form.css";
import "../style/button.css";
import HeaderForm from "./HeaderForm.jsx";
import { useToast } from "../context/ToastContext.jsx"

export default function FormReservation({ mode, id }) {
  const [form, setForm] = useState({
    table_id: "",
    customer_id: "",
    reservation_datetime: "",
    status: "PENDENTE"
  });
  const [loading, setLoading] = useState(mode === "edit");
  const navigate = useNavigate();
  const [tables, setTables ] = useState([]);
  const [customers, setCustomers ] = useState([]);
  const [initialForm, setInitialForm] = useState(null);
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [capacity, setCapacity] = useState(null);
  const [suggestions, setSuggestions] = useState({
    sug_tables: "",
    sug_date: ""
  });
  const timeoutRef = useRef(null);
  const { showToast } = useToast();
  const [statusOptions, setStatusOptions] = useState([]);

  const fetchData = async () => {
    const data_tables = await getTables()
    setTables(data_tables);
    const data_customers = await getCustomers()
    setCustomers(data_customers);
  }

  // Carrega dados se for modo EDITAR
  useEffect(() => {
    if (mode === "edit") {
      getReservationById(id).then((reservation) => {
        setForm({
            table_id: reservation.table_id,
            customer_id: reservation.customer_id,
            reservation_datetime: reservation.reservation_datetime.slice(0,10),
            status: reservation.status
        });
        setInitialForm({
            table_id: reservation.table_id,
            customer_id: reservation.customer_id,
            reservation_datetime: reservation.reservation_datetime.slice(0,10),
            status: reservation.status
        });
        if (reservation.status === 'CONFIRMADA') {
          setStatusOptions(['CANCELADA', 'CONFIRMADA'])
        }
        else if (reservation.status === 'PENDENTE') {
          setStatusOptions(['CANCELADA', 'CONFIRMADA', 'PENDENTE'])
        }
        else if (reservation.status === 'CANCELADA') {
          setStatusOptions(['CANCELADA'])
        }
        setAvailable(true);
        setLoading(false);
      });
    }
    fetchData();
  }, [mode, id]);

useEffect(() => {
  if (!form.table_id || tables.length === 0) {
    setCapacity(null);
    return;
  }

  const table = tables.find(
    t => t.id === Number(form.table_id)
  );

  setCapacity(table ? table.capacity : null);
}, [form.table_id, tables]);



    const isFormChanged = () => {
    if (!initialForm) return false;
    return (
      parseInt(form.table_id) !== initialForm.table_id ||
      parseInt(form.customer_id) !== initialForm.customer_id ||
      form.reservation_datetime !== initialForm.reservation_datetime ||
      form.status !== initialForm.status
    );
  };

    // atualizar disponibilidade do table_number
    async function checkAvailability() {
      const newTableId = form.table_id;
      const newDate = form.reservation_datetime;
      clearTimeout(timeoutRef.current);

      if (newTableId === "" || newDate === "") {
        setAvailable(null);
        setChecking(false);
        return;
      }
  
      if (mode === "edit") {
        if (newTableId == initialForm.table_id && newDate == initialForm.reservation_datetime) {
          setAvailable(true);
          setChecking(false);
          return;
        }
      }

      setAvailable(null);
      setChecking(true);

      timeoutRef.current = setTimeout(() => {
        checkReservationAvailability(newTableId, newDate)
          .then((data) => {
            setAvailable(data.available);
            setChecking(false);
            if (data.available == false) {
                setSuggestions({
                    sug_tables: data.suggestions.tables.join(', '),
                    sug_date: data.suggestions.date
                });
                showToast("Indisponível! Escolha uma data ou mesa alternativa.", "error")
            }
          })
          .catch((err) => {
            console.error(err);
            setChecking(null);
          });
      }, 600);
    }


  // atualizar formulário quando há mudanças
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAvailable(null)
    if (mode === 'edit'){
      if (e.target.name === 'table_id' && e.target.value == initialForm.table_id) {
      setAvailable(true)
    }
      else if (e.target.name === 'reservation_datetime' && e.target.value == initialForm.reservation_datetime) {
      setAvailable(true)
    }
      else if (e.target.name === 'status') {
      setAvailable(true)
    }
    }
  }

  // SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    try {
        console.log(form)
      let message;
      if (mode === "add") {
        await createReservation(form);
        message = "Reserva criada!";
      } else {
        await updateReservation(id, form);
        message = "Reserva atualizada!";
      }
      navigate("/reservas", {
        state: { toastMessage: message, toastType: "success", refresh: true },
      });
    } catch (err) {
      console.log(err);
      navigate("/reservas", {
        state: { toastMessage: "Ocorreu um erro!", toastType: "error", refresh: true },
      });
    }
  }

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

  if (loading) return <p>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} className="form">
      <HeaderForm />

      <div className="fields">
          <div className={`input-label`}>
            {" "}
            <label>Número da mesa:</label>
            <select
            className={`${!form.table_id || !available ? 'invalid' : 'valid'}`}
              name="table_id"
              value={form.table_id}
              onChange={handleChange}
              required
            >
            <option value="">Selecione...</option>
            {tables?.map((t) => (
                <option key={t.id} value={t.id} disabled={t.status === 'INATIVA'}>Mesa #{t.table_number} {t.status === 'INATIVA' ? '(desativada)' : ''}</option>
                ))}
            </select>
            <p className="required">*</p>
          </div>

          <div className="input-label">
            
              
          {form.table_id && typeof capacity === 'number' && (
            <div className="property">
              Capacidade: {capacity} {capacity > 1 ? 'pessoas' : 'pessoa'}
            </div>
          )}

          </div>

            <div className="suggestions">
                {form.table_id === "" || form.reservation_datetime === ""
                ? "" : available === null ? "" :
                available ? <p>Disponível</p> :
                                    <div>
                <p>Mesa indisponível</p>
                <p id="suggestions">
                    {available
                    ? ""
                    : suggestions
                    ? `Mesas disponíveis nessa data: ${suggestions.sug_tables}`
                    : "Sem sugestões..."}
                </p>
                </div>
                }
            </div>

            <div className="input-label">
            {" "}
            <label>Cliente:</label>
            <select
            className={`${!form.customer_id ? 'invalid' : 'valid'}`}
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              required
            >
            <option value="">Selecione...</option>
            {customers?.map((c) => (
                <option key={c.id} value={c.id}>(id: {c.id}) {c.name}</option>
                ))}
            </select>
            <p className="required">*</p>
          </div>

            <div className="input-label">
            {" "}
            <label>Data:</label>
            <input className={`${!form.table_id || !available ? 'invalid' : 'valid'}`} type="date" value={form.reservation_datetime} name="reservation_datetime" id="reservation_datetime" onChange={handleChange} required />
            <p className="required">*</p>
          </div>
                      <div className="suggestions">
            {form.table_id === "" || form.reservation_datetime === "" ? (
                ""
            ) : available === null ? ""
            : available ? (
                <p>Disponível</p>
            ) : (
                <div>
                <p>Data indisponível</p>
                <p id="suggestions">
                    {available
                    ? ""
                    : suggestions
                    ? `Mesa #${form.table_id} disponível em: ${formatDate(suggestions.sug_date)}`
                    : "Sem sugestões..."}
                </p>
                </div>
            )}
            </div>

            {mode==='add' ? '' : (
              <div className="input-label">
              <label>Status: </label>
              <select name="status" id="status"
              value={form.status}
              onChange={handleChange}
              required
              >
                {statusOptions?.map((c) => (
                                <option key={c} value={c}> {c}</option>
                                ))}
              </select>
            </div>
            )}
            
      </div>
        

        <button
        className={`button-new solo ${available === null ? 'editButton' : 'createButton' }`}
        onClick={checkAvailability}
        type="button"
        disabled={form.table_id == "" || form.reservation_datetime == ""}
            >Verificar disponbilidade</button>

      <div className="buttons-form">
        <button
          onClick={() => navigate("/reservas")}
          className="button-new cancelButton"
          type="button"
        >
          Cancelar
        </button>

        {mode === "edit" ? (
          <button
            type="submit"
            className="button-new createButton"
            disabled={!available || !isFormChanged()}
          >
            Atualizar
          </button>
        ) : (
          <button
            type="submit"
            className="button-new createButton"
            disabled={!available}
          >
            Salvar
          </button>
        )}

      </div>
  {mode === 'edit' ? (!isFormChanged() ? (<p className='alert-message'>Nenhuma informação foi alterada</p>) : "") : ''}
    </form>
  );
}
