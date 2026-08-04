const canvas = document.getElementById('plant-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the screen dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawStaticGarden(); 
}
window.addEventListener('resize', resizeCanvas);

// Load your precise Heartleaf Philodendron asset library in strict order
const plantImages = {};
const imagePaths = {
    topstem: 'assets/plants/topstem.svg',
    midstem: 'assets/plants/midstem.svg',
    finalstem: 'assets/plants/finalstem.svg',
    leaf1: 'assets/plants/topleaf1.svg',
    leaf2: 'assets/plants/midleaf2.svg',
    leaf3: 'assets/plants/midleaf3.svg',
    leaf4: 'assets/plants/midleaf4.svg',
    leaf5: 'assets/plants/finalleaf5.svg'
};

let loadedCount = 0;
const totalImages = Object.keys(imagePaths).length;

for (let key in imagePaths) {
    plantImages[key] = new Image();
    plantImages[key].src = imagePaths[key];
    
    plantImages[key].onload = () => {
        loadedCount++;
        console.log(`Successfully loaded asset: ${key}`);
        if (loadedCount === totalImages) {
            drawStaticGarden(); 
        }
    };

    plantImages[key].onerror = () => {
        console.error(`ERROR: Could not load SVG file at path: ${imagePaths[key]}`);
    };
}

// Function to draw the vine sequentially in strict order without scroll calculation
function drawStaticGarden() {
    if (loadedCount < totalImages) return; // Wait until all assets are fully loaded
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startX = 100;   // Left margin position on screen
    let currentY = 0;   // Starts precisely at the top of the viewport

    // Define the exact sequential asset mapping array
    const vineSequence = [
        { stem: 'topstem', leaf: 'leaf1' },
        { stem: 'midstem', leaf: 'leaf2' },
        { stem: 'midstem', leaf: 'leaf3' },
        { stem: 'midstem', leaf: 'leaf4' },
        { stem: 'finalstem', leaf: 'leaf5' }
    ];

    // Loop through each ordered segment and render it
    vineSequence.forEach((stage, index) => {
        // 1. Draw the stem segment in sequence (60x120px scale)
        const stemImg = plantImages[stage.stem];
        if (stemImg && stemImg.complete) {
            ctx.save();
            ctx.translate(startX, currentY + 60);
            ctx.drawImage(stemImg, -30, -60, 60, 120);
            ctx.restore();
        }

        // 2. Overlap the corresponding leaf in strict sequence (120x120px scale)
        const leafImg = plantImages[stage.leaf];
        if (leafImg && leafImg.complete) {
            ctx.save();
            // Alternate leaves left and right down the vine sequence
            let sideMultiplier = (index % 2 === 0) ? 1 : -1;
            let leafOffsetX = sideMultiplier * 70; 
            let rotationAngle = sideMultiplier * 0.35; // Clean organic tilt

            ctx.translate(startX + leafOffsetX, currentY + 60);
            ctx.rotate(rotationAngle);
            ctx.drawImage(leafImg, -60, -60, 120, 120);
            ctx.restore();
        }

        // Step down vertically for the next sequence piece
        currentY += 100; 
    });
}

// Initial sizing trigger
resizeCanvas();