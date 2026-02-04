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
const closeModal = document.getElementById("close-modal")
const modalBudgetInput = document.getElementById("modal-budget")
const openModal = document.querySelector(".edit")
const confirmBtnModal = document.getElementById("modal-budget-confirm")

let expenses = JSON.parse(localStorage.getItem("expenses")) || []
let todayTotal = 0
let monthTotal = 0

function formatMoney(value) {
    return Number(value).toFixed(2)
}

budget.textContent = `$${formatMoney(localStorage.getItem("budget") || 0)}`

function validateInput(input) {
    if (input.value.trim() === "") {
        input.style.border = "2px solid red"
        return false
    }
    input.style.border = ""
    return true
}

function getTodayDate() {
    return new Date().toISOString().split("T")[0]
}

function getCurrentMonth() {
    return new Date().getMonth()
}

function updateTotals() {
    todaySpending.textContent = `$${formatMoney(todayTotal)}`
    month.textContent = `$${formatMoney(monthTotal)}`
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses))
}

function saveBudget(value) {
    localStorage.setItem("budget", formatMoney(value))
}

function renderExpenses() {
    expensesCont.innerHTML = ""
    todayTotal = 0
    monthTotal = 0

    expenses.forEach((expense, index) => {
        const row = document.createElement("div")
        row.classList.add("expenses-row")

        const date = document.createElement("div")
        date.textContent = expense.date

        const amount = document.createElement("div")
        amount.style.color = "red"
        amount.textContent = `$${formatMoney(expense.amount)}`

        const category = document.createElement("div")
        category.textContent = expense.category

        const note = document.createElement("div")
        note.textContent = expense.note

        const del = document.createElement("div")
        const img = document.createElement("img")
        img.src = "./assets/delete.svg"
        img.style.cursor = "pointer"
        del.appendChild(img)

        row.append(date, amount, category, note, del)
        expensesCont.appendChild(row)

        if (expense.date === getTodayDate()) {
            todayTotal += expense.amount
        }

        if (new Date(expense.date).getMonth() === getCurrentMonth()) {
            monthTotal += expense.amount
        }

        img.addEventListener("click", () => {
            expenses.splice(index, 1)
            saveExpenses()
            renderExpenses()
        })
    })

    updateTotals()
}

openModal.addEventListener("click", () => {
    modalOverlay.classList.add("active")
})

closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active")
})

confirmBtnModal.addEventListener("click", () => {
    if (!validateInput(modalBudgetInput)) return

    budget.textContent = `$${formatMoney(modalBudgetInput.value)}`
    saveBudget(modalBudgetInput.value)

    modalOverlay.classList.remove("active")
    modalBudgetInput.value = ""
})

addBtn.addEventListener("click", () => {
    if (!validateInput(amountInput) || !validateInput(categoryInput)) return

    const expense = {
        amount: Number(formatMoney(amountInput.value)),
        category: categoryInput.value,
        note: noteInput.value,
        date: dateInput.value
    }

    expenses.push(expense)
    saveExpenses()
    renderExpenses()

    amountInput.value = ""
    categoryInput.value = ""
    noteInput.value = ""
    dateInput.value = getTodayDate()
})

renderExpenses()
