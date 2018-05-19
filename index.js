#!/usr/bin/env node

const RouterService = require('./services/routerService');
const CommandResolver = require('./services/commandResolverService');
const fs = require('fs');


const route = CommandResolver.parse(process.argv);
RouterService.goTo(route, process.argv.slice(3));