const DOM_SELECTORS = {
  todoListHeader: ".todo-list__header",
  todoListContent: ".todo-list__main",
};

const TODO_HEADER = "My Todo List";
const COMPLETED_ITEM_CLASS = "todo-list-completed";

let todoList = null;

const fetchData = async (path) => {
  let data = await fetch(path)
    .then((res) => res.json())
    .then((json) => json);

  return data;
};

const render = (el, data) => {
  if (typeof data === "string") el.replaceChildren(data);
  if (data instanceof Array) el.replaceChildren(...data);
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

const generateTodoItem = (todoItem) => {
  const { id, title, completed, deleted } = todoItem;

  if (deleted) return;

  const liNode = document.createElement("li");
  liNode.id = id;
  liNode.classList.add("todo-list__content__row");
  if (completed) liNode.classList.add(COMPLETED_ITEM_CLASS);
  liNode.addEventListener("click", toggleCompletion);

  const radioNode = document.createElement("input");
  radioNode.type = "radio";
  radioNode.classList.add("todo-list__content__radio");
  radioNode.checked = completed;
  radioNode.value = id;

  const itemNode = document.createElement("span");
  itemNode.classList.add("todo-list__content__item");
  itemNode.innerHTML = title;

  liNode.append(radioNode, itemNode);

  return liNode;
};

const generateTodoList = (todoList) =>
  todoList.map((todoItem) => generateTodoItem(todoItem));

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
