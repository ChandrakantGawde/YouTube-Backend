// in this file we have to methods to deal with the asyncHandler using promise or try catch

// here we create higher order function 
// it define as same as variable and take paramer as function and return

//   const asyncHandler = (fn) => { (req, res, next) => { 
//   }}

const asyncHandler = (requestHandler) => { (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next)).
         catch((error) => next(error))
}}

export {asyncHandler}


//=====================================================

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//      try{
//        await requestHandler(req, res, next);
//      } catch(error){
//          res.status(error.code || 500).json({
//             sucess: false,
//             message: error.message
//          })
//      }
// }