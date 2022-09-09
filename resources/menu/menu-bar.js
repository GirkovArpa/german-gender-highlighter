export class MenuBar extends Element {
  app;

  constructor(props) {
    super();
    this.app = props.app;
  }

  render() {
    return (
      <ul styleset={__DIR__ + 'menu-bar.css#menu-bar'}>
        <li>
          File
          <menu name="file">
            <li class="command" name="open" accesskey="^KeyO">
              Open <span class="accesskey">CTRL+O</span>
            </li>
          </menu>
        </li>
        <li>
          Help
          <menu name="help">
            <li class="command" name="about" accesskey="!F1">
              About <span class="accesskey">F1</span>
            </li>
          </menu>
        </li>
      </ul>
    );
  }

  ['on click at [name=file] > [name=open]']() {
    const filename = Window.this
      .selectFile({
        mode: 'open',
        filter: 'TXT files (*.txt)|*.txt',
        caption: 'Open lyric file...',
        extension: 'txt',
      })
      ?.replace('file://', '')
      ?.replace(/.+/, (filename) => decodeURIComponent(filename));

    if (!filename) return;

    const songLyrics = fetch(filename, { sync: true }).text();
    const songTitle = filename.split(/[\/\\]+/).reverse()[0].split('.')[0];
    this.app.componentUpdate({ songTitle, songLyrics });
    
  }

  ['on click at [name=help] > [name=about]']() {
    Window.this.modal({ url: 'about/about.htm' })
  }
}
