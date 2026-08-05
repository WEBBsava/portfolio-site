const canvas = document.getElementById('plant-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGarden();
}
window.addEventListener('resize', resizeCanvas);

// Define a modular plant species library
const plantLibrary = {
    philodendron: {
        paths: {
            topstem: 'assets/plants/topstem.svg',
            midstem: 'assets/plants/midstem.svg',
            finalstem: 'assets/plants/finalstem.svg',
            leaf1: 'assets/plants/topleaf1.svg',
            leaf2: 'assets/plants/midleaf2.svg',
            leaf3: 'assets/plants/midleaf3.svg',
            leaf4: 'assets/plants/midleaf4.svg',
            leaf5: 'assets/plants/finalleaf5.svg'
        },
        sequence: [
            { stem: 'topstem', leaf: 'leaf1' },
            { stem: 'midstem', leaf: 'leaf2' },
            { stem: 'midstem', leaf: 'leaf3' },
            { stem: 'midstem', leaf: 'leaf4' },
            { stem: 'finalstem', leaf: 'leaf5' }
        ]
    }
    // Later you can easily add: pothos: { ... } or fern: { ... }
};

// Load assets for the active plant profile
const activeProfile = 'philodendron';
const currentPlant = plantLibrary[activeProfile];
const loadedImages = {};
let loadedCount = 0;
const totalAssets = Object.keys(currentPlant.paths).length;

for (let key in currentPlant.paths) {
    loadedImages[key] = new Image();
    loadedImages[key].src = currentPlant.paths[key];
    loadedImages[key].onload = () => {
        loadedCount++;
        if (loadedCount === totalAssets) {
            drawGarden();
        }
    };
}

// Render the modular plant down the side margins
function drawGarden() {
    if (loadedCount < totalAssets) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startX = 100; // Left margin position
    let currentY = 20;

    currentPlant.sequenceforEach = currentPlant.sequence.forEach((stage, index) => {
        // Draw stem
        const stemImg = loadedImages[stage.stem];
        if (stemImg && stemImg.complete) {
            ctx.save();
            ctx.translate(startX, currentY + 60);
            ctx.drawImage(stemImg, -30, -60, 60, 120);
            ctx.restore();
        }

        // Draw overlapping modular leaf
        const leafImg = loadedImages[stage.leaf];
        if (leafImg && leafImg.complete) {
            ctx.save();
            let sideMultiplier = (index % 2 === 0) ? 1 : -1;
            let leafOffsetX = sideMultiplier * 75; 
            let rotationAngle = sideMultiplier * 0.35;

            ctx.translate(startX + leafOffsetX, currentY + 60);
            ctx.rotate(rotationAngle);
            ctx.drawImage(leafImg, -60, -60, 120, 120);
            ctx.restore();
        }

        currentY += 100;
    });
}

resizeCanvas();