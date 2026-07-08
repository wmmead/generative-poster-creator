import { layers, createLayer, duplicateLayer, MAX_LAYERS } from './state.js';
import { addLayerPanel } from './layerUI.js';
import { initPageUI } from './pageUI.js';

initPageUI();

const addLayerBtn = document.querySelector('#addLayerBtn');
const newLayerMode = document.querySelector('#newLayerMode');

function addLayer() {
    if (layers.length >= MAX_LAYERS) return;
    addLayerPanel(createLayer(newLayerMode.value));
    updateAddButton();
}

function updateAddButton() {
    addLayerBtn.disabled = layers.length >= MAX_LAYERS;
}

addLayerBtn.addEventListener('click', addLayer);
document.addEventListener('layerschanged', updateAddButton);

// Duplicate buttons on the layer panels: new empty layer, same settings
document.addEventListener('duplicatelayer', e => {
    if (layers.length >= MAX_LAYERS) return;
    addLayerPanel(duplicateLayer(e.detail));
    updateAddButton();
});

// Start with one layer
addLayer();
