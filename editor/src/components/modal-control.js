/**
 * @param {HTMLElement[]} content A set of HTML elements for the content od the modal
 * @param {() => void} onClose Callback function called when the modal is closed
 */
export function useModal(content, onClose) {
  const modal = document.getElementById('creation-modal');

  if (modal) {
    modal.innerHTML = '';
    modal.append(...content);

    const closeButton = document.getElementById('close-button');
    if (closeButton) {
      closeButton.onclick = null;
      closeButton.onclick = () => {
        const modalBg = document.getElementById('modal-bg');
        if (modalBg) modalBg.classList.remove('showModal');
        onClose();
      };
    }
  }
}

/**
 * Clears the content of the modal.
 */
export function clearModal() {
  const modal = document.getElementById('creation-modal');
  if (modal) modal.innerHTML = '';
}

/**
 * Unhides the modal from the user.
 */
export function showModal() {
  const modalBg = document.getElementById('modal-bg');
  if (modalBg) modalBg.classList.add('showModal');
}

/**
 * Hides the modal from the user.
 */
export function hideModal() {
  const modalBg = document.getElementById('modal-bg');
  if (modalBg) modalBg.classList.remove('showModal');
}

/**
 * Sets a new width for the modal.
 *
 * @param {string} newWidth CSS value for setting the new width of the modal.
 */
export function setModalWidth(newWidth) {
  const modalCard = document.getElementById('modal-card');
  if (modalCard) {
    modalCard.style.width = newWidth;
  }
}

/**
 * Sets a new height for the modal.
 *
 * @param {string} newHeight CSS value for setting the new width of the modal.
 */
export function setModalHeight(newHeight) {
  const modalCard = document.getElementById('modal-card');
  if (modalCard) {
    modalCard.style.height = newHeight;
  }
}
