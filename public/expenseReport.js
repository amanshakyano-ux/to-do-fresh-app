

const token = localStorage.getItem("token");

const API_URL = "http://localhost:3000/time/transactions";

const dailyBtn = document.getElementById("daily");

const ul = document.getElementById("timely-exp");

const weeklyBtn = document.getElementById("weekly");

const downloadBtn = document.getElementById("download-list");

const totalExpense = document.getElementById("totalExp");

const monthlyBtn = document.getElementById("monthly")

monthlyBtn.addEventListener("click",async()=>{

  try{
    
    console.log("MONTH BUTTON GOT CLICKED")
     
    const res = await axios.get(`${API_URL}?period=monthly`,{
        headers: { Authorization: token },
        })
        expenseByPeriod(res.data.monthlyExp,res.data.totalExp,"Monthly")
    console.log(res.data.monthlyExp)
    console.log(res.data.totalExp)

  }catch(err)
  {
    console.log("Month sec frontend err", err.message)
  }
})

    weeklyBtn.addEventListener("click", async () => {
    try {
        const res = await axios.get(`${API_URL}?period=weekly`, {
        headers: { Authorization: token },
        });

       expenseByPeriod(res.data.weeklyExp, res.data.totalExp,"Weekly");
    } catch (err) {
        console.log("WEEKLY SEC ERROR MESSAGE >", err.message);
    }
    });

    dailyBtn.addEventListener("click", async () => {
        try {
            const res = await axios.get(`${API_URL}?period=daily`, {
            headers: { Authorization: token },
            });
            expenseByPeriod(res.data.dailyExp, res.data.totalExp,"Daily");
        } catch (err) {
            console.log("Daily Bar ERROR", err.message);
        }
    });
 


function expenseByPeriod(expList, totalExp,period) {
  ul.innerHTML = "";
  totalExpense.innerHTML = "";

  expList.forEach((ex) => {
    const li = document.createElement("li");
    li.textContent = `${ex.amount}|| ${ex.description} || ${ex.category}`;

    ul.appendChild(li);
  });

  downloadBtn.style.display = "inline-block";
  totalExpense.innerHTML = `<h4> Total Expense = ${totalExp}</h4>`;

  downloadBtn.addEventListener("click", async () => {  
    let csv = "Amount,Category,Description\n";
    expList.forEach((ex) => {
      csv += `${ex.amount}, ${ex.description}, ${ex.category}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${period} Expense Report.csv`;
    a.click();
  });
}
