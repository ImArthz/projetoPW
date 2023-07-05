document.addEventListener('DOMContentLoaded', function() {
  // Verificar se há um "user" no localStorage
  const user = localStorage.getItem('user');
  const navElement = document.querySelector('nav');

  const dadosUsuario = JSON.parse(user);

  // Se existir é porque está logado e preciso mudar o nav
  if (user) {
    texto = ''
    if (dadosUsuario.admin){
      texto += "<a href='pages/admin.html'>Administração</a>"
    }
    texto += "<a href='pages/perfil.html'>Perfil</a>"
    texto += "<button type='button' onclick='deslogar()'>Deslogar</button>"
    navElement.innerHTML = texto
  }
});

function deslogar(){
  const user = localStorage.getItem('user');
  localStorage.removeItem('user');
  window.location.href = "loja.html"
}

// Referência aos elementos da interface do usuário
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');

// Carrinho de compras
let cart = [];

// Função para exibir os produtos
function displayProducts(products) {
  productList.innerHTML = '';
  for (const productId in products) {
    const product = products[productId];
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${product.name}</span>
      <span>R$ ${product.price.toFixed(2)}</span>
      <button data-id="${productId}" class="add-to-cart-btn">Adicionar ao Carrinho</button>
    `;
    productList.appendChild(li);
  }
}

// Função para adicionar um produto ao carrinho
function addToCart(productId) {
  const product = products[productId];
  cart.push(product);
  displayCartItems();
}

// Função para exibir os itens do carrinho
function displayCartItems() {
  cartItems.innerHTML = '';
  for (const item of cart) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}</span>
      <span>R$ ${item.price.toFixed(2)}</span>
      <button data-id="${item.id}" class="remove-from-cart-btn">Remover</button>
    `;
    cartItems.appendChild(li);
  }
}

// Função para remover um item do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  displayCartItems();
}

// Manipulador de evento para adicionar ao carrinho
productList.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart-btn')) {
    const productId = e.target.dataset.id;
    addToCart(productId);
  }
});

// Manipulador de evento para remover do carrinho
cartItems.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-from-cart-btn')) {
    const productId = e.target.dataset.id;
    removeFromCart(productId);
  }
});

// Manipulador de evento para finalizar a compra
checkoutBtn.addEventListener('click', () => {
  // Lógica para finalizar a compra
  console.log('Compra finalizada:', cart);
  // Limpar o carrinho após finalizar a compra
  cart = [];
  displayCartItems();
});

// Dados de exemplo (produtos)
const products = {
  product1: {
    id: 'product1',
    name: 'Produto 1',
    price: 10.99
  },
  product2: {
    id: 'product2',
    name: 'Produto 2',
    price: 19.99
  },
  product3: {
    id: 'product3',
    name: 'Produto 3',
    price: 7.50
  }
};

// Exibir os produtos na página
displayProducts(products);
