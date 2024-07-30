class DesktopIcon {
    static instances = [];

    constructor(name, icon, window) {
        this.template = document.getElementById('desktopIconTemplate');
        this.el = this.template.content.cloneNode(true).firstElementChild;
        this.iconEl = this.el.querySelector('.icon')
        this.iconEl.src = icon;
        this.nameEl = this.el.querySelector('.name');
        this.nameEl.textContent = name;
        this.window = window;
        this.taskBarIcon = this.window.taskBarIcon;
        this.icon = icon;
        this.offsetX = 0;
        this.offsetY = 0;

        document.body.appendChild(this.el);
        DesktopIcon.instances.push(this);

        this.attachEventListeners();
    }

    static resetAllIconPositions(){
        for (let i = 0; i < DesktopIcon.instances.length; i++){
            let instance = DesktopIcon.instances[i];
            const centerX = Math.floor(i / 11) * instance.el.offsetWidth;
            const centerY = ((i + 1) % 11 - 1) * (instance.el.offsetHeight);
            instance.el.style.transform = `translate(${centerX}px, ${centerY}px)`;
            instance.offsetX = centerX;
            instance.offsetY = centerY;
        }
    }
    
    attachEventListeners() {
        this.iconEl.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        this.iconEl.addEventListener('click', () => {
            this.window.open();
        })
    }

    startDrag(event) {
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.el.classList.add('dragging');
        const transform = window.getComputedStyle(this.el).transform;
    
        if (transform === 'none' || !transform.startsWith('matrix')) {
            this.offsetX = 0;
            this.offsetY = 0;
        } else {
            const translate = transform.match(/matrix\(([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+)\)/);
            if (translate) {
                this.offsetX = parseFloat(translate[5]);
                this.offsetY = parseFloat(translate[6]);
            }
        }
    }

    drag(event) {
        if (!this.el.classList.contains('dragging')) {
            return;
        }
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        const newTransform = `translate(${this.offsetX + dx}px, ${this.offsetY + dy}px)`;
        this.el.style.transform = newTransform;
    }

    endDrag(event) {
        if (!this.el.classList.contains('dragging')) {
            return;
        }
        this.el.classList.remove('dragging');
        
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;

        this.offsetX += dx;
        this.offsetY += dy;

        this.offsetX = Math.round(this.offsetX / this.el.offsetWidth) * this.el.offsetWidth;
        this.offsetY = Math.round(this.offsetY / this.el.offsetHeight) * this.el.offsetHeight;
        const newTransform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
        this.el.style.transform = newTransform;
    }
}

new DesktopIcon("profile.info", "./assets/images/ProfileIcon.svg", new ProfileWindow("profile.txt", "./assets/images/ProfileIcon.svg", "./windowContent/profile.html"));
new DesktopIcon("éducation.tml", "./assets/images/education.svg", new DraggableWindow("éducation.tml", "./assets/images/education.svg", "./windowContent/education.html"));
new DesktopIcon("travail.info", "./assets/images/work.svg", new DraggableWindow("travail.info", "./assets/images/work.svg", "./windowContent/work.html"));
new DesktopIcon("réseaux.con", "./assets/images/connections.svg", new ConnectionsWindow("réseaux.con", "./assets/images/connections.svg", "./windowContent/networks.html"));
new DesktopIcon("projets", "./assets/images/folder.svg", new ProjectsWindow("projets", "./assets/images/folder.svg", "./windowContent/projects.html"));

DesktopIcon.resetAllIconPositions();
window.addEventListener('resize', DesktopIcon.resetAllIconPositions);