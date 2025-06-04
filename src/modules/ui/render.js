import TodoUI from './todoUI';
import ProjectUI from './projectUI';
import Modal from './modal';
import Storage from '../storage';
import TodoFactory from '../todo';
import { ProjectFactory } from '../project';

const Render = {
    projects: [],
    activeProjectId: 'inbox',
    
    init() {
        // Initialize UI components
        Modal.init();
        
        // Load data from storage
        this.projects = Storage.load();
        this.activeProjectId = 'inbox';

        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
    },

    setupEventListeners() {
        // New Todo button
        document.getElementById('new-todo-btn').addEventListener('click', () => {
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
                    if (confirm(`Are you sure you want to delete project "${project.name}" and all its todos?`)) {
                        this.deleteProject(project.id);
                    }
                }
            }
        );
    },

    renderTodos() {
        const todosContainer = document.getElementById('todos-container');
        todosContainer.innerHTML = '';
        const activeProject = this.projects.find(p => p.id === this.activeProjectId);
        
        if (!activeProject) return;

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
                    if (confirm('Are you sure you want to delete this todo?')) {
                        activeProject.removeTodo(todo.id);
                        this.saveAndRender();
                    }
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
        }
    },

    addProject(project) {
        this.projects.push(project);
        this.activeProjectId = project.id;
        this.saveAndRender();
    },

    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.activeProjectId === projectId) {
            this.activeProjectId = 'inbox';
        }
        this.saveAndRender();
    },

    saveAndRender() {
        Storage.save(this.projects);
        this.render();
    }
};

export default Render; 