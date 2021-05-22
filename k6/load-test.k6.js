import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const response = http.get(`http://localhost:3000/api/todos`);
  check(response, {
    "is status 200": (r) => r.status === 200
  })
}

export let options = {
  vus: 1,
  duration: '5s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    http_reqs: ['count>6000']
  }
};