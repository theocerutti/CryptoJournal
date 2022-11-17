import axios from 'axios';

const htmlEntities: Record<string, string> = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  dollar: '$',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  mdash: '–',
  ndash: '-',
  quot: '"',
  amp: '&',
  apos: "'",
};

export const scrape = async (
  url: string,
  regexInput: string,
  retry = 0,
  convertNum = true
): Promise<number | string> => {
  if (isNaN(retry)) {
    retry = 0;
  }

  let output = 'ERROR!';

  if (regexInput.length > 1) {
    try {
      const res = await axios.get(url);
      if (res) {
        const html = res.data;
        if (html.length && regexInput.length) {
          output = html.match(new RegExp(regexInput, 'i'))[1];
        }
      }
    } catch (e) {
      console.error('importRegex() yielded an error: ' + e);

      if (retry < 3) {
        return scrape(url, regexInput, retry + 1, convertNum);
      }
    }
  }

  return convertNum ? toReadableNumber(unescapeHTML(output)) : unescapeHTML(output);
};

const toReadableNumber = (numString: string): number => {
  let s = numString.replace(/ /g, '').replace(/[^.,0-9]/g, '');
  if (!s.includes('.') && s.includes(',')) s = s.replace(/,/g, '.');
  return parseFloat(s.replace(',', ''));
};

const unescapeHTML = (str: string): string => {
  if (str != null) {
    if (typeof str != 'string') {
      str = String(str);
    }

    return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
      let match;

      if (entityCode in htmlEntities) {
        return htmlEntities[entityCode];
      } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
        return String.fromCharCode(parseInt(match[1], 16));
      } else if ((match = entityCode.match(/^#(\d+)$/))) {
        return String.fromCharCode(~~match[1]);
      } else {
        return entity;
      }
    });
  }
};
