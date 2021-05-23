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

export let options = {
  vus: 10,                              // vus: Virtual users
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],     // http errors should be less than 1%
    http_req_duration: ['p(95)<200']    // 95% of requests should be below 200ms
  }
};
