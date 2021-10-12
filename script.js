(function () {

    class Todo {
        constructor() {
            this.filterTodoInput = document.getElementById("filterTodoInput");
            this.hideCompletedCheckEl = document.getElementById("hideCompleted");
            this.todosLeft = document.getElementById("todos-left");
            this.todoContainer = document.querySelector(".todos");
            this.newTodoInput = document.getElementById("newTodo");
            this.submitTodo = document.querySelector(".submit-btn");
            this.noOfInput = 0;
            this.totalTodos = 0;
            this.finishedTodos = [];
            this.todoStorage = [];
            this.indexCounter = 0;
            this.totalTodosStorageCounter = 0;
        }

        validate() {
            let inputValue = this.newTodoInput.value;
            let isValid = false;
            if (inputValue == "") {
                alert("please provide an input");
            } else {
                isValid = true;
            }
            return isValid;
        }

        createTodo() {
            let validated = this.validate();
            let inputValue = this.newTodoInput.value;
            let initialLetter = inputValue.charAt(0);
            let remainingChars = inputValue.substr(1);

            inputValue = initialLetter.toUpperCase() + remainingChars;

            if (validated) {
                this.todoContainer.insertAdjacentHTML('beforeend', `<div class="todo" data-index = "${this.indexCounter}" ><input type="checkbox" class="todoCheckbox"><p class="todo-content">${inputValue}</p> <span class="remove">remove</span></div>`);

                this.totalTodos++;

                this.addEventListenters(inputValue);

                this.setStorage({ content: inputValue, crossed: false, totalTodos: this.totalTodos });

                this.newTodoInput.value = "";

                this.updateTodosLeft();
                this.indexCounter++;
            }
        }

        addEventListenters(inputValue) {
            let self = this;
            let todoCheckbox = document.querySelectorAll(".todo input");
            let removeEl = document.querySelectorAll(".remove");

            for (let i = 0; i < todoCheckbox.length; i++) {

                if (todoCheckbox[i].nextElementSibling.textContent == inputValue) {

                    todoCheckbox[i].addEventListener("click", checked, false);
                    removeEl[i].addEventListener("click", removeTodo, false);
                }

            }
            function removeTodo() {
                let todoToDelete = this.parentElement;
                self.totalTodos--;

                todoToDelete.parentElement.removeChild(todoToDelete);
                delete self.todoStorage[parseInt(this.parentElement.getAttribute("data-index"))];

                self.todoStorage = self.todoStorage.filter(element => element !== null);

                refreshTotalTodos();
                self.updateStorage();
                self.updateTodosLeft();
            }

            function refreshTotalTodos() {
                self.totalTodosStorageCounter = 0;
                self.todoStorage.forEach(todoItemStored => {
                    self.totalTodosStorageCounter++;
                    todoItemStored.totalTodos = self.totalTodosStorageCounter;
                });
            }

            function checked() {
                this.nextElementSibling.classList.toggle("cross");

                self.checkFinishedTodos();
            }
        }

        checkFinishedTodos() {
            let self = this;
            this.finishedTodos = [];
            let completedTodos = document.querySelectorAll(".cross");
            let checkedInputs = document.querySelectorAll(".todoCheckbox");

            checkedInputs.forEach((checkedInput, index) => {
                if (checkedInput.checked) {
                    self.todoStorage[index].crossed = true;
                } else {
                    self.todoStorage[index].crossed = false;
                }
            });

            completedTodos.forEach(completedTodo => {
                let todoItem = completedTodo.parentElement;
                this.finishedTodos.push(todoItem);
            });

            this.clearStorage();
            this.updateStorage();

            this.updateTodosLeft();
        }

        updateTodosLeft() {
            let todosLeft = this.totalTodos - this.finishedTodos.length;
            if (todosLeft < 0) {
                this.todosLeft.textContent = "0";
                console.log("executed");
            } else {
                this.todosLeft.textContent = todosLeft.toString();
            }
        }

        hideCompletedTodos() {
            let todoItems = document.querySelectorAll(".todo");
            let unfinishedTodoItems = [];

            todoItems.forEach(todoItem => {
                if (!todoItem.lastElementChild.previousElementSibling.classList.contains("cross")) {
                    unfinishedTodoItems.push(true);
                }
            });

            if (this.todoContainer.textContent.trim() === "") {
                alert("Create a new to-do item. \n Tip: \n Create a new Todo List by typing in your required task for the day in \n the input box.");
                this.hideCompletedCheckEl.checked = false;
            } else if (unfinishedTodoItems.length == todoItems.length) {
                alert("You have no unfinished task today");
                this.hideCompletedCheckEl.checked = false;
            }
            else {
                this.finishedTodos.forEach(finishedTodo => {
                    finishedTodo.classList.toggle("remove");
                });
            }

        }

        filterTodos() {
            let userInput = this.filterTodoInput.value.trim().toLowerCase();
            let todoItems = document.querySelectorAll(".todo");
            let initialLetterCap = userInput.charAt(0);

            this.noOfInput++;

            if(userInput.length == 0){
                this.noOfInput = 0;
            }

            if (this.noOfInput == 1){
                initialLetterCap = initialLetterCap.toUpperCase();
                this.filterTodoInput.value = initialLetterCap;
            }

            todoItems.forEach(todoItem => {
                if (todoItem.lastElementChild.previousElementSibling.textContent.includes(this.filterTodoInput.value)) {
                    todoItem.classList.remove("remove");
                } else {
                    todoItem.classList.remove("remove");
                    todoItem.classList.add("remove");
                }
            });
        }

        setStorage(todoInfo) {
            this.todoStorage.push(todoInfo);

            let storage = JSON.stringify(this.todoStorage);

            localStorage.setItem("todoStorage", storage);
        }

        clearStorage() {
            localStorage.clear();
        }

        updateStorage() {
            let todoStorage = this.todoStorage;

            localStorage.setItem("todoStorage", JSON.stringify(todoStorage));
        }

        getStorage() {
            let self = this;
            let storage = localStorage.getItem("todoStorage");
            let todosChecked = [];
            let todosFinished = [];
            if (storage == undefined || storage == null) return

            let todoItems = JSON.parse(storage);

            this.todoStorage = todoItems;


            todoItems.forEach(todoItem => {
                if (todoItem.crossed == false) {
                    todosChecked.push(todoItem.crossed);
                    this.todoContainer.insertAdjacentHTML('beforeend', `<div class="todo" data-index = ${this.indexCounter}><input type="checkbox" class="todoCheckbox"><p class="todo-content">${todoItem.content}</p> <span class="remove">remove</span></div>`);
                    this.indexCounter++;
                } else {
                    todosChecked.push(todoItem.crossed);
                    this.todoContainer.insertAdjacentHTML('beforeend', `<div class="todo" data-index = ${this.indexCounter}><input type="checkbox" class="todoCheckbox"><p class="todo-content cross">${todoItem.content}</p> <span class="remove">remove</span></div>`);
                    this.indexCounter++;
                }
            });

            syncCheckboxesInStorage();
            syncFinishedTodosInStorage();

            function syncCheckboxesInStorage() {
                let checkboxes = document.querySelectorAll(".todoCheckbox");

                checkboxes.forEach((checkbox, index) => {
                    checkbox.checked = todosChecked[index];
                });
            }


            function syncFinishedTodosInStorage() {
                let todos = document.querySelectorAll(".todo");
                todosChecked.forEach((checkedTodo, index) => {
                    if (checkedTodo) {
                        todosFinished.push(todos[index]);
                    } else {
                    }
                });
            }

            if (todoItems.length == 0) return
            else this.totalTodos = todoItems[todoItems.length - 1].totalTodos;


            todoItems.forEach(storedTodoItem => {
                self.addEventListenters(storedTodoItem.content)
            });

            this.finishedTodos = todosFinished;
            this.updateTodosLeft();
        }
    }


    let app = new Todo();

    app.getStorage();

    let formEl = document.getElementById("formEl");
    let hideCompletedCheckEl = document.getElementById("hideCompleted");
    let filterTodoInput = document.getElementById("filterTodoInput");

    function addEventListenters() {
        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            app.createTodo();
        }, false);

        hideCompletedCheckEl.addEventListener("click", app.hideCompletedTodos.bind(app), false);
        filterTodoInput.addEventListener("keyup", app.filterTodos.bind(app));

    }

    addEventListenters();
}());
