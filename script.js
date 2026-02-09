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
const filterOpenBtn = document.getElementById('filter-open-btn')
const filterModalOverlay = document.querySelector(".filter-modal-overlay")
const filterCategory = document.getElementById("filter-category")
const closeModalFilter = document.getElementById("close-modal-filter")
const confirmFilterBtn = document.querySelector(".confirm-filter")
const clearAllFilter = document.querySelector(".clear-all-filter")


let expenses = JSON.parse(localStorage.getItem("expenses")) || []
let todayTotal = 0
let monthTotal = 0
let filterCategories = loadFilter()

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

function saveFilter() {
    localStorage.setItem("filterCategories", JSON.stringify(filterCategories))
}

function loadFilter() {
    return JSON.parse(localStorage.getItem("filterCategories")) || []
}


function renderExpenses() {
    expensesCont.innerHTML = `
        <div class="expenses-header">
            <div>Date</div>
            <div>Amount</div>
            <div>Category</div>
            <div>Note</div>
        </div>
    `

    todayTotal = 0
    monthTotal = 0

    let expensesToShow = expenses

    if (filterCategories.length > 0) {
        expensesToShow = expenses.filter(expense =>
            filterCategories.includes(expense.category)
        )
    }

    expensesToShow.forEach(expense => {
        const row = document.createElement("div")
        row.classList.add("expenses-row")

        const dateDiv = document.createElement("div")
        dateDiv.textContent = expense.date

        const amountDiv = document.createElement("div")
        amountDiv.textContent = `$${formatMoney(expense.amount)}`
        amountDiv.style.color = "red"

        const categoryDiv = document.createElement("div")
        categoryDiv.textContent = expense.category

        const noteDiv = document.createElement("div")
        noteDiv.textContent = expense.note

        const deleteDiv = document.createElement("div")
        const deleteImg = document.createElement("img")
        deleteImg.src = "./assets/delete.svg"
        deleteImg.style.cursor = "pointer"
        deleteDiv.appendChild(deleteImg)

        row.append(
            dateDiv,
            amountDiv,
            categoryDiv,
            noteDiv,
            deleteDiv
        )

        deleteImg.addEventListener("click", () => {
            expenses = expenses.filter(e => e !== expense)
            saveExpenses()
            renderExpenses()
        })

        expensesCont.appendChild(row)

        if (expense.date === getTodayDate()) {
            todayTotal += expense.amount
        }

        if (new Date(expense.date).getMonth() === getCurrentMonth()) {
            monthTotal += expense.amount
        }
    })

    updateTotals()
}



openModal.addEventListener("click", () => {
    modalOverlay.classList.add("active")
})

closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active")
})

filterOpenBtn.addEventListener("click", () => {
    filterModalOverlay.style.display = "flex"

    document
        .querySelectorAll('.filter-modal input[type="checkbox"]')
        .forEach(cb => {
            cb.checked = filterCategories.includes(cb.value)
        })
})


closeModalFilter.addEventListener("click", () => {
    filterModalOverlay.style.display = "none"
})

confirmFilterBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(
        '.filter-modal input[type="checkbox"]:checked'
    )

    filterCategories = [...checked].map(cb => cb.value)

    saveFilter()
    filterModalOverlay.style.display = "none"
    renderExpenses()
})


clearAllFilter.addEventListener("click", () => {
    document
        .querySelectorAll('.filter-modal input[type="checkbox"]')
        .forEach(cb => cb.checked = false)

    filterCategories = []
    saveFilter()
    renderExpenses()
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
