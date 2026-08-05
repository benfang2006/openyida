'use strict';

const Babel = require('@babel/standalone');

const parser = Babel.packages.parser;
const traverse = Babel.packages.traverse.default || Babel.packages.traverse;

const FORM_ROUTE_PATTERN = /\/(?:submission|formDetail)\//i;
const FORM_URL_NAME_PATTERN = /(?:submit|submission|detail|formOpen|form)Url|formHref|detailHref|submitHref/i;
const MOBILE_GUARD_PATTERN = /isMobile|isMobileViewport|matchMedia|utils\.isMobile|runtime\.isMobile/i;

const DEFAULT_PARSER_OPTIONS = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'typescript',
    'objectRestSpread',
    'classProperties',
    'optionalChaining',
    'nullishCoalescingOperator',
  ],
};

function getNodeLine(node) {
  return node && node.loc && node.loc.start ? node.loc.start.line : 1;
}

function getNodeText(sourceCode, node) {
  if (!node || typeof node.start !== 'number' || typeof node.end !== 'number') {
    return '';
  }
  return sourceCode.slice(node.start, node.end);
}

function nodeContains(parent, child) {
  return !!(
    parent &&
    child &&
    typeof parent.start === 'number' &&
    typeof parent.end === 'number' &&
    typeof child.start === 'number' &&
    typeof child.end === 'number' &&
    parent.start <= child.start &&
    parent.end >= child.end
  );
}

function literalContainsFormRoute(node) {
  if (!node) {
    return false;
  }
  if (node.type === 'StringLiteral') {
    return FORM_ROUTE_PATTERN.test(node.value || '');
  }
  if (node.type === 'TemplateLiteral') {
    return node.quasis.some((quasi) => FORM_ROUTE_PATTERN.test((quasi.value && (quasi.value.cooked || quasi.value.raw)) || ''));
  }
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    return literalContainsFormRoute(node.left) || literalContainsFormRoute(node.right);
  }
  if (node.type === 'ConditionalExpression') {
    return literalContainsFormRoute(node.consequent) || literalContainsFormRoute(node.alternate);
  }
  return false;
}

function isWindowOpenCall(callee) {
  return !!(
    callee &&
    callee.type === 'MemberExpression' &&
    callee.object &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'window' &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'open'
  );
}

function isOpenPageCall(callee) {
  return !!(
    callee &&
    callee.type === 'MemberExpression' &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'openPage'
  );
}

function isLocationHrefAssignment(node) {
  if (!node || node.type !== 'AssignmentExpression' || node.operator !== '=') {
    return false;
  }
  const left = node.left;
  if (!left || left.type !== 'MemberExpression') {
    return false;
  }
  if (!left.property || left.property.type !== 'Identifier' || left.property.name !== 'href') {
    return false;
  }
  if (left.object && left.object.type === 'Identifier' && left.object.name === 'location') {
    return true;
  }
  return !!(
    left.object &&
    left.object.type === 'MemberExpression' &&
    left.object.object &&
    left.object.object.type === 'Identifier' &&
    left.object.object.name === 'window' &&
    left.object.property &&
    left.object.property.type === 'Identifier' &&
    left.object.property.name === 'location'
  );
}

function isMobileGuarded(pathRef, sourceCode) {
  let cursor = pathRef;
  while (cursor && cursor.parentPath) {
    const parent = cursor.parentPath;
    if (parent.node && parent.node.type === 'IfStatement' && nodeContains(parent.node.consequent, pathRef.node)) {
      if (MOBILE_GUARD_PATTERN.test(getNodeText(sourceCode, parent.node.test))) {
        return true;
      }
    }
    if (parent.node && parent.node.type === 'ConditionalExpression') {
      if (MOBILE_GUARD_PATTERN.test(getNodeText(sourceCode, parent.node.test))) {
        return true;
      }
    }
    cursor = parent;
  }
  return false;
}

function expressionLooksLikeFormUrl(node, sourceCode, knownFormUrlNames) {
  if (!node) {
    return false;
  }
  if (literalContainsFormRoute(node)) {
    return true;
  }
  if (node.type === 'Identifier') {
    return knownFormUrlNames.has(node.name) || FORM_URL_NAME_PATTERN.test(node.name);
  }
  if (node.type === 'CallExpression') {
    return FORM_URL_NAME_PATTERN.test(getNodeText(sourceCode, node.callee));
  }
  return FORM_ROUTE_PATTERN.test(getNodeText(sourceCode, node));
}

function findDirectFormOpenIssues(sourceCode, options = {}) {
  if (typeof sourceCode !== 'string' || sourceCode.trim() === '') {
    return [];
  }

  let ast;
  try {
    ast = parser.parse(sourceCode, options.parserOptions || DEFAULT_PARSER_OPTIONS);
  } catch {
    return [];
  }

  const knownFormUrlNames = new Set();
  traverse(ast, {
    VariableDeclarator(pathRef) {
      const id = pathRef.node.id;
      if (!id || id.type !== 'Identifier') {
        return;
      }
      if (literalContainsFormRoute(pathRef.node.init) || FORM_URL_NAME_PATTERN.test(id.name)) {
        knownFormUrlNames.add(id.name);
      }
    },
  });

  const issues = [];
  traverse(ast, {
    CallExpression(pathRef) {
      const callee = pathRef.node.callee;
      if (!isWindowOpenCall(callee) && !isOpenPageCall(callee)) {
        return;
      }
      const firstArg = pathRef.node.arguments && pathRef.node.arguments[0];
      if (!expressionLooksLikeFormUrl(firstArg, sourceCode, knownFormUrlNames)) {
        return;
      }
      if (isMobileGuarded(pathRef, sourceCode)) {
        return;
      }
      issues.push({
        line: getNodeLine(pathRef.node),
        callee: getNodeText(sourceCode, callee),
      });
    },
    AssignmentExpression(pathRef) {
      if (!isLocationHrefAssignment(pathRef.node)) {
        return;
      }
      if (!expressionLooksLikeFormUrl(pathRef.node.right, sourceCode, knownFormUrlNames)) {
        return;
      }
      if (isMobileGuarded(pathRef, sourceCode)) {
        return;
      }
      issues.push({
        line: getNodeLine(pathRef.node),
        callee: getNodeText(sourceCode, pathRef.node.left),
      });
    },
  });

  return issues;
}

function formatDirectFormOpenMessage() {
  return '自定义页内打开表单提交/详情只能使用 FormOpenContainer：PC 端用 50vw 抽屉 iframe，移动端才整页或新页打开。按钮事件请调用 openForm({ type: "submission" | "detail", ... })。';
}

module.exports = {
  findDirectFormOpenIssues,
  formatDirectFormOpenMessage,
};
