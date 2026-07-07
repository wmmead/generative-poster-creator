import { setIntervalMs } from './render.js';
import { wireSliderBox } from './sliderBox.js';

export function initPageUI() {
    const poster = document.querySelector('main');

    document.querySelector('#sizeForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const widthInches = parseFloat(document.querySelector('#widthInches').value);
        const heightInches = parseFloat(document.querySelector('#heightInches').value);

        if (isNaN(widthInches) || isNaN(heightInches) || widthInches <= 0 || heightInches <= 0) {
            alert('Please enter valid positive numbers for width and height.');
            return;
        }

        document.querySelector('#displaySize').textContent = `${widthInches}" x ${heightInches}"`;

        // 1 inch = 96 CSS pixels
        poster.style.width = `${widthInches * 96}px`;
        poster.style.height = `${heightInches * 96}px`;
    });

    // Master generation speed: one interval shared by all layers
    const intervalSlider = document.querySelector('#intervalRange');
    wireSliderBox(intervalSlider);
    intervalSlider.addEventListener('input', () => setIntervalMs(+intervalSlider.value));

    const zoomStops = [0.25, 0.5, 0.75, 1, 1.25, 1.5];
    const zoomSlider = document.querySelector('#zoomRange');
    const zoomLevelDisplay = document.querySelector('#zoomLevelDisplay');

    function updateZoom() {
        const scale = zoomStops[Number(zoomSlider.value)];
        poster.style.transform = `scale(${scale})`;
        zoomLevelDisplay.textContent = `${scale * 100}%`;
    }

    updateZoom();
    zoomSlider.addEventListener('input', updateZoom);

    document.querySelector('#printBtn').addEventListener('click', () => window.print());
}
