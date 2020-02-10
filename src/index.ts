import chroma, { Color } from 'chroma-js';
import { isPlainObject, mapValues } from 'lodash';

type MappedValues<T, MappedValue> = {
  [K in keyof T]: T[K] extends object
    ? MappedValues<T[K], MappedValue>
    : MappedValue;
};

const mapValuesDeep = <T extends object, Value, MappedValue>(
  obj: T,
  fn: (val: Value, key: string, obj: T) => MappedValue
): MappedValues<T, MappedValue> =>
  mapValues(obj, (val, key) =>
    isPlainObject(val)
      ? mapValuesDeep(val as any, fn)
      : fn((val as unknown) as Value, key, obj)
  ) as MappedValues<T, MappedValue>;

export const decorateColors = <Theme extends object>(
  theme: Theme
): MappedValues<Theme, Color> => {
  return mapValuesDeep(theme, (value: any) => {
    try {
      return chroma(value);
    } catch (e) {
      throw new Error(`${value} is not a valid color: ${e.message}`);
    }
  });
};

export const decorateDimensions = <Theme extends object>(
  theme: Theme
): MappedValues<Theme, { css: string; value: number; unit: string }> => {
  return mapValuesDeep(theme, (value: string | number) => {
    if (value === 0 || value === '0') {
      return {
        css: '0',
        value: 0,
        unit: '',
      };
    }

    if (typeof value !== 'string') {
      throw new Error(`Value ${value} is not a valid dimension.`);
    }

    const match = value.match(
      /^([-+]?[0-9]*\.?[0-9]+)(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)$/i
    );

    if (match === null) {
      throw new Error(`Value ${value} is not a valid dimension.`);
    }

    return {
      css: match[0],
      value: Number.parseFloat(match[1]),
      unit: match[2],
    };
  });
};

export default <
  Colors extends object,
  Dimensions extends object,
  Input extends {
    colors: Colors;
    dimensions: Dimensions;
  }
>({
  colors,
  dimensions,
  ...rest
}: Input) => {
  return {
    colors: decorateColors(colors),
    dimensions: decorateDimensions(dimensions),
    ...rest,
  };
};
