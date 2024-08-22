/**
 * Displays a toast message.
 * 
 * @param {string} message - The message to be displayed in the toast.
 * @param {string} [type='info'] - The type of the toast. Defaults to 'info'.
 * @param {number} [duration=3000] - The duration in milliseconds for which the toast should be displayed. Defaults to 3000.
 */
export function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show the toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide the toast after the specified duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, duration);
}
