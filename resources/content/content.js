import isArticle from '../articles.js';
import isPreposition from '../prepositions.js';
import isCompound from '../compounds.js';

function isValidWord(word) {
  return isArticle(word) || isPreposition(word) || isCompound(word);
}

export class Content extends Element {
  app;

  constructor(props) {
    super();
    this.app = props.app;
  }

  render() {
    const lyrics = this.app.songLyrics.replace(/\r?\n{2,}/g, '\n\n');
    const lines = lyrics.split(/\r?\n/);

    this.post(() => {
      const NOUNS = this.app.nouns;

      this.$$('text').forEach((text) => {
        const nouns = [
          ...text.innerHTML.matchAll(
            /(?<a>((?<=^)[A-ZÄÖÜẞ])?[a-zäöüß']+\s)?(?<b>((?<=^)[A-ZÄÖÜẞ])?[a-zäöüß']+\s)?(?<noun>(?<!^)[A-ZÄÖÜẞ][a-zäöüß]+)/g
          ),
        ]
          .map((match) => {
            if (!match) return null;

            let { a, b, noun } = match.groups;
            
            /*if (/ein/i.test(a) && /paar/i.test(b)) {
              a = undefined;
              b = undefined;
            }*/

            let x = a?.slice(0, -1);
            let y = b?.slice(0, -1);

            const firstLetter = noun[0];
            const index = NOUNS[firstLetter]?.[noun];
            const gender = ['male', 'female', 'neuter'][index];
            if (!gender) return null;

            console.log(`${noun.toUpperCase()} <= ${x} ${y} ${noun}`);

            if (!isValidWord(x) && isValidWord(y)) {
              console.log('TWO (2) [only B recognized]');

              let start = match.index + a.length;
              let end = start + b.length + noun.length;

              //if (isArticle(x)) {
              //  start = match.index;
              //  end = start + a.length + b.length + noun.length;
              //}

              console.log(`@${match.index} ${x} ${y} ${noun} (${gender}) => start: ${start} end: ${end}`);
              return { element: text.firstChild, noun, gender, start, end };
            }

            if (isValidWord(x) && isValidWord(y)) {
              console.log('THREE (3)');
              console.log(`a: ${a} b: ${b}`);

              console.log(`x: ${x} y: ${y} noun: ${noun}`);

              const { index: start } = match;
              const end = start + x.length + 1 + y.length + 1 + noun.length;
              console.log(`@${match.index} ${x} ${y} ${noun} (${gender}) => start: ${start} end: ${end}`);
              return { element: text.firstChild, noun, gender, start, end };
            } 

            if (isValidWord(x) && !isValidWord(y)) {
              console.log('TWO (2) [only A recognized]');
              console.log(`a: ${a} b: ${b}`);

              console.log(`x: ${x} y: ${y} noun: ${noun}`);

              let start = match.index;
              let end = start + a.length + noun.length;

              if (isArticle(x)) {
                start = match.index;
                end = start + a.length + (b?.length || 0) + noun.length;
              }

              if (isCompound(x)) {
                start = match.index;
                end = start + a.length + (b?.length || 0) + noun.length;
              }

              console.log(`@${match.index} ${x} ${y} ${noun} (${gender}) => start: ${start} end: ${end}`);
              return { element: text.firstChild, noun, gender, start, end };
            }

            if (!isValidWord(x) && !isValidWord(y)) {
              console.log('ONE (1)');
              console.log(`a: ${a} b: ${b}`);

              let start = match.index;
              let end = start + noun.length;

              if (a && b) {
                start = match.index + a.length + b.length;
                end = start + noun.length;
              }

              if (a && !b) {
                start = match.index + a.length;
                end = start + noun.length;
              }

              if (!a && b) {
                start = match.index + b.length;
                end = start + a.length + b.length + noun.length;
              }

              console.log(`@${match.index} ${x} ${y} ${noun} (${gender}) => start: ${start} end: ${end}`);

              const { index, input, groups } = match;
              //console.log('\t' + JSON.stringify({ index, input, groups }));

              return { element: text.firstChild, noun, gender, start, end };
            }

            return null;
          })
          .filter(Boolean);

        nouns.forEach(({ element, noun, gender, start, end }) => {
          const range = new Range();
          range.setStart(element, start);
          range.setEnd(element, end);
          range.applyMark([gender]);
        });
      });

      this.componentUpdate({ status: 'Lyrics loaded.' });
    });

    return (
      <div id="container" styleset={__DIR__ + 'content.css#content'}>
        <h1>{this.app.songTitle}</h1>
        <plaintext readonly="true">
          {lines.map((line) => (
            <text>{line}</text>
          ))}
        </plaintext>
      </div>
    );
  }
}
