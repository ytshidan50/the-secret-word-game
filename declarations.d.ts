// TypeScript ambient declarations for standalone files without local node_modules
declare var require: any;
declare var module: any;
declare var exports: any;
declare var process: any;
declare var __dirname: string;

declare module 'react' {
  export type ReactNode = any;
  export type JSXElementConstructor<P> = any;
  export interface RefObject<T> { readonly current: T | null; }
  export interface MutableRefObject<T> { current: T; }
  export type DependencyList = ReadonlyArray<unknown>;

  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;

  export interface MouseEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
  }
  export interface TouchEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
  }
  export interface KeyboardEvent<T = Element> {
    key: string;
    preventDefault(): void;
    stopPropagation(): void;
  }
  export interface HTMLAttributes<T> {
    [key: string]: any;
  }

  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useCallback: typeof useCallback;
    [key: string]: any;
  };
  export default React;
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
  export const Mic: any;
  export const MicOff: any;
  export const Play: any;
  export const Pause: any;
  export const RotateCcw: any;
  export const Sparkles: any;
  const icons: { [key: string]: any };
  export default icons;
}

declare namespace JSX {
  interface Element {}
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
