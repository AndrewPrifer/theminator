declare module 'deep-map-object' {
  export type MappedValues<T, MappedValue> = {
    [K in keyof T]: T[K] extends object
      ? MappedValues<T[K], MappedValue>
      : MappedValue;
  };
  export default function<Value, MappedValue>(
    transform: (value: Value) => MappedValue
  ): <T extends object>(input: T) => MappedValues<T, MappedValue>;
}
