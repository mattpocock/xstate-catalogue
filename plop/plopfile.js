const path = require("path");

module.exports = function (plop) {
  plop.setGenerator("machine", {
    description: "Create new machine",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Machine name",
      },
    ],
    actions: [
      {
        type: "add",
        path: path.resolve(
          __dirname,
          "../",
          "lib/machines/{{dashCase name}}.machine.ts",
        ),
        templateFile: "machine.ts.hbs",
      },
      {
        type: "add",
        path: path.resolve(
          __dirname,
          "../",
          "lib/machines/{{dashCase name}}.mdx",
        ),
        template: "# {{properCase name}}",
      },
    ],
  });
};
