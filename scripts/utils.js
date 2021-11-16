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
}

document.querySelector('.user-name').addEventListener('focusin', () => {
  if (document.querySelector('.user-name-error').value !=='') {
    document.querySelector('.user-name-error').innerText = '';
    document.querySelector('.user-name').value = '';
  }
})

document.querySelector('textarea').addEventListener('input', () => {
    text = document.querySelector('textarea').value;
    document.querySelector('textarea').value = text.charAt(0).toUpperCase() + text.slice(1);
})

document.querySelector("textarea").addEventListener("keypress", submitOnEnter);

function submitOnEnter(e){
    if(e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        
        let message = e.currentTarget.value;
        sendMessage(message);
        e.currentTarget.value = '';
        e.currentTarget.style.height = txHeight + "px";
    }
}