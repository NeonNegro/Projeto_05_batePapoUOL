let idMessage;
const user = "ak47";
let to = 'Todos';
let type = 'message';
const promisse = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants ', {name: user});
promisse.then(() =>{console.log("ok!")});
promisse.catch(() =>{console.log("Deu Ruim :(")});

idMessage = setInterval(getMessages, 3000);

setInterval( () => 
{
  axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: user})
  .then(response =>{console.log(response)
  })
  .catch(error =>{console.log(error.response)
  });
}, 5000);


const txHeight = 30;
const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  if (tx[i].value == '') {
    tx[i].setAttribute("style", "height:" + txHeight + "px;overflow-y:hidden;");
  } else {
    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  }
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput(e) {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
  if (this.value =='')
    this.style.height = txHeight + "px";
}

document.querySelector('textarea').addEventListener('input', () => {
    text = document.querySelector('textarea').value;
    document.querySelector('textarea').value = text.charAt(0).toUpperCase() + text.slice(1);
})

document.querySelector("textarea").addEventListener("keypress", submitOnEnter);

function submitOnEnter(e){
    if(e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        
        let message = e.currentTarget.value;
        console.log(message);
        sendMessage(message);
        e.currentTarget.value = '';
    }

    if(e.which === 13 && e.shiftKey)
      clearInterval(idMessage);
    
}
function prepareMessage(){
  let message = document.querySelector("textarea").value;
  document.querySelector("textarea").value = '';
  sendMessage(message);
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
function getMessages(){
  
  axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
  .then(response => {
    let chat = document.querySelector("main ul");
    chat.innerHTML = '';

    response.data.forEach(msg => {
      let li;
      if(msg.type === 'message'){
        li = ` <li data-identifier="message"><p><span class='time'>&nbsp; (${msg.time}) &nbsp;</span><strong>${msg.from}</strong>&nbsp; para &nbsp;<strong>${msg.to}</strong>: &nbsp; 
        ${msg.text} </p></li>`;
        chat.innerHTML += li;
        chat.querySelector('li:last-of-Type').classList.add("message");
      }
      if(msg.type === 'status'){
        li = ` <li data-identifier="message"><p> <span class='time'>&nbsp; (${msg.time}) &nbsp;</span><strong>${msg.from}</strong>&nbsp; ${msg.text}</p></li>`;
        chat.innerHTML += li;
        chat.querySelector('li:last-of-Type').classList.add("status");
      }
      if(msg.type === 'private_message' && msg.to === user){
        li = ` <li data-identifier="message"><p> <span class='time'>&nbsp; (${msg.time}) &nbsp;</span><strong>${msg.from}</strong> &nbsp; reservadamente para <strong> &nbsp;${msg.to}</strong>: 
        &nbsp; ${msg.text}</p></li>`;
        chat.innerHTML += li;
        chat.querySelector('li:last-of-Type').classList.add("private_message");
      }

      chat.querySelector('li:last-of-Type').scrollIntoView();

    });
    
    console.log(response)
  })
  .catch(error =>{console.log(error.response)
  });
}


