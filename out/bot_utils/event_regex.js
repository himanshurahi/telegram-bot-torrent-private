"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegex = void 0;
const constants = require("../.constants");
const regexps = require("./reg_exps");
class EventRegex {
    constructor() {
        var commands = ['^/start', '^/mirrortar', '^/mirror', '^/mirrorstatus', '^/list', '^/getfolder', '^/cancelmirror', '^/cancelall', '^/disk', '^/ping'];
        var commandsNoName = [];
        var commandAfter = ['$', ' (.+)', ' (.+)', '$', ' (.+)', '$', '$', '$', '$', '$'];
        if (constants.COMMANDS_USE_BOT_NAME && constants.COMMANDS_USE_BOT_NAME.ENABLED) {
            commands.forEach((command, i) => {
                if (command === '^/list') {
                    // In case of more than one of these bots in the same group, we want all of them to respond to /list
                    commands[i] = command + commandAfter[i];
                }
                else {
                    commands[i] = command + constants.COMMANDS_USE_BOT_NAME.NAME + commandAfter[i];
                }
                commandsNoName.push(this.getNamelessCommand(command, commandAfter[i]));
            });
        }
        else {
            commands.forEach((command, i) => {
                commands[i] = command + commandAfter[i];
                commandsNoName.push(this.getNamelessCommand(command, commandAfter[i]));
            });
        }
        this.commandsRegex = new regexps.RegExps(commands);
        this.commandsRegexNoName = new regexps.RegExps(commandsNoName);
    }
    getNamelessCommand(command, after) {
        return `(${command}|${command}@[\\S]+)${after}`;
    }
}
exports.EventRegex = EventRegex;
