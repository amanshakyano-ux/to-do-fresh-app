 const API_URL = "http://localhost:3000/user/login"
 
 console.log("login here")
 const caution = document.getElementById("response-msg")
 const form = document.querySelector("form")

 async function handleForm(e){
    
    e.preventDefault()
    console.log("hii")
    const loginDetails = {
        email:e.target.email.value,
        password:e.target.password.value
    }
    try{
        console.log(loginDetails)
        const user = await axios.post(API_URL,loginDetails)
        localStorage.setItem("token", user.data.token)
        
        alert("Welcome")
        window.location.href = "../views/expense.html"

    }
    catch(err){
       caution.innerHTML = `<h2 style = "color:red"> ${err.response.data.message}</h2>`
    }

 }

 const reset_pass_btn = document.getElementById("reset-pass");

if (reset_pass_btn) {
    reset_pass_btn.addEventListener("click", () => resetPass());
}

 async function resetPass(){
     window.location.href = "../views/resetPassForm.html";
 }

const responseMsg = document.getElementById("response-msg")

 

 async function resetForm(e){
    e.preventDefault()
    try{
        const email = e.target.email.value;
        const res = await axios.post("http://localhost:3000/password/forgotpassword",{email})
        
        
        responseMsg.textContent = `${res.data.message}`
        responseMsg.style = "color:green"
        
    }catch(err)
    {
         responseMsg.textContent = `${err.response.data.message}`
          responseMsg.style = "color:red"

        console.log("RESET PASS ERROR ___" , err.response.data.message)
    }
        
    
 }