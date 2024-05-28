import { collection, db, addDoc } from './db.js';

const form = document.querySelector('form');
const name = document.querySelector('#name');
const cost = document.querySelector('#cost');
const error = document.querySelector('#error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (name.value && cost.value) {
    const item = { 
      name: name.value, 
      cost: parseInt(cost.value) 
    };

    await addDoc(collection(db, 'expenses'), item);

    error.textContent = '';
    name.value = '';
    cost.value = '';

  } else {
    error.textContent = 'Please enter values before submitting';
  }
});
