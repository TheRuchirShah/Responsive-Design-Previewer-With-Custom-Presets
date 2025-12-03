const presets = [
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "iPad", width: 768, height: 1024 },
  { name: "Desktop HD", width: 1366, height: 768 }
];

const presetSelect = document.getElementById('presetSelect');
const resizeBtn = document.getElementById('resizeBtn');
const addCustomBtn = document.getElementById('addCustomBtn');
const customName = document.getElementById('customName');
const customWidth = document.getElementById('customWidth');
const customHeight = document.getElementById('customHeight');

function populateSelect(presetsArray) {
    presetSelect.innerHTML = '';
    presetsArray.forEach((p, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${p.name} (${p.width}x${p.height})`;
        presetSelect.appendChild(opt);
    });
}

// Load saved custom presets
chrome.storage.sync.get(['customPresets'], ({ customPresets }) => {
    if (customPresets) {
        presets.push(...customPresets);
    }
    populateSelect(presets);
});

resizeBtn.addEventListener('click', () => {
    const preset = presets[presetSelect.value];
    chrome.windows.getCurrent({}, win => {
        chrome.windows.update(win.id, { width: preset.width, height: preset.height });
    });
});

addCustomBtn.addEventListener('click', () => {
    const newPreset = { 
        name: customName.value || 'Custom', 
        width: parseInt(customWidth.value), 
        height: parseInt(customHeight.value) 
    };
    if (!newPreset.width || !newPreset.height) return alert('Enter valid dimensions!');
    presets.push(newPreset);
    populateSelect(presets);
    chrome.storage.sync.get(['customPresets'], ({ customPresets = [] }) => {
        customPresets.push(newPreset);
        chrome.storage.sync.set({ customPresets });
    });
});
