import { list } from 'postcss';

// match an opening parenthesis
const matchOpeningParen = /^([^(]+)(.*)$/;

export function getMixinParams(data) {
  const [, name, sourceParams] = data.match(matchOpeningParen);
  const paramsString = sourceParams && sourceParams.slice(1, -1).trim();
  const params = paramsString ? list.comma(paramsString) : [];

  return { name, params };
}
