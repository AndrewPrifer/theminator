# Theminator

Theminator replaces the colors and dimensions (e.g. `#123456` or `12rem`) in your theme with objects containing useful methods that you can use to create derived values, like a darkened version of the background color or a multiplied border width for a hover effect.

## Installation

```sh
yarn add theminator
```

or

```sh
npm i theminator
```

## Quick start

### 1. Import Theminator.

```js
import decorate from 'theminator';
```

### 2. Create your theme object.

A theme object needs to have at least a `colors` key and a `dimensions` key at the top level. Feel free to nest values as deep as you want, the only requirement is that primitive values need to be parseable as a color value or a dimension value respectively. The rest of the top level keys are ignored and can contain anything.

```js
const theme = {
  colors: {
    button: {
      primary: '#123456',
      secondary: '#654321',
    },
  },
  dimensions: {
    borderWidth: '1px',
    circle: {
      borderRadius: '50%',
    },
  },
  extra: 'I am ignored.',
};
```

### 3. Decorate it using Theminator. If you want, you can export it right away.

```js
export default decorate(theme);
```

### 4. Profit.

```js
// ...
import theme from '../theme';

const color = theme.colors.button.primary;
const borderWidth = theme.dimensions.borderWidth;

// ...

<button
  className={css`
    background: ${color.css()};
    border-color: ${color.darken(2).css()};
    border-width: ${borderWidth.value * 2} ${borderWidth.unit};
  `}
>
  ...
</button>;
```

## Documentation

### `decorate(theme)` (default export)

#### Parameters

`theme`: an object containing a `colors` and a `dimensions` key.

#### Return value

An enhanced object of the same shape. Color values are wrapped with [chroma-js](https://gka.github.io/chroma.js). Dimension values are replaced with an object of the shape `{ css: string, value: number, unit: string }`. If a value is not valid, the function throws.

### `decorateColors(colors)`

#### Parameters

`colors`: an object containing color values. Values can be nested as deep as you want but they need to be valid.

#### Return value

An enhanced object of the same shape. Values are wrapped with [chroma-js](https://gka.github.io/chroma.js). Called internally by `decorate()`.

### `decorateDimensions(dimensions)`

#### Parameters

`dimensions`: an object containing dimension values. Values can be nested as deep as you want but they need to be valid.

#### Return value

An enhanced object of the same shape. Values are replaced with an object of the shape `{ css: string, value: number, unit: string }`. Called internally by `decorate()`.

## Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
