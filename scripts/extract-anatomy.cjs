const fs = require('fs');
const JSZip = require('jszip');

async function extractPptx(zipPath, member, outFile) {
  const zipData = fs.readFileSync(zipPath);
  const outerZip = await JSZip.loadAsync(zipData);
  const innerData = await outerZip.file(member)?.async('nodebuffer');
  if (!innerData) { console.log('Member not found:', member); return; }
  const innerZip = await JSZip.loadAsync(innerData);
  const slideFiles = Object.keys(innerZip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml$/));
  slideFiles.sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0]);
    const nb = parseInt(b.match(/\d+/)[0]);
    return na - nb;
  });
  let out = '';
  for (const sf of slideFiles) {
    const xml = await innerZip.file(sf).async('string');
    const texts = [];
    let m;
    const re = /<a:t>([\s\S]*?)<\/a:t>/g;
    while ((m = re.exec(xml))) {
      const t = m[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      if (t) texts.push(t);
    }
    const num = sf.match(/slide(\d+)/)[1];
    if (texts.length) out += 'SLIDE ' + num + ': ' + texts.join(' | ') + '\n';
    else out += 'SLIDE ' + num + ': [image-only]\n';
  }
  fs.writeFileSync(outFile, out);
  console.log('Wrote', outFile, '(' + slideFiles.length + ' slides)');
}

const ZIP = 'content/Anatomy-20261003T001157Z-1-002.zip';

(async () => {
  await extractPptx(ZIP, 'Anatomy/Gross/Cardiovascular/Cardiovascular System Gross 1.pptx', 'cvs-gross-1.txt');
  // Also list ALL files in the ZIP for reference
  const zipData = fs.readFileSync(ZIP);
  const outerZip = await JSZip.loadAsync(zipData);
  const allFiles = Object.keys(outerZip.files)
    .filter(f => !outerZip.files[f].dir)
    .filter(f => f.endsWith('.pptx') || f.endsWith('.ppt') || f.endsWith('.pptm') || f.endsWith('.pdf'))
    .sort();
  fs.writeFileSync('anatomy-zip-files.txt', allFiles.join('\n'));
  console.log('All slide/pdf files:', allFiles.length);
})().catch(e => { console.error(e); process.exit(1); });
