const ProjectUI = {
    createProjectElement(project, isActive, onSelect, onEdit, onDelete) {
        const projectElement = document.createElement('li');
        projectElement.className = `project-item ${isActive ? 'active' : ''} animate-fade-in`;
        projectElement.dataset.id = project.id;

        projectElement.innerHTML = `
            <div class="project-content">
                <div class="project-info">
                    <span class="project-color" style="background-color: ${project.color}"></span>
                    <span class="project-name">${project.name}</span>
                </div>
                ${project.id !== 'inbox' ? `
                    <div class="project-actions">
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
                    </div>
                ` : ''}
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .project-item {
                margin-bottom: var(--spacing-xs);
                border-radius: 4px;
                transition: background-color var(--transition-fast);
            }

            .project-item:hover {
                background-color: var(--bg-tertiary);
            }

            .project-item.active {
                background-color: color-mix(in srgb, var(--accent-primary) 15%, transparent);
            }

            .project-content {
                padding: var(--spacing-sm) var(--spacing-md);
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
            }

            .project-info {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                flex-grow: 1;
            }

            .project-color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
            }

            .project-name {
                color: var(--text-primary);
                font-size: 0.95rem;
                transition: color var(--transition-fast);
            }

            .project-item:hover .project-name {
                color: var(--accent-primary);
            }

            .project-actions {
                display: flex;
                gap: var(--spacing-xs);
                opacity: 0;
                transition: opacity var(--transition-fast);
            }

            .project-item:hover .project-actions {
                opacity: 1;
            }

            .project-action-btn {
                background: transparent;
                border: none;
                color: var(--text-secondary);
                padding: var(--spacing-xs);
                cursor: pointer;
                border-radius: 4px;
                transition: all var(--transition-fast);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .project-action-btn:hover {
                color: var(--text-primary);
                background-color: var(--bg-tertiary);
            }

            .project-action-btn.delete-btn:hover {
                color: var(--error);
            }
        `;
        document.head.appendChild(style);

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