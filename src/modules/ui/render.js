import TodoUI from './todoUI';
import ProjectUI from './projectUI';
import Modal from './modal';
import Storage from '../storage';
import TodoFactory from '../todo';
import { ProjectFactory } from '../project';

const Render = {
    projects: [],
    activeProjectId: null,
    
    init() {
        // Initialize UI components
        Modal.init();
        
        // Load data from storage
        this.projects = Storage.load();

        // Add initial fade-in animation to app container
        const appContainer = document.querySelector('.app');
        appContainer.style.opacity = '0';
        requestAnimationFrame(() => {
            appContainer.classList.add('fade-in');
            appContainer.style.opacity = '1';
        });

        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
    },

    setupEventListeners() {
        // New Todo button
        const newTodoBtn = document.getElementById('new-todo-btn');
        newTodoBtn.addEventListener('click', () => {
            if (!this.activeProjectId) {
                Modal.showToast('To add a todo, you must first create a project.', 'warning');
                return;
            }

            Modal.open(
                'New Todo',
                Modal.createTodoForm(),
                (data) => {
                    const todo = TodoFactory(
                        data.title,
                        data.description,
                        data.dueDate,
                        data.priority,
                        this.activeProjectId,
                        data.notes,
                        data.checklist || []
                    );
                    this.addTodo(todo);
                }
            );
        });

        // New Project button
        document.getElementById('new-project-btn').addEventListener('click', () => {
            Modal.open(
                'New Project',
                Modal.createProjectForm(),
                (data) => {
                    const project = ProjectFactory(data.name, data.color);
                    this.addProject(project);
                }
            );
        });
    },

    render() {
        this.renderProjects();
        this.renderTodos();
    },

    renderProjects() {
        const projectsList = document.getElementById('projects-list');
        ProjectUI.updateProjectList(
            projectsList,
            this.projects,
            this.activeProjectId,
            {
                onSelect: (project) => {
                    this.activeProjectId = project.id;
                    document.getElementById('current-project-title').textContent = project.name;
                    this.renderTodos();
                },
                onEdit: (project) => {
                    Modal.open(
                        'Edit Project',
                        Modal.createProjectForm(project),
                        (data) => {
                            project.update(data);
                            this.saveAndRender();
                        }
                    );
                },
                onDelete: (project) => {
                    Modal.showConfirm(
                        'Delete Project',
                        `Are you sure you want to delete project "${project.name}" and all its todos?`,
                        () => {
                            this.deleteProject(project.id);
                        }
                    );
                }
            }
        );
    },

    renderTodos() {
        const todosContainer = document.getElementById('todos-container');
        const currentProjectTitle = document.getElementById('current-project-title');
        
        // Clear containers
        todosContainer.innerHTML = '';
        currentProjectTitle.textContent = this.activeProjectId ? 
            this.projects.find(p => p.id === this.activeProjectId).name : 
            'Welcome';

        // Show empty state if no projects
        if (this.projects.length === 0) {
            todosContainer.innerHTML = `
                <div class="empty-state animate-fade-in">
                    <h3>Welcome to Your Todo List!</h3>
                    <p>To add a todo list, first create a project from the sidebar.</p>
                </div>
            `;
            return;
        }

        // Show project selection message if no project is selected
        if (!this.activeProjectId) {
            todosContainer.innerHTML = `
                <div class="empty-state animate-fade-in">
                    <p>Select a project from the sidebar to view or add todos.</p>
                </div>
            `;
            return;
        }

        const activeProject = this.projects.find(p => p.id === this.activeProjectId);
        if (!activeProject) return;

        // Show empty project state
        if (activeProject.getTodos().length === 0) {
            todosContainer.innerHTML = `
                <div class="empty-state animate-fade-in">
                    <p>This project is empty. Click the "New Todo" button to add your first todo!</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();
        activeProject.getTodos().forEach(todo => {
            const todoElement = TodoUI.createTodoElement(
                todo,
                // Toggle handler
                (todo) => {
                    todo.toggleComplete();
                    this.saveAndRender();
                },
                // Edit handler
                (todo) => {
                    Modal.open(
                        'Edit Todo',
                        Modal.createTodoForm(todo),
                        (data) => {
                            todo.update({
                                ...data,
                                projectId: this.activeProjectId
                            });
                            this.saveAndRender();
                        }
                    );
                },
                // Delete handler
                (todo) => {
                    Modal.showConfirm(
                        'Delete Todo',
                        'Are you sure you want to delete this todo?',
                        () => {
                            activeProject.removeTodo(todo.id);
                            this.saveAndRender();
                        }
                    );
                }
            );

            TodoUI.attachChecklistHandlers(todoElement, todo);
            fragment.appendChild(todoElement);
        });

        todosContainer.appendChild(fragment);
    },

    addTodo(todo) {
        const project = this.projects.find(p => p.id === todo.projectId);
        if (project) {
            project.addTodo(todo);
            this.saveAndRender();
            Modal.showToast('Todo added successfully!', 'success');
        }
    },

    addProject(project) {
        this.projects.push(project);
        this.activeProjectId = project.id;
        this.saveAndRender();
        Modal.showToast('Project created successfully!', 'success');
    },

    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.activeProjectId === projectId) {
            this.activeProjectId = this.projects.length > 0 ? this.projects[0].id : null;
        }
        this.saveAndRender();
        Modal.showToast('Project deleted successfully!', 'success');
    },

    saveAndRender() {
        Storage.save(this.projects);
        this.render();
    }
};

export default Render; 