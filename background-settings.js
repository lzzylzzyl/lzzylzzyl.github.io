// background-settings.js
class BackgroundSettings extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          left: 20px;
          bottom: 20px;
          background: rgba(30, 30, 30, 0.95);
          padding: 15px;
          border-radius: 10px;
          width: 220px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          font-family: -apple-system, BlinkMacSystemFont, 
                      "Segoe UI", "Microsoft YaHei", 
                      "PingFang SC", "Hiragino Sans GB", 
                      sans-serif;
        }
        
        #settings-panel {
          color: white;
        }
        
        h4 {
          margin: 0 0 12px 0;
          color: #FF9500;
          font-size: 16px;
          font-weight: 600;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 149, 0, 0.3);
        }
        
        .setting-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin: 8px 0 5px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        input[type="color"] {
          width: 100%;
          height: 32px;
          padding: 2px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          cursor: pointer;
        }
        
        select {
          width: 100%;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          font-size: 13px;
        }
        
        select option {
          background: #333;
          color: white;
          padding: 8px;
        }
        
        .reset-btn {
          margin-top: 15px;
          width: 100%;
          padding: 8px;
          background: rgba(255, 149, 0, 0.2);
          color: #FF9500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        
        .reset-btn:hover {
          background: rgba(255, 149, 0, 0.3);
        }
      </style>
      
      <div id="settings-panel">
        <h4>显示设置</h4>
        
        <div class="setting-group">
          <label for="bg-color">背景颜色</label>
          <input type="color" id="bg-color" value="#1a1a1a">
        </div>
        
        <div class="setting-group">
          <label for="font-style">字体设置</label>
          <select id="font-style">
            <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif">系统默认</option>
            <option value="'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif">微软雅黑/苹方</option>
            <option value="'Noto Sans SC', sans-serif">思源黑体</option>
            <option value="'SimSun', 'Songti SC', serif">宋体/宋体-简</option>
            <option value="'Courier New', monospace">等宽字体</option>
          </select>
        </div>
        
        <button class="reset-btn" id="reset-btn">恢复默认设置</button>
      </div>
    `;

        // 初始化元素引用
        this.bgColorInput = this.shadowRoot.getElementById('bg-color');
        this.fontStyleSelect = this.shadowRoot.getElementById('font-style');
        this.resetBtn = this.shadowRoot.getElementById('reset-btn');
    }

    connectedCallback() {
        // 加载保存的设置
        this.loadSettings();

        // 添加事件监听
        this.bgColorInput.addEventListener('input', this.handleBgColorChange);
        this.fontStyleSelect.addEventListener('change', this.handleFontStyleChange);
        this.resetBtn.addEventListener('click', this.resetSettings);

        // 初始化应用到页面
        this.applySettings();
    }

    disconnectedCallback() {
        this.bgColorInput.removeEventListener('input', this.handleBgColorChange);
        this.fontStyleSelect.removeEventListener('change', this.handleFontStyleChange);
        this.resetBtn.removeEventListener('click', this.resetSettings);
    }

    loadSettings = () => {
        // 从localStorage加载设置
        const savedBgColor = localStorage.getItem('bgSettings_color');
        const savedFontStyle = localStorage.getItem('bgSettings_font');

        if (savedBgColor) {
            this.bgColorInput.value = savedBgColor;
        }

        if (savedFontStyle) {
            this.fontStyleSelect.value = savedFontStyle;
        }
    }

    saveSettings = () => {
        // 保存设置到localStorage
        localStorage.setItem('bgSettings_color', this.bgColorInput.value);
        localStorage.setItem('bgSettings_font', this.fontStyleSelect.value);
    }

    applySettings = () => {
        // 应用当前设置到页面
        document.body.style.backgroundColor = this.bgColorInput.value;
        document.body.style.fontFamily = this.fontStyleSelect.value;
    }

    handleBgColorChange = (e) => {
        document.body.style.backgroundColor = e.target.value;
        this.saveSettings();
    }

    handleFontStyleChange = (e) => {
        document.body.style.fontFamily = e.target.value;
        this.saveSettings();
    }

    resetSettings = () => {
        // 重置为默认值
        this.bgColorInput.value = '#1a1a1a';
        this.fontStyleSelect.value = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif";

        // 应用到页面并保存
        this.applySettings();
        this.saveSettings();
    }
}

// 注册自定义元素
if (!customElements.get('background-settings')) {
    customElements.define('background-settings', BackgroundSettings);
}