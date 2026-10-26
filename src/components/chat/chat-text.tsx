import { Platform, type StyleProp, type TextStyle } from 'react-native';

import { Text } from '@/components/ui/text';
import { hasChatFormatting, parseChatText } from '@/lib/chat-format';

const MONO = Platform.select({ web: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', default: 'monospace' });

/** A chat message's text with WhatsApp formatting: *bold*, _italic_, ~strike~, `code` (lib/chat-format.ts). */
export function ChatText({ text, style, codeBackground }: { text: string; style: StyleProp<TextStyle>; codeBackground: string }) {
  if (!hasChatFormatting(text)) {
    return <Text style={style} selectable>{text}</Text>;
  }
  return (
    <Text style={style} selectable>
      {parseChatText(text).map((span, index) => (
        <Text
          key={index}
          style={[
            span.bold && { fontWeight: '700' },
            span.italic && { fontStyle: 'italic' },
            span.strike && { textDecorationLine: 'line-through' },
            span.code && { fontFamily: MONO, fontSize: 13.5, backgroundColor: codeBackground, borderRadius: 4 },
          ]}
        >
          {span.text}
        </Text>
      ))}
    </Text>
  );
}
