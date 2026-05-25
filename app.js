let tasks = [];


let taskInput;
let taskList;
let taskCountSpan;


function init() {

    loadFromLocalStorage();
    
    const container = document.createElement('div');
    container.className = 'todo-container';
    
    const header = document.createElement('header');
    header.className = 'todo-header';

    const h1 = document.createElement('h1');
    h1.textContent = 'TaskFlow';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Organize seu dia com foco e elegância.';

    header.appendChild(h1);
    header.appendChild(subtitle);


    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.className = 'task-input';
    taskInput.placeholder = 'O que você precisa realizar hoje?';
    taskInput.maxLength = 100;
    taskInput.autocomplete = 'off';

    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.innerHTML = `<span>+</span> Adicionar`;

    inputGroup.appendChild(taskInput);
    inputGroup.appendChild(addBtn);


    taskList = document.createElement('ul');
    taskList.className = 'task-list';


    const footer = document.createElement('footer');
    footer.className = 'todo-footer';

    taskCountSpan = document.createElement('span');
    taskCountSpan.className = 'task-count';
    taskCountSpan.textContent = '0 tarefas';

    const clearCompletedBtn = document.createElement('button');
    clearCompletedBtn.className = 'clear-completed';
    clearCompletedBtn.textContent = 'Limpar concluídas';

    footer.appendChild(taskCountSpan);
    footer.appendChild(clearCompletedBtn);


    container.appendChild(header);
    container.appendChild(inputGroup);
    container.appendChild(taskList);
    container.appendChild(footer);

    document.body.appendChild(container);


    addBtn.addEventListener('click', handleAddTask);


    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleAddTask();
        }
    });


    clearCompletedBtn.addEventListener('click', handleClearCompleted);


    taskInput.focus();


    renderList();
}


function renderList() {

    taskList.innerHTML = '';


    if (tasks.length === 0) {
        renderEmptyState();
        updateFooterInfo();
        return;
    }

 
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

  
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';


        const customCheckbox = document.createElement('div');
        customCheckbox.className = 'custom-checkbox';


        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        taskContent.appendChild(customCheckbox);
        taskContent.appendChild(taskText);


        taskContent.addEventListener('click', () => {
            toggleTaskCompleted(task.id);
        });


        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = 'Excluir tarefa';

        deleteBtn.addEventListener('click', (event) => {

            event.stopPropagation();


            li.classList.add('removing');


            setTimeout(() => {
                removeTask(task.id);
            }, 250);
        });

        // Montar a LI
        li.appendChild(taskContent);
        li.appendChild(deleteBtn);


        taskList.appendChild(li);
    });


    updateFooterInfo();
}


function renderEmptyState() {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';

    const icon = document.createElement('div');
    icon.className = 'empty-state-icon';
    icon.textContent = '✨';

    const text = document.createElement('p');
    text.textContent = 'Nenhuma tarefa ativa por aqui. Crie uma para começar!';

    emptyDiv.appendChild(icon);
    emptyDiv.appendChild(text);

    taskList.appendChild(emptyDiv);
}


function handleAddTask() {
    const text = taskInput.value.trim();


    if (!text) {
       
        taskInput.style.borderColor = 'var(--danger-color)';
        setTimeout(() => {
            taskInput.style.borderColor = '';
        }, 1000);
        return;
    }


    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };


    tasks.push(newTask);


    taskInput.value = '';


    saveToLocalStorage();


    renderList();
}


function removeTask(id) {

    tasks = tasks.filter(task => task.id !== id);


    saveToLocalStorage();


    renderList();
}


function toggleTaskCompleted(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });


    saveToLocalStorage();


    renderList();
}


function handleClearCompleted() {

    tasks = tasks.filter(task => !task.completed);


    saveToLocalStorage();

    renderList();
}


function updateFooterInfo() {
    const pendingCount = tasks.filter(task => !task.completed).length;

    if (pendingCount === 1) {
        taskCountSpan.textContent = '1 tarefa pendente';
    } else {
        taskCountSpan.textContent = `${pendingCount} tarefas pendentes`;
    }
}


function saveToLocalStorage() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
    }
}


function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem('tasks');
        if (stored) {
            tasks = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Erro ao ler dados do localStorage:', error);
        tasks = []; 
    }
}


document.addEventListener('DOMContentLoaded', init);
