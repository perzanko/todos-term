module.exports = [
  {
    name: 'ROUTE_START',
    namespace: 'START',
    description: 'Cras mattis consectetur purus sit amet fermentum.',
    commands: [
      'start',
      '',
    ],
    module: require('./modules/start'),
  },
  {
    name: 'ROUTE_CREATE',
    namespace: 'CREATE',
    description: 'Create your own .todos list and keep it locally in your directory',
    commands: [
      'create',
      'crt',
      'cr',
    ],
    module: require('./modules/create'),
  },
  {
    name: 'ROUTE_LIST',
    namespace: 'LIST',
    description: 'Cras mattis consectetur purus sit amet fermentum.',
    commands: [
      'list',
      'lst',
      'ls',
      'l',
    ],
    module: require('./modules/list'),
  },
  {
    name: 'ROUTE_ADD',
    namespace: 'ADD',
    description: 'Cras mattis consectetur purus sit amet fermentum.',
    commands: [
      'add',
      'ad',
      'a',
    ],
    module: require('./modules/add'),
  },
  {
    name: 'ROUTE_REMOVE',
    namespace: 'REMOVE',
    description: 'Cras mattis consectetur purus sit amet fermentum.',
    commands: [
      'remove',
      'rem',
      'rm',
      'r',
    ],
  },
  {
    name: 'ROUTE_STATUS',
    namespace: 'STATUS',
    description: 'Change status of .todos single item',
    commands: [
      'status',
      'stat',
      'st',
      's',
    ],
    module: require('./modules/status'),
  },
  {
    name: 'ROUTE_EDIT',
    namespace: 'EDIT',
    description: 'Cras mattis consectetur purus sit amet fermentum.',
    commands: [
      'edit',
      'ed',
      'e',
    ],
  },
  {
    name: 'ROUTE_HELP',
    namespace: 'HELP',
    description: 'Cras mattis consectetur purus sit amet fermentum.',
    commands: [
      'help',
      'h',
    ],
  },
];