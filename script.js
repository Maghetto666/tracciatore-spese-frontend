const btnAdd = document.getElementById('btnAdd');
const btnEdit = document.getElementById('btnEdit');
const inputText = document.querySelector('input');
const expensesList = document.getElementById('expenses-list');
const emptyListMsg = document.querySelector('.empty-list-msg');
const btnDeleteAll = document.getElementById('btnDeleteAll');
const newDate = document.querySelector('.newDate');
const newMovement = document.querySelector('.newMovement');
const newCash = document.querySelector('.newCash');
const categoriesDropdown = document.querySelector('.categoriesDropdown');
const editNewDate = document.querySelector('.editNewDate');
const editNewMovement = document.querySelector('.editNewMovement');
const editNewCash = document.querySelector('.editNewCash');
const editCategoriesDropdown = document.querySelector('.editCategoriesDropdown');
const addPopup = document.getElementById("addPopup");
const modifyPopup = document.getElementById("modifyPopup");
const add_cancel_button = document.querySelector('.add-cancel-button');
const edit_cancel_button = document.querySelector('.edit-cancel-button');
const open_button = document.querySelector('.open-button');

btnAdd.addEventListener('click', addExpense);

fetchCategories();
fetchExpenses();

async function fetchCategories() {
    const apiUrl = 'http://localhost:8080/categories';
    const response = await fetch(apiUrl);
    const data = await response.json();
    categories = data;
    for (let i = 0; i < categories.length; i++) {
        const template = buildCategoriesHTML(categories[i]);
        categoriesDropdown.innerHTML += template;
        editCategoriesDropdown.innerHTML += template;
    }
}

function buildCategoriesHTML(category) {
    return `<option value="${category.id}">${category.categoryType}</option>`
}

async function fetchExpenses() {
    const apiUrl = 'http://localhost:8080/expenses';
    const response = await fetch(apiUrl);
    const data = await response.json();
    expenses = data;

    expensesList.innerHTML = '';

    if (expenses.length == 0) {

        emptyListMsg.style.display = 'block';
        btnDeleteAll.style.visibility = 'hidden';
    } else {
        emptyListMsg.style.display = 'none';
        btnDeleteAll.style.visibility = 'visible';

        for (let i = 0; i < expenses.length; i++) {
            const template = buildTemplateHTML(expenses[i]);
            expensesList.innerHTML += template;
        }

        activateChecks();
        activateEdits();
    }
}

function buildTemplateHTML(expense) {
    const category = expense.category;
    categoryType = category.categoryType
    let date = new Date(expense.date).toLocaleDateString();
    return `
    <li class="expense-item">
        <div class="expense-modify" id="${expense.id}"><img src="images/edit.svg"></div>
        <p class="expense-text-date">${date}</p>
        <p class="expense-text-movement">${expense.movement}</p>
        <p class="expense-text-cash">${expense.cash}</p>
        <p class="expense-text-category">${categoryType}</p>
        <div class="expense-check" id="${expense.id}"><img src="images/check.svg"></div>
    </li>
    `;
}

function addExpense() {
    let date = newDate.value;
    let movement = newMovement.value.trim();
    let cash = newCash.value;
    let category = categoriesDropdown.value;

    (async () => {

        const rawResponse = await fetch('http://localhost:8080/expenses', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: date,
                movement: movement,
                cash: cash,
                category_id: category
            })
        });

        toggleAddButton();
        fetchExpenses();
    })();


    newDate.value = '';
    newMovement.value = '';
    newCash.value = '';
    categoriesDropdown.value = '';
}


function activateChecks() {
    const checks = document.querySelectorAll('.expense-check');

    for (let i = 0; i < checks.length; i++) {
        checks[i].addEventListener('click', function () {
            let id = checks[i].id;
            deleteExpense(id);
        });
    };
}

function activateEdits() {
    const checks = document.querySelectorAll('.expense-modify');
    for (let i = 0; i < checks.length; i++) {
        checks[i].addEventListener('click', function () {
            let id = checks[i].id;
            toggleEditButtons();
            fillEditFields(id);
        });
    };
}

async function deleteExpense(id) {
    await fetch(`http://localhost:8080/expenses/${id}`, {
        method: 'DELETE'
    });
    toggleAddButton()
    fetchExpenses();
}

async function modifyExpense(id) {
    /*
    await fetch(`http://localhost:8080/expenses/${id}`, {
        method: 'PUT'
    });
    */
    toggleEditButtons()
    fetchExpenses();
}


async function deleteAll() {
    const confirm = window.confirm('Sei sicuro di voler eliminare tutte le tue spese?');
    if (confirm) {
        await fetch(`http://localhost:8080/expenses/all`, {
            method: 'DELETE'
        });

        toggleAddButton()
        fetchExpenses();

    }
}

let isAddOpen = false;
let isModifyOpen = false;

function toggleAddButton() {
    if (isAddOpen == false) {
        addPopup.style.display = "block";
        add_cancel_button.style.display = "block";
        open_button.style.display = "none";

        isAddOpen = true;
        isModifyOpen = true;
    }
    else {
        addPopup.style.display = "none";
        add_cancel_button.style.display = "none";
        open_button.style.display = "block";
        isAddOpen = false;
        isModifyOpen = false;
    }
}

function toggleEditButtons() {

    if (isModifyOpen == false) {

        modifyPopup.style.display = "block";
        edit_cancel_button.style.display = "block";
        open_button.style.display = "none";
        isModifyOpen = true;
        isAddOpen = true;
    }
    else {

        modifyPopup.style.display = "none";
        edit_cancel_button.style.display = "none";
        open_button.style.display = "block";
        isModifyOpen = false;
        isAddOpen = false;
    }
}

async function fillEditFields(id) {
    const apiUrl = `http://localhost:8080/expenses/${id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    expense = data;

    const category = expense.category  ;
    categoryType = category.id;
    let date = expense.date;
    let editDate = convert(date);
    
    function convert(oldDate) {
        var date = new Date(oldDate),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }

    editNewDate.value = editDate;
    editNewMovement.value = expense.movement;
    editNewCash.value = expense.cash;
    editCategoriesDropdown.value = categoryType;
}