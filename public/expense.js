
const token = localStorage.getItem("token")
 
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






                                 //previous download files
async function showDownloadHistory() {
  try {
    const res = await axios.get(`${API_URL}/files`, {
      headers: { Authorization: token }
    });

    const container = document.getElementById("history");

    container.innerHTML = "<h3>Download History</h3>";

    res.data.files.forEach(file => {
      const div = document.createElement("div");

      div.innerHTML = `
        <a href="${file.fileUrl}" target="_blank">
          ${new Date(file.createdAt).toLocaleString()}
        </a>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.log(err);
  }
}

async function isPremium(){
    
    try{
        const checkStatus = await axios.get(`${API_URL}/isPremium`,{headers:{"Authorization":token}})
        
        
        if(checkStatus.data.account === "PREMIUM")
            {
                  
                showLeaderBoardBtn();
                showReportBtn();
                downloadAllExp();
                showDownloadHistory();
            }
        else
        {
              console.log("User is not premium ❌");
      alert("You are not a premium user");
        }    
        
    
     } catch(err){
       console.log("isPremium error:", err.message);
    }
}

  function downloadAllExp(){
    try{
         
        const premTag = document.getElementById("prem-down")
        premTag.textContent = "Premium";
        premTag.style.color  = "green";
        if (document.getElementById("download-btn")) return;
        const downAllExpBtn = document.createElement("button")
        downAllExpBtn.textContent = "Download Expense"
        downAllExpBtn.style.margin = "10px"
        premTag.appendChild(downAllExpBtn)
        downAllExpBtn.onclick = async()=>{
        
        const response = await axios.get(`${API_URL}/downlod-expenses`,{headers:{"Authorization":token}})
         
        const a = document.createElement("a");
        a.href = response.data.fileURL;     //S3 URL
        a.download = "expense.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
    }catch(err)
    {
        console.log(err.message)
    }
}


const allUsers =document.getElementById("leaderboard")

async function showLeaderBoard() {
   
    
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

async function showLeaderBoardBtn() {
           const premiumUser = document.getElementById("premium-user");
           const leaderBoard = document.createElement('h3')
           leaderBoard.style = "color: green; font-size: 20px; font-weight: bold; padding: 10px;";
           leaderBoard.textContent = "Premium"
           const leaderBoardBtn = document.createElement("button")
           leaderBoardBtn.style= "margin:10px"
           leaderBoardBtn.textContent = "LEADERBOARD"
           leaderBoardBtn.addEventListener("click", showLeaderBoard);
           leaderBoard.appendChild(leaderBoardBtn)
           premiumUser.appendChild(leaderBoard)
    
}
async function showReportBtn() {
    const reportDiv = document.getElementById("report-sec")
    const reportTag = document.createElement("h3")
    reportTag.innerText = `Premium`
    reportTag.style = "color: green; font-size: 20px; font-weight: bold; padding: 10px;"

    const reportLink  = document.createElement("a")
    reportLink.href = "../views/expenseReport.html"
    reportLink.style = "color: black; font-size: 15px; font-weight: bold; padding: 10px;  "
    reportLink.textContent = "Click to get the full expense report"

    reportTag.appendChild(reportLink )
    reportDiv.appendChild(reportTag)

    
}