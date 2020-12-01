<template>
  <div class="container mt-4">
    <div class="row justify-content-md-center">
      <div class="col-12 col-lg-5">
        <div class="mb-3">
          <label>Error Type</label>
          <select class="form-control" v-model="config.type">
            <option value="1">Info</option>
            <option value="2">Debug</option>
            <option value="3">Warning</option>
            <option value="4">Error</option>
            <option value="5">Fatal</option>
          </select>
        </div>

        <div class="mb-3">
          <label>Channel Name</label>
          <input
            v-model="config.channel"
            type=""
            class="form-control"
            name=""
            placeholder="Channel Name"
          />
        </div>

        <div class="mb-3">
          <label>Message</label>
          <textarea
            v-model="config.message"
            class="form-control"
            placeholder="Message"
          ></textarea>
        </div>

        <button class="btn btn-success w-100" @click="pushLog()">
          Push Log
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    config: {
      type: 1,
      channel: null,
      message: null,
    },
  }),
  methods: {
    pushLog() {
      if (this.config.message) {
        switch (this.config.type) {
          case 1:
            window.Crashdeck.info({
              channel: this.config.channel,
              message: this.config.message,
            });
            break;
          case 2:
            window.Crashdeck.debug({
              channel: this.config.channel,
              message: this.config.message,
            });
            break;
          case 3:
            window.Crashdeck.warning({
              channel: this.config.channel,
              message: this.config.message,
            });
            break;
          case 4:
            window.Crashdeck.error({
              channel: this.config.channel,
              message: this.config.message,
            });
            break;
          case 5:
            window.Crashdeck.fatal({
              channel: this.config.channel,
              message: this.config.message,
            });
            break;
        }
        this.config.channel = null;
        this.config.message = null;
        this.config.type = 1;

        alert("Log has been pushed");
      } else {
        alert("Message can't be empty");
      }
    },
  },
  mounted() {
    // window.Crashdeck.debug({
    //   channel: "web",
    //   message: "this is an error",
    // });
  },
};
</script>
