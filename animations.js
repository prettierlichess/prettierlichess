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