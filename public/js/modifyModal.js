document.addEventListener('DOMContentLoaded', () => {
  console.log('modifyModal.js DOMContentLoaded event fired');
  const modal = document.getElementById('modifyModal');
  const btnModify = document.querySelector('.btn-modify');
  const spanClose = document.getElementById('closeModal');

  if (btnModify) {
    console.log('btnModify found');
    btnModify.addEventListener('click', () => {
      console.log('btnModify clicked');
      modal.style.display = 'block';
    });
  } else {
    console.log('btnModify NOT found');
  }

  if (spanClose) {
    spanClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
