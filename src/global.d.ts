declare module '*.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
