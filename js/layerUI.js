import { layers, removeLayer, moveLayer } from './state.js';
import { startLayer, stopLayer } from './render.js';
import { fontWeights } from './fonts.js';
import { hexToHsl } from './color.js';

const layersList = document.querySelector('#layersList');
const poster = document.querySelector('main');

// Fields that map 1:1 onto numeric layer properties
const NUMERIC_FIELDS = [
    'minFontSize', 'maxFontSize',
    'minFontWeight', 'maxFontWeight',
    'minOpacity', 'maxOpacity',
    'minRotationDeg', 'maxRotationDeg',
    'lightnessMinPercent', 'lightnessMaxPercent',
    'widthPercent', 'heightPercent'
];

// Fields that transform the layer's container as a whole
const TRANSFORM_FIELDS = [
    'layerScalePercent', 'layerRotationDeg',
    'layerOffsetXPercent', 'layerOffsetYPercent'
];

function applyLayerTransform(layer, container) {
    container.style.transform =
        `translate(${layer.layerOffsetXPercent}%, ${layer.layerOffsetYPercent}%) ` +
        `rotate(${layer.layerRotationDeg}deg) ` +
        `scale(${layer.layerScalePercent / 100})`;
}

// Parses textarea into an array of space-separated values;
// anything in double quotes is treated as one element
function parseTextCharacters(text) {
    const regex = /"([^"]+)"|(\S+)/g;
    let match;
    const arr = [];
    while ((match = regex.exec(text)) !== null) {
        arr.push(match[1] ?? match[2]);
    }
    return arr;
}

function textCharactersToString(chars) {
    return chars.map(c => /\s/.test(c) ? `"${c}"` : c).join(' ');
}

export function addLayerPanel(layer) {
    const panel = document.querySelector('#layerTemplate').content.firstElementChild.cloneNode(true);
    panel.dataset.layerId = layer.layerId;
    panel.querySelector('.layer-name').textContent = `Layer ${layer.layerId}`;

    // Each layer's generated characters live in their own container inside <main>
    const container = document.createElement('div');
    container.className = 'layer';
    container.dataset.layerId = layer.layerId;
    poster.appendChild(container);

    const field = name => panel.querySelector(`[name="${name}"]`);

    // Initialize inputs from the layer object so panel and state always agree
    field('fontFamily').value = layer.fontFamily;
    field('rgbColor').value = layer.rgbColor;
    field('textCharacters').value = textCharactersToString(layer.textCharacters);
    for (const name of NUMERIC_FIELDS) {
        field(name).value = layer[name];
    }
    for (const name of TRANSFORM_FIELDS) {
        field(name).value = layer[name];
    }

    // Adjusts the weight sliders' range and the italic option to the selected font
    function applyFontConstraints() {
        const info = fontWeights[layer.fontFamily];
        const minSlider = field('minFontWeight');
        const maxSlider = field('maxFontWeight');

        minSlider.min = maxSlider.min = info.from;
        minSlider.max = maxSlider.max = info.to;
        minSlider.value = info.from;
        maxSlider.value = info.to;
        layer.minFontWeight = info.from;
        layer.maxFontWeight = info.to;
        minSlider.closest('.slider-container').querySelector('.slider-value').textContent = info.from;
        maxSlider.closest('.slider-container').querySelector('.slider-value').textContent = info.to;

        const styleDiv = panel.querySelector('.font-style');
        styleDiv.innerHTML = '';
        layer.fontStyle = 'regular';
        if (info.italic) {
            const radioName = `fontStyle-${layer.layerId}`;
            styleDiv.innerHTML = `
                <label>Font Style</label>
                <div>
                    <label><input type="radio" name="${radioName}" value="regular" checked> Regular</label>
                    <label><input type="radio" name="${radioName}" value="italic"> Italic</label>
                </div>
            `;
            styleDiv.querySelectorAll('input').forEach(radio => {
                radio.addEventListener('change', () => { layer.fontStyle = radio.value; });
            });
        }
    }

    applyFontConstraints();

    // Wire every input to update the layer object live
    for (const name of NUMERIC_FIELDS) {
        field(name).addEventListener('input', e => { layer[name] = +e.target.value; });
    }

    for (const name of TRANSFORM_FIELDS) {
        field(name).addEventListener('input', e => {
            layer[name] = +e.target.value;
            applyLayerTransform(layer, container);
        });
    }

    field('fontFamily').addEventListener('change', e => {
        layer.fontFamily = e.target.value;
        applyFontConstraints();
    });

    field('rgbColor').addEventListener('input', e => {
        layer.rgbColor = e.target.value;
        layer.hslColor = hexToHsl(e.target.value);
    });

    field('textCharacters').addEventListener('input', e => {
        layer.textCharacters = parseTextCharacters(e.target.value);
    });

    // Slider value read-outs
    panel.querySelectorAll('.slider-container input[type="range"]').forEach(slider => {
        const value = slider.closest('.slider-container').querySelector('.slider-value');
        value.textContent = slider.value;
        slider.addEventListener('input', () => { value.textContent = slider.value; });
    });

    // Generation controls
    panel.querySelector('.startBtn').addEventListener('click', () => startLayer(layer, container));
    panel.querySelector('.stopBtn').addEventListener('click', () => stopLayer(layer));
    panel.querySelector('.clearBtn').addEventListener('click', () => { container.innerHTML = ''; });

    // Header buttons (preventDefault keeps clicks from toggling the <details>)
    const visBtn = panel.querySelector('.toggle-visibility');
    visBtn.addEventListener('click', e => {
        e.preventDefault();
        layer.visible = !layer.visible;
        container.classList.toggle('hidden', !layer.visible);
        panel.classList.toggle('layer-hidden', !layer.visible);
        visBtn.textContent = layer.visible ? 'Hide' : 'Show';
        visBtn.title = layer.visible
            ? 'Hide this layer (also excludes it from printing)'
            : 'Show this layer';
    });

    panel.querySelector('.remove-layer').addEventListener('click', e => {
        e.preventDefault();
        stopLayer(layer);
        removeLayer(layer);
        container.remove();
        panel.remove();
        document.dispatchEvent(new CustomEvent('layerschanged'));
    });

    panel.querySelector('.move-up').addEventListener('click', e => {
        e.preventDefault();
        if (moveLayer(layer, -1)) syncOrder();
    });

    panel.querySelector('.move-down').addEventListener('click', e => {
        e.preventDefault();
        if (moveLayer(layer, 1)) syncOrder();
    });

    layersList.appendChild(panel);
}

// Reorders both the control panels and the poster's layer containers to match
// the layers array (panel list top-to-bottom = paint order bottom-to-top of stack)
function syncOrder() {
    for (const layer of layers) {
        layersList.appendChild(layersList.querySelector(`[data-layer-id="${layer.layerId}"]`));
        poster.appendChild(poster.querySelector(`[data-layer-id="${layer.layerId}"]`));
    }
}
