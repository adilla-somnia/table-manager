const URL = 'http://localhost:3000/customers';
export const getCustomers = () => fetch(URL).then(res => res.json());
export const getRestrictCustomers = () => fetch(`${URL}/restrict`).then(res => res.json());
export const getCustomerById = (id) => fetch(`${URL}/${id}`).then(res => res.json());
export const createCustomer = (body) => {
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }});
  };
export const updateCustomer = (id, body) => {
  fetch(`${URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }});
  };
export const deleteCustomer = (id) => fetch(`${URL}/${id}`, { method: "DELETE" });