declare module 'json-bignumber' {
    import BigNumber from 'bignumber.js';
  
    /**
     * Converts an object containing BigNumber instances into a JSON string.
     * @param obj Object to be serialized.
     * @param options Optional configuration for serialization.
     * @returns JSON string.
     */
    export function stringify(
      value: any,
      replacer?: any,
      space?: any
    ): string;
  
    /**
     * Parses a JSON string and converts numeric values to BigNumber instances.
     * @param json JSON string to be parsed.
     * @param options Optional configuration for parsing.
     * @returns Parsed object with BigNumber instances.
     */
    export function parse(
      json: string,
      options?: JSONBigNumberOptions
    ): any;
  }
  