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
const errorContainer = document.getElementById("error-container")

// GLOBAL TOTALS
let todayTotal = 0
let monthTotal = 0

todaySpending.textContent = "$0.00"
month.textContent = "$0.00"
budget.textContent = "$0.00"

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
    const isBudgetValid = validateInput(modalBudgetInput)
    if (!isBudgetValid) return

    budget.textContent = `$${parseFloat(modalBudgetInput.value).toFixed(2)}`
    modalOverlay.classList.remove("active")
    modalBudgetInput.value = ""
})

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

    amountInput.value = ""
    categoryInput.value = ""
    noteInput.value = ""
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
