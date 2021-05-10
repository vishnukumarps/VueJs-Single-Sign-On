<template>
  <div class="home">
    <br />
    <button @click="connectToDropbox()">Login With Dropbox</button>
    <br />
    <a id="authlink">c</a>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox");
export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  methods: {
    loginWithDropBox(authCode) {
      require("isomorphic-fetch"); // or another library of choice.
      var Dropbox = require("dropbox").Dropbox;
      var dbx = new Dropbox({ accessToken: authCode });
      dbx
        .usersGetCurrentAccount()
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    async connectToDropbox() {
      var dbx = new Dropbox.Dropbox({ clientId: "2jcyfio39bexhql" });
      var authUrl = await dbx.auth.getAuthenticationUrl(
        "http://localhost:8080"
      );
      window.location.href = authUrl;
    },
    Authenicate() {
      var url_string = window.location.href;
      console.log(url_string);
      var accessToken = url_string
        .toString()
        .split("=")[2]
        .toString()
        .split("&")[0];

      console.log(accessToken);

      if (accessToken) {
        var dbx = new Dropbox.Dropbox({ accessToken: accessToken });
        dbx
          .filesListFolder({ path: "" })
          .then(function (response) {
            console.log("dataaa", response);
            //renderItems(response.result.entries);
          })
          .catch(function (error) {
            console.log(error);
          });

        dbx
          .usersGetCurrentAccount()
          .then(function (response) {
            console.log(response);
            alert(response);
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    },
  },
  mounted() {
    this.Authenicate();
    console.log("mounted");
  },
};
</script>
