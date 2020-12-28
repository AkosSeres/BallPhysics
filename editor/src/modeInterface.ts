import Editor from "./editor";

/**
 * Interface representing a mode type for the editor
 */
interface Mode {
  name: string,
  description: string,
  drawFunc(editorApp: Editor, dt: number): void,
  startInteractionFunc(editorApp: Editor): void,
  endInteractionFunc(editorApp: Editor): void,
  keyGotUpFunc(editorApp: Editor): void,
  keyGotDownFunc(editorApp: Editor): void,
}

export default Mode;
