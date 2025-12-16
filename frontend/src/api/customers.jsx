// api/customers.js
const URL = 'http://localhost:3000/customers';

// real req
export const getCustomers = () => fetch(URL).then(res => res.json());
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

// mock req

// ----------------------------
// MOCK DATA
// ----------------------------
// let mockClientes = [
//   { id: 1, name: 'Joao', phone: '8195314413', email: 'joao@gmail.com' },
//   {
//     id: 2,
//     name: 'Paulo Neves',
//     phone: '8112395731',
//     email: 'neves1o@gmail.com',
//   },
//   {
//     id: 3,
//     name: 'Adriana Jouk',
//     phone: '8191244126',
//     email: 'adriana20314@gmail.com',
//   },
//   {
//     id: 4,
//     name: 'Jujus Jaja',
//     phone: '1212312455',
//     email: 'jujujaja@turkish.com',
//   }
// ];

// // util para simular atraso
// const delay = (result, time = 300) =>
//   new Promise((resolve) => setTimeout(() => resolve(result), time));

// // ----------------------------
// // MOCK REQUESTS
// // ----------------------------

// // GET ALL
// export const getCustomers = async () => {
//   return delay([...mockClientes]); // retorna cópia do array
// };

// // GET BY ID
// export const getCustomerById = async (id) => {
//   const customer = mockClientes.find((c) => c.id === Number(id));
//   if (!customer) throw new Error('Cliente não encontrado');
//   return delay({ ...customer });
// };

// // POST
// export const createCustomer = async (body) => {
//   const newCustomer = {
//     id: Date.now(), // mock id
//     ...body,
//   };
//   mockClientes.push(newCustomer);
//   return delay(newCustomer);
// };

// // PUT
// export const updateCustomer = async (id, body) => {
//   const index = mockClientes.findIndex((c) => c.id === Number(id));
//   if (index === -1) throw new Error('Cliente não encontrado');

//   mockClientes[index] = {
//     ...mockClientes[index],
//     ...body,
//   };

//   return delay(mockClientes[index]);
// };

// // DELETE
// export const deleteCustomer = async (id) => {
//   const exists = mockClientes.some((c) => c.id === Number(id));
//   if (!exists) throw new Error('Cliente não encontrado');

//   mockClientes = mockClientes.filter((c) => c.id !== Number(id));

//   return delay({ success: true });
// };
