const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.resolve(__dirname, '..', 'src', 'components');

function toKebab(pascal) {
    return pascal
        .replace(/([A-Z])/g, '-$1')
        .replace(/^-/, '')
        .toLowerCase();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseArgs() {
    const args = process.argv.slice(2);
    const name = args.find((a) => !a.startsWith('--'));
    const subsFlag = args.find((a) => a.startsWith('--subs'));
    const hasContext = args.includes('--context');
    const subs = subsFlag
        ? subsFlag.split('=')[1].split(/[, ]+/).map((s) => s.trim()).filter(Boolean)
        : [];
    return { name, subs, hasContext };
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ ${path.relative(COMPONENTS_DIR, filePath)}`);
}

function generateMainComponent(name, className, hasContext, subs) {
    const lines = [];

    lines.push("import type { ReactNode } from 'react';");

    if (hasContext) {
        lines.push(`import { ${name}Provider } from './${name}Context';`);
    }

    for (const sub of subs) {
        lines.push(`import ${name}${capitalize(sub)} from './${capitalize(sub)}';`);
    }

    lines.push(`import './${name}.scss';`);
    lines.push('');

    const rootName = `${name}Root`;
    lines.push(`const ${rootName} = ({ children }: { children: ReactNode }) => {`);

    if (hasContext) {
        lines.push('    return (');
        lines.push(`        <${name}Provider>`);
        lines.push(`            <div className="${className}" data-testid="${className}">{children}</div>`);
        lines.push(`        </${name}Provider>`);
        lines.push('    );');
    } else {
        lines.push(`    return <div className="${className}" data-testid="${className}">{children}</div>;`);
    }

    lines.push('};');
    lines.push('');

    const assignTargets = subs.map((s) => `${capitalize(s)}: ${name}${capitalize(s)}`).join(',\n    ');

    lines.push(`const ${name} = Object.assign(${rootName}, {`);
    if (subs.length > 0) {
        lines.push(`    ${assignTargets},`);
    }
    lines.push('});');
    lines.push('');

    lines.push(`export default ${name};`);
    lines.push('');

    return lines.join('\n');
}

function generateScss(className) {
    return `@use '../../styles/index' as *;

.${className} { }
`;
}

function generateTest(name, className) {
    return `import { render, screen } from '@testing-library/react';
import ${name} from './${name}';

describe('${name}', () => {
    it('renders', () => {
        render(<${name} />);
        expect(screen.getByTestId('${className}')).toBeInTheDocument();
    });
});
`;
}

function generateIndex(name) {
    return `export { default } from './${name}';
`;
}

function generateContext(name) {
    return `import { createContext, useContext, useState, type ReactNode } from 'react';

export interface ${name}ContextValue {
    // TODO: define context values
}

const ${name}Context = createContext<${name}ContextValue | null>(null);

export const use${name} = () => {
    const ctx = useContext(${name}Context);
    if (!ctx) throw new Error('use${name} must be used within <${name}>');
    return ctx;
};

export const ${name}Provider = ({ children }: { children: ReactNode }) => {
    // TODO: add state

    return (
        <${name}Context.Provider value={{ /* TODO */ }}>
            {children}
        </${name}Context.Provider>
    );
};
`;
}

function generateSubComponent(parentName, subName, parentClassName) {
    const componentName = `${parentName}${capitalize(subName)}`;
    const className = `${parentClassName}__${subName.toLowerCase()}`;

    return {
        tsx: `import './${capitalize(subName)}.scss';

const ${componentName} = () => {
    return (
        <div className="${className}" data-testid="${className}">
            {/* TODO: implement ${subName} */}
        </div>
    );
};

export default ${componentName};
`,
        scss: `@use '../../../styles/index' as *;

.${className} { }
`,
        index: `export { default } from './${capitalize(subName)}';
`,
    };
}

function main() {
    const { name, subs, hasContext } = parseArgs();

    if (!name) {
        console.error('Usage: node scripts/generate-component.js <ComponentName> [--subs=Header,Nav,Footer] [--context]');
        process.exit(1);
    }

    const componentDir = path.join(COMPONENTS_DIR, name);
    const className = toKebab(name);

    if (fs.existsSync(componentDir)) {
        console.error(`Error: Component "${name}" already exists at ${componentDir}`);
        process.exit(1);
    }

    console.log(`\nGenerating component "${name}"...\n`);

    ensureDir(componentDir);

    // Main files
    writeFile(path.join(componentDir, 'index.ts'), generateIndex(name));
    writeFile(path.join(componentDir, `${name}.tsx`), generateMainComponent(name, className, hasContext, subs));
    writeFile(path.join(componentDir, `${name}.scss`), generateScss(className));
    writeFile(path.join(componentDir, `${name}.test.tsx`), generateTest(name, className));

    // Optional context
    if (hasContext) {
        writeFile(path.join(componentDir, `${name}Context.tsx`), generateContext(name));
    }

    // Optional subcomponents
    for (const sub of subs) {
        const subDir = path.join(componentDir, capitalize(sub));
        ensureDir(subDir);
        const files = generateSubComponent(name, sub, className);
        writeFile(path.join(subDir, 'index.ts'), files.index);
        writeFile(path.join(subDir, `${capitalize(sub)}.tsx`), files.tsx);
        writeFile(path.join(subDir, `${capitalize(sub)}.scss`), files.scss);
    }

    console.log(`\n✔ Component "${name}" generated at src/components/${name}/`);
    if (subs.length > 0) {
        console.log(`  Subcomponents: ${subs.join(', ')}`);
    }
    if (hasContext) {
        console.log('  Context: yes');
    }
    console.log('');
}

main();
