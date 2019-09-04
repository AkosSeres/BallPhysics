module.exports = new (function() {
  this.compress = (string) => {
    let ret = (' ' + string).slice(1);

    let regexes = [/false/g, /true/g, /"[a-zA-Z0-9_.]*"/g];
    let results = new Map();

    regexes.forEach((regex) => {
      let matches = ret.match(regex);

      if (matches && matches.length > 0) {
        matches.forEach((match) => {
          if (results.has(match)) {
            results.set(match, results.get(match) + match.length);
          } else results.set(match, match.length);
        });
      }
    });

    let sorted = new Map(
      [...results.entries()].sort((a, b) => {
        return a[1] < b[1] ? 1 : -1;
      })
    );
    delete results;

    ret.replace(/(\r\n|\n|\r)/gm, '');

    let i = 0;
    for (let entry of sorted) {
      sorted.set(entry[0], '_' + i.toString(36) + '_');

      ret = ret.replace(new RegExp(entry[0], 'g'), '_' + i.toString(36) + '_');

      i++;
    }
    delete i;

    return JSON.stringify([...sorted]) + 'endoftheentries' + ret;
  };

  this.uncompress = (compressed) => {
    let parts = compressed.split('endoftheentries');
    let entries = JSON.parse(parts[0]);
    let ret = parts[1];

    entries.forEach((e) => {
      ret = ret.replace(new RegExp(e[1], 'g'), e[0]);
    });

    return ret;
  };
})();
