const path = require('path');
const { version } = require('../package.json');

module.exports = function (plop) {
  plop.setGenerator('machine', {
    description: 'Create new machine',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Machine name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.resolve(
          __dirname,
          '../',
          'lib/machines/{{dashCase name}}.machine.ts',
        ),
        templateFile: 'machine.ts.hbs',
      },
      {
        type: 'add',
        path: path.resolve(
          __dirname,
          '../',
          'lib/machines/{{dashCase name}}.mdx',
        ),
        template: '# {{name}}',
      },
      {
        type: 'append',
        path: path.resolve(__dirname, '../', 'lib/metadata.ts'),
        template: `  "{{dashCase name}}": {
    title: "{{ name }}",
    icon: "PlaylistAddCheckOutlined",
    version: "${version}",
  },`,
        pattern: 'export const metadata: Record<string, MetadataItem> = {',
      },
    ],
  });
};
