validationHandler = {}

validationHandler.requiredParams = function(incomingParams, requiredParams) {
    var missingParams = [];
    requiredParams.forEach(function(param) {
        if (!incomingParams[param]) {
            missingParams.push(param);
        }
    });
    if(missingParams.length > 0){
        throw new Error("Missing required parameters: " + missingParams.join());
    } else {
        return true;
    }
}
module.exports = validationHandler;
