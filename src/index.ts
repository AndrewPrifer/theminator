import chroma, { Color } from 'chroma-js';
import deepMap, { MappedValues } from 'deep-map-object';
import parser from 'postcss-value-parser';

export const decorateColors = <Theme extends object>(
  theme: Theme
): MappedValues<Theme, Color> => {
  return deepMap((value: string) => {
    try {
      return chroma(value);
    } catch (e) {
      throw new Error(`${value} is not a valid color: ${e.message}`);
    }
  })(theme);
};

export const decorateDimensions = <Theme extends object>(
  theme: Theme
): MappedValues<
  Theme,
  {
    css: string;
    number: number;
    unit: string;
  }
> => {
  return deepMap((value: string | number): {
    css: string;
    number: number;
    unit: string;
  } => {
    if (typeof value === 'number') {
      return {
        css: `${value}`,
        number: value,
        unit: '',
      };
    }

    const parsedValue = parser.unit(value);

    if (parsedValue === false) {
      throw new Error(`${value} can't be parsed as a dimension.`);
    }

    return {
      css: value,
      number: Number.parseFloat(parsedValue.number),
      unit: parsedValue.unit,
    };
  })(theme);
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
