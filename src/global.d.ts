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

declare module '*.svg' {
  const src: string;
  export default src;
}
