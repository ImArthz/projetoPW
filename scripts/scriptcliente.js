// Configuração do Firebase
const firebaseConfig = {
  // Coloque aqui a sua configuração do Firebase
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMÍNIO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o app do Firebase
firebase.initializeApp(firebaseConfig);

// Referência à div onde serão exibidos os produtos
const productList = document.getElementById('product-list');

// Função para exibir os produtos na página
function renderProducts(products) {
  productList.innerHTML = '';

  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.innerHTML = `
      <h4>${product.name}</h4>
      <p>Descrição: ${product.description}</p>
      <p>Preço: ${product.price}</p>
    `;
    productList.appendChild(productElement);
  });
}

// Referência à coleção de produtos no Firestore
const productsCollection = firebase.firestore().collection('products');

// Obtém os produtos do Firestore e renderiza na página
productsCollection.get().then((snapshot) => {
  const productsData = [];
  snapshot.forEach((doc) => {
    const product = doc.data();
    productsData.push(product);
  });
  renderProducts(productsData);
}).catch((error) => {
  console.error('Erro ao obter os produtos:', error);
});