// ==UserScript==
// @name         You're addicted to the internet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       BK927
// @match https://*/*
// @match http://*/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license MIT
// @description Give delay to each session. This will help you to stop using internet.

// ==/UserScript==
(function() {
    'use strict';

    const BlockScreen = function(seconds) {
        let elipsedSeconds = 0;

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
        displayTime.innerText = String(seconds - elipsedSeconds) + ' seconds left';

        blocker.appendChild(displayTime);
        document.body.appendChild(blocker);

        const start = function() {
            const timerId = setInterval(function() {
                if (elipsedSeconds === seconds) {
                    blocker.remove();
                    clearInterval(timerId);
                }
                console.log('blocker elapsed');
                displayTime.innerText = String(seconds - elipsedSeconds) + ' seconds left';
                document.querySelector("video").pause();
                ++elipsedSeconds;
            }, 1000);
            return timerId;
        }

        const pause = function() {
            console.log('paused');
            clearInterval(timer);
        }

        const resume = function() {
            console.log('resume');
            timer = start();
        }

                let timer = start();

        return {
            //'start': start,
            'pause': pause,
            'resume': resume,
        }
    }



    let url = location.href;
    let blocker = BlockScreen(30);
    //blocker.start();

    const handleVisibilityChange = function() {
        if (document.hidden) {
            console.log('pause');
            blocker.pause();
        } else {
            console.log('');
            blocker.resume();
        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange, false);


    document.body.addEventListener('click', () => {
        requestAnimationFrame(() => {
            if (url !== location.href) {
                console.log('url changed');
                url = location.href;
                console.log('spa block screen');
                blocker = BlockScreen(30);
                //blocker.start();
            }
        });
    }, true);

})();