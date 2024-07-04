const { query } = require('express');
const dbQuery = require('./db-query').dbQuery;
const bcrypt = require('bcrypt');


module.exports = class SessionPersistence {
  constructor(session) {
    // this._todoLists = session.todoLists || deepCopy(SeedData);
    // session.todoLists = this._todoLists;
    this.username = session.username;
  }

  // Mark all todos on the todo list as done. Returns `true` on success,
  // `false` if the todo list doesn't exist. The todo list ID must be numeric.
  async completeAllTodos(todoListId) {
    // let todoList = this._findTodoList(todoListId);
    // if (!todoList) return false;

    // todoList.todos.filter(todo => !todo.done)
    //               .forEach(todo => (todo.done = true));
    // return true;
    const COMPLETE_ALL = 'UPDATE todos SET done = true WHERE todolist_id = $1 AND username = $2';

    const result = await dbQuery(COMPLETE_ALL, todoListId, this.username);
    return result.rowCount > 0;
  }

  // Create a new todo with the specified title and add it to the indicated todo
  // list. Returns `true` on success, `false` on failure.
  async createTodo(todoListId, title) {
    // let todoList = this._findTodoList(todoListId);
    // if (!todoList) return false;

    // todoList.todos.push({
    //   title,
    //   id: nextId(),
    //   done: false,
    // });

    // return true;
    const CREATE_TODO = 'INSERT INTO todos (todolist_id, title, username) values ($1, $2, $3)';

    const result = await dbQuery(CREATE_TODO, todoListId, title, this.username);
    return result.rowCount > 0;
  }

  // Create a new todo list with the specified title and add it to the list of
  // todo lists. Returns `true` on success, `false` on failure. (At this time,
  // there are no known failure conditions.)
  async createTodoList(title) {
    const ADD_TODOLIST   = 'INSERT INTO todolists (title, username) VALUES ($1, $2)';

    const result = await dbQuery(ADD_TODOLIST, title, this.username);
    return result.rowCount > 0;
  }

  // Delete the specified todo from the specified todo list. Returns `true` on
  // success, `false` if the todo or todo list doesn't exist. The id arguments
  // must both be numeric.
  async deleteTodo(todoListId, todoId) {
    const DELETE_TODO = 'DELETE FROM todos WHERE todolist_id = $1 AND id = $2 AND username = $3';

    const result = await dbQuery(DELETE_TODO, todoListId, todoId, this.username);
    return result.rowCount > 0;
  }

  // Delete a todo list from the list of todo lists. Returns `true` on success,
  // `false` if the todo list doesn't exist. The ID argument must be numeric.
  async deleteTodoList(todoListId) {
    const DELETE_TODO = 'DELETE FROM todolists WHERE id = $1 AND username = $2';

    const result = await dbQuery(DELETE_TODO, todoListId, this.username);
    return result.rowCount > 0;

  }

  // Returns `true` if a todo list with the specified title exists in the list
  // of todo lists, `false` otherwise.
  async existsTodoListTitle(title) {
    const FIND_TODOLIST = 'SELECT * FROM todolists WHERE title = $1 AND username = $2';

    const result = await dbQuery(FIND_TODOLIST, title, this.username);
    return result.rowCount > 0;
  }

  // Does the todo list have any undone todos? Returns true if yes, false if no.
  hasUndoneTodos(todoList) {
    return todoList.todos.some(todo => !todo.done);
  }

  // Are all of the todos in the todo list done? If the todo list has at least
  // one todo and all of its todos are marked as done, then the todo list is
  // done. Otherwise, it is undone.
  isDoneTodoList(todoList) {
    return todoList.todos.length > 0 && todoList.todos.every(todo => todo.done);
  }

  // Returns a copy of the indicated todo in the indicated todo list. Returns
  // `undefined` if either the todo list or the todo is not found. Note that
  // both IDs must be numeric.
  async loadTodo(todoListId, todoId) {
    const FIND_TODO = 'SELECT * FROM todos WHERE todolist_id = $1 AND id = $2 AND username = $3';

    const result = await dbQuery(FIND_TODO, todoListId, todoId, this.username);
    return result.rows[0];
  }

  // Returns a copy of the todo list with the indicated ID. Returns `undefined`
  // if not found. Note that `todoListId` must be numeric.
  async loadTodoList(todoListId) {
    const FIND_TODOLIST = 'SELECT * FROM todolists WHERE id = $1 AND username = $2';
    const FIND_TODOS = 'SELECT * FROM todos WHERE todolist_id = $1 AND username = $2';

    const result = await dbQuery(FIND_TODOLIST, todoListId, this.username);
    const todoList = result.rows[0];

    console.log(result);

    if (todoList) {
      const result = await dbQuery(FIND_TODOS, todoList.id, this.username);
      todoList.todos = result.rows;
      console.log(todoList);
    }

    return todoList;
  }

  // Set a new title for the specified todo list. Returns `true` on success,
  // `false` if the todo list isn't found. The todo list ID must be numeric.
  async setTodoListTitle(todoListId, title) {
    const UPDATE_TODOLIST = 'UPDATE todolists SET title = $2 WHERE id = $1 AND username = $3';

    const result = await dbQuery(UPDATE_TODOLIST, todoListId, title, this.username);
    return result.rowCount > 0;
  }

  // Return the list of todo lists sorted by completion status and title (case-
  // insensitive).
  async sortedTodoLists() {
    const ALL_TODOLISTS = 'SELECT * FROM todolists WHERE username = $1 ORDER BY lower(title) ASC';
    const FIND_TODOS = 'SELECT * FROM todos WHERE todolist_id = $1';

    const result = await dbQuery(ALL_TODOLISTS, this.username);
    const todoLists = result.rows;

    for (let index = 0; index < todoLists.length; index++) {
      const todoList = todoLists[index];
      let todos = await dbQuery(FIND_TODOS, todoList.id);
      todoList.todos = todos.rows;
    }

    return this._partitionTodoLists(todoLists);
  }

  _partitionTodoLists(todoLists) {
    const undone = [];
    const done = [];

    todoLists.forEach(todoList => {
      if (this.isDoneTodoList(todoList)) {
        done.push(todoList);
      } else {
        undone.push(todoList);
      }
    });

    return undone.concat(done);
  }

  // Returns a copy of the list of todos in the indicated todo list by sorted by
  // completion status and title (case-insensitive).
  async sortedTodos(todoList) {
    const FIND_TODOS = 'SELECT * FROM todos WHERE todolist_id = $1 AND username = $2 ORDER BY done ASC, LOWER(title) ASC';

    const result = await dbQuery(FIND_TODOS, todoList.id, this.username);

    return result.rows;
  }

  // Toggle a todo between the done and not done state. Returns `true` on
  // success, `false` if the todo or todo list doesn't exist. The id arguments
  // must both be numeric.
  async toggleDoneTodo(todoListId, todoId) {
    const TOGGLE_DONE = 'UPDATE todos SET done = NOT done WHERE todolist_id = $1 AND id = $2 AND username = $3';

    let result = await dbQuery(TOGGLE_DONE, todoListId, todoId, this.username);
    return result.rowCount > 0;
  }

  async authenticateUser(username, password) {
    const CHECK_USER = 'SELECT * FROM users WHERE username = $1';

    const result = await dbQuery(CHECK_USER, username);
    if (result.rowCount === 0) return false;

    return bcrypt.compare(password, result.rows[0].password);
  }
};
