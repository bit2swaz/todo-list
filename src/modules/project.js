const ProjectFactory = (name, color = '#bb86fc') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const createdAt = new Date().toISOString();
    let todos = [];

    return {
        id,
        name,
        color,
        createdAt,

        addTodo(todo) {
            todos.push(todo);
            todos.sort((a, b) => {
                // Sort by completion status first
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                // Then by due date if both have one
                if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                }
                // Put todos without due dates at the end
                if (a.dueDate) return -1;
                if (b.dueDate) return 1;
                // Finally, sort by creation date (id contains timestamp)
                return a.id.localeCompare(b.id);
            });
        },

        removeTodo(todoId) {
            todos = todos.filter(todo => todo.id !== todoId);
        },

        getTodos() {
            return [...todos];
        },

        getTodoById(todoId) {
            return todos.find(todo => todo.id === todoId);
        },

        update(updates) {
            Object.assign(this, updates);
        },

        toJSON() {
            return {
                id: this.id,
                name: this.name,
                color: this.color,
                createdAt: this.createdAt,
                todos: todos.map(todo => todo.toJSON())
            };
        }
    };
};

// Create the default inbox project
const createDefaultProject = () => {
    return ProjectFactory('Inbox', '#bb86fc');
};

export { ProjectFactory, createDefaultProject }; 