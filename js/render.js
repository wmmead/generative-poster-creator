const INTERVAL_MS = 500;

// Per-layer setTimeout handles, keyed by layerId (kept off the layer objects so they stay serializable)
const timers = new Map();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function addChar(layer, container) {
    if (layer.textCharacters.length === 0) return;

    const char = layer.textCharacters[Math.floor(Math.random() * layer.textCharacters.length)];
    const fontSize = getRandomInt(layer.minFontSize, layer.maxFontSize);
    const fontWeight = getRandomInt(layer.minFontWeight, layer.maxFontWeight);
    const opacity = getRandomInt(layer.minOpacity, layer.maxOpacity) / 100;
    const rotation = getRandomInt(layer.minRotationDeg, layer.maxRotationDeg);
    const lightness = getRandomInt(layer.lightnessMinPercent, layer.lightnessMaxPercent);
    const [hue, saturation] = layer.hslColor;

    // width/height percent controls how much of the page the layer spreads across, centered
    const xMin = (100 - layer.widthPercent) / 2;
    const yMin = (100 - layer.heightPercent) / 2;
    const x = xMin + Math.random() * layer.widthPercent;
    const y = yMin + Math.random() * layer.heightPercent;

    const el = document.createElement('div');
    el.className = 'addedtext';
    el.textContent = char;
    el.style.fontFamily = `"${layer.fontFamily}"`;
    el.style.fontStyle = layer.fontStyle === 'italic' ? 'italic' : 'normal';
    el.style.fontSize = `${fontSize}px`;
    el.style.fontWeight = fontWeight;
    el.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    el.style.opacity = opacity;
    el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    container.appendChild(el);
}

export function startLayer(layer, container) {
    if (timers.has(layer.layerId)) return;
    const tick = () => {
        addChar(layer, container);
        timers.set(layer.layerId, setTimeout(tick, INTERVAL_MS));
    };
    tick();
}

export function stopLayer(layer) {
    clearTimeout(timers.get(layer.layerId));
    timers.delete(layer.layerId);
}
