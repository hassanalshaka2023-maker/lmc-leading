import { definedOnly } from './defined';

describe('definedOnly', () => {
  it('drops undefined values, keeps everything else (incl. null / "" / 0 / false)', () => {
    expect(
      definedOnly({
        a: 1,
        b: undefined,
        c: '',
        d: null,
        e: false,
        f: 0,
        g: { x: 1 },
      }),
    ).toEqual({ a: 1, c: '', d: null, e: false, f: 0, g: { x: 1 } });
  });

  it('models the class-transformer case: a partial PATCH body must not carry undefined keys into doc.set()', () => {
    // What ValidationPipe hands a service for `PATCH { whatsapp }`
    const dto = {
      whatsapp: '905551112233',
      address: undefined,
      socialLinks: undefined,
    };
    expect(definedOnly(dto)).toEqual({ whatsapp: '905551112233' });
  });
});
