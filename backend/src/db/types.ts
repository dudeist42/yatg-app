export enum VarcharLen {
  // main
  TINY = 32, // cuid/codes/prefixes
  SHORT = 64, // password/names/cities
  REGULAR = 128, // address/email
  MEDIUM = 255, // default
  LONG = 512, // descriptions
  LARGE = 1024, // long descriptions
  EXTRA = 2048,

  // specifics
  USERNAME = 100,
  IP = 45, // IPv4/IPv6
  UUIDV4 = 36,
}
