import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Retrieves the current time or converts a Date into
 * an ISO timezone aware string. i.e '2021-06-13T09:22:15.926-05:00'
 * By default, new Date().toISOString() would be UTC.
 *
 * @param {Date|null} date - Optionally, the date to
 *     convert to a timezone aware ISO string. Otherwise,
 *     the current time will be used.
 *
 * @returns {String} A timezone aware ISO date string.
 */
function getTimezoneAwareISOString(date = null) {
  let tzOffsetMin = new Date().getTimezoneOffset();
  let tzOffsetMs = tzOffsetMin * 60000;
  let timeMs = date instanceof Date ? date.getTime() : Date.now();

  return new Date(timeMs - tzOffsetMs).toISOString().replace(
    'Z',
    // A '-' is used here since the offset sign is
    // flipped from what we want when we
    // getTimezoneOffset(). Ex. UTC+10 => -600
    // However, we want +10:00 in the ISO string,
    // not -10:00.
    convertMinutesToOffset(-tzOffsetMin)
  );
}

/**
 * Convert minutes to a UTC offset.
 *
 * @param {Number} minutes - The minutes to convert to an offset.
 * @returns {String} A time of the form '+10:00'.
 */
function convertMinutesToOffset(minutes) {
  if (minutes === 0) {
    return 'Z';
  }

  let absMinutes = Math.abs(minutes);
  let h = Math.floor(absMinutes / 60);
  let m = absMinutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;

  let hoursMins = h + ':' + m;
  return minutes > 0 ? `+${hoursMins}` : `-${hoursMins}`;
}

const fileName = process.argv[2];
const tags = process.argv.slice(3);

if (!fileName) {
    console.error('Please provide a file name');
    process.exit(1);
}

const dashedFileName = fileName.toLowerCase().replace(/\s+/g, '-');
const title = fileName;
const date = getTimezoneAwareISOString();
const filePath = path.join('src', 'content', 'posts', `${dashedFileName}.md`);

// Format tags with proper indentation
const formattedTags = tags.length
    ? tags.map(tag => `  - ${tag}`).join('\n')
    : '  - example';

const content = `---
tags:
${formattedTags}
description: '${title}'
title: '${title}'
pubDate: '${date}'
draft: true
---

`;

await fs.writeFile(filePath, content, 'utf8');
console.log(`Created new post: ${filePath}`);
