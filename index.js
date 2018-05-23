#!/usr/bin/env node

const RouterService = require('./services/routerService');
const CommandResolver = require('./services/commandResolverService');
const ListService = require('./services/listService');
const fs = require('fs');


const route = CommandResolver.parse(process.argv);
const isGlobal = process.argv.find((arg) => arg === '-g' || arg === '--global') ? true : false;
RouterService.goTo(route, process.argv.slice(3), isGlobal);