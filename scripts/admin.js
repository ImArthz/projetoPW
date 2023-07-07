// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDszb3HU4O2zz3mJfU0liqjZQ3h_2Yy3J4",
  authDomain: "lojapw-fb3a6.firebaseapp.com",
  projectId: "lojapw-fb3a6",
  storageBucket: "lojapw-fb3a6.appspot.com",
  messagingSenderId: "815610211542",
  appId: "1:815610211542:web:f8dd536df181ea1f07ad77"
}
  
// Inicialização do Firebase
firebase.initializeApp(firebaseConfig)
var db = firebase.firestore()
const usuarios = db.collection('usuarios')
const produtosCollection = db.collection("produtos")
const caixa = document.getElementById("caixa")

// Ao iniciar preciso preencher os usuários e os produtos
document.addEventListener('DOMContentLoaded', async function() {
  var usuariosHTML = document.getElementById("usuarios")
  var produtosHTML = document.getElementById("produtos")

  await atualizarFormularioUsuarios(usuariosHTML)
  await atualizarFormularioProdutos(produtosHTML)

  var formUsuario = document.getElementById("usuarios-form")

  formUsuario.addEventListener('submit', async function(e) {
    e.preventDefault() // Evita o envio padrão do formulário

    // Função para atualizar os administradores
    atualizarAdministradores()

    // Função para excluir os usuários marcados para deleção
    excluirUsuarios(usuariosHTML) // Aguarda a resolução da promessa

  })

  var formEstoque = document.getElementById("produtos-form")

  formEstoque.addEventListener('submit', async function(e) {
    e.preventDefault()
    
    atualizarEstoque(formEstoque,produtosHTML)
  })

  await atualizarFluxoTotal()
})

// FUNÇÃO DE ATUALIZAR E EXCLUIR USUÁRIOS
async function atualizarFormularioUsuarios(usuariosHTML) {
  try {
    var texto = await getTextoUsuarios()
    usuariosHTML.innerHTML = '<form id="usuarios-form">' + texto + '</form>'
  } catch (error) {
    console.log("Erro ao obter os usuários:", error)
  }
}

async function getTextoUsuarios(){
  try {
    const querySnapshot = await usuarios.get()
    var texto = ''
    querySnapshot.forEach((doc) => {
      const usuario = doc.data()
      var isAdmin = usuario.admin ? 'checked' : '' // Verifica se o usuário é administrador
      texto += '<label for=adm_user_' + doc.id + '>' + usuario.email + ' é admin?</label><input type="checkbox" id=adm_user_' + doc.id + ' ' + isAdmin + '></input>'
      texto += '<label for=del_user_' + doc.id + '>Deletar ' + usuario.email + '?</label><input type="checkbox" id=del_user_' + doc.id + '></input>'
    })
    return texto + '<button type="submit" class="submit-usuarios">Atualizar</button>'
  } catch (error) {
    console.log("Erro ao obter os usuários:", error)
    return ''
  }
}

function atualizarAdministradores() {
  // Obtenha os elementos de input de administração
  var checkboxesAdmin = document.querySelectorAll('input[id^="adm_user_"]')

  // Atualize os administradores no banco de dados
  checkboxesAdmin.forEach((checkbox) => {
    var userId = checkbox.id.replace('adm_user_', '')
    var adminStatus = checkbox.checked
    
    // Atualize o status do administrador no banco de dados
    usuarios.doc(userId).update({
      admin: adminStatus
    }).then(() => {
      console.log("Status do administrador atualizado para o usuário com ID: " + userId)
    }).catch((error) => {
      console.log("Erro ao atualizar o status do administrador para o usuário com ID " + userId + ":", error)
    })
  })
}

async function excluirUsuarios(usuariosHTML) {
  try {
    const querySnapshot = await usuarios.get()
    var promessasExclusao = [] // Array para armazenar as promessas de exclusão
    var excluiuAlguem = false // Variável para indicar se algum usuário foi excluído

    querySnapshot.forEach((doc) => {
      const checkboxExcluir = document.getElementById('del_user_' + doc.id)

      if (checkboxExcluir.checked) {
        promessasExclusao.push(usuarios.doc(doc.id).delete()) // Adiciona a promessa de exclusão ao array
        excluiuAlguem = true // Define a flag como true se pelo menos um usuário for excluído
      }
    })

    // Aguarda a resolução de todas as promessas de exclusão
    await Promise.all(promessasExclusao)

    if (excluiuAlguem) {
      await atualizarFormularioUsuarios(usuariosHTML)
    }
  } catch (error) {
    console.log("Erro ao excluir os usuários:", error)
  }
}

// FUNÇÃO DE DESLOGAR
function deslogar(){
  const user = localStorage.getItem('user')
  localStorage.removeItem('user')
  window.location.href = "../loja.html"
}

//  PARTE DE ADICIONAR PRODUTOS
const formProduto = document.getElementById("form-produto")

formProduto.addEventListener("submit", async function(e) {
  e.preventDefault(); // Evita o envio padrão do formulário

  // Obtém os valores dos campos do formulário
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const categoria = document.getElementById("categoria").value;
  const precoCompra = parseFloat(document.getElementById("precoCompra").value);
  const precoVenda = parseFloat(document.getElementById("precoVenda").value);
  const fornecedor = document.getElementById("fornecedor").value;
  const garantia = document.getElementById("garantia").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const fluxo = -quantidade * precoCompra;

  // Cria o objeto de produto
  const produto = {
    nome: nome,
    descricao: descricao,
    categoria: categoria,
    precoCompra: precoCompra,
    precoVenda: precoVenda,
    fornecedor: fornecedor,
    garantia: garantia,
    quantidade: quantidade,
    fluxo: fluxo,
  };

  // Adiciona o produto ao Firestore
  produtosCollection
    .add(produto)
    .then(function(docRef) {
      console.log("Produto criado com ID:", docRef.id);
      // Limpa os campos do formulário após a criação do produto
      formProduto.reset();

      // Após a criação do produto, atualiza o formulário de produtos e o fluxo total
      var produtosHTML = document.getElementById("produtos")
      atualizarFormularioProdutos(produtosHTML)
        .then(() => {
          atualizarFluxoTotal();
        })
        .catch(function(error) {
          console.error("Erro ao atualizar formulário de produtos:", error);
        });
    })
    .catch(function(error) {
      console.error("Erro ao criar produto:", error);
    });
});

// PARTE DE ATUALIZAR O ESTOQUE
async function atualizarFormularioProdutos(produtosHTML) {
  try {
    var texto = await getTextoProdutos()
    produtosHTML.innerHTML = '<form id="produtos-form">' + texto + '</form>'
  } catch (error) {
    console.log("Erro ao obter os usuários:", error)
  }
}

async function getTextoProdutos(){
  try {
    const querySnapshot = await produtosCollection.get()
    var texto = ''
    querySnapshot.forEach((doc) => {
      const produto = doc.data()
      texto += '<label for="estoque_' + doc.id + '">' + produto.nome + ' - Atual: ' + produto.quantidade + ', comprar/vendeu: </label>'
      texto += '<input type="number" id="estoque_' + doc.id + '" value="0" min="' + -produto.quantidade + '" required>'
    })
    return texto + '<button type="submit" class="atualizar-estoque">Atualizar</button>'
  } catch (error) {
    console.log("Erro ao obter os produtos:", error)
    return ''
  }
}

async function atualizarEstoque(formEstoque, produtosHTML) {
  var inputsQuantidade = formEstoque.querySelectorAll("input[type='number']")

  var promises = [] // Array para armazenar as promessas das atualizações de estoque

  inputsQuantidade.forEach((produtoInput) => {
    var produtoId = produtoInput.id.replace('estoque_', '')

    var promise = produtosCollection.doc(produtoId).get().then((doc) => {
      const produto = doc.data()
      const estoque = parseInt(produtoInput.value)
      const novaQuantidade = produto.quantidade + estoque
      var novoFluxo = 0
      if (estoque > 0){
        novoFluxo = produto.fluxo - parseInt(produtoInput.value)*produto.precoCompra //como o value será positivo, acabará descendo o fluxo, pois você está comprando
      }
      else{
        novoFluxo = produto.fluxo - parseInt(produtoInput.value)*produto.precoVenda //como o value será negativo, acabará subindo o fluxo, pois você está vendendo
      }

      return produtosCollection.doc(produtoId).update({
        quantidade: novaQuantidade,
        fluxo: novoFluxo,
      })
    }).then(() => {
      console.log("Estoque do id: " + produtoId + " atualizado")
    }).catch((error) => {
      console.log("Erro ao atualizar o estoque do produto de ID " + produtoId + ":", error)
    })

    promises.push(promise)
  })

  await Promise.all(promises) // Aguarda todas as atualizações de estoque serem concluídas

  await atualizarFormularioProdutos(produtosHTML)
  atualizarFluxoTotal()
}

async function atualizarFluxoTotal(){
  try {
    const querySnapshot = await produtosCollection.get()
    let totalFluxo = 0

    querySnapshot.forEach((doc) => {
      const produto = doc.data()
      const fluxo = produto.fluxo || 0 // Valor padrão de 0 se o fluxo não estiver definido
      totalFluxo += fluxo
    })

    caixa.innerHTML = 'R$' + totalFluxo.toLocaleString()
  } catch (error) {
    console.log("Erro ao obter os produtos:", error)
  }
}