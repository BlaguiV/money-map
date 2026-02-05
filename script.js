// ==================== ELEMENTS ====================
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
<<<<<<< HEAD
const errorContainer = document.getElementById("error-container")

// GLOBAL TOTALS
let todayTotal = 0
let monthTotal = 0

todaySpending.textContent = "$0.00"
month.textContent = "$0.00"
budget.textContent = "$0.00"
=======

let expenses = JSON.parse(localStorage.getItem("expenses")) || []
let todayTotal = 0
let monthTotal = 0

function formatMoney(value) {
    return Number(value).toFixed(2)
}

function showMessageError(message) {
    const errorContainer = document.getElementById("error-container")

    errorContainer.textContent = message
    errorContainer.style.display = "block"

    setTimeout(() => {
        errorContainer.style.display = "none"
        errorContainer.textContent = ""
    }, 3000);
}

budget.textContent = `$${formatMoney(localStorage.getItem("budget") || 0)}`

function validateInput(input) {
    if (input.value.trim() === "") {
        input.style.border = "2px solid red"
        showMessageError("Input cannot be empty")
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
>>>>>>> dev

// ERROR TOAST
function showErrorMessage(message) {
    errorContainer.textContent = message
    errorContainer.classList.add("show")

    setTimeout(() => {
        errorContainer.classList.remove("show")
    }, 3000)
}

// VALIDATION
function validateInput(input) {
    if (input.value.trim() === "") {
        input.style.border = "2px solid red"
        showErrorMessage(`The "${input.placeholder}" field cannot be empty!`)
        return false
    } else {
        input.style.border = ""
        return true
    }
}

// MODAL BUDGET
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

<<<<<<< HEAD
    budget.textContent = `$${parseFloat(modalBudgetInput.value).toFixed(2)}`
=======
>>>>>>> dev
    modalOverlay.classList.remove("active")
    modalBudgetInput.value = ""
})

<<<<<<< HEAD
//  ADD EXPENSE
addBtn.addEventListener("click", () => {
    const isAmountValid = validateInput(amountInput)
    const isCategoryValid = validateInput(categoryInput)

    if (!isAmountValid || !isCategoryValid) return
    if (budget.textContent === "$0.00") {
        showErrorMessage("Enter your budget!")
        return
    }

    // CREATE NEW ROW
    const newRow = document.createElement("div")
    newRow.classList.add("expenses-row")

    const dateItem = document.createElement("div")
    dateItem.textContent = dateInput.value

    const amountItem = document.createElement("div")
    amountItem.style.color = "red"
    amountItem.textContent = `$${parseFloat(amountInput.value).toFixed(2)}`

    const categoryItem = document.createElement("div")
    categoryItem.textContent = categoryInput.value

    const noteItem = document.createElement("div")
    noteItem.textContent = noteInput.value

    const deleteItem = document.createElement("div")
    const deleteImg = document.createElement("img")
    deleteImg.src = "./assets/delete.svg"
    deleteImg.style.cursor = "pointer"
    deleteItem.appendChild(deleteImg)

    newRow.append(dateItem, amountItem, categoryItem, noteItem, deleteItem)
    expensesCont.appendChild(newRow)

    //  UPDATE TOTALS
    const amount = parseFloat(amountItem.textContent.replace("$", ""))
    const expenseDate = dateInput.value
    const expenseMonth = new Date(expenseDate).getMonth()

    if (expenseDate === getTodayDate()) todayTotal += amount
    if (expenseMonth === getCurrentMonth()) monthTotal += amount

    updateTotals()

    //  DELETE EXPENSE
    deleteImg.addEventListener("click", () => {
        const amount = parseFloat(amountItem.textContent.replace("$", ""))
        const expenseDate = dateItem.textContent
        const expenseMonth = new Date(expenseDate).getMonth()

        if (expenseDate === getTodayDate()) todayTotal -= amount
        if (expenseMonth === getCurrentMonth()) monthTotal -= amount

        updateTotals()
        newRow.remove()
    })

    // RESET INPUTS
    const today = new Date()
    let yyyy = today.getFullYear()
    let mm = today.getMonth() + 1
    let dd = today.getDate()
    if (mm < 10) mm = "0" + mm
    if (dd < 10) dd = "0" + dd
=======
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
>>>>>>> dev

    amountInput.value = ""
    categoryInput.value = ""
    noteInput.value = ""
<<<<<<< HEAD
    dateInput.value = `${yyyy}-${mm}-${dd}`
})

//  HELPERS
function getTodayDate() {
    return new Date().toISOString().split("T")[0]
}

function getCurrentMonth() {
    return new Date().getMonth()
}

function updateTotals() {
    todaySpending.textContent = `$${todayTotal.toFixed(2)}`
    month.textContent = `$${monthTotal.toFixed(2)}`
}
=======
    dateInput.value = getTodayDate()
})

renderExpenses()
>>>>>>> dev
