// ==UserScript==
// @name         You're addicted to the internet
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       BK927
// @match https://*/*
// @match http://*/*
// @icon         https://raw.githubusercontent.com/BK927/AddictionBlocker/main/icon.png
// @grant        none
// @license MIT
// @description Give delay to each session. This will help you to stop using internet.

// ==/UserScript==
(function() {
    //
    // Variables
    //
    var countdown;
    var time = 30000;
    let url = location.href;
    //
    // Set state-based components
    //
    var blockTimer = {
        time: time,
        completed: false
    };

    const blocker = document.createElement("div");
    blocker.style.alignItems = 'center';
    blocker.style.backgroundColor = '#000';
    blocker.style.display = 'flex';
    blocker.style.margin = '0';
    blocker.style.width = '100vw';
    blocker.style.height = '100vh';
    blocker.style.position = 'fixed';
    blocker.style.justifyContent = 'center';
    blocker.style.zIndex = '999999999999999';

    const displayTime = document.createElement("p");
    displayTime.style.fontSize = '3rem';
    displayTime.style.color = "#FFF";


    blocker.appendChild(displayTime);
    document.body.appendChild(blocker);

    //
    // Methods
    //
    var timer = function() {
        if (blockTimer.time == 0) {
            completedTimer();
        } else {
            blockTimer.time = blockTimer.time - 1000;
            // pause Youtube and other video players
            document.querySelector("video").pause();
            updateDisplayTime();
        }
    };

    var updateDisplayTime = function() {
        displayTime.innerText = String(blockTimer.time / 1000) + ' seconds left';
    }

    var startTimer = function() {
        countdown = window.setInterval(timer, 1000);
    };

    var stopTimer = function() {
        clearInterval(countdown);
    };

    var resetTimer = function() {
        stopTimer();
        blockTimer.time = time;
        blockTimer.completed = false;
        blocker.style.display = 'flex';
    };

    var completedTimer = function() {
        stopTimer();
        blockTimer.completed = false
        blocker.style.display = 'none';
    };

    var visibilityChangeHandler = function() {
        const flag = vis();
        if (flag) {
            console.log('visible');
            startTimer();
        } else {
            console.log('hidden');
            stopTimer();
        }
    };

    var vis = (function() {
        var stateKey, eventKey, keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };
        for (stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }
        return function(c) {
            if (c) document.addEventListener(eventKey, c);
            return !document[stateKey];
        }
    })();

    vis(visibilityChangeHandler);

    blocker.addEventListener('mouseenter', e => {
        console.log('mouseenter');
        startTimer();
    });

    blocker.addEventListener('mouseleave', e => {
        console.log('mouseleave');
        stopTimer();
    });

    document.body.addEventListener('click', () => {
        requestAnimationFrame(() => {
            if (url !== location.href) {
                console.log('url changed');
                url = location.href;
                console.log('spa block screen');
                resetTimer();
            }
        });
    }, true);
})();