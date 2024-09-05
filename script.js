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


fetchExpenses()

async function fetchExpenses() {
    const apiUrl = 'http://localhost:8080/expenses';
    const response = await fetch(apiUrl);
    const data = await response.json();

    expenses = data;
    console.log(expenses);

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

// Funzione che genera l'HTML per attività expenses
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
        <div class="expense-check"><img src="images/check.svg"></div>
    </li>
    `;
}

// Funzione che aggiunge una attività alla lista
function addExpense() {

    let date = newDate.value;
    let movement = newMovement.value.trim();
    let cash = newCash.value;
    let category = newCategory.value;

    let newExpense = {
        date: date,
        movement: movement,
        cash: cash,
        category: category
    };

    console.log(newExpense);

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
                category: category
             })
        });
        const content = await rawResponse.json();

        console.log(content);
    })();
            
        // Cancella test
        date.value = '';
        movement.value = '';
        cash.value = '';
        category.value = '';

    
}

// Funzione che abilita le checkbox
function activateChecks() {
    // Recupera tutte le checkbox della pagina
    const checks = document.querySelectorAll('.todo-check');
    // Le cicla
    for (let i = 0; i < checks.length; i++) {
        // Ad ogni elemento associa un listener
        checks[i].addEventListener('click', function () {
            // log operazione
            const now = Date.now();
            opLogs.push(now + ' - ' + 'eliminata attività: ' + activities[i]);
            console.log(opLogs[opLogs.length - 1]);
            // Elimina dalla lista
            activities.splice(i, 1);
            // Aggiorna local storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
            // Update della lista
            showContent();
        });
    }
}

// Funzione che elimina tutte le attività pending
function deleteAll() {
    // Chiede conferma all'utente
    const confirm = window.confirm('Sei sicuro di voler eliminare tutte le tue spese?');
    if (confirm) {
        // log operazione
        const now = Date.now();
        opLogs.push(now + ' - ' + 'eliminate tutte le spese');
        console.log(opLogs[opLogs.length - 1]);
        // Procede all'eliminazione
        activities = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        showContent();
    }
}