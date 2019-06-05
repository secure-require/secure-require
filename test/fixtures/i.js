require.__proto__.call = function() {
    console.error('REPLACED Function.prototype.call');
}