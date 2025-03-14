interface Settings {
  interval: number;
  boldWeight: number;
  normalWeight: number;
  boldColor: string;
}

const defaultSettings: Settings = {
  interval: 3,
  boldWeight: 700,
  normalWeight: 400,
  boldColor: '#000000'
};

function processText(text: string, settings: Settings, isEnglish: boolean): string {
  if (isEnglish) {
    return text.split(' ').map((word, index) => {
      if (index % settings.interval === 0) {
        const boldPart = word.slice(0, Math.ceil(word.length / 2));
        const normalPart = word.slice(Math.ceil(word.length / 2));
        return `<span style="font-weight: ${settings.boldWeight}; color: ${settings.boldColor}">${boldPart}</span>${normalPart}`;
      }
      return `<span style="font-weight: ${settings.normalWeight}">${word}</span>`;
    }).join(' ');
  } else {
    return text.split('').map((char, index) => {
      if (index % settings.interval === 0) {
        return `<span style="font-weight: ${settings.boldWeight}; color: ${settings.boldColor}">${char}</span>`;
      }
      return `<span style="font-weight: ${settings.normalWeight}">${char}</span>`;
    }).join('');
  }
}

function processNode(node: Node, settings: Settings) {
  if (node.nodeType === Node.TEXT_NODE && node.textContent) {
    const text = node.textContent.trim();
    if (text) {
      const isEnglish = /^[a-zA-Z0-9\s.,!?'"]+$/.test(text);
      const span = document.createElement('span');
      span.innerHTML = processText(text, settings, isEnglish);
      node.parentNode?.replaceChild(span, node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const skipTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'];
    if (!skipTags.includes((node as Element).tagName)) {
      Array.from(node.childNodes).forEach(child => processNode(child, settings));
    }
  }
}

function processPage(settings: Settings = defaultSettings) {
  const body = document.body;
  processNode(body, settings);
}

// 初始化
function init() {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || defaultSettings;
    processPage(settings);
  });

  // 监听设置变化
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.settings) {
      const newSettings = changes.settings.newValue;
      processPage(newSettings);
    }
  });
}

// 启动插件
init();
