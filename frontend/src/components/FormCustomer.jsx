import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from '../api/customers.jsx';
import '../style/form.css';
import '../style/button.css';
import HeaderForm from './HeaderForm.jsx';

export default function FormCustomer({ mode, id }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(mode === 'edit');
  const navigate = useNavigate();
  const [initialForm, setInitialForm] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  // Carrega dados se for modo EDITAR
  useEffect(() => {
    if (mode === 'edit') {
      getCustomerById(id).then((customer) => {
        setForm({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        });
        setInitialForm({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        });
        setLoading(false);
      });
    }
  }, [mode, id]);

  const isFormChanged = () => {
    if (!initialForm) return false;
    return (
      form.name !== initialForm.name ||
      form.phone !== initialForm.phone ||
      form.email !== initialForm.email
    );
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [e.target.name]: e.target.value });

    let setCanSubmitValue = false;

    if (name === "name") {
      setCanSubmitValue = value.length > 0 && isPhoneValid(form.phone) && (form.email.length === 0 || isEmailValid(form.email));
    }
    else if (name === "email") {
      setCanSubmitValue = (value.length === 0 || isEmailValid(value)) && form.name.length > 0 && isPhoneValid(form.phone);
    }

    setCanSubmit(setCanSubmitValue);

    }

 // Função para validar o número de telefone
  function isPhoneValid(phone) {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; // Verifica o formato (xx) xxxxx-xxxx
    return phoneRegex.test(phone);
  }

  // Função para validar o e-mail
  function isEmailValid(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function handlePhone(e) {
    let value = e.target.value;

    value = value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número

    if (value.length > 0) value = `(${value}`;
    if (value.length > 3) value = `${value.slice(0, 3)}) ${value.slice(3)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    value = value.slice(0, 15); // Limita a 15 caracteres (formato máximo)

    e.target.value = value;
    setForm({ ...form, phone: value });

    // Verifica se o telefone está completo e válido

    const isPhoneValidNow = isPhoneValid(value);
    const isNameValidNow = form.name.length > 0;
    const isEmailValidNow = form.email.length === 0 || isEmailValid(form.email);

    // if (form.email.length > 0) {
    //   setCanSubmitValue = isPhoneValid(value) && form.name.length > 0 && isEmailValid(form.email);
    // } else {
    //   setCanSubmitValue = isPhoneValid(value) && form.name.length > 0;
    // }

    setCanSubmit(isPhoneValidNow && isNameValidNow && isEmailValidNow);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let message;
      if (mode === 'add') {
        await createCustomer(form);
        message = 'Cliente adicionado!'
      } else {
        await updateCustomer(id, form);
         message = 'Cliente atualizado!'       
      }
      navigate('/clientes', { state: { toastMessage: message, toastType: 'success'} })
    } catch (err) {
      console.log(err);
      navigate('/clientes', { state: { toastMessage: 'Ocorreu um erro ao salvar!', toastType: 'error' }});
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} className='form'>
      <HeaderForm />
      <div className="fields">
        <div className="input-label">
      <label className='long-label'>Nome:</label>
      <input placeholder='Digite o nome...' className={`long-input ${form.name.length > 0 ? 'valid' : 'invalid'}`} name="name" value={form.name} onChange={handleChange} required /> <p className='required'>*</p>
      </div>
      <div className="input-label">
      <label className='long-label'>Telefone:</label>
      <input placeholder='Digite o telefone...' className={`long-input ${isPhoneValid(form.phone) ? 'valid' : 'invalid'}`} name="phone" value={form.phone} onChange={handlePhone} required /> <p className='required'>*</p>
      </div>
      <div className="input-label">
      <label className='long-label'>E-mail:</label>
      <input placeholder='Digite o e-mail...' className={`long-input ${form.email.length === 0 ? '' : (isEmailValid(form.email) ? 'valid' : 'invalid')}`} name="email" value={form.email} onChange={handleChange} /> <p className='required invisible'>..</p>
      </div>
      </div>
      <div className="buttons-form">
      <button onClick={() => navigate('/clientes')} className='button-new cancelButton' type='button'>Cancelar</button>

      {mode === 'edit' ? (      <button type="submit" disabled={!canSubmit || !isFormChanged()} className='button-new createButton'>
      Atualizar
      </button>) :       <button type="submit" disabled={!canSubmit} className='button-new createButton'>
        Salvar
      </button>}
      </div>
      {mode === 'edit' ? (!isFormChanged() ? (<p className='alert-message'>Nenhuma informação foi alterada</p>) : "") : ''}
    </form>
  );
}
