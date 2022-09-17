//Top Navigation

const TAB_SELECTOR = document.querySelectorAll('#topnav section>a');
const TAB_GROUP = document.querySelectorAll('[role="group"]');

// Navbar Animations
TAB_SELECTOR.forEach((item, index) => {
	item.addEventListener('mouseenter', (e) => {
		if (item.nextSibling == TAB_GROUP[index]) {
			item.nextSibling.classList.add('topnavHover');
		}
	});

	item.addEventListener('mouseleave', (e) => {
		if (item.nextSibling == TAB_GROUP[index]) {
			item.nextSibling.classList.remove('topnavHover');
		}
	});

	item.nextSibling.addEventListener('mouseenter', (e) => {
		if (item.nextSibling == TAB_GROUP[index]) {
			item.nextSibling.classList.add('topnavHover');
		}
	});

	item.nextSibling.addEventListener('mouseleave', (e) => {
		if (item.nextSibling == TAB_GROUP[index]) {
			item.nextSibling.classList.remove('topnavHover');
		}
	});
});
