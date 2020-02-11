import chroma, { Color } from 'chroma-js';
import deepMap, { MappedValues } from 'deep-map-object';

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
): MappedValues<Theme, { css: string; value: number; unit: string }> => {
  return deepMap((value: string | number) => {
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
