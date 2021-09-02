"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("./classes/Module");
Module_1.Module.createModule('typescript')
    .then(module => {
    module.run();
});
