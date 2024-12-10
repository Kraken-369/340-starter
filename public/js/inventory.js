'use strict'

// Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector('#classification-list')

classificationList.addEventListener('change', async () => {
  let classification_id = classificationList.value;
  let classIdURL = `/inv/getInventory/${classification_id}`;

  try {
    const response = await fetch(classIdURL);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();

    buildInventoryList(data);
  } catch(error) { console.error('There was a problem: ', error.message); }
})

const buildInventoryList = data => {
  let inventoryDisplay = document.getElementById('inventoryDisplay');
  let dataTable = '';

  if (!data.length) {
    dataTable = `
      <thead>
        <tr><th>No vehicles to show.</th></tr>
      </thead>
    `;
  } else {
    // Set up the table labels 
    dataTable = '<thead>';
  
    dataTable += '<tr><th><h3>Vehicle Name</h3></th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    // Set up the table body 
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(element => {
      dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
      dataTable += `<td width="60px"><a href="/inv/edit/${element.inv_id}" title="Click to update">Modify</a></td>`;
      dataTable += `<td width="60px"><a class="button-delete" href="/inv/delete/${element.inv_id}" title="Click to delete">Delete</a></td></tr>`;
    });
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view 
  }
  inventoryDisplay.innerHTML = dataTable;
}