# Changes to PostCSS Advanced Variables

## [4.0.3](https://github.com/armano2/postcss-advanced-variables/compare/v4.0.2...v4.0.3) (2024-02-23)


### Bug Fixes

* update node version for release ([4e0de76](https://github.com/armano2/postcss-advanced-variables/commit/4e0de7689eb914cc5c2d47f5a8b7b22ca9c70564))

## [4.0.2](https://github.com/armano2/postcss-advanced-variables/compare/v4.0.1...v4.0.2) (2024-02-23)


### Bug Fixes

* correct package lock ([a7b10e0](https://github.com/armano2/postcss-advanced-variables/commit/a7b10e012a3df8b2d7278fafbc50007f68cb399b))
* enable dependabot ([1d1f975](https://github.com/armano2/postcss-advanced-variables/commit/1d1f97546942dc2d8e7ea4d995e059064473fb33))
* update actions and add missing lock file ([c2b579d](https://github.com/armano2/postcss-advanced-variables/commit/c2b579d043cf9fa7e6afa2a88f1898baa6768ede))
* update tests to run on node 18 ([3d83c4c](https://github.com/armano2/postcss-advanced-variables/commit/3d83c4c48c3c537cd7abb85c4419c4adaf7efab0))

## [4.0.1](https://github.com/armano2/postcss-advanced-variables/compare/v4.0.0...v4.0.1) (2024-02-23)


### Bug Fixes

* automated releases ([15ebaf5](https://github.com/armano2/postcss-advanced-variables/commit/15ebaf580d1876d92331b2d39056ffe42e891d87))
* correct issues in package.json ([61dd98d](https://github.com/armano2/postcss-advanced-variables/commit/61dd98d750ceb273adf37956cd2cb6ae7c0f4819))
* improve support for each ([5b7ae89](https://github.com/armano2/postcss-advanced-variables/commit/5b7ae8955e8186a56d69d9c459b7b802de192afa))
* trigger release ([b387946](https://github.com/armano2/postcss-advanced-variables/commit/b387946d18f13e2c48206d83eb4fcab17d28eaa3))
* update pipeline ([bd01265](https://github.com/armano2/postcss-advanced-variables/commit/bd01265a4d0f44d672b7574049cb594e53ed0b59))

### 4.0.0

- Updated: `postcss` to ^8.2.4 (major)

### 3.0.1 (February 27, 2020)

- Fixed: parsing the contents of imported stylesheets (#71)

### 3.0.0 (November 22, 2018)

- Fixed: transform variables in default value of mixins
- Updated: `postcss` to 7.0.6 (major)
- Changed: Support for Node 6+

### 2.3.3 (February 10, 2018)

- Fixed: asynchronous transforms to allow for imported mixins and variables

### 2.3.2 (February 10, 2018)

- Fixed: imports failing when `from` is missing

### 2.3.1 (February 10, 2018)

- Added: `babel-plugin-array-includes` instead of `babel-polyfill` for publish
- Fixed: `@mixin` rules to support being declared with empty parens
- Noted: Recommend `postcss-scss-syntax` to best support variable interpolation

### 2.3.0 (January 6, 2018)

- Added: `importFilter` option to accept or ignore imports by function or regex
- Added: Support for media parameters after `@import` rules
- Added: Support for case-insensitive at-rules
- Fixed: Protocol and protocol-less imports are ignored

### 2.2.0 (January 2, 2018)

- Added: Support for `@import`
- Added: `disable` option to conditionally disable any feature(s)
- Fixed: How iterator arrays and objects are treated

### 2.1.0 (January 1, 2018)

- Added: Support for `@mixin`, `@include`, and `@content`

### 2.0.0 (December 31, 2017)

- Completely rewritten
- Added: `unresolved` option to throw errors or warnings on unresolved variables
- Added: Support for the `#{$var}` syntax
- Added: Support for iterators in `@each` at-rules
- Added: Support for boolean `@if` at-rules
  (`@each $item $index in $array`)
- Added: Support for variable replacement in all at-rules
- Added: Support for neighboring variables `$a$b`
- Fixed: Number comparison in `@if` at-rules

## 1.2.2 (October 21, 2015)

- Removed: Old gulp file

## 1.2.1 (October 21, 2015)

- Updated: PostCSS 5.0.10
- Updated: Tests

## 1.2.0 (October 21, 2015)

- Added: Global variables set in options

## 1.1.0 (September 8, 2015)

- Added: Support for `!default`

## 1.0.0 (September 7, 2015)

- Updated: PostCSS 5.0.4
- Updated: Chai 3.2.0
- Updated: ESLint 1.0
- Updated: Mocha 2.1.3  

## 0.0.4 (July 22, 2015)

- Added: Support for vars in @media

## 0.0.3 (July 8, 2015)

- Added: Support for @else statements

## 0.0.2 (July 7, 2015)

- Fixed: Some variable evaluations
- Added: Support for deep arrays

## 0.0.1 (July 7, 2015)

- Pre-release
