import chroma from 'chroma-js';

import decorate, { decorateColors, decorateDimensions } from '../src';

describe('decorateColors', () => {
  it('decorates colors', () => {
    expect(
      decorateColors({
        a: '#ffffff',
        b: '#abcdef',
        c: {
          d: '#550000',
        },
      })
    ).toEqual({
      a: chroma('#ffffff'),
      b: chroma('#abcdef'),
      c: {
        d: chroma('#550000'),
      },
    });
  });

  it('throws for invalid values', () => {
    expect(() => decorateColors({ a: 'asdf' })).toThrow();
  });
});

describe('decorateDimensions', () => {
  it('decorates dimensions', () => {
    expect(
      decorateDimensions({
        a: '31px',
        b: '22em',
        c: {
          d: '-3vh',
          e: 0,
          f: '0',
          g: '34.5%',
        },
      })
    ).toEqual({
      a: { css: '31px', number: 31, unit: 'px' },
      b: { css: '22em', number: 22, unit: 'em' },
      c: {
        d: { css: '-3vh', number: -3, unit: 'vh' },
        e: { css: '0', number: 0, unit: '' },
        f: { css: '0', number: 0, unit: '' },
        g: { css: '34.5%', number: 34.5, unit: '%' },
      },
    });
  });

  it('throws for invalid values', () => {
    expect(() => decorateDimensions({ a: 'asdf' })).toThrow();
  });
});

describe('decorate', () => {
  const theme = {
    dimensions: {
      a: '1px',
    },
    colors: {
      b: '#123456',
    },
  };

  const themeWithExtraFields = {
    ...theme,
    extra: 'hello',
  };

  it('is equal to running decorateDimensions and decorateColors separately', () => {
    expect(decorate(theme)).toEqual({
      colors: decorateColors(theme.colors),
      dimensions: decorateDimensions(theme.dimensions),
    });
  });

  it('preserves extra fields', () => {
    expect(decorate(themeWithExtraFields).extra).toBeDefined();
  });
});
