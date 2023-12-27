
import * as asklim from 'asklim';

describe(
    '`asklim import` testing ...',
    () => {
        test(`asklim exports returns is object.`,
            () => {
                // expect( typeof asklim ).toBe('function');
                expect( typeof asklim ).toBe('object');
                // expect( testLog ).toBeInstanceOf( Logger );
            }
        );
        test(`Logger instance has properties.`,
            () => {
                expect( asklim ).toHaveProperty('__esModule');
                // expect( asklim ).toHaveProperty('default');
                expect( asklim ).toHaveProperty('Logger');
                expect( asklim ).toHaveProperty('consoleLogger');
                expect( asklim ).toHaveProperty('rsisFactory');
                expect( asklim ).toHaveProperty('version');
                expect( asklim ).toHaveProperty('http');
                expect( asklim ).toHaveProperty('weeks');
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                expect( Object.keys( asklim )).toHaveLength( 6 );
            }
        );
        test(`asklim.Logger is class (function), returns is object.`,
            () => {
                const { Logger } = asklim;
                const testLog = new Logger('test');
                expect( typeof Logger ).toBe('function');
                expect( typeof testLog ).toBe('object');
                expect( testLog ).toBeInstanceOf( Logger );
            }
        );
        test(`asklim.consoleLogger is function.`,
            () => {
                const { consoleLogger } = asklim;
                expect( typeof consoleLogger ).toBe('function');
            }
        );
        test(`asklim.rsisFactory is function.`,
            () => {
                const { rsisFactory } = asklim;
                expect( typeof rsisFactory ).toBe('function');
            }
        );
        test(`asklim.version is function.`,
            () => {
                const { version } = asklim;
                expect( typeof version ).toBe('string');
            }
        );
    }
);

describe(
    '`asklim.http` testing ...',
    () => {
        const { http } = asklim;
        test(`asklim.http is object; and have some properties`,
            () => {
                expect( typeof http ).toBe('object');
                expect( Object.keys( http )).toHaveLength( 14 );
                expect( http ).toHaveProperty('StatusCodes');
                expect( http ).toHaveProperty('sendJSONResponse');
                expect( http ).toHaveProperty('send200Ok');
                expect( http ).toHaveProperty('send201Created');
                expect( http ).toHaveProperty('send204NoContent');
                expect( http ).toHaveProperty('send400BadRequest');
                expect( http ).toHaveProperty('send401UnAuthorized');
                expect( http ).toHaveProperty('send404NotFound');
                expect( http ).toHaveProperty('send405MethodNotAllowed');
                expect( http ).toHaveProperty('send409Conflict');
                expect( http ).toHaveProperty('send500ServerError');
                expect( http ).toHaveProperty('send503ServiceUnavailable');
                expect( http ).toHaveProperty('callbackError400');
                expect( http ).toHaveProperty('callbackError405');
            }
        );
        const { StatusCodes: HTTP } = http;
        test(`asklim.http is object; and have some properties`,
            () => {
                expect( typeof HTTP ).toBe('object');
                expect( Array.isArray( HTTP )).toBe( false );
                expect( Object.keys( HTTP )).toHaveLength( 118 );
            }
        );
    }
);

describe(
    '`asklim.weeks` testing ...',
    () => {
        const { weeks } = asklim;
        test(`asklim.weeks is object.`,
            () => {
                expect( typeof weeks ).toBe('object');
                expect( Object.keys( weeks )).toHaveLength( 3 );
                expect( weeks ).toHaveProperty('JDN_of_20010101');
                expect( weeks ).toHaveProperty('julianDay');
                expect( weeks ).toHaveProperty('week21c');
            }
        );
    }
);
