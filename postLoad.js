//Top Navigation

const tabSelector = document.querySelectorAll('#topnav section>a');
const tabGroup = document.querySelectorAll('[role="group"]');

tabSelector.forEach((item, index) => {
    item.addEventListener('mouseenter', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.add('topnavHover');
        }
    })

    item.addEventListener('mouseleave', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.remove('topnavHover');
        }
    })

    item.nextSibling.addEventListener('mouseenter', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.add('topnavHover');
        }
    })

    item.nextSibling.addEventListener('mouseleave', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.remove('topnavHover');
        }
    })
})

//Streamer Mode

var styles = `
@media (min-width: 800px),
(orientation: landscape) {
    div.round__app {
        grid-template-columns: minmax(calc(70vmin * var(--board-scale)), calc(100vh * var(--board-scale) - calc(var(--site-header-height) + var(--site-header-margin)) - 3rem)) minmax(240px, 400px);
        grid-template-rows: 60px 1fr auto min-content 3fr auto min-content auto 1fr 60px !important;
        grid-template-areas: 'user-top .''board .''board mat-top''board expi-top''board moves''board controls''board expi-bot''board mat-bot''board .''user-bot .''kb-move .';
    }

    rm6 {
        background: var(--surfaceColor);
        border-top: 2px solid var(--surfaceColorHover);
        border-bottom: 2px solid var(--surfaceColorHover);
        border-radius: var(--borderRadius);
    }

    .round__app .rclock-top {
        padding-bottom: 20px;
        padding-top: 10px;
        grid-area: 1/ 2;
    }

    .round__app .rclock-bottom {
        padding-top: 20px;
        padding-bottom: 10px;
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
        padding-right: calc(100% + 30px);
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
        font-size: 1.3em;
        line-height: 0px;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .ruser {
        font-size: 16px;
        padding: 0em .5em !important;
        line-height: 14px;
        background: var(--surfaceColor);
        border: 2px solid var(--surfaceColorHover);
        border-radius: var(--borderRadius);
        align-items: center;
    }

    .ruser-bottom {
        margin-top: 10px;
    }

    .ruser-top {
        margin-bottom: 10px;
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
        margin-top: 0;
    }
}

#top .site-buttons a[title="Moderation"] {
    display: none;
}
`

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Enable Streamer Mode";
button.classList.add('button');
button.style.maxHeight = '40px';

// 2. Append somewhere
var round = document.querySelector('.round');
round.appendChild(button);

// 3. Add event handler
button.addEventListener("click", function () {
    alert("Streamer Mode Enabled!");
});