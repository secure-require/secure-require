const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.__proto__.on = (event) => event === 'myevent' && console.error('REPLACED EventEmitter.on!', event);