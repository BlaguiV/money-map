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

function validateInput(input) {
    if (input.value.trim() === "") {
        input.style.border = "2px solid red";
        return false;
    } else {
        input.style.border = "";
        return true;
    }
}

let todayTotal = 0
let monthTotal = 0

todaySpending.textContent = "$0"
month.textContent = "$0"
budget.textContent = "$0"

openModal.addEventListener("click", () => {
    modalOverlay.classList.add("active")
})

closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active")
})

confirmBtnModal.addEventListener("click", () => {
    const isBudgetValid = validateInput(modalBudgetInput)
    if (!isBudgetValid) return

    budget.textContent = `$${modalBudgetInput.value}`
    modalOverlay.classList.remove("active")
    modalBudgetInput.value = ""
})


addBtn.addEventListener("click", () => {
    const isAmountValid = validateInput(amountInput);
    const isCategoryValid = validateInput(categoryInput);

    if (!isAmountValid || !isCategoryValid) return;

    const newRow = document.createElement("div")
    newRow.classList.add("expenses-row")

    const dateItem = document.createElement("div")
    dateItem.textContent = dateInput.value

    const amountItem = document.createElement("div")
    amountItem.style.color = "red"
    amountItem.textContent = `$${amountInput.value}`

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

    const amount = Number(amountItem.textContent.replace("$", ""))
    const expenseDate = dateInput.value

    if (expenseDate == getTodayDate()) {
        todayTotal += amount
    }

    const expenseMonth = new Date(expenseDate).getMonth()
    if (expenseMonth == getCurrentMonth()) {
        monthTotal += amount
    }
    updateTotals()

    deleteImg.addEventListener("click", () => {
        const amount = Number(amountInput.value)
        const expenseDate = dateItem.textContent.replace("$", "")

        if (expenseDate == getTodayDate()) {
            todayTotal -= amount
        }

        if (expenseMonth == getCurrentMonth()) {
            monthTotal -= amount
        }

        updateTotals()
        newRow.remove()
    })

    let today = new Date()
    let yyyy = today.getFullYear()
    let mm = today.getMonth() + 1
    let dd = today.getDate()
    if (mm < 10) mm = "0" + mm
    if (dd < 10) dd = "0" + dd

    amountInput.value = ""
    categoryInput.value = ""
    noteInput.value = ""
    dateInput.value = `${yyyy}-${mm}-${dd}`;
});

function getTodayDate() {
    const today = new Date()
    return today.toISOString().split("T")[0]
}

function getCurrentMonth() {
    return new Date().getMonth()
}

function updateTotals() {
    todaySpending.textContent = `$${todayTotal}`
    month.textContent = `$${monthTotal}`
}


