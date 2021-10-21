interface ProcessEnv {
  NODE_ENV: 'development' | 'production';
}

declare const process: {
  env: Readonly<ProcessEnv>;
};

declare module '*.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
