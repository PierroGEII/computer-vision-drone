/**
 * @Author Raphael Manke, codecentric AG
 *
 * This class is used to record from a microphone an listens to a hotword.
 *
 * Simply use the constructor to create a new microphone listener.
 *
 */

'use-strict'

module.exports = Voice;

const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;


/**
 *
 * @param resourceFile
 * @constructor
 */
function Voice(resourceFile) {
    this.models = new Models();
    this.resourceFile = resourceFile;
}


/**
 * add a hotword file to the models
 * @param path path to the hotword file
 * @param name name of the horword
 */
Voice.prototype.addHotWord = function(path, name, sensitivity) {

    this.models.add({
        file: path,
        sensitivity: sensitivity,
        hotwords : name
    });
    this.detector = new Detector({
        resource: this.resourceFile,
        models: this.models,
        audioGain: 2.0
    });
}


/**
 * register a new hotword reaction
 * @param hotword the hotword to react on
 * @param callback the callback which will be called on the hotword occurence
 */
Voice.prototype.registerHotwordReaction = function(callback) {
    this.detector.on('hotword', callback);
}


/**
 *
 */
Voice.prototype.triggerStart = function()  {
    const mic = record.start({
        threshold: 0,
        verbose: true
    });

    mic.pipe(this.detector);

}
