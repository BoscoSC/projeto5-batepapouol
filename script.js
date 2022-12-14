let dados;

//nome do Usuario
const nomeUsuario = prompt('Qual seu nome?');
console.log(nomeUsuario);

const enviaNome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nomeUsuario});
enviaNome.then(recebeMensagem);
enviaNome.catch(tratarErro);

//manter conexão
function manterConexao(){
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: nomeUsuario}).catch(tratarErro);
}
setInterval(manterConexao, 5000);

//recebe mensagens
function recebeMensagem(){
  const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

  promessa.then(processarResposta);
  promessa.catch(tratarErro);
}

function atualiza(){
  const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

  promessa.then(processarResposta);
  promessa.catch(tratarErro);
}
atualiza();
setInterval(atualiza, 3000);

function processarResposta(resposta) {
	console.log(resposta.data);

  dados = resposta.data;

  renderizarMensagem();
}

function tratarErro() {
  window.location.reload();
}

function renderizarMensagem(){
  const conteudo = document.querySelector('.content');
  conteudo.innerHTML = '';

  for(let i = 0; i < dados.length; i++){
    if(dados[i].type === "status"){
      conteudo.innerHTML = conteudo.innerHTML + `
      <div class="msg ${dados[i].type}">
        <p><span>(${dados[i].time}) </span><strong>${dados[i].from}</strong> ${dados[i].text}</p>
      </div>
    `;
    }

    else{
      conteudo.innerHTML = conteudo.innerHTML + `
      <div class="msg ${dados[i].type}">
        <p><span>(${dados[i].time}) </span><strong>${dados[i].from}</strong> para <strong>${dados[i].to}</strong>: ${dados[i].text}</p>
      </div>
    `;
    }
  }
  const todasMensagens = document.querySelectorAll('.msg');
  const ultimaMensagem = todasMensagens[todasMensagens.length-1];
  console.log(ultimaMensagem)
  ultimaMensagem.scrollIntoView();
}

function mandarMensagem(){
  const minhaMensagem = document.getElementById("input").value;
  document.getElementById("input").value = '';

  const  novaMensagem = {
    from: nomeUsuario,
    to: "Todos",
    text: minhaMensagem,
    type: "message"
  }

  const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem); 
  requisicao.then(processarResposta);
  requisicao.catch(tratarErro);
}