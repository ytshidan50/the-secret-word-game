// TypeScript ambient declarations for standalone files without local node_modules
declare var require: any;
declare var module: any;
declare var exports: any;
declare var process: any;
declare var __dirname: string;

declare module 'react' {
  export = React;
  export as namespace React;
  export default React;

  namespace React {
    type ReactNode = any;
    type JSXElementConstructor<P> = any;
    interface RefObject<T> { readonly current: T | null; }
    interface MutableRefObject<T> { current: T; }
    type DependencyList = ReadonlyArray<unknown>;

    function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
    function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
    function useRef<T>(initialValue: T): MutableRefObject<T>;
    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;

    interface MouseEvent<T = Element> {
      preventDefault(): void;
      stopPropagation(): void;
    }
    interface TouchEvent<T = Element> {
      preventDefault(): void;
      stopPropagation(): void;
    }
    interface KeyboardEvent<T = Element> {
      key: string;
      preventDefault(): void;
      stopPropagation(): void;
    }
    interface HTMLAttributes<T> {
      [key: string]: any;
    }
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'lucide-react' {
  export const Lock: any;
  export const Dices: any;
  export const Volume2: any;
  export const ShieldCheck: any;
  export const RefreshCw: any;
  export const VolumeX: any;
  export const Eye: any;
  export const Trophy: any;
  export const [key: string]: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'next/server' {
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static rewrite(destination: string | URL): NextResponse;
    static next(): NextResponse;
  }
}
