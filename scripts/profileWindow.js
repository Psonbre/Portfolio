class ProfileWindow extends DraggableWindow {
    open() {
        super.open();
        this.createRadarChart([
            { name: "C#", value: 75 },
            { name: "Python", value: 60 },
            { name: "JavaScript", value: 75 },
            { name: "C++", value: 50 },
            { name: "CSS", value: 75 },
            { name: "Java", value: 75 },
            { name: "GDScript", value: 95 },
        ]);
    }

    createRadarChart(stats) {
        const numStats = stats.length;
        const angleStep = (2 * Math.PI) / numStats;
        const radius = 37.5;
        const centerX = radius;
        const centerY = radius;
        const svgNS = "http://www.w3.org/2000/svg";
        const duration = 500;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "-12.5 -12.5 100 100");

        function createCircle(cx, cy, r) {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", cy);
            circle.setAttribute("r", r);
            circle.setAttribute("stroke", "#009b00");
            circle.setAttribute("stroke-width", "0.05vh");
            circle.setAttribute("fill", "none");
            return circle;
        }

        svg.appendChild(createCircle(centerX, centerY, radius));
        svg.appendChild(createCircle(centerX, centerY, radius / 1.5));
        svg.appendChild(createCircle(centerX, centerY, radius / 3));

        // Add lines for each stat
        stats.forEach((stat, index) => {
            const angle = angleStep * index;
            const x2 = centerX + radius * Math.cos(angle);
            const y2 = centerY + radius * Math.sin(angle);
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", centerX);
            line.setAttribute("y1", centerY);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("stroke", "#009b00");
            line.setAttribute("stroke-width", "0.05vh");
            svg.appendChild(line);
        });

        const polygon = document.createElementNS(svgNS, "polygon");
        polygon.setAttribute("fill", "lime");
        polygon.setAttribute("fill-opacity", "0.5");
        svg.appendChild(polygon);

        // Add text labels
        stats.forEach((stat, index) => {
            const angle = angleStep * index;
            const x = centerX + (radius + 5) * Math.cos(angle);
            const y = centerY + (radius + 5) * Math.sin(angle);
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", x);
            text.setAttribute("y", y);
            text.setAttribute("font-size", "0.5vh");
            text.setAttribute("fill", "lime");

            if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
                text.setAttribute("text-anchor", "end");
            } else {
                text.setAttribute("text-anchor", "start");
            }

            text.textContent = stat.name;
            svg.appendChild(text);
        });

        document.querySelector(".radarChart").innerHTML = "";
        document.querySelector(".radarChart").appendChild(svg);

        let startTime;

        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const polygonPoints = stats.map((stat, index) => {
                const angle = angleStep * index;
                const value = (stat.value / 100) * radius * progress;
                const x = centerX + value * Math.cos(angle);
                const y = centerY + value * Math.sin(angle);
                return `${x},${y}`;
            });

            polygon.setAttribute("points", polygonPoints.join(" "));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }
}
