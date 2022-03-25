const DOM_SELECTORS = {
  todoListHeader: ".todo-list__header",
  todoListContent: ".todo-list__main",
};

const TODO_HEADER = "My Todo List";
const COMPLETED_ITEM_CLASS = "todo-list-completed";
const INACTIVE_ITEM_CLASS = "todo-list__content__item-inactive";

let todoList = null;

const fetchData = async (path) => {
  let data = await fetch(path)
    .then((res) => res.json())
    .then((json) => json);

  return data;
};

const render = (el, data) => {
  if (data instanceof Array) return el.replaceChildren(...data);

  el.replaceChildren(data);
};

const compareId = (id1, id2) => id1 * 1 === id2 * 1;

const toggleCompletion = (el) => {
  const { target } = el;
  const id = target.id || target.parentElement.id;

  todoList = todoList.map((todoItem) => {
    if (compareId(todoItem.id, id)) {
      return { ...todoItem, completed: !todoItem.completed };
    } else {
      return todoItem;
    }
  });

  //   TODO - Persist data

  renderTodoList(todoList);
};

const createListContent = () => {
  const liNode = document.createElement("li");
  liNode.classList.add("todo-list__content__row");

  return liNode;
};

const createRadioNode = () => {
  const radioNode = document.createElement("input");
  radioNode.type = "radio";
  radioNode.classList.add("todo-list__content__radio");

  return radioNode;
};

const createTodoItem = (inputNode) => {
  if (inputNode.value.length > 0) {
    todoList = todoList.concat({
      userId: 1,
      id: todoList.length,
      title: inputNode.value,
      completed: false,
      deleted: false,
    });

    renderTodoList(todoList);
  }
};

const appendTodoItemOnClick = (el) => {
  const { target } = el;
  const liNode = target.parentElement;
  const inputNode = liNode.childNodes[1];
  createTodoItem(inputNode);
};

const appendTodoItemOnEnter = (el) => {
  if (el.code === "Enter") {
    createTodoItem(el.target);
  }
};

const generateTodoItem = (todoItem) => {
  const { id, title, completed, deleted } = todoItem;

  if (deleted) return;

  const liNode = createListContent();
  liNode.id = id;
  if (completed) liNode.classList.add(COMPLETED_ITEM_CLASS);
  liNode.addEventListener("click", toggleCompletion);

  const radioNode = createRadioNode();
  radioNode.checked = completed;
  radioNode.value = id;

  const itemNode = document.createElement("span");
  itemNode.classList.add("todo-list__content__item");
  itemNode.innerHTML = title;

  liNode.append(radioNode, itemNode);

  return liNode;
};

const activeInput = (el) => {
  const { target } = el;
  target.parentElement.classList.remove(INACTIVE_ITEM_CLASS);
};

const inactiveInput = (el) => {
  const { target } = el;
  target.parentElement.classList.add(INACTIVE_ITEM_CLASS);
};

const createInputNode = () => {
  const liNode = createListContent();
  liNode.classList.add(INACTIVE_ITEM_CLASS);

  const plusNode = document.createElement("i");
  plusNode.classList.add("fa-solid", "fa-plus");
  plusNode.addEventListener("click", appendTodoItemOnClick);

  const inputNode = document.createElement("input");
  inputNode.type = "text";

  inputNode.addEventListener("focus", activeInput);
  inputNode.addEventListener("blur", inactiveInput);
  inputNode.addEventListener("keypress", appendTodoItemOnEnter);

  liNode.append(plusNode, inputNode);

  return liNode;
};

const generateTodoList = (todoList) => {
  let newTodoList = [createInputNode()];

  newTodoList = newTodoList.concat(
    todoList.map((todoItem) => generateTodoItem(todoItem))
  );

  return newTodoList;
};

const renderTodoList = (todoList) => {
  const data = generateTodoList(todoList);
  const el = document.querySelector(DOM_SELECTORS.todoListContent);

  render(el, data);
};

const renderTodoHeader = () => {
  const el = document.querySelector(DOM_SELECTORS.todoListHeader);

  render(el, TODO_HEADER);
};

const init = async () => {
  //   todoList = await fetchData("https://jsonplaceholder.typicode.com/todos");
  todoList = await fetchData("js/data.json");

  renderTodoHeader();
  renderTodoList(todoList);
};

init();
