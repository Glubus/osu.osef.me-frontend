/// <reference types="@rsbuild/core/types" />

/**
 * Types for application environment variables
 */
interface ImportMetaEnv {
  /** Base URL for the main API */
  readonly VITE_API_BASE_URL: string;
  /** Runtime environment */
  readonly VITE_ENVIRONMENT: 'development' | 'production' | 'test';
  /** Development mode */
  readonly MODE: 'development' | 'production';
  /** Development mode (boolean) */
  readonly DEV: boolean;
  /** Production mode (boolean) */
  readonly PROD: boolean;
  /** Base URL of the application */
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Types for Node.js process.env (for compatibility)
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VITE_API_BASE_URL: string;
    readonly VITE_ENVIRONMENT: 'development' | 'production' | 'test';
  }
}

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
