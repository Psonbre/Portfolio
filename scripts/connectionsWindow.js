class ConnectionsWindow extends DraggableWindow {
    open() {
        super.open();
        startConnectionsAnimation();
    }
    close(){
        super.close()
        stopConnectionsAnimation();
    }
    minimize(){
        super.minimize();
        stopConnectionsAnimation();
    }
}
