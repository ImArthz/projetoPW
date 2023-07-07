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
  productList.innerHTML = `
  <li class="product-item">
  <div class="titulo">Produto</div>
  <div class="titulo">Categoria</div>
  <div class="titulo">Preço</div>
  <div class="titulo">Garantia</div>
  <span></span></li>`

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
          <div class="product-description">${product.descricao}</div>
          <div class="product-supplier">${product.fornecedor}</div>
        </div>
        <div class="product-category">${product.categoria}</div>
        <div class="product-price">R$ ${product.precoVenda.toFixed(2)}</div>
        <div class="product-info">
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
    product.productId = productId;
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
      <button class="remove-from-cart-btn" onClick="removeFromCart('${item.productId.trim()}')">Remover</button>
    `
    li.classList.add('cart-item');
    cartItems.appendChild(li);
  }

  updateCartTotal();
}

// Função para remover um item do carrinho
function removeFromCart(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) {
      cart.splice(i, 1)
      break
    }
  }
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
checkoutBtn.addEventListener('click', async () => {
  console.log('Compra finalizada:', cart);

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const produtoId = item.productId;

    try {
      const doc = await produtosRef.doc(produtoId).get();
      const produto = doc.data();
      const novaQuantidade = produto.quantidade - 1;
      const novoFluxo = produto.fluxo + produto.precoVenda;

      await produtosRef.doc(produtoId).update({
        quantidade: novaQuantidade,
        fluxo: novoFluxo,
      });

      console.log("Estoque do id: " + produtoId + " atualizado");
    } catch (error) {
      console.log("Erro ao atualizar o estoque do produto de ID " + produtoId + ":", error);
    }
  }

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
