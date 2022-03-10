interface ProcessEnv {
  NODE_ENV: 'development' | 'production';
  MIXPANEL_PROJECT_TOKEN: string;
  STRIPE_PUB_KEY: string;
  STRIPE_ACCOUNT: string;
}

declare const process: {
  env: Readonly<ProcessEnv>;
};

declare type ValuesOf<T extends unknown[]> = T[number];

declare type DateString = string & { __isDateString: true };

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

declare module 'pdfjs-dist/build/pdf.worker.min' {
  const path: string;
  export default path;
}

declare namespace Intl {
  type ListType = 'conjunction' | 'disjunction';

  interface ListFormatOptions {
    localeMatcher?: 'lookup' | 'best fit';
    type?: ListType;
    style?: 'long' | 'short' | 'narrow';
  }

  interface ListFormatPart {
    type: 'element' | 'literal';
    value: string;
  }

  class ListFormat {
    constructor(locales?: string | string[], options?: ListFormatOptions);
    format(values: unknown[]): string;
    formatToParts(values: unknown[]): ListFormatPart[];
    supportedLocalesOf(locales: string | string[], options?: ListFormatOptions): string[];
  }
}
