// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDszb3HU4O2zz3mJfU0liqjZQ3h_2Yy3J4",
  authDomain: "lojapw-fb3a6.firebaseapp.com",
  databaseURL: "https://lojapw-fb3a6-default-rtdb.firebaseio.com",
  projectId: "lojapw-fb3a6",
  storageBucket: "lojapw-fb3a6.appspot.com",
  messagingSenderId: "815610211542",
  appId: "1:815610211542:web:f8dd536df181ea1f07ad77"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Referência ao formulário
const cadastro = document.getElementById('form-cadastro');

// Manipulador de evento de envio do formulário
cadastro.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtenção dos valores de email e senha
  const email = cadastro['email'].value;
  const password = cadastro['password'].value;
  var db = firebase.firestore()
  const usuarios = db.collection('usuarios')

  // Checa se o e-mail já é utilizado
  const existe = await usuarios.where("email","==",email).get()
  if (!existe.empty){
    alert("E-mail já utilizado!")
    return
  }

  // Se não for, deixa cadastrar
  usuarios.get().then((querySnapshot) => {
    const numeroUsuarios = querySnapshot.size+1;
    novoUsuario = db.collection('usuarios').doc(numeroUsuarios.toString())
    novoUsuario.set({
      email: email,
      senha: password,
      admin: false,
    })
    alert("Cadastro realizado com sucesso!")
    window.location.href = "cliente.html"
  }).catch((error) => {
    console.error('Erro ao obter documentos:', error);
  });
});
