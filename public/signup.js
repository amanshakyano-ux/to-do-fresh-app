const API_URL = "/user/signup"
const form = document.querySelector("form")
const caution = document.getElementById("response-msg")
async function signup(e){
    e.preventDefault()
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing up...';
    }

    const userDetails = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
    }
    try{
        await axios.post(API_URL, userDetails)
        window.location.href = "/login.html"
    }catch(err)
    {
        caution.innerHTML = `<h2 style="color:brown">${err.response?.data?.message || 'Signup failed'}</h2>`
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
        }
    }
 }