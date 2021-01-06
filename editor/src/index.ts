import Editor from './editor';

window.onload = () => {
  (window as any).editorApp = new Editor();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js').then(() => {
    }, (err) => {
      // eslint-disable-next-line no-console
      console.log('ServiceWorker registration failed: ', err);
    });
  }
};
