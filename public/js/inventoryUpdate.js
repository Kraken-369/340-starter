const form = document.querySelector('#update-form');
console.log(form);
form.addEventListener('change', () => {
  const updateBtn = document.querySelector('#button-update');

  updateBtn.removeAttribute('disabled');
})