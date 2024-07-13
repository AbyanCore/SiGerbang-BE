export enum LOG_COLOR {
  RED = "\x1b[31m",
  GREEN = "\x1b[32m",
  YELLOW = "\x1b[33m",
  BLUE = "\x1b[34m",
  MAGENTA = "\x1b[35m",
  CYAN = "\x1b[36m",
  WHITE = "\x1b[37m",
  DEFAULT = "\x1b[0m",
}

export default function betterlog(
  whois: string,
  message: string,
  color: LOG_COLOR = LOG_COLOR.DEFAULT
) {
  console.log(
    `${color}[${whois}]\t[${new Date().toLocaleString()}]\t${message} `
  );
}
