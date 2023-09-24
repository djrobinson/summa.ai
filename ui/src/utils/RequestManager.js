class RequestManager {
    constructor(concurrency = 5) {
      this.concurrency = concurrency;
    }
    enqueue(requestID, stateSetter) {

    }
    async makeRequest(request) {
        return await request
    }
  }
  