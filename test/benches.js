const Benchmark = require('benchmark');
const { default: secureRequire } = require('../dist');

function makeAndRunBenchmark(name, fn) {
  const bench = new Benchmark(name, fn, {
    onStart() {
      console.log(`Running benchmark ${this.name}`);
    },
    onComplete() {
      console.log(this.toString());
    }
  });
  bench.run({ async: true });
}

console.log('Running benchmarks');

makeAndRunBenchmark('local-require', () => require('../jest.config'));
makeAndRunBenchmark('local-secure-require', () =>
  secureRequire('../jest.config')
);
makeAndRunBenchmark('native-require', () => require('fs'));
makeAndRunBenchmark('native-secure-require', () => secureRequire('fs'));
makeAndRunBenchmark('thirdparty-require', () => require('acorn'));
makeAndRunBenchmark('thirdparty-secure-require', () => secureRequire('acorn'));
