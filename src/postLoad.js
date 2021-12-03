//Top Navigation

const TAB_SELECTOR = document.querySelectorAll('#topnav section>a');
const TAB_GROUP = document.querySelectorAll('[role="group"]');
const STREAMER_STYLES = `
@media (min-width: 800px),
(orientation: landscape) {

    cg-container cg-board {
        box-shadow: none !important;
    }

    div.round__app {
        grid-template-columns: minmax(calc(70vmin * var(--board-scale)), calc(100vh * var(--board-scale) - calc(var(--site-header-height) + var(--site-header-margin)) - 3rem)) minmax(240px, 400px);
        grid-template-rows: 50px 1fr auto min-content 3fr auto min-content auto 1fr 50px !important;
        grid-template-areas: 'user-top .''board .''board mat-top''board expi-top''board moves''board controls''board expi-bot''board mat-bot''board .''user-bot .''kb-move .';
    }

    rm6 {
        background: var(--surfaceColor);
        border-top: 2px solid var(--surfaceColorHover);
        border-bottom: 2px solid var(--surfaceColorHover);
        border-radius: var(--borderRadius);
    }

    .round__app .rclock-top {
        padding-bottom: 10px;
        padding-top: 5px;
        grid-area: 1/ 2;
    }

    .round__app .rclock-bottom {
        padding-top: 10px;
        padding-bottom: 5px;
        grid-area: 10 / 2;
    }

    .round__app .round__app__table {
        grid-area: 4 / 2 / 6 / 3;
    }

    .rclock {
        justify-self: flex-end;
        z-index: 1;
        display: flex;
        align-items: center;
        padding-right: calc(100% + 20px);
    }

    .rclock .tour-rank,
    .rclock .moretime,
    .rclock .berserked {
        order: -1;
    }

    .rclock .bar {
        display: none;
    }

    .rclock .time {
        position: relative;
        font-size: 1.5em;
        line-height: 0px;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .rclock.running .time {
        opacity: 1;
        color: var(--defaultWhite) !important;
    }

    .rclock .time::before {
        content: '';
        top: 0;
        left: 0;
        position: absolute;
        width: 98%;
        height: 100%;
        background: var(--defaultWhite);
        opacity: .1;
        border-radius: 4px;
        z-index: -1;
    }

    .rclock.running .time::before {
        background: var(--primaryColor);
        opacity: .5;
    }

    .rclock.emerg.running .time::before {
        background: var(--tertiaryColor);
    }

    .ruser {
        font-size: 16px;
        padding: 0em !important;
        line-height: 14px;
        background:none;
        border: none !important;
        border-radius: 0;
        align-items: center;
    }

    .ruser-bottom {
        margin-top: 5px;
    }

    .ruser-top {
        margin-bottom: 5px;
    }

    .ruser a {
        overflow: visible;
        flex: none;
    }

    .rcontrols {
        margin-top: 10px;
        background: var(--surfaceColor);
        border: 2px solid var(--surfaceColorHover);
        border-radius: var(--borderRadius);
    }

    .ricons {
        margin-top: 8px;
    }

    .round__underboard:empty {
        display: none;
    }
}

#top .site-buttons a[title="Moderation"] {
    display: none;
}
`

// Navbar Animations
TAB_SELECTOR.forEach((item, index) => {
    item.addEventListener('mouseenter', e => {
        if (item.nextSibling == TAB_GROUP[index]) {
            item.nextSibling.classList.add('topnavHover');
        }
    })

    item.addEventListener('mouseleave', e => {
        if (item.nextSibling == TAB_GROUP[index]) {
            item.nextSibling.classList.remove('topnavHover');
        }
    })

    item.nextSibling.addEventListener('mouseenter', e => {
        if (item.nextSibling == TAB_GROUP[index]) {
            item.nextSibling.classList.add('topnavHover');
        }
    })

    item.nextSibling.addEventListener('mouseleave', e => {
        if (item.nextSibling == TAB_GROUP[index]) {
            item.nextSibling.classList.remove('topnavHover');
        }
    })
})

// Setup Streamer mode button only runs on match/tv pages
chrome.storage.sync.get('streamerMode', function (result) {
    const round = document.querySelector('.round');
    if (round) {
        result = result['streamerMode']
        if (result) {
            enableStreamerMode()
        }

        var button = document.createElement("button");
        button.innerHTML = result ? "Disable Vertical Layout" : "Enable Vertical Layout";
        button.classList.add('button');
        button.classList.add('streamerButton');

        button.addEventListener("click", function () {
            if (result) {
                syncSet('streamerMode', false)
                window.location.reload()
            } else {
                syncSet('streamerMode', true)
                window.location.reload()
            }
        });

        round.appendChild(button);
    }
});

function enableStreamerMode() {
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = STREAMER_STYLES;
    document.head.appendChild(styleSheet);
}

function syncSet(scheme, value) {
    chrome.storage.sync.set({
        [scheme]: value
    })
}