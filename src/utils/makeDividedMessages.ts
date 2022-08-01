export default (
  text: string
): string[] => {
  let head = text.slice(0, 450);
  let tail = text.slice(450);

  let messages = [];

  let lastDot = text => {
    let pos = -1;
    let re = /(\.)(?:[^a-z0-9])/g;
    let match;
    while ((match = re.exec(text)) != null) {
      pos = match.index;
    }
    return pos;
  };

  while (head.length > 0) {
    if (tail.length == 0) {
      messages.push(head.trim());
    } else {
      let index = Math.max.apply(null, [
        lastDot(head),
        head.lastIndexOf("!"),
        head.lastIndexOf("?"),
        head.lastIndexOf("\n")
      ]);

      if (index < 0) {
        messages.push(head.trim());
      } else {
        messages.push(head.slice(0, index + 1).trim());
        tail = head.slice(index + 1) + tail;
      }
    }

    head = tail.slice(0, 450);
    tail = tail.slice(450);
  }

  return messages.map(text => `\u00AD${text}`);
};