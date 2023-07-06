// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyDszb3HU4O2zz3mJfU0liqjZQ3h_2Yy3J4",
  authDomain: "lojapw-fb3a6.firebaseapp.com",
  projectId: "lojapw-fb3a6",
  storageBucket: "lojapw-fb3a6.appspot.com",
  messagingSenderId: "815610211542",
  appId: "1:815610211542:web:f8dd536df181ea1f07ad77"
};

firebase.initializeApp(firebaseConfig);

// Reference to the produtos collection in your Firebase database
const produtosRef = firebase.firestore().collection('produtos');

// Retrieve produtos from Firebase and update the produtos object
let allProdutos = {};
produtosRef.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    allProdutos[doc.id] = doc.data();
  });
  displayProducts(allProdutos);
});

document.addEventListener('DOMContentLoaded', function() {
  // Verificar se há um "user" no localStorage
  const user = localStorage.getItem('user');
  const navElement = document.querySelector('nav');

  const dadosUsuario = JSON.parse(user);

  // Se existir é porque está logado e preciso mudar o nav
  if (user) {
    texto = '';
    if (dadosUsuario.admin){
     texto += "<a href='pages/admin.html'>Administração</a>";
    }
    texto += "<a href='pages/perfil.html'>Perfil</a>";
    texto += "<button type='button' onclick='deslogar()'>Deslogar</button>";
    navElement.innerHTML = texto;
  }
});

function deslogar(){
  const user = localStorage.getItem('user');
  localStorage.removeItem('user');
  location.reload(true);
}

// Referência aos elementos da interface do usuário
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const filterNameInput = document.getElementById('filter-name');
const filterCategoryInput = document.getElementById('filter-category');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const cartTotal = document.getElementById('cart-total');

// Carrinho de compras
let cart = [];

// Função para exibir os produtos
function displayProducts(produtos) {
  productList.innerHTML = '';

  // Obter valores dos campos de filtro
  const filterName = filterNameInput.value.toLowerCase();
  const filterCategory = filterCategoryInput.value.toLowerCase();

  for (const productId in produtos) {
    const product = produtos[productId];

    // Aplicar filtros
    const productName = product.nome.toLowerCase();
    const productCategory = product.categoria.toLowerCase();
    if (
      productName.includes(filterName) &&
      productCategory.includes(filterCategory)
    ) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="product-info">
          <div class="product-name">${product.nome}</div>
          <div class="product-category">${product.categoria}</div>
          <div class="product-description">${product.descricao}</div>
          <div class="product-price">R$ ${product.precoVenda.toFixed(2)}</div>
          <div class="product-supplier">${product.fornecedor}</div>
          <div class="product-warranty">${product.garantia}</div>
        </div>
        <button data-id="${productId}" class="add-to-cart-btn">Adicionar ao Carrinho</button>
      `;
      li.classList.add('product-item');
      productList.appendChild(li);
    }
  }

  // Update the addToCart function to use the produtos parameter
  function addToCart(productId) {
    const product = produtos[productId];
    cart.push(product);
    displayCartItems();
    updateCartTotal();
  }

  // Add event listener to add-to-cart buttons
  productList.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.dataset.id;
      addToCart(productId);
    });
  });
}

// Função para exibir os itens do carrinho
function displayCartItems() {
  cartItems.innerHTML = '';
  for (const item of cart) {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="cart-item">
        <div class="cart-product-name">${item.nome}</div>
        <div class="cart-product-price">R$ ${item.precoVenda.toFixed(2)}</div>
      </div>
      <button data-id="${item.id}" class="remove-from-cart-btn">Remover</button>
    `;
    li.classList.add('cart-item');
    cartItems.appendChild(li);
  }
}

// Função para remover um item do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  displayCartItems();
  updateCartTotal();
}

// Manipulador de evento para remover do carrinho
cartItems.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-from-cart-btn')) {
    const productId = e.target.dataset.id;
    removeFromCart(productId);
  }
});

// Função para atualizar o total do carrinho
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.precoVenda, 0);
  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Manipulador de evento para finalizar a compra
checkoutBtn.addEventListener('click', () => {
  // Lógica para finalizar a compra
  console.log('Compra finalizada:', cart);
  // Limpar o carrinho após finalizar a compra
  cart = [];
  displayCartItems();
  updateCartTotal();
});

// Manipulador de evento para aplicar os filtros
applyFiltersBtn.addEventListener('click', () => {
  const filterName = filterNameInput.value.toLowerCase();
  const filterCategory = filterCategoryInput.value.toLowerCase();

  const filteredProdutos = {};
  for (const productId in allProdutos) {
    const product = allProdutos[productId];
    if (product.nome.toLowerCase().includes(filterName) && product.categoria.toLowerCase().includes(filterCategory)) {
      filteredProdutos[productId] = product;
    }
  }

  displayProducts(filteredProdutos);
});
