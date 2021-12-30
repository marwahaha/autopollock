// https://stackoverflow.com/questions/9749910/programmatically-triggering-mouse-move-event-in-javascript
var gestureTimeoutID;
var periodicGesturesTimeoutID;

window.simulateRandomGesture = function (doneCallback) {
    var t = 0;

    var target = document.querySelector('canvas');
    var rect = target.getBoundingClientRect();

    var simulateMouseEvent = function simulateMouseEvent(type, point) {
        var event = new MouseEvent(type, {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'clientX': rect.left + point.x,
            'clientY': rect.top + point.y,
            // you can pass any other needed properties here
        });
        target.dispatchEvent(event);
    };

    // More fun:
    var cx = Math.random() * rect.width;
    var cy = Math.random() * rect.height;
    var gestureComponents = [];
    var numberOfComponents = 10;
    var rx = (1.2 +Math.random()) * Math.min(rect.width, rect.height) / 2 / numberOfComponents;
    var ry = (1.2 + Math.random()) * Math.min(rect.width, rect.height) / 2 / numberOfComponents;
    angularFactor =2*(Math.random() - 0.5);
    angularOffset = 3*(Math.random() - 0.5);
    for (var i = 0; i < numberOfComponents; i += 1) {
        gestureComponents.push({
            rx: rx,
            ry: ry,
            angularFactor: angularFactor,
            angularOffset: angularOffset,
        });
    }
    var getPointAtTime = function getPointAtTime(t) {
        var point = { x: cx, y: cy };
        for (var i = 0; i < gestureComponents.length; i += 1) {
            var c = gestureComponents[i];
            point.x += Math.sin(Math.PI * 2 * (t / 100 * c.angularFactor + c.angularOffset)) * c.rx;
            point.y += Math.cos(Math.PI * 2 * (t / 100 * c.angularFactor + c.angularOffset)) * c.ry;
        }
        return point;
    };

    simulateMouseEvent('mousedown', getPointAtTime(-1));
    simulateMouseEvent('mouseup',  getPointAtTime(0));
    var move = function move() {
        end = (15);
        if (t > end) {
            // simulateMouseEvent('mouseup', getPointAtTime(t));
            if (doneCallback) {
                doneCallback();
            }
        } else {
            simulateMouseEvent('mousemove', getPointAtTime(t));
            gestureTimeoutID = setTimeout(move, 10);
        }
        t += 1;
    };
    move();
};

window.simulateRandomGesturesPeriodically = function (delayBetweenGestures) {
    delayBetweenGestures = delayBetweenGestures !== undefined ? delayBetweenGestures : 150;

    var waitThenGo = function waitThenGo() {
        periodicGesturesTimeoutID = setTimeout(function () {
            window.simulateRandomGesture(waitThenGo);
        }, delayBetweenGestures);
    };
    window.simulateRandomGesture(waitThenGo);
};

window.stopSimulatingGestures = function () {
    clearTimeout(gestureTimeoutID);
    clearTimeout(periodicGesturesTimeoutID);
};

window.simulateRandomGesturesPeriodically();