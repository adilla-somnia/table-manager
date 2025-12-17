import { createContext, useContext, useState, useCallback } from 'react';
import '../style/toast.css';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = crypto.randomUUID();
    const newToast = {id, message, type};

    setToasts((prev) => [...prev, newToast]);

  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, duration);
}, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// Componente visual
function ToastList({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
  </div>
  );

}
