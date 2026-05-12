declare module 'markdown-it-emoji' {
  import MarkdownIt from 'markdown-it';
  const emoji: MarkdownIt.Plugin;
  export default emoji;
}

declare module 'markdown-it-task-lists' {
  import MarkdownIt from 'markdown-it';
  const taskLists: MarkdownIt.Plugin;
  export default taskLists;
}

declare module 'markdown-it-mark' {
  import MarkdownIt from 'markdown-it';
  const mark: MarkdownIt.Plugin;
  export default mark;
}