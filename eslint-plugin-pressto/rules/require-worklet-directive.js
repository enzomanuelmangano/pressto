/**
 * ESLint rule to enforce 'worklet' directive in createAnimatedPressable functions
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Enforce 'worklet' directive in functions passed to createAnimatedPressable",
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingWorklet:
        "Missing 'worklet' directive in createAnimatedPressable function. Add 'worklet'; as the first statement in the function body.",
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        // Check if this is a call to createAnimatedPressable
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'createAnimatedPressable'
        ) {
          // Get the first argument (the animation function)
          const firstArg = node.arguments[0];

          if (!firstArg) {
            return;
          }

          // Check if it's an arrow function or function expression
          if (
            firstArg.type === 'ArrowFunctionExpression' ||
            firstArg.type === 'FunctionExpression'
          ) {
            let body = firstArg.body;

            // If it's an arrow function with implicit return (no block), it's invalid
            if (firstArg.type === 'ArrowFunctionExpression' && body.type !== 'BlockStatement') {
              context.report({
                node: firstArg,
                messageId: 'missingWorklet',
              });
              return;
            }

            // Check if the function has a block statement
            if (body.type === 'BlockStatement') {
              const statements = body.body;

              if (statements.length === 0) {
                context.report({
                  node: firstArg,
                  messageId: 'missingWorklet',
                });
                return;
              }

              const firstStatement = statements[0];

              // Check if the first statement is an expression statement with a 'worklet' directive
              if (
                firstStatement.type === 'ExpressionStatement' &&
                firstStatement.expression.type === 'Literal' &&
                firstStatement.expression.value === 'worklet'
              ) {
                // Valid - has worklet directive
                return;
              }

              // Missing worklet directive
              context.report({
                node: firstArg,
                messageId: 'missingWorklet',
              });
            }
          }
        }
      },
    };
  },
};
