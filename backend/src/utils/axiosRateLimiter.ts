import { global } from '../types/axiosRateLimit';
import RateLimitedAxiosInstance = global.RateLimitedAxiosInstance;

function AxiosRateLimit(axios) {
  this.queue = [];
  this.timeslotRequests = 0;

  this.interceptors = {
    request: null,
    response: null,
  };

  this.handleRequest = this.handleRequest.bind(this);
  this.handleResponse = this.handleResponse.bind(this);

  this.enable(axios);
}

AxiosRateLimit.prototype.getMaxRPS = function () {
  const perSeconds = this.perMilliseconds / 1000;
  return this.maxRequests / perSeconds;
};

AxiosRateLimit.prototype.setMaxRPS = function (rps) {
  this.setRateLimitOptions({
    maxRequests: rps,
    perMilliseconds: 1000,
  });
};

AxiosRateLimit.prototype.setRateLimitOptions = function (options) {
  if (options.maxRPS) {
    this.setMaxRPS(options.maxRPS);
  } else {
    this.perMilliseconds = options.perMilliseconds;
    this.maxRequests = options.maxRequests;
  }
};

AxiosRateLimit.prototype.enable = function (axios) {
  function handleError(error) {
    return Promise.reject(error);
  }

  this.interceptors.request = axios.interceptors.request.use(this.handleRequest, handleError);
  this.interceptors.response = axios.interceptors.response.use(this.handleResponse, handleError);
};

AxiosRateLimit.prototype.handleRequest = function (request) {
  return new Promise(
    function (resolve) {
      this.push({
        resolve: function () {
          resolve(request);
        },
      });
    }.bind(this)
  );
};

AxiosRateLimit.prototype.handleResponse = function (response) {
  this.shift();
  return response;
};

AxiosRateLimit.prototype.push = function (requestHandler) {
  this.queue.push(requestHandler);
  this.shiftInitial();
};

AxiosRateLimit.prototype.shiftInitial = function () {
  setTimeout(
    function () {
      return this.shift();
    }.bind(this),
    0
  );
};

AxiosRateLimit.prototype.shift = function () {
  if (!this.queue.length) return;
  if (this.timeslotRequests === this.maxRequests) {
    if (this.timeoutId && typeof this.timeoutId.ref === 'function') {
      this.timeoutId.ref();
    }

    return;
  }

  const queued = this.queue.shift();
  queued.resolve();

  if (this.timeslotRequests === 0) {
    this.timeoutId = setTimeout(
      function () {
        this.timeslotRequests = 0;
        this.shift();
      }.bind(this),
      this.perMilliseconds
    );

    if (typeof this.timeoutId.unref === 'function') {
      if (this.queue.length === 0) this.timeoutId.unref();
    }
  }

  this.timeslotRequests += 1;
};

export function axiosRateLimit(axios, options): RateLimitedAxiosInstance {
  const rateLimitInstance = new AxiosRateLimit(axios);
  rateLimitInstance.setRateLimitOptions(options);

  axios.getMaxRPS = AxiosRateLimit.prototype.getMaxRPS.bind(rateLimitInstance);
  axios.setMaxRPS = AxiosRateLimit.prototype.setMaxRPS.bind(rateLimitInstance);
  axios.setRateLimitOptions = AxiosRateLimit.prototype.setRateLimitOptions.bind(rateLimitInstance);

  return axios;
}
