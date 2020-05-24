"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DlVars = void 0;
class DlVars {
    constructor(gid, msg, isTar, downloadDir) {
        this.isTar = isTar;
        this.tgUsername = getUsername(msg);
        if (msg.reply_to_message) {
            this.tgRepliedUsername = getUsername(msg.reply_to_message);
        }
        this.gid = gid;
        this.downloadDir = downloadDir;
        this.tgFromId = msg.from.id;
        this.tgChatId = msg.chat.id;
        this.tgMessageId = msg.message_id;
        this.startTime = new Date().getTime();
        this.uploadedBytes = 0;
        this.uploadedBytesLast = 0;
    }
}
exports.DlVars = DlVars;
function getUsername(msg) {
    if (msg.from.username) {
        return `@${msg.from.username}`;
    }
    else {
        return `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a>`;
    }
}
