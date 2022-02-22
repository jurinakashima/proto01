// https://wp-kyoto.net/lunr-search-by-typescript/
import Lunr from 'lunr'
type Ilunr = (config: Lunr.ConfigFunction) => Lunr.Index;
type JPlunr = Ilunr & {
    ja: any
};

export const lunr: JPlunr = require('lunr');
require('lunr-languages/lunr.stemmer.support.js')(lunr);
require('lunr-languages/tinyseg.js')(lunr);
require('lunr-languages/lunr.ja.js')(lunr);
