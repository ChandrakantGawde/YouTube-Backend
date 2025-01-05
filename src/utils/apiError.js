// as same as async handler customise function we define the errormessage structure 

// here we refer the nodejs api error class.....
// like normal class and object concept 

class ApiError extends Error {   // extending error class 
     
    constructor( statuscode, message = "Something went wrong", errors = [], stack = "" ) // constructor parameters 
    {
        super(message)   // call the parent constructor 

        // assigning properties 
        this.statuscode = statuscode  
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){  // handling the stack to trace the errors
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError} 