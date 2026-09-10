(function () {
  const HEADER_OFFSET = 260;

  const tabSelectors = [
    '.e-n-tab-title',
    '.elementor-tab-title',
    '[role="tab"]'
  ].join(',');

  const escapeSelector = (value) => {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return value.replace(/"/g, '\\"');
  };

  const scrollToTabs = (element) => {
    const wrapper =
      element.closest('.tech-tabs') ||
      element.closest('.elementor-widget-n-tabs') ||
      element.closest('.elementor-widget-tabs') ||
      element;

    const top =
      wrapper.getBoundingClientRect().top +
      window.pageYOffset -
      HEADER_OFFSET;

    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };

  const activateTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');

    if (!hash) return;

    const decodedHash = decodeURIComponent(hash);
    const escapedHash = escapeSelector(decodedHash);

    const target = document.getElementById(decodedHash);

    if (!target) return;

    let tabButton = target.matches(tabSelectors)
      ? target
      : target.closest(tabSelectors);

    if (!tabButton) {
      tabButton = document.querySelector(
        '.e-n-tab-title[aria-controls="' + escapedHash + '"], ' +
        '.elementor-tab-title[aria-controls="' + escapedHash + '"], ' +
        '[role="tab"][aria-controls="' + escapedHash + '"]'
      );
    }

    if (tabButton) {
      tabButton.click();

      setTimeout(() => {
        scrollToTabs(tabButton);
      }, 250);

      return;
    }

    scrollToTabs(target);
  };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(activateTabFromHash, 400);
  });

  window.addEventListener('load', () => {
    setTimeout(activateTabFromHash, 700);
  });

  window.addEventListener('hashchange', () => {
    setTimeout(activateTabFromHash, 150);
  });
})();
