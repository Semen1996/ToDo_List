const todoList = document.querySelector('.todo-list');
const taskAddForm = todoList.querySelector('.todo-list__add-form');
const taskAddInput = taskAddForm.querySelector('.todo-list__input');
const listOfTasks = todoList.querySelector('.todo-list__checklist');
const taskTemplate = listOfTasks.querySelector('#todo-list__item').content;
const taskElem = listOfTasks.querySelector('.todo-list__item');
const searchInput = todoList.querySelector('.todo-list__searcher');
const separator = todoList.querySelector('.todo-list__separator');
const editTitle = document.querySelector('.todo-edit__title');
const editText = document.querySelector('.todo-edit__text');
const editSelect = document.querySelector('.todo-edit__status-btn');

const taskSelector = '.todo-list__item';
const itemActiveSelector = '.todo-list__item_active';

let arrTasks = [];
let numberTask = 0;
let pointMouseDown = 0;
let oldWidth = 0;

// Функция вставляет задачу в toDo list
function insertTask(title, text, status, number) {
  const task = addTask(title, text, status, number);
  listOfTasks.prepend(task);
}

// Функция для создание задачи
function addTask(title, text, status, number) {

  const task = taskTemplate.querySelector(taskSelector).cloneNode(true);
  task.querySelector('.todo-list__item-link').textContent = title;
  task.classList.add(`todo-list__item_status_${status}`);
  
  // При нажатие на задачу
  task.addEventListener('click', (e) => {
    let activeTask = document.querySelector(itemActiveSelector);
    if ( activeTask !== null ) {
      activeTask.classList.remove('todo-list__item_active');
    }

    activeTask = e.target.closest(taskSelector);
    activeTask.classList.add('todo-list__item_active');

    const number = activeTask.value;

    if(arrTasks[number] !== undefined) {
      editTitle.value = arrTasks[number].title;
      editText.value = arrTasks[number].text;
      editSelect.value = arrTasks[number].status;
    }
  });

  // Кнопка удаления
  task.querySelector('.todo-list__delete-button').addEventListener('click', (e) => {
    e.target.closest(taskSelector).remove();

    const number = e.target.closest(taskSelector).value;
    arrTasks.splice(number, 1);
    numberTask = numberTask - 1;

    const addTasks = listOfTasks.querySelectorAll(taskSelector);

    addTasks.forEach((task,index) => {
      task.value = addTasks.length - index - 1;
    });
  });

  // Задаем значение в список
  task.value = number;
  return task;
}

// Функция, определяющая изменение ширины по движению мыши
function mouseMove(e) {
  todoList.style.width = oldWidth + ( e.clientX - pointMouseDown) + 'px';
}

// Добавления задачи в список дел при нажатии кнопки
taskAddForm.addEventListener('submit', (e) => {
  e.preventDefault();

  arrTasks.push({
    title: taskAddInput.value,
    text: '',
    status: 'waiting',
    number: numberTask
  });

  insertTask(taskAddInput.value, '', 'waiting', numberTask);
  numberTask = numberTask + 1;

  taskAddForm.reset();
});

// При изменение поля ввода
editTitle.addEventListener('change', (e) => {
  const activeTask = document.querySelector(itemActiveSelector);
  
  if ( activeTask !== null ) {
    activeTask.querySelector('.todo-list__item-link').textContent = e.target.value;
    const number = activeTask.value;
    arrTasks[number].title = e.target.value;
  }
});

editText.addEventListener('change', (e) => {
  const activeTask = document.querySelector(itemActiveSelector);

  if ( activeTask !== null ) {
    const number = activeTask.value;
    arrTasks[number].text = e.target.value;
  }
});

editSelect.addEventListener('change', (e) => {
  const activeTask = document.querySelector(itemActiveSelector);

  if ( activeTask !== null ) {
    const number = activeTask.value;
    const status = e.target.value;

    activeTask.classList.remove(`todo-list__item_status_${arrTasks[number].status}`);
    activeTask.classList.add(`todo-list__item_status_${status}`);

    arrTasks[number].status = status;
  }
});

// Функция поиска нужной задачи 
searchInput.addEventListener('input', (e) => {
  if (e.target.value !== ''){
    const items = document.querySelectorAll(taskSelector);
    
    items.forEach((item) => item.remove());
    
    const foundItems = arrTasks.filter((val) => val.title.startsWith(e.target.value));

    foundItems.forEach((item) => {
      insertTask(item.title, item.text, item.status, item.number);
    });
  } else {
    const items = document.querySelectorAll(taskSelector);
    
    items.forEach((item) => item.remove());
    
    arrTasks.forEach((item) => {
      insertTask(item.title, item.text, item.status, item.number);
    });
  }
});

// Движение границы левого блока
separator.addEventListener('mousedown', (e) => {
  pointMouseDown = e.clientX;
  oldWidth = todoList.offsetWidth;
  window.addEventListener('mousemove', mouseMove);
});

window.addEventListener('mouseup', () => {
  window.removeEventListener('mousemove', mouseMove);
});
  

