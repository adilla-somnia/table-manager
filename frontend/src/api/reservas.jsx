const URL = 'http://localhost:3000/reservations';
export const getReservations = () => fetch(URL).then(res => res.json());
export const getReservationById = (id) => fetch(`${URL}/${id}`).then(res => res.json());
export const createReservation = (body) => {
  fetch(URL, { 
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }});
  };
export const updateReservation = (id, body) => {
  fetch(`${URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }});
  };
export const checkReservationAvailability = (table_id, date) => (fetch(`http://localhost:3000/reservation-check/${table_id}?date=${date}`).then(res => res.json()));
export const deleteReservation = (id) => fetch(`${URL}/${id}`, { method: "DELETE" });