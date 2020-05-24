"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExps = void 0;
class RegExps {
    constructor(commands) {
        this.start = new RegExp(commands[0]);
        this.mirrorTar = new RegExp(commands[1]);
        this.mirror = new RegExp(commands[2]);
        this.mirrorStatus = new RegExp(commands[3]);
        this.list = new RegExp(commands[4]);
        this.getFolder = new RegExp(commands[5]);
        this.cancelMirror = new RegExp(commands[6]);
        this.cancelAll = new RegExp(commands[7]);
        this.disk = new RegExp(commands[8]);
        this.ping = new RegExp(commands[9]);
    }
}
exports.RegExps = RegExps;
