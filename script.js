const btnAdd = document.getElementById('btnAdd');
const inputText = document.querySelector('input');
const expensesList = document.getElementById('expenses-list');
const emptyListMsg = document.querySelector('.empty-list-msg');
const btnDeleteAll = document.getElementById('btnDeleteAll');
const newDate = document.querySelector('.newDate');
const newMovement = document.querySelector('.newMovement');
const newCash = document.querySelector('.newCash');
const newCategory = document.querySelector('.newCategory');

btnAdd.addEventListener('click', addExpense);


fetchExpenses();

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
    }
}


function buildTemplateHTML(expense) {
    const category = expense.category;
    categoryType = category.categoryType
    let date = new Date(expense.date).toLocaleDateString();
    return `
    <li class="expense-item">
        <p class="expense-text">${date}</p>
        <p class="expense-text">${expense.movement}</p>
        <p class="expense-text">${expense.cash}</p>
        <p class="expense-text">${categoryType}</p>
        <div class="expense-check" id="${expense.id}"><img src="images/check.svg"></div>
    </li>
    `;
}


function addExpense() {

    let date = newDate.value;
    let movement = newMovement.value.trim();
    let cash = newCash.value;
    let category = newCategory.value;

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
        const content = await rawResponse.json();

        console.log(content);
        fetchExpenses();
    })();


    newDate.value = '';
    newMovement.value = '';
    newCash.value = '';
    newCategory.value = '';
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


async function deleteExpense(id) {
    await fetch(`http://localhost:8080/expenses/${id}`, {
        method: 'DELETE'
    });
    fetchExpenses();
}


function deleteAll() {
    // Chiede conferma all'utente
    const confirm = window.confirm('Sei sicuro di voler eliminare tutte le tue spese?');
    if (confirm) {

    }
}