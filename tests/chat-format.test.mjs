import assert from 'node:assert/strict';
import { test } from 'node:test';

import { hasChatFormatting, parseChatText, plainChatText } from '../src/lib/chat-format.ts';

const styles = (text) => parseChatText(text).map((span) => [span.text, ['bold', 'italic', 'strike', 'code'].filter((key) => span[key]).join('+')]);

test('WhatsApp markers: bold, italic, strikethrough, code', () => {
  assert.deepEqual(styles('*hello*'), [['hello', 'bold']]);
  assert.deepEqual(styles('see _this_ now'), [['see ', ''], ['this', 'italic'], [' now', '']]);
  assert.deepEqual(styles('~gone~!'), [['gone', 'strike'], ['!', '']]);
  assert.deepEqual(styles('run `npm test` please'), [['run ', ''], ['npm test', 'code'], [' please', '']]);
  assert.deepEqual(styles('```a *b*\nc```'), [['a *b*\nc', 'code']]);
});

test('markers combine', () => {
  assert.deepEqual(styles('*_both_*'), [['both', 'bold+italic']]);
  assert.deepEqual(styles('*bold and _italic_*'), [['bold and ', 'bold'], ['italic', 'bold+italic']]);
});

test('ordinary text is left alone', () => {
  for (const text of ['2*3*4', 'snake_case_name', 'a * b * c', '* not bold *', 'price ~5~6', 'email me_at_home', '**', 'a*b']) {
    assert.deepEqual(styles(text), [[text, '']], text);
  }
  assert.deepEqual(styles('*one*\n*two*'), [['one', 'bold'], ['\n', ''], ['two', 'bold']]);
  assert.deepEqual(styles('*not\nacross lines*'), [['*not\nacross lines*', '']]);
});

test('plain text for previews', () => {
  assert.equal(plainChatText('*Exam* on _Friday_ ~maybe~'), 'Exam on Friday maybe');
  assert.equal(hasChatFormatting('plain message'), false);
  assert.equal(hasChatFormatting('2*3*4'), false);
  assert.equal(hasChatFormatting('a *bold* word'), true);
});
