const express = require('express');
const app = express();

const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const {map} = require('lodash');

let runningTask = [''];
//- default is every one minute
const doJob = (asterisk = '* * * * *', randomFunc) => {
    return cron.schedule(asterisk, randomFunc, {
        scheduled: false
    });
}

//- every 10 seconds
let taskA = doJob('*/10 * * * * *', function() {
    console.log('task A');
});

//- every one minute
let taskB = doJob('* * * * *', function() {
    console.log('task B');
});

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

// function removeTaskById(uuid) {}
// function runAllTask() {}

// function stopTaskById(uuid) {}

app.get('/start/task/:uuid', (req, res)=> {
    const uuid = req.params.uuid;
    startTaskById(uuid);
    res.json({
        "message": "started task with id" + uuid
    });
});

app.get('/start/jobs', (req, res)=> {
    taskA.start();
    taskB.start();
    res.json({
        "message": "starting jobs..."
    });
});

app.get('/add/task/:message', (req, res) => {
    const message = req.params.message;
    addTask('*/10 * * * * *', () => {
        console.log(message);
    });
    console.log('running task', runningTask);
    res.json({
        "message": "added new task to system"
    });
})

app.get('/stop/:taskName', (req, res)=> {
    //- task name should be a or b
    console.log('request params', req.params);
    const taskName = req.params.taskName;
    switch (taskName) {
        case 'a':
            taskA.stop();
            res.json({
                "message": 'stoped task a'
            });
            break;
        
        case 'b':
            taskB.stop();
            res.json({
                "message": "stopped task b"
            });
            break;
        default:
            break;
    }
});

app.get('/restart/:taskName', (req, res)=> {
    //- task name should be a or b
    console.log('request params', req.params);
    const taskName = req.params.taskName;
    switch (taskName) {
        case 'a':
            taskA.start();
            res.json({
                "message": 'restarted task a'
            });
            break;
        
        case 'b':
            taskB.start();
            res.json({
                "message": "restarted task b"
            });
            break;
        default:
            break;
    }
});

app.get('/monit', (req, res)=> {
    res.json({
        "message": {
            "task A": taskA.getStatus(),
            "task B": taskB.getStatus(),
            "allRunningTask": JSON.stringify(runningTask)
        }
    });
});

app.listen(3000, function() {
    console.log('listening on 3000')
})