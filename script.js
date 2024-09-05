const btnAdd = document.getElementById('btnAdd');
const inputText = document.querySelector('input');
const expensesList = document.getElementById('expenses-list');
const emptyListMsg = document.querySelector('.empty-list-msg');
const btnDeleteAll = document.getElementById('btnDeleteAll');

btnAdd.addEventListener('click', addActivity);
inputText.addEventListener('keypress', function (event) {
    if (event.key == "Enter") {
        addActivity();
    }
});

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
function addActivity() {
    // Recupera testo inserito
    let text = inputText.value.trim();
    // Se il testo non è vuoto
    if (text.length > 0) {
        // log operazione
        const now = Date.now();
        opLogs.push(now + ' - ' + 'aggiunta nuova attività: ' + text);
        console.log(opLogs[opLogs.length - 1]);
        // Aggiungiamo all'array
        activities.push(text);
        // Aggiungiamo al local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
        // Update della schermata
        showContent();
        // Cancella test
        inputText.value = '';

    }
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













// Struttura appoggio log operazioni
let opLogs = [];
// Recupera dai dal local storage
const STORAGE_KEY = 'todo-key';
let activities = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// Funzione che aggiorna il contenuto della lista
function showContent() {

    // Pulisce la lista
    expensesList.innerHTML = '';
    // Se la lista è vuota
    if (expenses.length == 0) {
        // Mostra msg lista vuota e nasconde pulsante deleteAll
        emptyListMsg.style.display = 'block';
        btnDeleteAll.style.visibility = 'hidden';
    } else { // Altrimenti
        // Nasconde msg lista vuota e mostra pulsante deleteAll
        emptyListMsg.style.display = 'none';
        btnDeleteAll.style.visibility = 'visible';
        // Cicliamo gli elementi dell'array
        for (let i = 0; i < expenses.length; i++) {
            const template = buildTemplateHTML(expenses[i]);
            expensesList.innerHTML += template;
        }
        // Rende cliccabili le checkbox
        activateChecks();
    }
}