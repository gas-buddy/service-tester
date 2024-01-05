module.exports = {
  root: true,
  extends: 'gasbuddy',
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
