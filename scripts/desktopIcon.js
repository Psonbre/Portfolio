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
        this.setInitialPosition();
    }

    static resetAllIconPositions(){
        for (let i = 0; i < DesktopIcon.instances.length; i++){
            let instance = DesktopIcon.instances[i];
            const centerX = Math.floor(i / 13) * instance.el.offsetWidth;
            const centerY = ((i + 1) % 13 - 1) * instance.el.offsetHeight;
            instance.el.style.transform = `translate(${centerX}px, ${centerY}px)`;
            instance.offsetX = centerX;
            instance.offsetY = centerY;
        }
    }
    
    attachEventListeners() {
        this.iconEl.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        this.iconEl.addEventListener('dblclick', () => {
            this.window.open();
        })
    }
    
    setInitialPosition() {

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

new DesktopIcon("Profile.txt", "/assets/images/profileIcon.png", new DraggableWindow("profile.txt", "/assets/images/profileIcon.png", "test avec quand même beaucou pde texte qui prend pas mal de place sur la fenêtre"));
new DesktopIcon("Prix.txt", "/assets/images/AwardsIcon.png", new DraggableWindow("Prix.txt", "/assets/images/AwardsIcon.png", '<p>test avec quand même beaucou pde texte qui \n prend pas mal de place sur la feneêtre</p>'));
new DesktopIcon("Scolaire.txt", "/assets/images/scolaire.png", new DraggableWindow("Scolaire.txt", "/assets/images/scolaire.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));
new DesktopIcon("Travail.txt", "/assets/images/travail.png", new DraggableWindow("Experiences de travail.txt", "/assets/images/travail.png", '<img src="/assets/images/scolaire.png">'));

DesktopIcon.resetAllIconPositions();
window.addEventListener('resize', DesktopIcon.resetAllIconPositions);