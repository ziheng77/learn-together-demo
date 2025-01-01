import * as monaco from '@modules/monaco-editor/esm/vs/editor/editor.api.js';
// 编辑器语言支持
self.MonacoEnvironment = {
    getWorkerUrl: function (_, label) {
        if (label === 'css') {
            return '/monaco-editor/css.worker.js';
        }
        if (label === 'html') {
            return '/monaco-editor/html.worker.js';
        }
        if (label === 'json') {
            return '/monaco-editor/json.worker.js';
        }
        if (label === 'javascript' || label === 'typescript') {
            return '/monaco-editor/ts.worker.js';
        }
        return '/monaco-editor/editor.worker.js';
    }
}

class MonacoEditor extends HTMLElement {
    static instance = null;
    constructor(){
        super();
        // 单例模式，保证只有一个实例
        if(MonacoEditor.instance){
            return MonacoEditor.instance;
        }
        // 创建实例
        MonacoEditor.instance = this;
        console.log(MonacoEditor.instance)
        // 创建影子节点
        // const shadow = this.attachShadow({mode:'open'});
        // 创建编辑器实例
        this.editor = null;
        // 创建编辑器容器
        const container = document.createElement('div');
        container.id = 'editor';
        container.style.height = "800px";
        container.style.width = "100%";
        this.editor = monaco.editor.create(container, {
            value:'asdasd',
            language:'javascript',
            theme:'vs-dark',
            automaticLayout:true,
        })
        // shadow.appendChild(container);
        this.appendChild(container);
    }

    // 对外获取实例方法
    static getInstance() {
        return MonacoEditor.instance;
    }

    // 组件初始化之后执行
    connectedCallback() {
        this.editor.layout();
    }

    // 组件被移除之后执行
    disconnectedCallback() {
        this.editor.dispose();
    }


}

// 注册 MonacoEditor 自定义元素
customElements.define('monaco-editor', MonacoEditor);