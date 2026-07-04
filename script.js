(function(){
    'use strict';

    const container = document.querySelector('main');
    let startRecursion;

    const layers = [
        {
            layerId: 1,
            layerOrder: 0,
            fontFamily: 'Fira Code',
            minFontSize: 0,
            maxFontSize: 1000,
            minFontWeight: 300,
            maxFontWeight: 700,
            fontStyle: "regular",
            minOpacity: 0,
            maxOpacity: 100,
            leftRotationDeg: -180,
            rightRotationDeg: 180,
            rgbColor: '#000000',
            hlsColor: [0, 0, 0],
            lightnesMinPercent: 0,
            lightnesMaxPercent: 100,
            widthPercent: 100,
            heightPercent: 100,
            textCharacters: ['}', '{', '(', ')', ';' ]
        }
    ]

    const fontWeights = {
        oswald: {
            from: 200,
            to: 700
        },
        firacode: {
            from: 300,
            to: 700
        },
        playfairdisplay: {
            from: 400,
            to: 700,
            italic: true
        },
        ibmplexsans: {
            from: 100,
            to: 700,
            italic: true
        },
        ebgaramond: {
            from: 400,
            to: 800,
            italic: true
        },
        caveat: {
            from: 400,
            to: 700
        },
    }

    const pv = {
        minFontSize: 0,
        maxFontSize: 1000,
        minFontWeight: 300,
        maxFontWeight: 700,
        minOpacity: 0,
        maxOpacity: 100,
        leftRotationDeg: -180,
        rightRotationDeg: 180,
        lightnesMinPercent: 0,
        lightnesMaxPercent: 100,
        xAxisPlacementPercentStart: 10,
        xAxisPlacementPercentEnd: 90,
        yAxisPlacementPercentStart: 10,
        yAxisPlacementPercentEnd: 90,
        textCharacters: ['}', '{', '(', ')', ';' ]
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addChar(){
        
        const fontSize = getRandomInt(pv.minFontSize, pv.maxFontSize);
        const fontWeight = getRandomInt(pv.minFontWeight, pv.maxFontWeight);
        const opactiy = (getRandomInt(pv.minOpacity, pv.maxOpacity))/100;
        const rotation = getRandomInt(pv.leftRotationDeg, pv.rightRotationDeg);
        const xAxis = getRandomInt(pv.xAxisPlacementPercentStart, pv.xAxisPlacementPercentEnd);
        const yAxis = getRandomInt(pv.yAxisPlacementPercentStart, pv.yAxisPlacementPercentEnd);
        const lightness = getRandomInt(pv.lightnesMinPercent, pv.lightnesMaxPercent);
        const char = pv.textCharacters[Math.floor(Math.random() * pv.textCharacters.length)];

        //console.log(`fontsize is ${fontSize}, fontWeight is ${fontWeight}, opacity is ${opactiy}, rotation is ${rotation}, xAxis is ${xAxis}, yAxis is ${yAxis}, character is ${char}`);

        const thisElement = document.createElement('div');
        thisElement.className = 'addedtext';
        const textContent = document.createTextNode(char);
        thisElement.appendChild(textContent);
        thisElement.style.fontSize = `${fontSize}px`;
        //thisElement.style.fontWeight = `${fontWeight}px`;
        thisElement.style.color = `hsl(0, 0%, ${lightness}%)`;
        thisElement.style.opacity = opactiy;
        thisElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        thisElement.style.left = `${xAxis}%`;
        thisElement.style.top = `${yAxis}%`;
        container.appendChild(thisElement);
        startRecursion = setTimeout(function(){
            recursivelyAdd();
        }, 500);
    }

    function recursivelyAdd(){
        addChar();
    }

    //recursivelyAdd();

    document.addEventListener('keydown', function(event) {
        if (event.altKey) {
            if (event.code === 'KeyP') {
                event.preventDefault();
                //console.log('Alt + P was pressed');
                clearTimeout(startRecursion);
            }
            if (event.code === 'KeyR') {
                event.preventDefault();
                //console.log('Alt + R was pressed');
                addChar();
            }
        }
    });

    function updateLayer(layerIndex = 0) {
        const layer = layers[layerIndex];

        layer.fontFamily = document.querySelector('#fontFamily').value;
        layer.minFontSize = +document.querySelector('#minFontSize').value;
        layer.maxFontSize = +document.querySelector('#maxFontSize').value;
        layer.minFontWeight = +document.querySelector('#minFontWeight').value;
        layer.maxFontWeight = +document.querySelector('#maxFontWeight').value;
        
        // Font style: "italic" or "regular"
        const fontStyleInput = document.querySelector('input[name="fontStyle"]:checked');
        layer.fontStyle = fontStyleInput ? fontStyleInput.value : "regular";
        
        layer.minOpacity = +document.querySelector('#minOpacity').value;
        layer.maxOpacity = +document.querySelector('#maxOpacity').value;
        layer.leftRotationDeg = -Math.abs(+document.querySelector('#leftRotationDeg').value);
        layer.rightRotationDeg = Math.abs(+document.querySelector('#rightRotationDeg').value);
        layer.rgbColor = document.querySelector('#rgbColor').value;
        layer.hlsColor = hexToHsl(document.querySelector('#rgbColor').value);
        layer.lightnesMinPercent = +document.querySelector('#lightnesMinPercent').value;
        layer.lightnesMaxPercent = +document.querySelector('#lightnesMaxPercent').value;
        layer.widthPercent = +document.querySelector('#widthPercent').value;
        layer.heightPercent = +document.querySelector('#heightPercent').value;
        layer.textCharacters = parseTextCharacters(document.querySelector('#textCharacters').value);

        console.log('Layer updated:', layer);
    }

    // Slider value UI dynamic update
    function setupSliderValueDisplay(sliderId, valueId) {
        const slider = document.querySelector(sliderId);
        const value = document.querySelector(valueId);
        // Initial display
        value.textContent = slider.value;
        // Update on input
        slider.addEventListener('input', () => {
            value.textContent = slider.value;
        });
    }

    setupSliderValueDisplay('#minFontSize', '#minFontSizeValue');
    setupSliderValueDisplay('#maxFontSize', '#maxFontSizeValue');
    setupSliderValueDisplay('#minFontWeight', '#minFontWeightValue');
    setupSliderValueDisplay('#maxFontWeight', '#maxFontWeightValue');
    setupSliderValueDisplay('#minOpacity', '#minOpacityValue');
    setupSliderValueDisplay('#maxOpacity', '#maxOpacityValue');
    setupSliderValueDisplay('#leftRotationDeg', '#leftRotationDegValue');
    setupSliderValueDisplay('#rightRotationDeg', '#rightRotationDegValue');
    setupSliderValueDisplay('#lightnesMinPercent', '#lightnesMinPercentValue');
    setupSliderValueDisplay('#lightnesMaxPercent', '#lightnesMaxPercentValue');
    setupSliderValueDisplay('#widthPercent', '#widthPercentValue');
    setupSliderValueDisplay('#heightPercent', '#heightPercentValue');

    document.querySelector('#startBtn').addEventListener('click', () => {
        updateLayer();
        console.log(layers);
    });

    document.getElementById('sizeForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const widthInches = parseFloat(document.getElementById('widthInches').value);
        const heightInches = parseFloat(document.getElementById('heightInches').value);

        if (isNaN(widthInches) || isNaN(heightInches) || widthInches <= 0 || heightInches <= 0) {
        alert('Please enter valid positive numbers for width and height.');
        return;
        }

        // Update display text
        const display = document.getElementById('displaySize');
        display.textContent = `${widthInches}" x ${heightInches}"`;

        // Convert inches to pixels for screen rendering based on spec: 1 inch = 96 CSS pixels
        const pxWidth = widthInches * 96;
        const pxHeight = heightInches * 96;

        const mainEl = document.querySelector('main');
        mainEl.style.width = pxWidth + 'px';
        mainEl.style.height = pxHeight + 'px';
    });

    // List of possible zoom scales
    const zoomStops = [0.25, 0.5, 0.75, 1, 1.25, 1.5];
    const zoomPercents = ["25%", "50%", "75%", "100%", "125%", "150%"];

    const slider = document.querySelector('#zoomRange');
    const zoomLevelDisplay = document.querySelector('#zoomLevelDisplay');

    function updateZoom() {
      const stopIndex = Number(slider.value);
      const scale = zoomStops[stopIndex];
      const percent = zoomPercents[stopIndex];
      // Set scale
      container.style.transform = `scale(${scale})`;
      // Display percent
      zoomLevelDisplay.textContent = percent;
    }

    // Initialize display
    updateZoom();

    slider.addEventListener('input', updateZoom);

    // helper functions

    // Converts a hex color to RGB array
    function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(h => h+h).join('');
    }
    const num = parseInt(hex, 16);
    return [ (num >> 16) & 255, (num >> 8) & 255, num & 255 ];
    }

    // Parses textarea into array with space separated values
    // If something is in double quotes -> treat as one element
    function parseTextCharacters(text) {
    const regex = /"([^"]+)"|(\S+)/g;
    let match, arr = [];
    while ((match = regex.exec(text)) !== null) {
        if (match[1]) {
        arr.push(match[1]);
        } else if (match[2]) {
        arr.push(match[2]);
        }
    }
    return arr;
    }

    function hexToHsl(hex) {
        // Remove hash if present
        hex = hex.replace(/^#/, '');

        // Handle shorthand #RGB
        if (hex.length === 3) {
            hex = hex.split('').map(h => h + h).join('');
        }

        // Convert to RGB values (0-255)
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l;

        l = (max + min) / 2;

        if (max === min) {
            // achromatic
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0));
                    break;
                case g:
                    h = ((b - r) / d + 2);
                    break;
                case b:
                    h = ((r - g) / d + 4);
                    break;
            }
            h /= 6;
        }

        // Convert from [0–1] to degrees/percentages
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return [h, l, s];
    }

    function updateFontWeightRange(selectedFont) {
        const key = selectedFont.trim().toLowerCase()
            .replace(/\s+/g, '')        // remove all spaces
        console.log(key);
        if (fontWeights[key]) {
            const minVal = fontWeights[key].from;
            const maxVal = fontWeights[key].to;

            const minSlider = document.querySelector('#minFontWeight');
            const maxSlider = document.querySelector('#maxFontWeight');
            const minValueSpan = document.querySelector('#minFontWeightValue');
            const maxValueSpan = document.querySelector('#maxFontWeightValue');

            // Set new ranges
            minSlider.min = minVal;
            minSlider.max = maxVal;
            maxSlider.min = minVal;
            maxSlider.max = maxVal;

            // Set slider values to min/max for that font
            minSlider.value = minVal;
            maxSlider.value = maxVal;

            // Update displayed spans
            minValueSpan.textContent = minVal;
            maxValueSpan.textContent = maxVal;
        }
    }

    // Adds radio buttons for italic if available, or clears them if not
    function updateFontStyleOptions(selectedFont) {
        const key = selectedFont.trim().toLowerCase()
            .replace(/\s+/g, '')        // remove all spaces

        const styleDiv = document.querySelector('#font-style');
        styleDiv.innerHTML = ''; // clear previous

        if (fontWeights[key] && fontWeights[key].italic) {
            styleDiv.innerHTML = `
                <label>Font Style</label>
                <div>
                    <label><input type="radio" name="fontStyle" value="regular" checked> Regular</label>
                    <label><input type="radio" name="fontStyle" value="italic"> Italic</label>
                </div>
            `;
        }
    }

    document.querySelector('#fontFamily').addEventListener('change', (e) => {
        const selectedFont = e.target.value;
        updateFontWeightRange(selectedFont);
        updateFontStyleOptions(selectedFont);
    });
})();