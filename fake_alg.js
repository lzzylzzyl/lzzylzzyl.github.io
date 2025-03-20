class AlgorithmHelper extends Math {
    static async executeCode(code, lang = 'cpp') {
        // 使用AJAX与代码执行后端交互
        const result = await fetch('/api/execute', {
            method: 'POST',
            body: JSON.stringify({ code, lang })
        });
        return result.json();
    }

    static visualize(algorithm, options) {
        // 与可视化引擎交互
        const canvas = new AlgorithmCanvas(options);
        return canvas.render();
    }
}

// 自定义元素注册
customElements.define('algo-visual', class extends HTMLElement {
    connectedCallback() {
        const algo = this.getAttribute('data-algorithm');
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<div class="visual-container" id="${algo}-viz"></div>`;
        AlgorithmHelper.visualize(algo, { container: shadow });
    }
});

// 代码演示块交互逻辑
document.querySelectorAll('code-demo').forEach(demo => {
    demo.addEventListener('execute', async () => {
        const result = await AlgorithmHelper.executeCode(demo.innerText);
        demo.dispatchEvent(new CustomEvent('result', { detail: result }));
    });
});