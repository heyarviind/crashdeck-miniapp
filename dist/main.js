(function (window, document) {
  class Crashdeck {
    init({ secretKey, bucketID, channel }) {
      if (!secretKey) {
        console.log("Invalid Crashdeck Auth ID");
        return;
      }

      if (!bucketID) {
        console.log("Invalid Bucket ID");
        return;
      }

      if (channel) {
        this.channel = channel;
      }

      this.secretKey = secretKey;
      this.bucketID = bucketID;
      this.baseURL = `https://dev-api.crashdeck.io/log-${this.bucketID}`;
      // this.baseURL = `http://localhost:4000/log-${this.bucketID}`;
    }

    // auto collect errors
    autoCollectErrors(bool) {
      if (bool) {
        this.isAutoCollectErrorsEnabled = true;
        const vm = this;

        window.addEventListener("error", function (event) {
          let formattedErrorType;
          const errorType = String(event.error).substr(
            0,
            (String(event.error) + ":").indexOf(":")
          );

          const validErrorTypes = {
            SyntaxError: "Syntax Error",
            ReferenceError: "Reference Error",
            TypeError: "Type Error",
          };

          if (validErrorTypes[errorType]) {
            formattedErrorType = validErrorTypes[errorType];
          }

          const message = event.message || "Message not found";
          const fileName = event.filename || "Unable to get file name";
          const lineno = event.lineno || "Unable to get line number";
          const colno = event.colno || "Unable to get column number";

          const crashdeckErrorMessage = `${message} in ${fileName} at line number: ${lineno} and column: ${colno}`;

          vm.error({
            message: crashdeckErrorMessage,
            errorType: formattedErrorType || "",
          });
        });
      }
    }

    // Severity levels
    info(payload) {
      this.validateMessage(payload.message);
      this.sendLog({
        type: "info",
        message: payload.message,
        channel: payload.channel || this.channel || "",
      });
    }

    debug(payload) {
      this.validateMessage(payload.message);
      this.sendLog({
        type: "debug",
        message: payload.message,
        channel: payload.channel || this.channel || "",
      });
    }

    warning(payload) {
      this.validateMessage(payload.message);
      this.sendLog({
        type: "warning",
        message: payload.message,
        channel: payload.channel || this.channel || "",
      });
    }

    error(payload) {
      this.validateMessage(payload.message);
      this.sendLog({
        type: "error",
        message: payload.message,
        channel: payload.channel || this.channel || "",
        errorType: payload.errorType || "",
      });
    }

    fatal(payload) {
      this.validateMessage(payload.message);
      this.sendLog({
        type: "fatal",
        message: payload.message,
        channel: payload.channel || this.channel || "",
      });
    }

    validateMessage(message) {
      if (!message || message == "") {
        console.log("Invalid log message");
      }

      return;
    }

    sendLog({ type, message, channel, errorType }) {
      if (!this.isAppInitialized()) {
        console.log("Crashdeck didn't initialized properly!");
        return;
      }

      let headers = {};
      headers["Authorization"] = this.secretKey;
      headers["Content-Type"] = "application/json";

      return fetch(this.baseURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          type: type,
          message: message,
          channel: channel,
          errorType: errorType,
        }),
      })
        .then((response) => response.json())
        .then((data) => data)
        .catch((err) => err);
    }

    isAppInitialized() {
      if (
        !this.bucketID ||
        this.bucketID == "" ||
        !this.secretKey ||
        this.secretKey == ""
      ) {
        return false;
      }

      return true;
    }
  }

  window.Crashdeck = new Crashdeck();
})(window, document);
