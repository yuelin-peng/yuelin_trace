import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItEmoji from 'markdown-it-emoji';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItMark from 'markdown-it-mark';

export const md = new MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true,
  quotes: '""',
  highlight: function (str: string, lang: string): string {
    return `<pre class="hljs"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
  },
})
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'after',
      class: 'header-anchor',
      symbol: '#',
    }),
    slugify: (s: string) => s.toLowerCase().replace(/[^\w]+/g, '-'),
  })
  .use(markdownItEmoji)
  .use(markdownItTaskLists, { enabled: true, label: true, labelAfter: true })
  .use(markdownItMark);

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const aIndex = token.attrIndex('target');
  if (aIndex < 0) {
    token.attrPush(['target', '_blank']);
  } else {
    token.attrPush(['rel', 'noopener noreferrer']);
  }
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.fence = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const lang = token.info.trim();
  
  if (token.hidden) {
    return `<pre class="hidden-code">${md.utils.escapeHtml(token.content)}</pre>`;
  }
  
  return `<div class="code-block" data-lang="${lang}">
    <div class="code-header">
      <span class="code-lang">${lang || 'text'}</span>
      <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">Copy</button>
    </div>
    <pre><code class="language-${lang}">${md.utils.escapeHtml(token.content)}</code></pre>
  </div>`;
};

export function renderMarkdown(content: string): string {
  return md.render(content);
}

export function renderInline(content: string): string {
  return md.renderInline(content);
}

export const markdownConfig = {
  plugins: [
    'markdown-it-anchor',
    'markdown-it-emoji',
    'markdown-it-task-lists',
    'markdown-it-mark',
  ],
  options: {
    html: false,
    xhtmlOut: false,
    breaks: true,
    linkify: true,
    typographer: true,
  },
};

export default md;