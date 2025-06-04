const ProjectUI = {
    createProjectElement(project, isActive, onSelect, onEdit, onDelete) {
        const projectElement = document.createElement('li');
        projectElement.className = `project-item ${isActive ? 'active' : ''} animate-fade-in`;
        projectElement.dataset.id = project.id;

        projectElement.innerHTML = `
            <div class="project-content">
                <span class="project-color" style="background-color: ${project.color}"></span>
                <span class="project-name">${project.name}</span>
                <div class="project-actions">
                    ${project.id !== 'inbox' ? `
                        <button class="project-action-btn edit-btn" title="Edit project">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="project-action-btn delete-btn" title="Delete project">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Event listeners
        projectElement.addEventListener('click', (e) => {
            if (!e.target.closest('.project-action-btn')) {
                onSelect(project);
            }
        });

        if (project.id !== 'inbox') {
            const editBtn = projectElement.querySelector('.edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onEdit(project);
            });

            const deleteBtn = projectElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onDelete(project);
            });
        }

        return projectElement;
    },

    updateProjectList(projectsList, projects, activeProjectId, handlers) {
        projectsList.innerHTML = '';
        const fragment = document.createDocumentFragment();

        projects.forEach(project => {
            const projectElement = this.createProjectElement(
                project,
                project.id === activeProjectId,
                handlers.onSelect,
                handlers.onEdit,
                handlers.onDelete
            );
            fragment.appendChild(projectElement);
        });

        projectsList.appendChild(fragment);
    }
};

export default ProjectUI; 