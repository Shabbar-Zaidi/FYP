class ExpressError extends Error{   // Inheriting Error class
    constructor(statusCode, message){
        super();    // This calls the constructor of the parent class (Error).
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = ExpressError;