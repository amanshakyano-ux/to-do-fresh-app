const token = localStorage.getItem("token");
console.log("TOKEN:", token);
const API_URL = "/expense";
const expenseList = document.getElementById("expense-list");
const cashfree = Cashfree({
    mode:   "sandbox"
});

     let premiumInit = false;

function buy_premium_pack() {
    if (premiumInit) return;
    premiumInit = true;

    const buyBtn = document.getElementById("buy-premium");
    if (!buyBtn) return;

    buyBtn.style.display = "block";

    buyBtn.onclick = async () => {
        console.log("BUTTON CLICKED ✅");
        await buyingPaidfeature();
    };
}


// ✅ CORRECT FUNCTION (single definition)
async function buyingPaidfeature() {
    try {
       console.log("TOKEN", token)
        const res = await axios.post(
            "/payment/create-order",
            {},
            { headers: { Authorization: token } }
        );
        console.log(res.data.paymentSessionId, "SESSION ID IS THIS")
       const paymentSessionId = res.data.paymentSessionId;
       console.log(paymentSessionId)

        let checkoutOptions = {
        paymentSessionId,

        //? New page payment options

        redirectTarget : "_self",   //default;

    }
    
    //ab yhaan checkout process start hogii session dekr
      const output =  await cashfree.checkout(checkoutOptions);
      console.log(output, "Output")
        

         

    } catch (err) {
         
      console.log("Payment Error FULL:", err.response?.data || err.message);
    alert("Unable to start payment");
 
    }
}

 

// function startPayment(sessionId) {
//     const cashfree = Cashfree({
//         mode: "sandbox"
//     });

//     cashfree.checkout({
//         paymentSessionId: sessionId,
//         redirectTarget: "_modal"
//     });
// }

// ---------------- CATEGORY P 

function categoryGenerator() {
    const descInput = document.getElementById("desc");
    const categoryInput = document.getElementById("category");

    let timer;

    descInput.addEventListener("keyup", function () {
        clearTimeout(timer);

        timer = setTimeout(async () => {
            const description = descInput.value.trim();

            if (description.length < 3) return;

            try {
                const response = await axios.post(
                    `${API_URL}/predictCategory`,
                    { description },
                    { headers: { Authorization: token } }
                );

                categoryInput.value = response.data;

            } catch (err) {
                console.log("AI Error:", err);
            }
        }, 400);
    });
}

categoryGenerator();


// ---------------- ADD EXPENSE ----- 
async function handleExpense(e) {
    e.preventDefault();

    const expense_item = {
        amount: e.target.amount.value,
        description: e.target.description.value,
        category: e.target.category.value
    };

    try {
        await axios.post(`${API_URL}/addExpense`, expense_item, {
            headers: { Authorization: token }
        });

        const expenses = await axios.get(`${API_URL}/getExpenses`, {
            headers: { Authorization: token }
        });

        e.target.reset();
        showExpense(expenses.data);

    } catch (err) {
        console.log(err.message);
        alert("Something went wrong");
    }
}


// ---------------- SHOW EXPENSES 
function showExpense(expenses) {
    expenseList.innerHTML = "";

    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.id = `expense-${exp.id}`;

        li.innerHTML = `
            <strong>Amount:</strong> ${exp.amount}
            <strong>Category:</strong> ${exp.category}
            <strong>Description:</strong> ${exp.description}
        `;

        const delBtn = document.createElement("button");
        delBtn.textContent = "DELETE EXPENSE";
        delBtn.style.margin = "10px";

        delBtn.onclick = () => deleteExp(exp.id);

        li.appendChild(delBtn);
        expenseList.appendChild(li);
    });
}


//   DELETE EXPENSE ----------------
async function deleteExp(id) {
    try {
        await axios.delete(`${API_URL}/deleteExpense/${id}`, {
            headers: { Authorization: token }
        });

        const el = document.getElementById(`expense-${id}`);
        if (el) el.remove();

    } catch (err) {
        console.log(err.message);
    }
}


// ---- - DOWNLOAD HISTORY ----------------
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


// ---------------- PREMIUM CHECK ----------------
async function isPremium() {
    try {

        const res = await axios.get(`${API_URL}/isPremium`, {
            headers: { Authorization: token }
        });
          const buyBtn = document.getElementById("buy-premium");

        if (res.data.isPremium) {
            if (buyBtn) buyBtn.style.display = "none";
            showPremiumUI();
        } else {
            buy_premium_pack(); 
        }

    } catch (err) {
        console.log("isPremium error:", err.message);
    }
}


// ---------------- PREMIUM UI HANDLER ----------------
function showPremiumUI() {
    console.log("HERORROOROROROROROROR")
    showLeaderBoardBtn();
    showReportBtn();
    downloadAllExp();
    showDownloadHistory();
}


// ---------------- DOWNLOAD ALL EXPENSE ----------------
async function downloadAllExp() {
    try {
        const premTag = document.getElementById("prem-down");
        premTag.textContent = "Premium";
        premTag.style.color = "green";

        if (document.getElementById("download-btn")) return;

        const btn = document.createElement("button");
        btn.textContent = "Download Expense";
        btn.style.margin = "10px";
        btn.id = "download-btn";

        btn.onclick = async () => {
            const response = await axios.get(
                `${API_URL}/download-expenses`,
                { headers: { Authorization: token } }
            );

            const a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = "expense.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
        };

        premTag.appendChild(btn);
          

    } catch (err) {
        console.log(err.message);
    }
}


// ---------------- LEADERBOARD DATA ----------------
const allUsers = document.getElementById("leaderboard");

async function showLeaderBoard() {
    try {
        allUsers.innerHTML = "";

        const response = await axios.get(
            "/premium",
            { headers: { Authorization: token } }
        );

        const heading = document.getElementById("leader-heading");
        heading.textContent = "Leaderboard";
        heading.style.color = "brown";

        response.data.forEach(user => {
            const li = document.createElement("li");
            li.textContent = `Name - ${user.name} || Total Expense - ${user.totalExpense}`;
            allUsers.appendChild(li);
        });

    } catch (err) {
        console.log(err.message);
    }
}


// ---------------- PREMIUM BUTTONS ----------------
function showLeaderBoardBtn() {
    const premiumUser = document.getElementById("premium-user");

    const wrapper = document.createElement("div");
    wrapper.style = "color: green; font-weight: bold; padding: 10px;";
    wrapper.textContent = "Premium ";

    const btn = document.createElement("button");
    btn.textContent = "LEADERBOARD";
    btn.style.margin = "10px";
    btn.onclick = showLeaderBoard;

    wrapper.appendChild(btn);
    premiumUser.appendChild(wrapper);
}

function showReportBtn() {
    const reportDiv = document.getElementById("report-sec");

    const tag = document.createElement("h3");
    tag.innerText = "Premium";
    tag.style = "color: green; font-weight: bold; padding: 10px;";

    const link = document.createElement("a");
    link.href = "expenseReport.html";
    link.textContent = "Click to get the full expense report";
    link.style = "color: black; font-size: 15px; font-weight: bold; padding: 10px;";

    tag.appendChild(link);
    reportDiv.appendChild(tag);
}


// ---------------- INIT ----------------
window.addEventListener("DOMContentLoaded", async () => {
    await isPremium();

    const expenses = await axios.get(`${API_URL}/getExpenses`, {
        headers: { Authorization: token }
    });
     
    showExpense(expenses.data);
});