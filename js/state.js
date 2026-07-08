import { hexToHsl } from './color.js';

export const MAX_LAYERS = 10;

// Ordered bottom-to-top: layers[0] paints first (bottom of the stack)
export const layers = [];

let nextLayerId = 1;

// mode: 'text' sprinkles characters, 'shape' sprinkles div shapes
export function createLayer(mode = 'text') {
    const rgbColor = '#000000';
    const layer = {
        layerId: nextLayerId++,
        mode,
        minOpacity: 0,
        maxOpacity: 100,
        minRotationDeg: -180,
        maxRotationDeg: 180,
        rgbColor,
        hslColor: hexToHsl(rgbColor),
        lightnessMinPercent: 0,
        lightnessMaxPercent: 100,
        widthPercent: 100,
        heightPercent: 100,
        visible: true,
        layerScalePercent: 100,
        layerRotationDeg: 0,
        layerOffsetXPercent: 0,
        layerOffsetYPercent: 0,
        layerOpacityPercent: 100
    };
    if (mode === 'shape') {
        Object.assign(layer, {
            shapeType: 'rectangle', // 'rectangle' | 'square' | 'circle' | 'rounded'
            minShapeSize: 10,
            maxShapeSize: 1000
        });
    } else {
        Object.assign(layer, {
            fontFamily: 'Fira Code',
            minFontSize: 1,
            maxFontSize: 1000,
            minFontWeight: 300,
            maxFontWeight: 700,
            fontStyle: 'regular',
            textCharacters: ['}', '{', '(', ')', ';']
        });
    }
    layers.push(layer);
    return layer;
}

// New empty layer with all of source's settings (layers hold only plain
// serializable data, so a structured clone copies everything safely)
export function duplicateLayer(source) {
    const layer = structuredClone(source);
    layer.layerId = nextLayerId++;
    layer.visible = true;
    layers.push(layer);
    return layer;
}

export function removeLayer(layer) {
    const i = layers.indexOf(layer);
    if (i !== -1) layers.splice(i, 1);
}

// direction: -1 moves toward the bottom of the stack, +1 toward the top
export function moveLayer(layer, direction) {
    const i = layers.indexOf(layer);
    const j = i + direction;
    if (i === -1 || j < 0 || j >= layers.length) return false;
    [layers[i], layers[j]] = [layers[j], layers[i]];
    return true;
}
