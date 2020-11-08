/**
 * @file Disallow document.write() and document.writeln().
 * @author Jumpei Ogawa
 */
"use strict";

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-document-write");
const RuleTester = require("eslint").RuleTester;


// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const jsRuleTester = new RuleTester({ parserOptions: { ecmaVersion: 2019 }});
const tsRuleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2019,
  },
});

for (const ruleTester of [ jsRuleTester, tsRuleTester ]) {
  ruleTester.run("no-document-write", rule, {
    valid: [
      {
        code: `
          console.log("This code should be valid since there is no document.write[ln]()");
        `,
      },
      {
        code: `
          const d = document;
          if (true) {
            const d = {
              write: (str) => {
                console.log("I'm not document.write()!", str);
              }
            }
            d.write("I'm not document.write()!");
          }
        `,
      },
      {
        code: `
          let d = {
            write: (str) => {
              console.log("I'm not document.write()!", str);
            }
          };
          d.write("I'm not document.write()!");

          d = document;
        `,
      },
      {
        code: `
          let d = document;
          d = {
            write: (str) => {
              console.log("I'm not document.write()!", str);
            }
          };
          d.write("I'm not document.write()!");
        `,
      },
      {
        code: `
          let d;
          if (false) {
            d = document;
          } else {
            d = {
              write: (str) => {
                console.log("I'm not document.write()!", str);
              }
            };

            d.write("I may be document.write()!");
          }
        `,
      },
    ],

    invalid: [
      {
        code: `
          document.write("foo");
          document.writeln("bar");
        `,
        errors: [
          {
            message: "document.write() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 2,
            endLine: 2,
            column: 11,
            endColumn: 25,
          },
          {
            message: "document.writeln() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 3,
            endLine: 3,
            column: 11,
            endColumn: 27,
          },
        ],
      },
      {
        code: `
          const d = document;
          d.write("I'm document.write()!");
          d.writeln("I'm document.writeln()!");
        `,
        errors: [
          {
            message: "document.write() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 3,
            endLine: 3,
            column: 11,
            endColumn: 18,
          },
          {
            message: "document.writeln() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 4,
            endLine: 4,
            column: 11,
            endColumn: 20,
          },
        ],
      },
      {
        code: `
          var d = document;
          console.log(d); // Read only reference
          d.write("I'm document.write()!");
          d.writeln("I'm document.writeln()!");
        `,
        errors: [
          {
            message: "document.write() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 4,
            endLine: 4,
            column: 11,
            endColumn: 18,
          },
          {
            message: "document.writeln() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 5,
            endLine: 5,
            column: 11,
            endColumn: 20,
          },
        ],
      },
      {
        code: `
          const w = document.write;
          const wl = document.writeln;
          w("I'm document.write()!");
          wl("I'm document.writeln()!");
        `,
        errors: [
          {
            message: "document.write() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 2,
            endLine: 2,
            column: 21,
            endColumn: 35,
          },
          {
            message: "document.writeln() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 3,
            endLine: 3,
            column: 22,
            endColumn: 38,
          },
        ],
      },
      {
        code: `
          let d;
          if (false) {
            d = document;
          } else {
            d = {
              write: (str) => {
                console.log("I'm not document.write()!", str);
              }
            };
          }

          d.write("I may be document.write()!");
        `,
        errors: [
          {
            message: "document.write() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 13,
            endLine: 13,
            column: 11,
            endColumn: 18,
          },
        ],
      },
      {
        code: `
          let d = {
            write: (str) => {
              console.log("I'm not document.write()!", str);
            }
          };

          d = document;
          d.write("I'm document.write()");
        `,
        errors: [
          {
            message: "document.write() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 9,
            endLine: 9,
            column: 11,
            endColumn: 18,
          },
        ],
      },
      {
        code: `
          (function(d) {
            d.write("I'm document.write()");
          })(document);
        `,
        errors: [
          {
            message: "document.write() is not allowed. Use .innerHTML or .appendChild() instead",
            line: 9,
            endLine: 9,
            column: 11,
            endColumn: 18,
          },
        ],
      },
    ],
  });
}
