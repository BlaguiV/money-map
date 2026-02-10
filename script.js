// ===== ELEMENTS =====
const amountInput = document.getElementById("amount")
const categoryInput = document.getElementById("category")
const dateInput = document.getElementById("date")
const noteInput = document.getElementById("note")
const addBtn = document.getElementById("btn-add")
const expensesCont = document.querySelector(".expenses")
const todaySpending = document.getElementById("today")
const month = document.getElementById("month")
const budget = document.getElementById("budget")

const modalOverlay = document.querySelector(".modal-overlay")
const openModal = document.querySelector(".edit")
const closeModal = document.getElementById("close-modal")
const modalBudgetInput = document.getElementById("modal-budget")
const confirmBtnModal = document.getElementById("modal-budget-confirm")

const errorContainer = document.getElementById("error-container")

// FILTER
const filterOpenBtn = document.getElementById("filter-open-btn")
const filterModalOverlay = document.querySelector(".filter-modal-overlay")
const closeModalFilter = document.getElementById("close-modal-filter")
const confirmFilterBtn = document.querySelector(".confirm-filter")
const clearAllFilter = document.querySelector(".clear-all-filter")

// ===== STATE =====
let expenses = JSON.parse(localStorage.getItem("expenses")) || []
let filterCategories = JSON.parse(localStorage.getItem("filterCategories")) || []
let todayTotal = 0
let monthTotal = 0

// ===== HELPERS =====
function formatMoney(value) {
    return Number(value).toFixed(2)
}

function getTodayDate() {
    return new Date().toISOString().split("T")[0]
}

function getCurrentMonth() {
    return new Date().getMonth()
}

function showMessageError(message) {
    errorContainer.textContent = message
    errorContainer.style.display = "block"

    setTimeout(() => {
        errorContainer.style.display = "none"
        errorContainer.textContent = ""
    }, 3000)
}

function validateInput(input) {
    if (input.value.trim() === "") {
        input.style.border = "2px solid red"
        showMessageError("Input cannot be empty")
        return false
    }
    input.style.border = ""
    return true
}

// ===== STORAGE =====
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses))
}

function saveBudget(value) {
    localStorage.setItem("budget", formatMoney(value))
}

function saveFilter() {
    localStorage.setItem("filterCategories", JSON.stringify(filterCategories))
}

// ===== RENDER =====
function updateTotals() {
    todaySpending.textContent = `$${formatMoney(todayTotal)}`
    month.textContent = `$${formatMoney(monthTotal)}`
}

function renderExpenses() {
    expensesCont.innerHTML = `
        <div class="expenses-header">
            <div>Date</div>
            <div>Amount</div>
            <div>Category</div>
            <div>Note</div>
            <div></div>
        </div>
    `

    todayTotal = 0
    monthTotal = 0

    let list = expenses
    if (filterCategories.length) {
        list = expenses.filter(e => filterCategories.includes(e.category))
    }

    list.forEach(expense => {
        const row = document.createElement("div")
        row.className = "expenses-row"

        row.innerHTML = `
            <div>${expense.date}</div>
            <div style="color:red">$${formatMoney(expense.amount)}</div>
            <div>${expense.category}</div>
            <div>${expense.note}</div>
            <div><img src="./assets/delete.svg" style="cursor:pointer"></div>
        `

        row.querySelector("img").addEventListener("click", () => {
            expenses = expenses.filter(e => e !== expense)
            saveExpenses()
            renderExpenses()
        })

        expensesCont.appendChild(row)

        if (expense.date === getTodayDate()) todayTotal += expense.amount
        if (new Date(expense.date).getMonth() === getCurrentMonth()) {
            monthTotal += expense.amount
        }
    })

    updateTotals()
}

// ===== EVENTS =====
addBtn.addEventListener("click", () => {
    if (!validateInput(amountInput) || !validateInput(categoryInput)) return

    if (budget.textContent === "$0.00") {
        showMessageError("Enter your budget!")
        return
    }

    expenses.push({
        amount: Number(formatMoney(amountInput.value)),
        category: categoryInput.value,
        note: noteInput.value,
        date: dateInput.value || getTodayDate()
    })

    saveExpenses()
    renderExpenses()

    amountInput.value = ""
    categoryInput.value = ""
    noteInput.value = ""
    dateInput.value = getTodayDate()
})

// MODAL BUDGET
openModal.addEventListener("click", () => modalOverlay.classList.add("active"))
closeModal.addEventListener("click", () => modalOverlay.classList.remove("active"))

confirmBtnModal.addEventListener("click", () => {
    if (!validateInput(modalBudgetInput)) return

    budget.textContent = `$${formatMoney(modalBudgetInput.value)}`
    saveBudget(modalBudgetInput.value)

    modalBudgetInput.value = ""
    modalOverlay.classList.remove("active")
})

// FILTER
filterOpenBtn.addEventListener("click", () => {
    filterModalOverlay.style.display = "flex"
    document
        .querySelectorAll('.filter-modal input[type="checkbox"]')
        .forEach(cb => cb.checked = filterCategories.includes(cb.value))
})

closeModalFilter.addEventListener("click", () => {
    filterModalOverlay.style.display = "none"
})

confirmFilterBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll('.filter-modal input:checked')
    filterCategories = [...checked].map(cb => cb.value)
    saveFilter()
    filterModalOverlay.style.display = "none"
    renderExpenses()
})

clearAllFilter.addEventListener("click", () => {
    filterCategories = []
    saveFilter()
    document
        .querySelectorAll('.filter-modal input')
        .forEach(cb => cb.checked = false)
    renderExpenses()
})

// INIT
budget.textContent = `$${formatMoney(localStorage.getItem("budget") || 0)}`
dateInput.value = getTodayDate()
renderExpenses()
