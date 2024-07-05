export default function betterlog(whois: string, message: string) {
  console.log(`[${whois}]\t[${new Date().toLocaleString()}]\t${message}`);
}
