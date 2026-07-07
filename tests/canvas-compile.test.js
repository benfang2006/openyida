'use strict';

const {
  compileCanvas,
  compileCanvasLocal,
  extractImportedModules,
  resolveWindowAlias,
} = require('../lib/app/canvas-compile');

/**
 * 模拟 @ali/vc-deep-yida 的 YidaCodeCanvas 运行时装配（factory.tsx）：
 * 把 runtimeCode 包进 `new Function`，注入 window 桩，取回 YidaComp。
 */
function assembleRuntime(runtimeCode, stubWindow) {
  const wrapped =
    'return function(iframeWindow, parentWindow){ const window = iframeWindow; ' +
    runtimeCode +
    ' return YidaComp; }';
  // eslint-disable-next-line no-new-func
  const factory = new Function(wrapped)();
  return factory(stubWindow, stubWindow);
}

function stubReactWindow(extra) {
  const calls = [];
  const React = {
    createElement: (type, props, ...children) => {
      const name = typeof type === 'function' ? type.name || 'anon' : String(type);
      const node = { type: name, props: props || {}, children };
      calls.push(node);
      return node;
    },
    Fragment: 'Fragment',
    useState: (v) => [v, () => {}],
    useEffect: () => {},
    useMemo: (fn) => fn(),
    __esModule: false,
  };
  return Object.assign({ React, __calls: calls }, extra || {});
}

describe('extractImportedModules', () => {
  test('collects bare package names, skips relative/absolute, dedups & sorts', () => {
    const code = `
      import React from 'react';
      import { Button } from 'antd';
      import './local.css';
      import '/abs/thing';
      const d = require('d3');
      const lazy = import('recharts');
      import { Button as B2 } from 'antd';
    `;
    expect(extractImportedModules(code)).toEqual(['antd', 'd3', 'react', 'recharts']);
  });
});

describe('resolveWindowAlias', () => {
  test('maps known packages and sub-paths to window aliases', () => {
    expect(resolveWindowAlias('react')).toBe('React');
    expect(resolveWindowAlias('antd')).toBe('antd');
    expect(resolveWindowAlias('antd/es/button')).toBe('antd');
    expect(resolveWindowAlias('@ant-design/icons')).toBe('icons');
    expect(resolveWindowAlias('lucide-react')).toBe('DynamicIcon');
  });
  test('returns null for unknown packages', () => {
    expect(resolveWindowAlias('left-pad')).toBeNull();
  });
});

describe('compileCanvasLocal', () => {
  test('produces new Function-compatible runtimeCode that yields a rendering YidaComp', () => {
    const src = `
      import React, { useState } from 'react';
      import { Button, Card } from 'antd';
      import './styles.css';
      export default function App(props) {
        const [n, setN] = useState(0);
        return (
          <Card title="hello">
            <Button onClick={() => setN(n + 1)}>{n}</Button>
          </Card>
        );
      }
    `;
    const { runtimeCode, importedModules } = compileCanvasLocal(src);

    // runtimeCode 不得再含 JSX 或 ESM 语法
    expect(runtimeCode).not.toMatch(/</); // 无 JSX 尖括号残留（createElement 后应无 <）
    expect(runtimeCode).not.toMatch(/\bimport\s/);
    expect(runtimeCode).not.toMatch(/\bexport\s/);
    // 依赖被改写为 window 别名
    expect(runtimeCode).toMatch(/window\.React/);
    expect(runtimeCode).toMatch(/window\.antd/);
    // 收敛出 YidaComp 绑定
    expect(runtimeCode).toMatch(/YidaComp\s*=/);

    // importedModules 是 JSON 数组字符串；副作用 CSS 不计入
    const mods = JSON.parse(importedModules);
    expect(mods).toEqual(expect.arrayContaining(['antd', 'react']));
    expect(mods).not.toContain('./styles.css');

    // 运行时契约：装配后能拿到组件并渲染
    const win = stubReactWindow({
      antd: { Button: function Button() {}, Card: function Card() {} },
    });
    const Comp = assembleRuntime(runtimeCode, win);
    expect(typeof Comp).toBe('function');
    const tree = Comp({});
    expect(tree.type).toBe('Card');
    expect(tree.children[0].type).toBe('Button');
  });

  test('auto-injects React binding when source omits react import but uses JSX', () => {
    const src = `
      export default function Hello() {
        return <div className="x">hi</div>;
      }
    `;
    const { runtimeCode, importedModules } = compileCanvasLocal(src);
    expect(runtimeCode).toMatch(/window\.React/);
    expect(JSON.parse(importedModules)).toContain('react');
    const win = stubReactWindow();
    const Comp = assembleRuntime(runtimeCode, win);
    const tree = Comp({});
    expect(tree.type).toBe('div');
  });

  test('handles arrow-function default export and namespace import', () => {
    const src = `
      import * as d3 from 'd3';
      const Widget = (props) => <span>{d3.version}</span>;
      export default Widget;
    `;
    const { runtimeCode } = compileCanvasLocal(src);
    expect(runtimeCode).toMatch(/window\.d3/);
    const win = stubReactWindow({ d3: { version: '7.9.0' } });
    const Comp = assembleRuntime(runtimeCode, win);
    const tree = Comp({});
    expect(tree.type).toBe('span');
    expect(tree.children[0]).toBe('7.9.0');
  });

  test('strips TypeScript types', () => {
    const src = `
      import React from 'react';
      interface P { name: string }
      const C: React.FC<P> = (p: P) => <b>{p.name}</b>;
      export default C;
    `;
    const { runtimeCode } = compileCanvasLocal(src);
    expect(runtimeCode).not.toMatch(/interface\s/);
    expect(runtimeCode).not.toMatch(/:\s*P\b/);
    const win = stubReactWindow();
    const Comp = assembleRuntime(runtimeCode, win);
    expect(Comp({ name: 'z' }).type).toBe('b');
  });
});

describe('compileCanvas (async wrapper)', () => {
  test('resolves with runtimeCode + importedModules', async () => {
    const out = await compileCanvas('export default () => <i>ok</i>;');
    expect(out).toHaveProperty('runtimeCode');
    expect(out).toHaveProperty('importedModules');
    expect(out.runtimeCode).toMatch(/YidaComp/);
  });

  test('rejects on empty source', async () => {
    await expect(compileCanvas('   ')).rejects.toThrow(/源码为空/);
  });

  test('rejects with friendly message on invalid syntax', async () => {
    await expect(compileCanvas('export default function( {')).rejects.toThrow(/本地编译失败/);
  });
});
