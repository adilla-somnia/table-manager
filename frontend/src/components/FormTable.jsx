import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTable,
  getTableById,
  updateTable,
  checkTableNumber,
  suggestTableNumber,
} from "../api/tables.jsx";
import "../style/form.css";
import "../style/button.css";
import HeaderForm from "./HeaderForm.jsx";

export default function FormTable({ mode, id }) {
  const [form, setForm] = useState({
    table_number: "",
    capacity: "",
    status: "",
  });
  const [loading, setLoading] = useState(mode === "edit");
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [initialForm, setInitialForm] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  // Carrega dados se for modo EDITAR
  useEffect(() => {
    if (mode === "edit") {
      getTableById(id).then((table) => {
        setForm({
          table_number: table.table_number,
          capacity: table.capacity,
          status: table.status,
        });
        setInitialForm({
          table_number: table.table_number,
          capacity: table.capacity,
          status: table.status,
        });
        setAvailable(true);
        setLoading(false);
      });
    }
  }, [mode, id]);

  // ver se informações estão diferentes (só funciona para o botão do modo editar)
  const isFormChanged = () => {
    if (!initialForm) return false;
    return (
      parseInt(form.table_number) !== initialForm.table_number ||
      parseInt(form.capacity) !== initialForm.capacity ||
      form.status !== initialForm.status
    );
  };

  // atualizar disponibilidade do table_number
  function handleChangeTableNumber(e) {
    const newTableNumber = e.target.value;

    setForm((prev) => ({
      ...prev,
      table_number: newTableNumber,
    }));

    clearTimeout(timeoutRef.current);

    if (newTableNumber === "") {
      setAvailable(null);
      setChecking(false);
      return;
    }

    if (mode === "edit") {
      if (newTableNumber == initialForm.table_number) {
        setAvailable(true);
        setChecking(false);
        return;
      }
    }

    setAvailable(null);
    setChecking(true);

    timeoutRef.current = setTimeout(() => {
      checkTableNumber(newTableNumber)
        .then((data) => {
          setAvailable(data.available);
          setChecking(false);
          if (data.available == false) {
            suggestNumbers();
          }
        })
        .catch((err) => {
          console.error(err);
          setChecking(null);
        });
    }, 600);
  }

  //função para sugerir números disponíveis
  async function suggestNumbers() {
    const data = await suggestTableNumber();
    setSuggestions(data);
    return;
  }

  // atualizar formulário quando há mudanças
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let message;
      if (mode === "add") {
        await createTable(form);
        message = "Mesa adicionada!";
      } else {
        await updateTable(id, form);
        message = "Mesa atualizada!";
      }

      navigate("/mesas", {
        state: { toastMessage: message, toastType: "success", refresh: true },
      });
    } catch (err) {
      console.log(err);
      navigate("/mesas", {
        state: { toastMessage: "Ocorreu um erro!", toastType: "error", refresh: true },
      });
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} className="form">
      <HeaderForm />

      <div className="fields">
        <div className="input-label">
          <label>Número da mesa:</label>
          <input
            placeholder="..."
            className={`num-input ${available ? "" : "unavailable"}`}
            type="number"
            step="1"
            min="1"
            max="9999"
            name="table_number"
            id="table_number"
            value={form.table_number}
            onChange={handleChangeTableNumber}
            required
          />
          <p className="required">*</p>
        </div>

        <div className="suggestions">
          {form.table_number === "" ? (
            ""
          ) : checking ? (
            "Verificando..."
          ) : available ? (
            <p>Disponível</p>
          ) : (
            <div>
              <p>Indisponível</p>
              <p id="suggestions">
                {available
                  ? ""
                  : suggestions
                    ? `Números disponíveis: ${suggestions}`
                    : "Sem sugestões..."}
              </p>
            </div>
          )}
        </div>

        <div className="input-label">
          <label>Capacidade:</label>
          <input
            placeholder="..."
            className="num-input"
            name="capacity"
            type="number"
            step="1"
            min="1"
            value={form.capacity}
            onChange={handleChange}
            required
          />{" "}
          <p className="required">*</p>
        </div>

        {mode === "edit" ? (
          <div className="input-label">
            {" "}
            <label>Status:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="ATIVA">ATIVA</option>
              <option value="INATIVA">INATIVA</option>
            </select>
            <p className="required">*</p>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="buttons-form">
        <button
          onClick={() => navigate("/mesas")}
          className="button-new cancelButton"
          type="button"
        >
          Cancelar
        </button>

        {mode === "edit" ? (
          <button
            type="submit"
            disabled={!available || !isFormChanged()}
            className="button-new createButton"
          >
            Atualizar
          </button>
        ) : (
          <button
            type="submit"
            disabled={!available}
            className="button-new createButton"
          >
            Salvar
          </button>
        )}
      </div>
      {mode === "edit" ? (
        !isFormChanged() ? (
          <p className="alert-message">Nenhuma informação foi alterada</p>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </form>
  );
}
