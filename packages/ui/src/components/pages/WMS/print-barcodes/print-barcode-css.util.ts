export const getCssFromComponent = (fromDoc, toDoc) => {
    Array.from(fromDoc.styleSheets).forEach((styleSheet: CSSStyleSheet) => {
        try {
            if (styleSheet?.cssRules) { // true for inline styles and same-origin stylesheets
                const newStyleElement = toDoc.createElement("style");
                Array.from(styleSheet.cssRules).forEach((cssRule: CSSRule) => {
                    newStyleElement.appendChild(toDoc.createTextNode(cssRule.cssText));
                });
                toDoc.head.appendChild(newStyleElement);
            }
        } catch (e) {
            console.warn("Could not access stylesheet rules for", styleSheet.href, e);
        }
    });
  };
  