function deslogar(){
  const user = localStorage.getItem('user');
  localStorage.removeItem('user');
  window.location.href = "../loja.html"
}

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

const perfilForm = document.getElementById('perfil-form');

perfilForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = localStorage.getItem('user');
  const dadosUsuario = JSON.parse(user);

  // Obtenção dos valores de email e senha
  const email = perfilForm['email'].value;
  const password = perfilForm['password'].value;
  var db = firebase.firestore()
  const usuarios = db.collection('usuarios')

  const existe = await usuarios.where("email","==",email).get()
  if (!existe.empty && email != dadosUsuario.email){
    alert("E-mail já utilizado!")
    return
  }

  try{
    atualizar = db.collection('usuarios').doc(dadosUsuario.id)
    atualizar.set({
      email: email,
      senha: password,
      admin: dadosUsuario.admin,
    })
    alert("Perfil atualizado com sucesso!")
  }
  catch{
    alert("Erro ao atualizar o perfil")
  }
})