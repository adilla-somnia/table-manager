// api/customers.js
const URL = 'http://localhost:3000/tables';

// real req
export const getTables = () => fetch(URL).then(res => res.json());
export const getTableById = (id) => fetch(`${URL}/${id}`).then(res => res.json());
export const createTable = (body) => {
  fetch(URL, { 
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }});
  };
export const updateTable = (id, body) => {
  fetch(`${URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }});
  };
export const deleteTable = (id) => fetch(`${URL}/${id}`, { method: "DELETE" });
export const checkTableNumber = (number) => {
  return fetch(`http://localhost:3000/check-number?num=${number}`).then(res => res.json())
};
export const suggestTableNumber = () => {
  return fetch(`http://localhost:3000/suggests`).then(res => res.json())
};
// mock req

// ----------------------------
// MOCK DATA
// // ----------------------------

// let mockTables = [
//   { id: 1, table_number: 1, capacity: 5, status: 'ATIVA' },
//   { id: 2, table_number: 13, capacity: 4, status: 'ATIVA' },
//   { id: 3, table_number: 11, capacity: 2, status: 'ATIVA' },
//   { id: 4, table_number: 17, capacity: 7, status: 'INATIVA' },
// ];

// // util para simular atraso
// const delay = (result, time = 300) =>
//   new Promise((resolve) => setTimeout(() => resolve(result), time));

// // ----------------------------
// // MOCK REQUESTS
// // ----------------------------

// // GET ALL
// export const getTables = async () => {
//   return delay([...mockTables]); // retorna cópia do array
// };

// // GET BY ID
// export const getTableById = async (id) => {
//   const table = mockTables.find((c) => c.id === Number(id));
//   if (!table) throw new Error('Mesa não encontrada');
//   return delay({ ...table });
// };

// // POST
// export const createTable = async (body) => {
//   const newTable = {
//     id: Date.now(), // mock id
//     ...body,
//   };
//   mockTables.push(newTable);
//   return delay(newTable);
// };

// // PUT
// export const updateTable = async (id, body) => {
//   const index = mockTables.findIndex((c) => c.id === Number(id));
//   if (index === -1) throw new Error('Mesa não encontrada');

//   mockTables[index] = {
//     ...mockTables[index],
//     ...body,
//   };

//   return delay(mockTables[index]);
// };

// // DELETE
// export const deleteTable = async (id) => {
//   const exists = mockTables.some((c) => c.id === Number(id));
//   if (!exists) throw new Error('Mesa não encontrada');

//   mockTables = mockTables.filter((c) => c.id !== Number(id));

//   return delay({ success: true });
// };
