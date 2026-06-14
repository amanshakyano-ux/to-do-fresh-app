const API_URL = "/user/login"

const caution = document.getElementById("response-msg")
const form = document.querySelector("form")

async function handleForm(e){
    e.preventDefault()
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
    }

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }

    try{
        const user = await axios.post(API_URL, loginDetails)
        localStorage.setItem("token", user.data.token)
        alert("Welcome")
        window.location.href = "/expense.html"
    }
    catch(err){
       caution.innerHTML = `<h2 style="color:red">${err.response?.data?.message || 'Login failed'}</h2>`
    }
    finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    }
}

const reset_pass_btn = document.getElementById("reset-pass");
if (reset_pass_btn) {
    reset_pass_btn.addEventListener("click", () => resetPass());
}

async function resetPass(){
    window.location.href = "/resetPassForm.html";
}

const responseMsg = document.getElementById("response-msg")

async function resetForm(e){
    e.preventDefault()
    try{
        const email = e.target.email.value;
        const res = await axios.post("/password/forgotpassword",{email})
        responseMsg.textContent = `${res.data.message}`
        responseMsg.style = "color:green"
    }catch(err)
    {
        responseMsg.textContent = `${err.response?.data?.message || 'Unable to send reset link'}`
        responseMsg.style = "color:red"
        console.log("RESET PASS ERROR ___", err.response?.data?.message)
    }
}
