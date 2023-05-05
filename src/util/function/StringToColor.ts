export default function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) 
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  let color = ""
  for (let i = 0; i < 3; i += 1) {
    color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
  }
  let res = ""
  const thresh = 0xee
  let brightEnough = false
  let cnt = 0
  do {
    res = ""
    for (let i = 0; i < 6; i += 2) {
      let c = color.slice(i, i + 2)
      let hex = parseInt(c, 16) * 1.2 + 0x22
      hex = hex >= 256 ? 255 : Math.floor(hex)
      if (hex > thresh)
        brightEnough = true
      res += hex.toString(16)
    }
    color = res
  } while (!brightEnough && cnt++ < 10);
  return `#${res}`;
}