// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDszb3HU4O2zz3mJfU0liqjZQ3h_2Yy3J4",
  authDomain: "lojapw-fb3a6.firebaseapp.com",
  projectId: "lojapw-fb3a6",
  storageBucket: "lojapw-fb3a6.appspot.com",
  messagingSenderId: "815610211542",
  appId: "1:815610211542:web:f8dd536df181ea1f07ad77"
};
  
// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao formulário
const loginForm = document.getElementById('login-form');
  
// Manipulador de evento de envio do formulário
async function logar(){
  // Obtenção dos valores de email e senha
  const email = loginForm['email'].value;
  const password = loginForm['password'].value;
  var db = firebase.firestore()
  const usuarios = db.collection('usuarios')

  const logado = await usuarios.where("email","==",email).get()
  if(logado.empty){
    alert("Usuário ou Senha incorretos")
    return
  }
  logado.forEach(documento => {
    dados = documento.data()
  });
  if (dados.senha == password){
    alert("Logado com sucesso!")
    localStorage.setItem('user', JSON.stringify(dados));
    window.location.href = "cliente.html"
  }
  else{
    alert("Usuário ou Senha incorretos")
  }
}

    // // Recuperar dados do usuário do Local Storage
    // const userData = JSON.parse(localStorage.getItem('user'));

    // // Remover dados do usuário do Local Storage
    // localStorage.removeItem('user');