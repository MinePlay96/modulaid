import { Module } from './classes/Module';

Module.createModule('typescript')
  .then(module => {
    module.run();
  })

