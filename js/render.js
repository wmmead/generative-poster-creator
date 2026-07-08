// Master interval shared by all layers; each tick reads it, so changes apply
// to already-running layers on their next character
let intervalMs = 500;

export function setIntervalMs(ms) {
    intervalMs = ms;
}

// Per-layer setTimeout handles, keyed by layerId (kept off the layer objects so they stay serializable)
const timers = new Map();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Applies the randomized placement/appearance shared by both modes
// (opacity, rotation, position spread) and returns the randomized hsl color
function placeElement(layer, el) {
    const opacity = getRandomInt(layer.minOpacity, layer.maxOpacity) / 100;
    const rotation = getRandomInt(layer.minRotationDeg, layer.maxRotationDeg);
    const lightness = getRandomInt(layer.lightnessMinPercent, layer.lightnessMaxPercent);
    const [hue, saturation] = layer.hslColor;

    // width/height percent controls how much of the page the layer spreads across, centered
    const xMin = (100 - layer.widthPercent) / 2;
    const yMin = (100 - layer.heightPercent) / 2;
    const x = xMin + Math.random() * layer.widthPercent;
    const y = yMin + Math.random() * layer.heightPercent;

    el.style.opacity = opacity;
    el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function addChar(layer, container) {
    if (layer.textCharacters.length === 0) return;

    const char = layer.textCharacters[Math.floor(Math.random() * layer.textCharacters.length)];
    const fontSize = getRandomInt(layer.minFontSize, layer.maxFontSize);
    const fontWeight = getRandomInt(layer.minFontWeight, layer.maxFontWeight);

    const el = document.createElement('div');
    el.className = 'addedtext';
    el.textContent = char;
    el.style.fontFamily = `"${layer.fontFamily}"`;
    el.style.fontStyle = layer.fontStyle === 'italic' ? 'italic' : 'normal';
    el.style.fontSize = `${fontSize}px`;
    el.style.fontWeight = fontWeight;
    el.style.color = placeElement(layer, el);
    container.appendChild(el);
}

export function addShape(layer, container) {
    // Squares and circles use one random dimension; rectangles draw width and
    // height independently from the same size range
    const width = getRandomInt(layer.minShapeSize, layer.maxShapeSize);
    const height = (layer.shapeType === 'square' || layer.shapeType === 'circle')
        ? width
        : getRandomInt(layer.minShapeSize, layer.maxShapeSize);

    const el = document.createElement('div');
    el.className = 'addedshape';
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    if (layer.shapeType === 'circle') {
        el.style.borderRadius = '50%';
    } else if (layer.shapeType === 'rounded') {
        el.style.borderRadius = `${Math.min(width, height) * 0.25}px`;
    }
    el.style.backgroundColor = placeElement(layer, el);
    container.appendChild(el);
}

export function startLayer(layer, container) {
    if (timers.has(layer.layerId)) return;
    const paint = layer.mode === 'shape' ? addShape : addChar;
    const tick = () => {
        paint(layer, container);
        timers.set(layer.layerId, setTimeout(tick, intervalMs));
    };
    tick();
}

export function stopLayer(layer) {
    clearTimeout(timers.get(layer.layerId));
    timers.delete(layer.layerId);
}
