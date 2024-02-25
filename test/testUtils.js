import fs from 'node:fs/promises';
import assert from 'node:assert';

/**
 * @param result {any}
 * @param expectPath {string}
 * @param resultPath {string | undefined}
 * @returns {Promise<void>}
 */
export async function toMatchSnapshot(result, expectPath, resultPath) {
  const resultCode =
    typeof result === 'string' ? result : JSON.stringify(result, null, 2);

  const expectCSS = await fs.readFile(expectPath, 'utf8').catch(async () => {
    await fs.writeFile(expectPath, resultCode);
    return resultCode;
  });

  if (resultPath) {
    await fs.writeFile(resultPath, resultCode, 'utf8');
  }

  assert.deepStrictEqual(expectCSS, resultCode);
}
