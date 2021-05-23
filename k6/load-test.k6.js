import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const responses = http.batch([
    ['GET', `http://localhost:3000/api/todos`],
    ['GET', `http://localhost:3000/api/todos?status=completed`],
    ['GET', `http://localhost:3000/api/todos?status=uncompleted`],
  ]);

  responses.forEach(response => {
    check(response, {
      "is status 200": (r) => r.status === 200
    });
  });
}

export function create() {
  var url = 'http://localhost:3000/api/todos';
  var payload = JSON.stringify({
    todo: 'k6 load testing'
  });
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = http.post(url, payload, params);
  check(response, {
    "is status 201": (r) => r.status === 201
  });
}

// export let options = {
//   vus: 10,                              // vus: Virtual users
//   duration: '30s',
//   thresholds: {
//     http_req_failed: ['rate<0.01'],     // http errors should be less than 1%
//     http_req_duration: ['p(95)<200']    // 95% of requests should be below 200ms
//   }
// };

// export let options = {
//   scenarios: {
//     gets: {
//       executor: 'shared-iterations',
//       // common scenario configuration
//       iterations: 4000,
//       vus: 10
//     }
//   },
//   thresholds: {
//     http_req_failed: ['rate<0.01'],     // http errors should be less than 1%
//     http_req_duration: ['p(95)<200']    // 95% of requests should be below 200ms
//   }
// };

export let options = {
  scenarios: {
    gets: {
      executor: 'constant-vus',
      // common scenario configuration
      duration: '50s',
      vus: 10
    },
    create: {
      executor: 'ramping-arrival-rate',
      exec: 'create',
      // common scenario configuration
      startTime: '10s', // the ramping API test starts a little later
      startRate: 50,
      preAllocatedVUs: 10, // how large the initial pool of VUs would be
      maxVUs: 50, // if the preAllocatedVUs are not enough, we can initialize more
      stages: [
        { target: 200, duration: '10s' }, // go from 50 to 200 iters/s in the first 30 seconds
        { target: 200, duration: '15s' }, // hold at 200 iters/s for 15 second
        { target: 0, duration: '30s' }, // ramp down back to 0 iters/s over the last 30 second
      ]
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],     // http errors should be less than 1%
    http_req_duration: ['p(95)<500']    // 95% of requests should be below 200ms
  }
};
