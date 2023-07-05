// Referências aos elementos da interface do usuário
const productList = document.getElementById('product-list');
const categoryList = document.getElementById('category-list');
const customerList = document.getElementById('customer-list');
const adminList = document.getElementById('admin-list');
const addProductBtn = document.getElementById('add-product-btn');
const addCategoryBtn = document.getElementById('add-category-btn');
const stockList = document.getElementById('stock-list');
const buyStockBtn = document.getElementById('buy-stock-btn');

// Referência ao banco de dados do Firebase Realtime Database
const database = firebase.database();

// Função para exibir os produtos
function displayProducts(products) {
  productList.innerHTML = '';
  for (const productId in products) {
    const product = products[productId];
    const li = document.createElement('li');
    li.innerHTML = `<span>${product.name}</span><button data-id="${productId}" class="delete-product-btn">Excluir</button>`;
    productList.appendChild(li);
  }
}

// Função para exibir as categorias
function displayCategories(categories) {
  categoryList.innerHTML = '';
  for (const categoryId in categories) {
    const category = categories[categoryId];
    const li = document.createElement('li');
    li.innerHTML = `<span>${category.name}</span><button data-id="${categoryId}" class="delete-category-btn">Excluir</button>`;
    categoryList.appendChild(li);
  }
}

// Função para exibir os clientes
function displayCustomers(customers) {
  customerList.innerHTML = '';
  for (const customerId in customers) {
    const customer = customers[customerId];
    const li = document.createElement('li');
    li.innerHTML = `<span>${customer.name}</span>`;
    customerList.appendChild(li);
  }
}

// Função para exibir os administradores
function displayAdmins(admins) {
  adminList.innerHTML = '';
  for (const adminId in admins) {
    const admin = admins[adminId];
    const li = document.createElement('li');
    li.innerHTML = `<span>${admin.name}</span>`;
    adminList.appendChild(li);
  }
}

// Função para exibir o controle de estoque
function displayStock(stock) {
  stockList.innerHTML = '';
  for (const productId in stock) {
    const product = stock[productId];
    const li = document.createElement('li');
    li.innerHTML = `<span>${product.name}</span><span>Quantidade: ${product.quantity}</span>`;
    stockList.appendChild(li);
  }
}

// Manipulador de evento para adicionar produto
addProductBtn.addEventListener('click', () => {
  const productName = prompt('Digite o nome do produto:');
  if (productName) {
    // Adicionar produto ao banco de dados
    const newProductRef = database.ref('products').push();
    newProductRef.set({
      name: productName
    });
  }
});

// Manipulador de evento para excluir produto
productList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-product-btn')) {
    const productId = e.target.dataset.id;
    // Excluir produto do banco de dados
    database.ref('products/' + productId).remove();
  }
});

// Manipulador de evento para adicionar categoria
addCategoryBtn.addEventListener('click', () => {
  const categoryName = prompt('Digite o nome da categoria:');
  if (categoryName) {
    // Adicionar categoria ao banco de dados
    const newCategoryRef = database.ref('categories').push();
    newCategoryRef.set({
      name: categoryName
    });
  }
});

// Manipulador de evento para excluir categoria
categoryList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-category-btn')) {
    const categoryId = e.target.dataset.id;
    // Excluir categoria do banco de dados
    database.ref('categories/' + categoryId).remove();
  }
});

// Manipulador de evento para comprar produtos (controle de estoque)
buyStockBtn.addEventListener('click', () => {
  const productId = prompt('Digite o ID do produto:');
  const quantity = parseInt(prompt('Digite a quantidade a ser comprada:'));
  if (productId && quantity) {
    // Atualizar a quantidade em estoque do produto
    const productRef = database.ref('stock/' + productId);
    productRef.transaction((currentData) => {
      if (currentData) {
        currentData.quantity += quantity;
      } else {
        currentData = { quantity };
      }
      return currentData;
    });
  }
});

// Ouvir as alterações no banco de dados
database.ref('products').on('value', (snapshot) => {
  const products = snapshot.val();
  displayProducts(products);
});

database.ref('categories').on('value', (snapshot) => {
  const categories = snapshot.val();
  displayCategories(categories);
});

database.ref('customers').on('value', (snapshot) => {
  const customers = snapshot.val();
  displayCustomers(customers);
});

database.ref('admins').on('value', (snapshot) => {
  const admins = snapshot.val();
  displayAdmins(admins);
});

database.ref('stock').on('value', (snapshot) => {
  const stock = snapshot.val();
  displayStock(stock);
});
