let idMessage;
let user;
let to = 'Todos';
let type = 'message';
let promisse;

idMessage = setInterval(getMessages, 3000);

function login(){
  user = document.querySelector(".user-name").value;
  axios.post('https://mock-api.driven.com.br/api/v4/uol/participants ', {name: user})
  .then(() => {


    document.querySelector(".user-name").classList.add('hidden');
    document.querySelector(".login button").classList.add('hidden');
    document.querySelector(".container img").classList.remove('hidden');
    document.querySelector(".loading").classList.remove('hidden');

    setTimeout(() =>{
      let hiddenList = document.querySelectorAll(".hidden");
      hiddenList.forEach( (hidden) => {
        hidden.classList.remove("hidden");
      document.querySelector(".login").classList.add('hidden');
    });

    }, 1300)

    setInterval( () => 
    {
      axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: user})
      .then(response =>{
      })
      .catch(error =>{
      });
    }, 5000);

  })
  .catch(() => {
    document.querySelector(".user-name-error").innerText = `nome ${user} já utilizado`;
  });
}



setInterval( function getOnlines(){

  axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
  .then( response => {

      if(to !== 'todos' && response.data.map(function(e) { return e.name; }).indexOf(to) === -1){
        to = 'Todos';
        type = 'message';
        changeToWhom();
        document.querySelector(".privacy-list .selected").classList.remove("selected");
        document.querySelector(".publi-option img").classList.add("selected");
      }

      let list = document.querySelector('.user-list');
      let liList;
      if(to ==="Todos"){
        liList = `<li class="global-msg" data-identifier="participant" onclick= selectFriend(this) ><ion-icon name="people"></ion-icon> Todos 
        <img class="selected" src="imgs/ve.png" alt=""> </li>`;
      } else {
        liList = `<li class="global-msg" data-identifier="participant" onclick= selectFriend(this) ><ion-icon name="people"></ion-icon> Todos 
        <img src="imgs/ve.png" alt=""> </li>`;
      }
      response.data.forEach(friend =>{
        if(friend.name === 'Todos')
          friend.name = 'todos';
        if(friend.name !== to && friend.name !== user){
          liList += `<li  data-identifier="participant"onclick= selectFriend(this) ><ion-icon name="person-circle"></ion-icon><p> ${friend.name}</p>
          <img src="imgs/ve.png" alt=""></li>`;
        }
        if (friend.name === to){
          liList += `<li  data-identifier="participant" onclick= selectFriend(this) ><ion-icon name="person-circle"></ion-icon> 
          <p>${friend.name}</p><img class="selected" src="imgs/ve.png" alt=""></li>`;
        }
      })

      list.innerHTML = liList;
  })
  .catch( error => { 
  });
  
  // Essa função 'getOnlines' que retorna ela mesma foi uma forma que encontrei online de passar uma função
  //para o setInterval uma função ao mesmo tempo em que ela é chamada pela primeira vez sem esperar o Delay. Eu sei que é feio, mas eu gostei
  return getOnlines;
}(), 10000);

function getMessages(){
  
  axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
  .then(response => {
    let chat = document.querySelector("main ul");
    chat.innerHTML = '';

    response.data.forEach(msg => {
      let li;
      if(msg.type === 'message'){
        li = ` <li data-identifier="message"><p><span class='time'>(${msg.time}) &nbsp;</span><strong>${msg.from}</strong>&nbsp;para&nbsp;<strong>${msg.to}</strong>: 
        ${msg.text} </p></li>`;
        chat.innerHTML += li;
        chat.querySelector('li:last-of-Type').classList.add("message");
      }
      if(msg.type === 'status'){
        li = ` <li data-identifier="message"><p> <span class='time'>(${msg.time}) &nbsp;</span><strong>${msg.from}</strong>&nbsp; ${msg.text}</p></li>`;
        chat.innerHTML += li;
        chat.querySelector('li:last-of-Type').classList.add("status");
      }
      if(msg.type === 'private_message' && (msg.to === user || msg.from === user)){
        li = ` <li data-identifier="message"><p> <span class='time'>(${msg.time}) &nbsp;</span><strong>${msg.from}</strong> &nbsp; reservadamente para <strong> &nbsp;${msg.to}</strong>: 
        &nbsp; ${msg.text}</p></li>`;
        chat.innerHTML += li;
        chat.querySelector('li:last-of-Type').classList.add("private_message");
      }

      chat.querySelector('li:last-of-Type').scrollIntoView();

    });
    
  })
  .catch(error =>{
  });
}


function prepareMessage(){
  let message = document.querySelector("textarea").value;
  if(message !== ""){
    document.querySelector("textarea").value = '';
    document.querySelector("textarea").style.height = txHeight + "px";

    sendMessage(message);
  }
}
function sendMessage(message){
  const promisse = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
  {
    from : user,
    to,
    text: message,
    type
  })
  .then((response) =>{getMessages()
  })
  .catch(error =>{window.location.reload()
  });
}

function openLateral(){
  document.querySelector(".grayBack").classList.add("show");
  document.querySelector("aside").classList.add("open");
}
function closeLateral(){
  document.querySelector(".grayBack").classList.remove("show");
  document.querySelector("aside").classList.remove("open");
}

function selectFriend(element){
  document.querySelector(".user-list .selected").classList.remove("selected");
  element.querySelector("img").classList.add("selected");
  to = element.innerText;
  if (to === 'Todos' && type === 'private_message'){
    document.querySelector(".privacy-list .selected").classList.remove("selected");
    document.querySelector(".publi-option img").classList.add("selected");
    type ="message";
  }
  changeToWhom();
}
function selectPrivacy(element){
  if(element.innerText === 'Reservadamente' && to === 'Todos'){
    document.querySelector(".global-msg").classList.add("alert");
    setTimeout(() =>{document.querySelector(".global-msg").classList.remove("alert")}, 800);
  } else {
    document.querySelector(".privacy-list .selected").classList.remove("selected");
    element.querySelector("img").classList.add("selected");
    type = (element.innerText === 'Público') ? "message" : "private_message";
    changeToWhom();
  }
}

function changeToWhom(){
  let message;
  if(type == 'message')
    message = `Enviando para ${to}`;
  else
    message = `Enviando para ${to} (reservadamente)`;

  document.querySelector('.to-whom').innerText = message;
}


