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