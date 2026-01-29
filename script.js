const amountInput = document.getElementById("amount")
const categoryInput = document.getElementById("category")
const dateInput = document.getElementById("date")
const noteInput = document.getElementById("note")
const addBtn = document.getElementById("btn-add")
const expensesCont = document.querySelector(".expenses")
let budget = 0
let todaysSpending = 0
let thisMonthSpending = 0

function validateInput(input) {
    if (input.value.trim() === "") {
        input.style.border = "2px solid red";
        return false;
    } else {
        input.style.border = "";
        return true;
    }
}


addBtn.addEventListener("click", () => {
    const isAmountValid = validateInput(amountInput);
    const isCategoryValid = validateInput(categoryInput);

    if (!isAmountValid || !isCategoryValid) return;

    const newRow = document.createElement("div")
    newRow.classList.add("expenses-row")

    const dateItem = document.createElement("div")
    dateItem.textContent = dateInput.value

    const amoutItem = document.createElement("div")
    amoutItem.textContent = `$${amountInput.value}`

    const categoryItem = document.createElement("div")
    categoryItem.textContent = categoryInput.value

    const noteItem = document.createElement("div")
    noteItem.textContent = noteInput.value

    const deleteItem = document.createElement("div")
    const deleteImg = document.createElement("img")
    deleteImg.src = "./assets/delete.svg"
    deleteImg.style.cursor = "pointer"
    deleteItem.appendChild(deleteImg)

    newRow.append(dateItem, amoutItem, categoryItem, noteItem, deleteItem)

    expensesCont.appendChild(newRow)

    deleteImg.addEventListener("click", () => {
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
    inputDate.value = `${yyyy}-${mm}-${dd}`;
});
