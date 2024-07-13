class ProjectsWindow extends DraggableWindow {
    open(){
        super.open()
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

        fetch("./windowContent/projects/"+li.id+".html")
        .then(response => response.text())
        .then(data => {
            this.projectContainer.innerHTML = data;
        });
    }
}
