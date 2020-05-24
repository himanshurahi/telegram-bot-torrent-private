"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRecursive = void 0;
const fs = require("fs");
const mime = require("mime-types");
const gdrive = require("./drive/drive-upload");
/**
 * Recursively uploads a directory or a file to Google Drive. Also makes this upload
 * visible to everyone on Drive, then calls a callback with the public link to this upload.
 * @param {string} path The path of the file or directory to upload
 * @param {string} parent The ID of the Drive folder to upload into
 * @param {function} callback A function to call with an error or the public Drive link
 */
function uploadRecursive(dlDetails, path, parent, callback) {
    fs.stat(path, (err, stat) => {
        if (err) {
            callback(err.message, null);
            return;
        }
        if (stat.isDirectory()) {
            gdrive.uploadFileOrFolder(dlDetails, path, 'application/vnd.google-apps.folder', parent, 0, (err, fileId) => {
                if (err) {
                    callback(err, null);
                }
                else {
                    walkSubPath(dlDetails, path, fileId, (err) => {
                        if (err) {
                            callback(err, null);
                        }
                        else {
                            gdrive.getSharableLink(fileId, true, callback);
                        }
                    });
                }
            });
        }
        else {
            processFileOrDir(dlDetails, path, parent, (err, fileId) => {
                if (err) {
                    callback(err, null);
                }
                else {
                    gdrive.getSharableLink(fileId, false, callback);
                }
            });
        }
    });
}
exports.uploadRecursive = uploadRecursive;
function walkSubPath(dlDetails, path, parent, callback) {
    fs.readdir(path, (err, files) => {
        if (err) {
            callback(err.message);
        }
        else {
            walkSingleDir(dlDetails, path, files, parent, callback);
        }
    });
}
function walkSingleDir(dlDetails, path, files, parent, callback) {
    if (files.length === 0) {
        callback(null);
        return;
    }
    var uploadNext = function (position) {
        processFileOrDir(dlDetails, path + '/' + files[position], parent, (err) => {
            if (err) {
                callback(err);
            }
            else {
                if (++position < files.length) {
                    uploadNext(position);
                }
                else {
                    callback(null);
                }
            }
        });
    };
    uploadNext(0);
}
function processFileOrDir(dlDetails, path, parent, callback) {
    fs.stat(path, (err, stat) => {
        if (err) {
            callback(err.message);
            return;
        }
        if (stat.isDirectory()) {
            // path is a directory. Do not call the callback until the path has been completely traversed.
            gdrive.uploadFileOrFolder(dlDetails, path, 'application/vnd.google-apps.folder', parent, 0, (err, fileId) => {
                if (err) {
                    callback(err);
                }
                else {
                    walkSubPath(dlDetails, path, fileId, callback);
                }
            });
        }
        else {
            var mimeType = mime.lookup(path);
            if (!mimeType) {
                mimeType = 'application/octet-stream';
            }
            gdrive.uploadFileOrFolder(dlDetails, path, mimeType, parent, stat.size, (err, fileId) => {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, fileId);
                }
            });
        }
    });
}
