class XSideNavigator extends HTMLElement {
    static get observedAttributes() {
        return ['data-title', 'data-theme', 'data-position'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._render();
    }

    connectedCallback() {
        this._updatePosition();
        this._updateLinks();
        this._setupMutationObserver();
        this._setupResizeObserver();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-position') {
            this._updatePosition();
        } else if (name === 'data-theme') {
            this._updateTheme();
        } else if (name === 'data-title') {
            this._updateTitle();
        }
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 120px;
                    width: 280px;
                    z-index: 9999;
                }

                .x-nav-container {
                    background: ${this.getAttribute('data-theme') === 'dark' ? '#222' : '#fff'};
                    color: ${this.getAttribute('data-theme') === 'dark' ? '#eee' : '#333'};
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 2px 16px rgba(0,0,0,0.1);
                    border: 1px solid ${this.getAttribute('data-theme') === 'dark' ? '#444' : '#ddd'};
                    font-family: system-ui, -apple-system, sans-serif;
                    transition: all 0.3s ease;
                }

                .x-nav-title {
                    margin: 0 0 12px 0;
                    font-size: 1.1em;
                    font-weight: bold;
                    color: ${this.getAttribute('data-theme') === 'dark' ? '#ff9d00' : '#0066cc'};
                }

                .x-nav-links {
                    max-height: 70vh;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .x-nav-link {
                    display: block;
                    padding: 8px 12px;
                    margin: 4px 0;
                    color: inherit;
                    text-decoration: none;
                    border-radius: 6px;
                    transition: all 0.2s;
                    font-size: 0.95em;
                }

                .x-nav-link:hover {
                    background: ${this.getAttribute('data-theme') === 'dark' ? 'rgba(255,157,0,0.1)' : 'rgba(0,102,204,0.1)'};
                }

                /* 滚动条样式 */
                .x-nav-links::-webkit-scrollbar {
                    width: 6px;
                }

                .x-nav-links::-webkit-scrollbar-track {
                    background: transparent;
                }

                .x-nav-links::-webkit-scrollbar-thumb {
                    background: ${this.getAttribute('data-theme') === 'dark' ? '#555' : '#ccc'};
                    border-radius: 3px;
                }
            </style>

            <div class="x-nav-container">
                <div class="x-nav-title">${this.getAttribute('data-title') || '章节导航'}</div>
                <div class="x-nav-links" id="links"></div>
            </div>
        `;
        this.linksContainer = this.shadowRoot.getElementById('links');
    }

    _updatePosition() {
        const position = this.getAttribute('data-position') || 'right';
        this.style.left = position === 'left' ? '20px' : '';
        this.style.right = position === 'right' ? '20px' : '';
    }

    _updateTheme() {
        const container = this.shadowRoot.querySelector('.x-nav-container');
        if (!container) return;

        const isDark = this.getAttribute('data-theme') === 'dark';
        container.style.background = isDark ? '#222' : '#fff';
        container.style.color = isDark ? '#eee' : '#333';
        container.style.borderColor = isDark ? '#444' : '#ddd';

        const title = this.shadowRoot.querySelector('.x-nav-title');
        if (title) title.style.color = isDark ? '#ff9d00' : '#0066cc';

        const links = this.shadowRoot.querySelectorAll('.x-nav-link');
        links.forEach(link => {
            link.style.color = isDark ? '#eee' : '#333';
        });
    }

    _updateTitle() {
        const title = this.shadowRoot.querySelector('.x-nav-title');
        if (title) {
            title.textContent = this.getAttribute('data-title') || '章节导航';
        }
    }

    _updateLinks() {
        if (!this.linksContainer) return;

        this.linksContainer.innerHTML = '';
        const headings = document.querySelectorAll('h2, h3');

        headings.forEach(heading => {
            const link = document.createElement('a');
            link.className = 'x-nav-link';
            link.textContent = heading.textContent;

            // 确保标题有ID
            if (!heading.id) {
                heading.id = heading.textContent.toLowerCase().replace(/\W+/g, '-');
            }
            link.href = `#${heading.id}`;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            });

            this.linksContainer.appendChild(link);
        });
    }

    _setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            const headingsChanged = mutations.some(mutation => {
                return Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && (node.tagName === 'H2' || node.tagName === 'H3')
                );
            });

            if (headingsChanged) {
                this._updateLinks();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    _setupResizeObserver() {
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                this._updateLinks();
            });
            this.resizeObserver.observe(document.body);
        }
    }

    disconnectedCallback() {
        if (this.observer) this.observer.disconnect();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }
}

customElements.define('x-side-navigator', XSideNavigator);