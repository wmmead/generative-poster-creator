// Mirrors a slider's range and current value onto its numeric read-out box
export function syncNumberBox(slider) {
    const box = slider.closest('.slider-container').querySelector('.slider-value');
    box.min = slider.min;
    box.max = slider.max;
    box.step = slider.step || 1;
    box.value = slider.value;
}

// Keeps a slider and its number box in sync both ways: valid typed values
// apply live; on commit (blur/Enter) out-of-range values clamp and
// non-numeric input reverts, so bad values never propagate
export function wireSliderBox(slider) {
    const box = slider.closest('.slider-container').querySelector('.slider-value');
    syncNumberBox(slider);

    // Don't rewrite the box mid-typing; the commit handler below settles it
    slider.addEventListener('input', () => {
        if (document.activeElement !== box) box.value = slider.value;
    });

    // Typed values apply live while they're numeric and in range
    box.addEventListener('input', () => {
        const n = Number(box.value);
        if (box.value.trim() === '' || Number.isNaN(n)) return;
        if (n < +slider.min || n > +slider.max) return;
        slider.value = n;
        slider.dispatchEvent(new Event('input'));
    });

    // On commit (blur/Enter): clamp out-of-range values, revert non-numeric input
    box.addEventListener('change', () => {
        const n = Number(box.value);
        if (box.value.trim() === '' || Number.isNaN(n)) {
            box.value = slider.value;
            return;
        }
        slider.value = Math.min(+slider.max, Math.max(+slider.min, n));
        slider.dispatchEvent(new Event('input'));
        box.value = slider.value;
    });

    // Enter commits the value instead of submitting the surrounding form
    box.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            box.blur();
        }
    });
}
