const express = require('express');
const expressError = require('./expressError')

const app = express();

function freqCount(string){
    let obj = {};
    let arr = string.split(',')
    for(let i = 0; i < arr.length; i++){
        if(!obj[arr[i]]) obj[arr[i]] = 1;
        else obj[arr[i]]++
    }
    return obj
}

app.get('/mean/:nums', function(req, res,next) {
    if (!req.query.nums) {
        throw new ExpressError('You must use numbers with commas.', 400)
      }
    let nums = req.params.nums
    let average = 0;
    let length = 0;
    for(let i = 0; i < nums.length; i++){
        if(nums[i] !== ','){
            average += Number(nums[i]);
            length++;
        }
    }
    average = average/length
    return res.json({ operation: 'mean', value: average});
  });

app.get('/median/:nums', function(req, res,next) {
    if (!req.query.nums) {
        throw new ExpressError('You must use numbers with commas.', 400)
      }
   let nums = req.params.nums.split(',').map(x => Number(x)).sort((a,b) => a-b)
   let mid = (nums.length + 1)/2;
   if(nums.length % 2 === 0){
       let lower = nums[Math.floor(mid)];
       let upper = nums[Math.ceil(mid)];
       let median = (upper + lower)/2;
       return res.json({ operation: 'median', value: median});
   } else {
       let median = nums[mid-1];
       return res.json({ operation: 'median', value: median})
   }
   
  });

app.get('/mode/:nums', function(req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError('You must use numbers with commas.', 400)
      }
    let nums = req.params.nums
    let obj = freqCount(nums);
    let mode = 0;
    for(let key in obj){
        if(obj[key] > mode) mode = obj[key]
    }
    return res.json({ operation: 'mode', value: mode})
  });





app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});

app.use(function(err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: {message, status}
  });
});

app.listen(3000, function () {
    console.log('App on port 3000');
  });