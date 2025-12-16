let items = [
  { id: 1, name: 'Item 1', description: 'Descrição do item 1' },
  { id: 2, name: 'Item 2', description: 'Descrição do item 2' },
];

export function getItems() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...items]), 300);
  });
}

export function getItemById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = items.find((i) => i.id === Number(id));
      if (!found) reject('Item não encontrado');
      else resolve(found);
    }, 300);
  });
}

export function createItem(data) {
  return new Promise((resolve) => {
    const newItem = { id: Date.now(), ...data };
    items.push(newItem);
    resolve(newItem);
  });
}

export function updateItem(id, data) {
  return new Promise((resolve, reject) => {
    const index = items.findIndex((i) => i.id === Number(id));
    if (index === -1) reject('Item não encontrado');
    items[index] = { ...items[index], ...data };
    resolve(items[index]);
  });
}
