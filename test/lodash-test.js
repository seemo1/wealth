var Promise = require('bluebird');
run1('start1')
    .then(function(res1) {
        console.log(res1);
        //return run2('start2');
    })
    .then(function(res2) {
        console.log(res2);
        return run3('start3');
    })
    .then(function(res3) {
        console.log(res3);
        return run4('start4');
    })
    .then(function(res4) {
        console.log(res4);
        return run5('start5');
    })
    .then(function(res5) {
        console.log(res5);
        //done();
    })
    .catch(function(err) {
        console.log(err);
        //done();
    });

function run1(str) {
    return new Promise(function(resolve, reject) {
        console.log(str);
        resolve('run1');
    });
}

function run2(str) {
    return new Promise(function(resolve, reject) {
        console.log(str);
        resolve('run2');
    });
}

function run3(str) {
    return new Promise(function(resolve, reject) {
        console.log(str);

        //reject('err3');

        resolve('run3');
    });
}

function run4(str) {
    return new Promise(function(resolve, reject) {
        console.log(str);
        resolve('run4');
    });
}

function run5(str) {
    return new Promise(function(resolve, reject) {
        console.log(str);
        resolve('run5');
    });
}
