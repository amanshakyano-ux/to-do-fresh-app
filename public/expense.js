
const token = localStorage.getItem("token")
console.log(token)
const API_URL = "http://localhost:3000/expense"
const expenseList = document.getElementById("expense-list");

function categoryGenerator(){
    const descInput = document.getElementById("desc");
    const categoryInput = document.getElementById("category");

let timer;

descInput.addEventListener("keyup", function () {

    clearTimeout(timer);

    timer = setTimeout(async () => {

        const description = descInput.value.trim();

        if (description.length < 3) return;

        try {

            const response = await axios.post(   `${API_URL}/predictCategory`,{description }, {headers: { "Authorization": token }});
 console.log("RESPONSE",response)
            categoryInput.value = response.data;

        } catch (err) {
            console.log("AI Error:", err);
        }

    }, 800); // debounce
});
}

categoryGenerator();




async function handleExpense(e){
    e.preventDefault()
    const expense_item= {
        amount:e.target.amount.value,
        description:e.target.description.value,
        category:e.target.category.value   
    }
    try{


        await axios.post(`${API_URL}/addExpense`,expense_item ,{headers:{"Authorization":token}})
        const expenses = await axios.get(`${API_URL}/getExpenses`,{headers:{"Authorization":token}})
       e.target.reset();
       showExpense(expenses.data)
         
    }catch(err){
    console.log(err.message)
    alert("Something went wrong");
         
    }
}

function showExpense(expenses){
    expenseList.innerHTML = "";

    expenses.forEach(exp => {
         const li= document.createElement("li")
         li.id = `expense-${exp.id}`;

         li.innerHTML = `<strong>Amount:</strong>${exp.amount}   <strong> Category:</strong> ${exp.category}  <strong>Description :</strong>  ${exp.description}`
        const delBtn = document.createElement("button")
        delBtn.onclick = ()=>deleteExp(exp.id)
        delBtn.textContent = "DELETE EXPENSE"
        delBtn.style = "margin:10px"
        li.appendChild(delBtn)
        expenseList.appendChild(li)
    });

}


async function deleteExp(id){
    await axios.delete(`${API_URL}/deleteExpense/${id}`,{headers:{"Authorization":token}})
    
    document.getElementById(`expense-${id}`).remove();
}

const premiumUser = document.getElementById("premium-user");


async function isPremium(){

    try{
    const checkStatus = await axios.get(`${API_URL}/isPremium`,{headers:{"Authorization":token}})
    

    if(checkStatus.data.account === "PREMIUM")
    {
           const leaderBoard = document.createElement('h3')
           leaderBoard.style = "color: green; font-size: 20px; font-weight: bold; padding: 10px;";
           leaderBoard.textContent = "Premium Feauture"
           const leaderBoardBtn = document.createElement("button")
           leaderBoardBtn.style= "margin:10px"
           leaderBoardBtn.textContent = "LEADERBOARD"
           leaderBoardBtn.addEventListener("click", showLeaderBoard);
           leaderBoard.appendChild(leaderBoardBtn)
           premiumUser.appendChild(leaderBoard)
    }
       }
    catch(err){
        res.status(404).json({success:false,message:"isPremium error"+err.message})
      }
}
const allUsers =document.getElementById("leaderboard")

async function showLeaderBoard() {
    ///ADD data that you want to show only for premium Users!!
   
    allUsers.innerHTML = "";

    const response = await axios.get("http://localhost:3000/premium",{headers:{"Authorization":token}})
    
    const leaderHeading = document.getElementById("leader-heading")
    leaderHeading.textContent = "Leaderboard"
    leaderHeading.style = "color:brown"
    const users = response.data;
     users.forEach((user)=>{
        const li = document.createElement("li")
        li.textContent = `Name - ${user.name} || Total Expense - ${user.totalExpense}`
        allUsers.appendChild(li)
     }) 
    
}
window.addEventListener("DOMContentLoaded",async()=>{
    isPremium();
   const expenses = await axios.get(`${API_URL}/getExpenses`,{headers:{"Authorization":token}})
   showExpense(expenses.data)

})