class ProjectsWindow extends DraggableWindow {
    open(){
        super.open();
        this.projectContainer = this.window.querySelector(".projectContent");
        this.projectsList = this.window.querySelectorAll('.projectsList li');
        this.projectsList.forEach(projectElement => {
            projectElement.addEventListener('click', () => this.selectProject(projectElement));
        });
    }
    
    selectProject(li) {
        this.projectsList.forEach(element => {
            element.removeAttribute("selected");
        });

        li.setAttribute("selected", "true");

        fetch("./windowContent/projects/" + li.id + ".html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            this.projectContainer.innerHTML = data;
            this.projectContainer.scrollTop = 0;
        })
        .catch(error => {
            this.projectContainer.innerHTML = 'Cette page est encore en construction 🤷';
            this.projectContainer.scrollTop = 0;
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
}
