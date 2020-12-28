import EditorInterface from './editorInterface';

/**
 * Interface representing a mode type for the editor
 */
interface Mode {
  name: string,
  description: string,
  element: HTMLElement,
  drawFunc?(editorApp: EditorInterface, dt: number): void,
  startInteractionFunc?(editorApp: EditorInterface): void,
  endInteractionFunc?(editorApp: EditorInterface): void,
  keyGotUpFunc?(editorApp: EditorInterface): void,
  keyGotDownFunc?(editorApp: EditorInterface): void,
  activated?(editorApp: EditorInterface):void,
  deactivated?(editorApp: EditorInterface):void,
  alwaysUpdate?(editorApp:EditorInterface, dt:number):void
}

export default Mode;
