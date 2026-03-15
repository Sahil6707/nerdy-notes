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
return;
}


/* SUCCESS */



showToast("Login successful","success");

/* STORE TOKEN */

localStorage.setItem("token",data.token);
localStorage.setItem("user",JSON.stringify(data.user));


/* REDIRECT */

setTimeout(()=>{
window.location.href="index.html";
},1000);


}catch(error){

showToast("Server error","error");

}

}


/* CONTINUE WITHOUT LOGIN */

function continueWithoutLogin(){
window.location.href="index.html";
}

