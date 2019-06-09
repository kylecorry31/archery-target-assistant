
class ListView extends HTMLElement {
    private shadow: ShadowRoot;

    constructor(private items: {title: string, subtitle?: string, value: any}[]){
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        var style = document.createElement('style');
        style.innerHTML = `
            :host {
                --hover-bg-color: rgba(0, 0, 0, 0.12);
            }

            .list-item {
                width: calc(100% - 32px);
                padding: 12px 16px;
                min-height: 64px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .item-title {
                font-size: 16px;
                font-weight: bold;
                margin: 0;
                padding: 0;
                height: 28px;
            }

            .item-subtitle {
                font-size: 12px;
                font-weight: normal;
                margin: 0;
                padding: 0;
                height: 28px;
                opacity: 0.6;
            }

            .list-item:hover {
                background-color: var(--hover-bg-color);
            }
        `;
        this.shadow.appendChild(style);
        for (let i = 0; i < this.items.length; i++){
            let item = this.items[i];
            let div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `<p class="item-title">${item.title}</p>${item.subtitle ? `<p class="item-subtitle">${item.subtitle}</p>` : ''}`;
            div.addEventListener('click', this.onItemClick.bind(this, i));
            this.shadow.appendChild(div);
        }
    }

    private onItemClick(index: number): void {
        var event = new CustomEvent('item-click', {
            detail: {
                value: this.items[index].value,
                title: this.items[index].title,
                subtitle: this.items[index].subtitle,
                position: index
            }
        })
        this.dispatchEvent(event);
    }
}

window.customElements.define('list-view', ListView);

export = ListView;