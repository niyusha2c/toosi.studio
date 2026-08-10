(function () {
  document.querySelectorAll('.email-link').forEach(function (link) {
    var email = link.getAttribute('data-email');
    var revealed = false;

    link.addEventListener('click', function (e) {
      e.preventDefault();

      if (!revealed) {
        link.textContent = email;
        revealed = true;
        return;
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(function () {});
      }
      link.textContent = 'copied';
      setTimeout(function () {
        link.textContent = email;
      }, 1200);
    });
  });
})();
