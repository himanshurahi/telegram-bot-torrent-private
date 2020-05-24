"use strict";
/* Copyright seedceo */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadGoogleDriveFile = void 0;
const parseRange = require('http-range-parse');
const request = require("request");
const fs = require("fs");
const driveAuth = require("./drive-auth");
const driveUtils = require("./drive-utils");
/**
   * Divide the file to multi path for upload
   * @returns {array} array of chunk info
   */
function getChunks(filePath, start) {
    var allsize = fs.statSync(filePath).size;
    var sep = allsize < (20 * 1024 * 1024) ? allsize : (20 * 1024 * 1024) - 1;
    var ar = [];
    for (var i = start; i < allsize; i += sep) {
        var bstart = i;
        var bend = i + sep - 1 < allsize ? i + sep - 1 : allsize - 1;
        var cr = 'bytes ' + bstart + '-' + bend + '/' + allsize;
        var clen = bend != allsize - 1 ? sep : allsize - i;
        var stime = allsize < (20 * 1024 * 1024) ? 5000 : 10000;
        ar.push({
            bstart: bstart,
            bend: bend,
            cr: cr,
            clen: clen,
            stime: stime
        });
    }
    return ar;
}
/**
   * Upload one chunk to the server
   * @returns {string} file id if any
   */
function uploadChunk(filePath, chunk, mimeType, uploadUrl) {
    return new Promise((resolve, reject) => {
        request.put({
            url: uploadUrl,
            headers: {
                'Content-Length': chunk.clen,
                'Content-Range': chunk.cr,
                'Content-Type': mimeType
            },
            body: fs.createReadStream(filePath, {
                encoding: null,
                start: chunk.bstart,
                end: chunk.bend + 1
            })
        }, function (error, response, body) {
            if (error) {
                console.log(`Upload chunk failed, Error from request module: ${error.message}`);
                return reject(error);
            }
            let headers = response.headers;
            if (headers && headers.range) {
                let range = parseRange(headers.range);
                if (range && range.last != chunk.bend) {
                    // range is diff, need to return to recreate chunks
                    return resolve(range);
                }
            }
            if (!body) {
                console.log(`Upload chunk return empty body.`);
                return resolve(null);
            }
            try {
                body = JSON.parse(body);
            }
            catch (e) {
                // TODO: So far `body` has been 1 liners here. If large `body` is noticed, change this
                // to dump `body` to a file instead.
                console.log(body);
                return resolve(null);
            }
            if (body && body.id) {
                return resolve(body.id);
            }
            else {
                console.log(`Got file id null`);
                return resolve(null);
            }
        });
    });
}
function uploadGoogleDriveFile(dlDetails, parent, file) {
    var fileName = file.filePath.substring(file.filePath.lastIndexOf('/') + 1);
    return new Promise((resolve, reject) => {
        var size = fs.statSync(file.filePath).size;
        driveAuth.call((err, auth) => {
            if (err) {
                return reject(new Error('Failed to get OAuth client'));
            }
            auth.getAccessToken().then(tokenResponse => {
                var token = tokenResponse.token;
                var options = driveUtils.getPublicUrlRequestHeaders(size, file.mimeType, token, fileName, parent);
                request(options, function (error, response) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            return reject(error);
                        }
                        if (!response) {
                            return reject(new Error(`Get drive resumable url return undefined headers`));
                        }
                        if (!response.headers || !response.headers.location || response.headers.location.length <= 0) {
                            return reject(new Error(`Get drive resumable url return invalid headers: ${JSON.stringify(response.headers, null, 2)}`));
                        }
                        let chunks = getChunks(file.filePath, 0);
                        let fileId = null;
                        try {
                            let i = 0;
                            let lastUploadedBytes = 0;
                            while (i < chunks.length) {
                                // last chunk will return the file id
                                fileId = yield uploadChunk(file.filePath, chunks[i], file.mimeType, response.headers.location);
                                if ((typeof fileId === 'object') && (fileId !== null)) {
                                    chunks = getChunks(file.filePath, fileId.last);
                                    i = 0;
                                    dlDetails.uploadedBytes = dlDetails.uploadedBytes - lastUploadedBytes + fileId.last;
                                    lastUploadedBytes = fileId.last;
                                }
                                else {
                                    dlDetails.uploadedBytes = dlDetails.uploadedBytes - lastUploadedBytes + chunks[i].bend;
                                    lastUploadedBytes = chunks[i].bend;
                                    i++;
                                }
                            }
                            if (fileId && fileId.length > 0) {
                                return resolve(fileId);
                            }
                            else {
                                return reject(new Error('Uploaded and got invalid id for file ' + fileName));
                            }
                        }
                        catch (er) {
                            console.log(`Uploading chunks for file ${fileName} failed: ${er.message}`);
                            return reject(er);
                        }
                    });
                });
            }).catch(err => {
                console.log('Sending request to get resumable url: ' + err.message);
                return reject(err);
            });
        });
    });
}
exports.uploadGoogleDriveFile = uploadGoogleDriveFile;
