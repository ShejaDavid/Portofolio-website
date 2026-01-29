// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.getElementById('themeToggle');
const backToTopBtn = document.getElementById('backToTop');

// ===== Typewriter Effect for Roles =====
const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Data Science Enthusiast',
    
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const roleText = document.querySelector('.role-text');
    if (!roleText) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        roleText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next
    }
    
    setTimeout(typeWriter, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    const roleText = document.querySelector('.role-text');
    if (roleText) {
        roleText.textContent = '';
        setTimeout(typeWriter, 1000);
    }
});

// ===== Three.js 3D Section Backgrounds =====
function create3DBackground(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;
    
    const section = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = config.particleCount || 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 15;
        posArray[i + 1] = (Math.random() - 0.5) * 15;
        posArray[i + 2] = (Math.random() - 0.5) * 8;
        
        const t = Math.random();
        colorsArray[i] = config.color1.r + t * (config.color2.r - config.color1.r);
        colorsArray[i + 1] = config.color1.g + t * (config.color2.g - config.color1.g);
        colorsArray[i + 2] = config.color1.b + t * (config.color2.b - config.color1.b);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: config.particleSize || 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    const shapes = [];
    const geometries = [
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.OctahedronGeometry(0.4, 0),
        new THREE.TetrahedronGeometry(0.5, 0),
        new THREE.TorusGeometry(0.3, 0.1, 8, 16)
    ];
    
    for (let i = 0; i < 8; i++) {
        const geometry = geometries[i % geometries.length];
        const material = new THREE.MeshBasicMaterial({
            color: config.shapeColors[i % config.shapeColors.length],
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const shape = new THREE.Mesh(geometry, material);
        
        shape.position.x = (Math.random() - 0.5) * 10;
        shape.position.y = (Math.random() - 0.5) * 6;
        shape.position.z = (Math.random() - 0.5) * 4 - 2;
        
        shape.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015
            },
            floatSpeed: Math.random() * 0.5 + 0.3,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        shapes.push(shape);
        scene.add(shape);
    }
    
    camera.position.z = 5;
    
    let mouseX = 0, mouseY = 0;
    
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        particlesMesh.rotation.x = elapsedTime * 0.05 + mouseY * 0.3;
        particlesMesh.rotation.y = elapsedTime * 0.08 + mouseX * 0.3;
        
        shapes.forEach((shape) => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            shape.position.y += Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.002;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = section.offsetWidth / section.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(section.offsetWidth, section.offsetHeight);
    });
    resizeObserver.observe(section);
}

// ===== CONSTELLATION NETWORK - About Section =====
function createConstellationNetwork(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;
    
    const section = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const nodesCount = 80;
    const nodes = [];
    const nodesGeometry = new THREE.BufferGeometry();
    const nodesPositions = new Float32Array(nodesCount * 3);
    
    for (let i = 0; i < nodesCount; i++) {
        const node = {
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 5 - 2,
            vx: (Math.random() - 0.5) * 0.01,
            vy: (Math.random() - 0.5) * 0.01,
            vz: (Math.random() - 0.5) * 0.005
        };
        nodes.push(node);
        nodesPositions[i * 3] = node.x;
        nodesPositions[i * 3 + 1] = node.y;
        nodesPositions[i * 3 + 2] = node.z;
    }
    
    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodesPositions, 3));
    const nodesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const nodesMesh = new THREE.Points(nodesGeometry, nodesMaterial);
    scene.add(nodesMesh);
    
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    let linesGeometry = new THREE.BufferGeometry();
    let linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);
    
    camera.position.z = 6;
    
    let mouseX = 0, mouseY = 0;
    
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    function updateConnections() {
        const linePositions = [];
        const connectionDistance = 2.5;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dz = nodes[i].z - nodes[j].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < connectionDistance) {
                    linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
                    linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
                }
            }
        }
        
        linesGeometry.dispose();
        linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesMesh.geometry = linesGeometry;
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].x += nodes[i].vx;
            nodes[i].y += nodes[i].vy;
            nodes[i].z += nodes[i].vz;
            
            if (Math.abs(nodes[i].x) > 7.5) nodes[i].vx *= -1;
            if (Math.abs(nodes[i].y) > 5) nodes[i].vy *= -1;
            if (Math.abs(nodes[i].z) > 2.5) nodes[i].vz *= -1;
            
            nodesPositions[i * 3] = nodes[i].x;
            nodesPositions[i * 3 + 1] = nodes[i].y;
            nodesPositions[i * 3 + 2] = nodes[i].z;
        }
        
        nodesGeometry.attributes.position.needsUpdate = true;
        updateConnections();
        
        camera.position.x = mouseX * 0.5;
        camera.position.y = mouseY * 0.3;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = section.offsetWidth / section.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(section.offsetWidth, section.offsetHeight);
    });
    resizeObserver.observe(section);
}

// ===== CODE RAIN - Contact Section =====
function createCodeRain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;
    
    const section = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const particlesCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 20;
        posArray[i * 3 + 1] = Math.random() * 15 - 7.5;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
        velocities[i] = Math.random() * 0.02 + 0.01;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    const linesGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePoints = [
            new THREE.Vector3(-10, (Math.random() - 0.5) * 10, -3),
            new THREE.Vector3(10, (Math.random() - 0.5) * 10, -3)
        ];
        lineGeometry.setFromPoints(linePoints);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.1
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData.speed = Math.random() * 0.005 + 0.002;
        linesGroup.add(line);
    }
    scene.add(linesGroup);
    
    camera.position.z = 6;
    
    let mouseX = 0, mouseY = 0;
    
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        
        const positions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 1] -= velocities[i];
            if (positions[i * 3 + 1] < -7.5) {
                positions[i * 3 + 1] = 7.5;
                positions[i * 3] = (Math.random() - 0.5) * 20;
            }
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
        
        linesGroup.children.forEach(line => {
            line.position.y -= line.userData.speed;
            if (line.position.y < -5) {
                line.position.y = 5;
            }
        });
        
        particles.rotation.x = mouseY * 0.1;
        particles.rotation.y = mouseX * 0.1;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = section.offsetWidth / section.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(section.offsetWidth, section.offsetHeight);
    });
    resizeObserver.observe(section);
}

// ===== SCROLL-DRIVEN TIMELINE - Experience Section =====
function createScrollTimeline(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;
    
    const section = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const particlesCount = 1500;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const t = i / particlesCount;
        positions[i3] = Math.sin(t * Math.PI * 4) * 3 + (Math.random() - 0.5) * 0.5;
        positions[i3 + 1] = (t - 0.5) * 12 + (Math.random() - 0.5) * 0.3;
        positions[i3 + 2] = Math.cos(t * Math.PI * 4) * 2 + (Math.random() - 0.5) * 0.5 - 2;
        colors[i3] = 0.55 + t * 0.1;
        colors[i3 + 1] = 0.36 + t * 0.3;
        colors[i3 + 2] = 0.96 - t * 0.2;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    const nodes = [];
    const nodePositions = [0.1, 0.35, 0.6, 0.85];
    
    nodePositions.forEach((t, index) => {
        const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? 0x8b5cf6 : 0x06b6d4,
            transparent: true,
            opacity: 0.6
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
            Math.sin(t * Math.PI * 4) * 3,
            (t - 0.5) * 12,
            Math.cos(t * Math.PI * 4) * 2 - 2
        );
        node.userData.baseY = node.position.y;
        nodes.push(node);
        scene.add(node);
        
        const ringGeometry = new THREE.TorusGeometry(0.25, 0.02, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.4
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(node.position);
        ring.userData.node = node;
        nodes.push(ring);
        scene.add(ring);
    });
    
    camera.position.z = 8;
    
    let scrollProgress = 0;
    
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
            scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));
        }
    });
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        
        particles.position.y = scrollProgress * 4 - 2;
        particles.rotation.y = scrollProgress * Math.PI * 0.5;
        
        nodes.forEach((obj, i) => {
            if (obj.geometry.type === 'SphereGeometry') {
                obj.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
            } else {
                obj.rotation.x = time * 0.5 + i;
                obj.rotation.y = time * 0.3;
            }
        });
        
        camera.position.y = scrollProgress * 3 - 1.5;
        camera.lookAt(0, camera.position.y, -2);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = section.offsetWidth / section.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(section.offsetWidth, section.offsetHeight);
    });
    resizeObserver.observe(section);
}

// ===== DNA HELIX - Education Section =====
function createDNAHelix(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;
    
    const section = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const helixGroup = new THREE.Group();
    const spheres1 = [];
    const spheres2 = [];
    
    const helixLength = 60;
    const radius = 1.5;
    const verticalSpacing = 0.3;
    
    for (let i = 0; i < helixLength; i++) {
        const angle = i * 0.3;
        const y = (i - helixLength / 2) * verticalSpacing;
        
        const sphere1Geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const sphere1Material = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.7
        });
        const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
        sphere1.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        spheres1.push(sphere1);
        helixGroup.add(sphere1);
        
        const sphere2Geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const sphere2Material = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.7
        });
        const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
        sphere2.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
        spheres2.push(sphere2);
        helixGroup.add(sphere2);
        
        if (i % 3 === 0) {
            const connectorGeometry = new THREE.CylinderGeometry(0.03, 0.03, radius * 2, 8);
            const connectorMaterial = new THREE.MeshBasicMaterial({
                color: 0x22d3ee,
                transparent: true,
                opacity: 0.4
            });
            const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
            connector.position.set(0, y, 0);
            connector.rotation.z = Math.PI / 2;
            connector.rotation.y = angle;
            helixGroup.add(connector);
        }
    }
    
    scene.add(helixGroup);
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 12;
        posArray[i + 1] = (Math.random() - 0.5) * 15;
        posArray[i + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 8;
    
    let mouseX = 0, mouseY = 0;
    
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        
        helixGroup.rotation.y = time * 0.2;
        helixGroup.rotation.x = mouseY * 0.2;
        helixGroup.position.x = mouseX * 0.5;
        
        spheres1.forEach((sphere, i) => {
            sphere.scale.setScalar(1 + Math.sin(time * 3 + i * 0.1) * 0.2);
        });
        spheres2.forEach((sphere, i) => {
            sphere.scale.setScalar(1 + Math.sin(time * 3 + i * 0.1 + Math.PI) * 0.2);
        });
        
        particles.rotation.y = time * 0.02;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = section.offsetWidth / section.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(section.offsetWidth, section.offsetHeight);
    });
    resizeObserver.observe(section);
}

// Initialize all 3D effects
if (typeof THREE !== 'undefined') {
    createConstellationNetwork('about-canvas');
    
    create3DBackground('skills-canvas', {
        particleCount: 1500,
        particleSize: 0.04,
        color1: { r: 0.4, g: 0.2, b: 0.6 },
        color2: { r: 0.2, g: 0.3, b: 0.5 },
        shapeColors: [0x5a3d7a, 0x3d4a6a, 0x4a3060, 0x354055]
    });
    
    create3DBackground('projects-canvas', {
        particleCount: 1200,
        particleSize: 0.035,
        color1: { r: 0.3, g: 0.35, b: 0.5 },
        color2: { r: 0.25, g: 0.2, b: 0.4 },
        shapeColors: [0x4a5568, 0x3d4a5c, 0x4a4060, 0x354050]
    });
    
    createScrollTimeline('experience-canvas');
    createDNAHelix('education-canvas');
    createCodeRain('contact-canvas');
}

// ===== Custom Cursor =====
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    document.querySelectorAll('a, button, .btn, .project-card, .skill-group, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}

// ===== BIG SCROLL ANIMATIONS =====
function initScrollAnimations() {
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('scroll-animate', 'fade-up');
    });
    
    document.querySelectorAll('.about-text').forEach(el => {
        el.classList.add('scroll-animate', 'slide-left');
    });
    
    document.querySelectorAll('.about-stats').forEach(el => {
        el.classList.add('scroll-animate', 'slide-right');
    });
    
    document.querySelectorAll('.skill-group').forEach((el, i) => {
        el.classList.add('scroll-animate', 'scale-up');
        el.classList.add('stagger-delay-' + ((i % 6) + 1));
    });
    
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.classList.add('scroll-animate', 'flip-in');
        el.classList.add('stagger-delay-' + ((i % 4) + 1));
    });
    
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
        el.classList.add('scroll-animate', 'slide-left');
        el.classList.add('stagger-delay-' + ((i % 4) + 1));
    });
    
    document.querySelectorAll('.education-card').forEach((el, i) => {
        el.classList.add('scroll-animate', 'rotate-in');
        el.classList.add('stagger-delay-' + ((i % 2) + 1));
    });
    
    document.querySelectorAll('.cert-item').forEach((el, i) => {
        el.classList.add('scroll-animate', 'fade-up');
        el.classList.add('stagger-delay-' + ((i % 4) + 1));
    });
    
    document.querySelectorAll('.contact-item').forEach((el, i) => {
        el.classList.add('scroll-animate', 'slide-left');
        el.classList.add('stagger-delay-' + ((i % 3) + 1));
    });
    
    document.querySelectorAll('.contact-form').forEach(el => {
        el.classList.add('scroll-animate', 'slide-right');
    });
    
    document.querySelectorAll('.stat-card').forEach((el, i) => {
        el.classList.add('scroll-animate', 'scale-up');
        el.classList.add('stagger-delay-' + ((i % 3) + 1));
    });
}

function setupScrollObserver() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            } else {
                entry.target.classList.remove('animate-in');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

initScrollAnimations();
setupScrollObserver();

// ===== Theme Toggle (Dark/Light Mode) =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Default is dark mode (no attribute), light mode uses data-theme="light"
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon(false);
    } else {
        document.documentElement.removeAttribute('data-theme');
        updateThemeIcon(true);
    }
}

function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    if (isLight) {
        // Switch to dark mode
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
    } else {
        // Switch to light mode
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
    }
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

initTheme();
themeToggle.addEventListener('click', toggleTheme);

// ===== Back to Top Button =====
function handleBackToTop() {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', handleBackToTop);

// ===== Navigation =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ===== Contact Form =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
        const mailtoLink = 'mailto:shejadavid11@gmail.com?subject=' + encodeURIComponent(formData.subject) + '&body=' + encodeURIComponent('Name: ' + formData.name + '\nEmail: ' + formData.email + '\n\nMessage:\n' + formData.message);
        showNotification('Opening email client...', 'success');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        window.location.href = mailtoLink;
    }, 1000);
});

// ===== Notification System =====
function showNotification(message, type) {
    type = type || 'info';
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = '<span>' + message + '</span><button class="notification-close">&times;</button>';
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1';
    notification.style.cssText = 'position:fixed;top:100px;right:20px;padding:1rem 1.5rem;background:' + bgColor + ';color:white;border-radius:0.5rem;box-shadow:0 10px 15px -3px rgb(0 0 0/0.1);display:flex;align-items:center;gap:1rem;z-index:9999;animation:slideIn 0.3s ease;';
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
        document.head.appendChild(style);
    }
    document.body.appendChild(notification);
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = 'background:none;border:none;color:white;font-size:1.25rem;cursor:pointer;padding:0;line-height:1;';
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
