const API_URL = "http://localhost:3000/user/signup"
const form = document.querySelector("form")
const caution = document.getElementById("response-msg")
async function signup(e){
    e.preventDefault()
    const userDetails = {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value
    }
    try{

        const user = await axios.post(API_URL,userDetails)
        
        window.location.href = "../views/login.html"
    }catch(err)
    {
         
        caution.innerHTML = `<h2 style = "color:brown">${err.response.data.message}</h2>`
        
    }
     
     
 }