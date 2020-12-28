export function createModeTitle(title: string): HTMLDivElement {
    const el = document.createElement('div');
    const h = document.createElement('h3');
    h.innerText = title;
    h.classList.add('modetitlemargin');
    el.appendChild(h);
    el.classList.add('mode-title');
    el.classList.add('bg-blue');
    return el;
}

export function createSlider(label: string, min: number, max: number, defaultVal: number, onchange: (event: Event) => void, step = 1): HTMLDivElement {
    // Create label
    const sizeSliderLabel = document.createElement('p');
    sizeSliderLabel.innerText = label;

    // Create slider element
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = min.toString();
    sizeSlider.max = max.toString();
    sizeSlider.step = step.toString();
    sizeSlider.value = defaultVal.toString();
    sizeSlider.classList.add("slider");
    sizeSlider.classList.add("fix-width");
    sizeSlider.onchange = onchange;

    // Add them both to the container
    const container = document.createElement('div');
    container.appendChild(sizeSliderLabel);
    container.appendChild(sizeSlider);
    return container;
}

export function createCheckbox(label: string, defaultVal: boolean, onchange: (event: Event) => void): HTMLDivElement {
    // Create label
    const name = label + Math.random().toString();
    const checkboxLabel = document.createElement('label');
    checkboxLabel.innerText = label;
    checkboxLabel.htmlFor = name;
    checkboxLabel.classList.add('checkbox-label');

    // Create slider element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = name;
    checkbox.value = defaultVal.toString();
    checkbox.classList.add("ch-box");
    checkbox.onchange = onchange;

    // Add them both to the container
    const container = document.createElement('div');
    container.appendChild(checkbox);
    container.appendChild(checkboxLabel);
    return container;
}
