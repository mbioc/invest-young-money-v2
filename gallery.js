document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('.gallery-dialog');
  if (!dialog) return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('.gallery-dialog-caption');
  const close = dialog.querySelector('.gallery-dialog-close');
  let trigger = null;
  document.querySelectorAll('[data-gallery-image]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      image.src = button.dataset.galleryImage;
      image.alt = button.querySelector('img').alt;
      caption.textContent = button.dataset.galleryCaption;
      dialog.showModal();
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (trigger) trigger.focus(); });
});
