import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

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

function OptionsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // 加载保存的设置
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSettings = {
      ...settings,
      [name]: name === 'boldColor' ? value : Number(value)
    };
    setSettings(newSettings);
    // 保存设置
    chrome.storage.sync.set({ settings: newSettings });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Speed Reader 设置</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          文字间隔 (每隔多少个字符加粗):
          <input
            type="number"
            name="interval"
            value={settings.interval}
            onChange={handleChange}
            min="1"
            max="10"
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          加粗字体粗细 (400-900):
          <input
            type="number"
            name="boldWeight"
            value={settings.boldWeight}
            onChange={handleChange}
            min="400"
            max="900"
            step="100"
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          普通字体粗细 (100-400):
          <input
            type="number"
            name="normalWeight"
            value={settings.normalWeight}
            onChange={handleChange}
            min="100"
            max="400"
            step="100"
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          加粗字体颜色:
          <input
            type="color"
            name="boldColor"
            value={settings.boldColor}
            onChange={handleChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);
