import { sleep, check, group } from 'k6'
import http from 'k6/http'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 1000,
    iterations: 3500,
    thresholds: {
        http_req_duration: ['avg<2000'], // response time should be < 2s
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    },
}

export default function() {
  let response
  group('User Case', function () {
    // CREATE
    response = http.post('https://reqres.in/api/users', '{"name":"morpheus","job":"leader"}', {
      headers: {
        'content-type': 'application/json',
      },
    })
    check(response, { 'status equals 201': response => response.status.toString() === '201' })

    // UPDATE
    response = http.put('https://reqres.in/api/users/2', '{"name":"morpheus","job":"zion resident"}', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    check(response, { 'status equals 200': response => response.status.toString() === '200' })
  })
  // Automatically added sleep
  sleep(1)
}

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }