import TodoFactory from './todo';
import { ProjectFactory } from './project';

const STORAGE_KEY = 'todoApp';

const Storage = {
    save(projects) {
        try {
            const data = projects.map(project => project.toJSON());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                return [];
            }

            return JSON.parse(data).map(projectData => {
                const project = ProjectFactory(projectData.name, projectData.color);
                project.id = projectData.id;
                
                // Reconstruct todos
                projectData.todos.forEach(todoData => {
                    const todo = TodoFactory(
                        todoData.title,
                        todoData.description,
                        todoData.dueDate,
                        todoData.priority,
                        todoData.projectId,
                        todoData.notes,
                        todoData.checklist.map(item => item.text)
                    );
                    todo.id = todoData.id;
                    todo.completed = todoData.completed;
                    
                    // Restore checklist completion status
                    todoData.checklist.forEach((item, index) => {
                        if (item.completed) {
                            todo.toggleChecklistItem(todo.getChecklist()[index].id);
                        }
                    });

                    project.addTodo(todo);
                });

                return project;
            });
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return [];
        }
    },

    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

export default Storage; 