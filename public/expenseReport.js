const token = localStorage.getItem("token");
const API_URL = "http://localhost:3000/time/transactions";

const dailyBtn = document.getElementById("daily");
const weeklyBtn = document.getElementById("weekly");
const monthlyBtn = document.getElementById("monthly");

const ul = document.getElementById("timely-exp");
const totalExpense = document.getElementById("totalExp");
const paginationDiv = document.getElementById("pagination");
const downloadBtn = document.getElementById("download-list");

let currentPeriod = "";
let currentPage = 1;

/* ---------------- PERIOD BUTTONS ---------------- */

dailyBtn.addEventListener("click", () => {
  currentPeriod = "daily";
  currentPage = 1;
  fetchExpenses();
});

weeklyBtn.addEventListener("click", () => {
  currentPeriod = "weekly";
  currentPage = 1;
  fetchExpenses();
});

monthlyBtn.addEventListener("click", () => {
  currentPeriod = "monthly";
  currentPage = 1;
  fetchExpenses();
});

/* ---------------- FETCH FUNCTION ---------------- */

async function fetchExpenses() {
  try {
    const res = await axios.get(
      `${API_URL}?period=${currentPeriod}&page=${currentPage}`,
      { headers: { Authorization: token } }
    );

    renderExpenses(res.data);

  } catch (err) {
    console.log("Fetch error:", err.message);
  }
}

/* ---------------- RENDER DATA ---------------- */

function renderExpenses(result) {
  ul.innerHTML = "";
  totalExpense.innerHTML = "";
  paginationDiv.innerHTML = "";

  if (result.data.length === 0) {
    ul.innerHTML = "<li>No Data Found</li>";
    return;
  }

  result.data.forEach((ex) => {
    const li = document.createElement("li");
    li.textContent = `${ex.amount} || ${ex.description} || ${ex.category}`;
    ul.appendChild(li);
  });

  totalExpense.innerHTML = `<h4>Total Expense = ${result.totalExp}</h4>`;

  createPagination(result.totalPages);
}

/* ---------------- PAGINATION ---------------- */

function createPagination(totalPages) {
  paginationDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.style.backgroundColor = "black";
      btn.style.color = "white";
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      fetchExpenses();
    });

    paginationDiv.appendChild(btn);
  }
}

/* ---------------- DOWNLOAD CSV ---------------- */

downloadBtn.addEventListener("click", () => {

  const items = document.querySelectorAll("#timely-exp li");

  if (items.length === 0) return;

  let csv = "Amount,Description,Category\n";

  items.forEach(item => {
    csv += item.textContent.replace(/\|\|/g, ",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentPeriod}-Expense-Report.csv`;
  a.click();
});