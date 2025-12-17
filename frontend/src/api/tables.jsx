const URL = 'http://localhost:3000/tables';
export const getTables = () => fetch(URL).then(res => res.json());
export const getTableById = (id) => fetch(`${URL}/${id}`).then(res => res.json());
export const getRestrictTables = () => fetch(`${URL}/restrict`).then(res => res.json());
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