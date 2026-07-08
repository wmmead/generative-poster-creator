import { layers, createLayer, MAX_LAYERS } from './state.js';
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

// Start with one layer
addLayer();
