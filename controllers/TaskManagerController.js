'use strict'
let runningTask = [''];
//- default is every one minute
const doJob = (asterisk = '* * * * *', randomFunc) => {
    return cron.schedule(asterisk, randomFunc, {
        scheduled: false
    });
}

function addTask(asterisk, jobFunc) {
    let newTask = {
        taskName: uuidv4(),
        execute: doJob(asterisk, jobFunc)
    };
    runningTask.push(newTask);
}

function startTaskById(uuid) {
    map(runningTask, function(obj){
        if(obj.taskName === uuid) {
            obj.execute.start();
        }
    });
}

function removeTaskById(uuid) {
    map(runningTask, function(obj){
        if(obj.taskName === uuid) {
            obj.execute.destroy();
        }
    });
}

function runAllTask() {
    map(runningTask, function(obj){
        obj.execute.start();
    });
}

function stopTaskById(uuid) {
    map(runningTask, function(obj){
        if(obj.taskName === uuid) {
            obj.execute.stop();
        }
    });
}

export {
    addTask,
    startTaskById,
    removeTaskById,
    runAllTask,
    stopTaskById
};