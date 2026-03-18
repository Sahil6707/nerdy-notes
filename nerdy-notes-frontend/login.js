const loginBtn = document.getElementById("loginBtn");

/* AUTO LOGIN CHECK */
const token = localStorage.getItem("token");

if(token){
window.location.href = "index.html";
}


/* ENTER KEY LOGIN */

document.addEventListener("keypress",function(e){

if(e.key === "Enter"){
loginUser();
}

});


/* TOAST FUNCTION */

function showToast(message,type="success"){

const toastContainer = document.getElementById("toast");

const toast = document.createElement("div");
toast.classList.add("toast-message");

if(type === "success"){
toast.classList.add("toast-success");
}else{
toast.classList.add("toast-error");
}

toast.innerText = message;

toastContainer.appendChild(toast);

setTimeout(()=>{
toast.remove();
},3000);

}


/* LOGIN FUNCTION */

async function loginUser(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();


/* EMPTY CHECK */

if(!email || !password){
showToast("Please enter email and password","error");
return;
}

loginBtn.disabled = true;
loginBtn.innerText = "Logging in...";


try{

const response = await fetch("https://nerdy-notes-backend.onrender.com/api/auth/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
});

const data = await response.json();


/* WRONG PASSWORD */

if(!response.ok){
showToast(data.message || "Invalid login","error");

loginBtn.disabled = false;
loginBtn.innerText = "Login";

return;
}


/* SUCCESS */



showToast("Login successful","success");
loginBtn.innerText = "Success...";

/* STORE TOKEN */

localStorage.setItem("token",data.token);
localStorage.setItem("user",JSON.stringify(data.user));



// CHECK if user had clicked download before login
const pending = localStorage.getItem("pendingDownload");

if (pending) {
  window.open(
    `https://nerdy-notes-backend.onrender.com/api/notes/download/${pending}`,
    "_blank"
  );

  localStorage.removeItem("pendingDownload");
}


/* REDIRECT */

setTimeout(() => {
  window.location.href = "index.html";
}, 1500);

}catch(error){

showToast("Server error","error");

loginBtn.disabled = false;
loginBtn.innerText = "Login";

}

}


/* CONTINUE WITHOUT LOGIN */

function continueWithoutLogin(){
window.location.href="index.html";
}

