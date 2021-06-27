import { expect } from 'chai';

import { createDecoder } from '../src/decode';
import * as V from '../src/validators';

describe('json decoder for optionals', () => {
  xit('should fail when not including validator for optional field validator', done => {
    const data = { email: 'shit@wow.com' };
    const decode = createDecoder({
      email: V.string(),
      // username: V.optional(),
    });
    expect(() => decode(data)).to.throw(
      'Expected optional to have a validator\n' +
        'hint: you passed V.optional without a validator\n' +
        'you should pass one validator so that if the field exists\n' +
        'we can validate it by the specified type e.g:\n' +
        '{\n' +
        '  field: V.optional(V.string()) // string or undefined\n' +
        '}',
    );
    done();
  });
  it('should pass when not including optional field', done => {
    const data = { email: 'shit@wow.com' };
    const decode = createDecoder({
      email: V.string(),
      username: V.optional(V.string()),
    });
    expect(decode(data)).to.be.eq(data);
    done();
  });
  it('should pass when including optional field', done => {
    const data = { email: 'shit@wow.com', username: 'boi' };
    const decode = createDecoder({
      email: V.string(),
      username: V.optional(V.string()),
    });
    expect(decode(data)).to.be.eq(data);
    done();
  });
  it('should fail when including optional field but expecting different type', done => {
    const data = { email: 'shit@wow.com', username: 537457 };
    const decode = createDecoder({
      email: V.string(),
      username: V.optional(V.string()),
    });
    expect(() => decode(data)).to.be.throw(
      `Expected undefined or string but got ${data.username} at username`,
    );
    done();
  });
  it('should pass when including optional field with object', done => {
    const data = {
      email: 'shit@wow.com',
      username: { name: 'boi', isVerified: true },
    };
    const decode = createDecoder({
      email: V.string(),
      username: V.optional({ name: V.string(), isVerified: V.boolean() }),
    });
    expect(decode(data)).to.be.eq(data);
    done();
  });
  it('should fail when including optional field with object but expecting different type', done => {
    const data = {
      email: 'shit@wow.com',
      username: { name: 'boi', isVerified: true },
    };
    const decode = createDecoder({
      email: V.string(),
      username: V.optional({ name: V.nil(), isVerified: V.boolean() }),
    });
    expect(() => decode(data)).to.throw(
      `Expected undefined or specified schema but got ${data.username.name} at username`,
    );
    done();
  });
});