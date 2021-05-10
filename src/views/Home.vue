<template>
  <div class="home">
    <br />
    <h1 id="email">{{email}}</h1>
    <img src=""  id="img1">
    <br>
    <br>

    <button @click="connectToDropbox()">Login With Dropbox</button>
    <br />
   <div style="float:left">
     <h4>Upload files</h4>
      <form>
      <input type="text" id="access-token" placeholder="Access token" />
      <input type="file" id="file-upload" />
      <br>
      <button type="submit" @click="uploadFile()">Submit</button>
    </form>
   </div>
    <br>
    <br>
    <div v-for="item in fileFolderList" :key="item.name">
      {{item.name}}
    </div>
    <div style="float:right" > 
      <button @click="getFolderList()">Get FolderList</button>
    </div>
    <h2 id="results"></h2>

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
  props: {
   fileNameList:String,
   email:String,
  },
  data(){
    return{
      fileFolderList:[]
    }
  },
  components: {
    HelloWorld,
  },
  methods: {
    async connectToDropbox() {
      var dbx = new Dropbox.Dropbox({ clientId: "2jcyfio39bexhql" });
      var authUrl = await dbx.auth.getAuthenticationUrl(
        "http://localhost:8080"
      );
      window.location.href = authUrl;
    },
    Authenicate() {
      if (window.location.href != "http://localhost:8080/") {
        var url_string = window.location.href;
        console.log(url_string);
        var accessToken = url_string
          .toString()
          .split("=")[2]
          .toString()
          .split("&")[0];
      }
      var dbx = new Dropbox.Dropbox({ accessToken: accessToken });
        dbx
          .usersGetCurrentAccount()
          .then(function (response) {
            console.log(response);
            document.getElementById("email").innerHTML="Welcome "+response.result.email;
            document.getElementById("img1").src=response.result.profile_photo_url;
           // this.email=response.result.email;
           // alert(response.result.email);
          })
          .catch(function (error) {
            console.error(error);
          });
      console.log(accessToken);     
      return accessToken;
    },
    uploadFile() {
      console.log("Inside upload file");
      var UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
      var ACCESS_TOKEN = this.Authenicate();
      console.log("AccessTocken", ACCESS_TOKEN);
      var dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN });
      var fileInput = document.getElementById("file-upload");
      var file = fileInput.files[0];

      if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
        // File is smaller than 150 Mb - use filesUpload API
        dbx
          .filesUpload({ path: "/Test2/" + file.name, contents: file })
          .then(function (response) {
            var results = document.getElementById("results");
            var br = document.createElement("br");
            results.appendChild(document.createTextNode("File uploaded!"));
            results.appendChild(br);
            console.log(response);
          })
          .catch(function (error) {
            console.error(error);
          });
      }
      return false;
    },
    getFolderList() {
      var accessToken=this.Authenicate();
      if (accessToken) {
        var dbx = new Dropbox.Dropbox({ accessToken: accessToken });
        dbx
          .filesListFolder({ path: "" })
          .then((response)=> {
            console.log("dataaa", response);
            console.log(response.result.entries);
            response.result.entries.forEach(element => {
              this.fileFolderList.push(element);
            });
            
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    downloadFile() {
      var ACCESS_TOKEN = this.Authenicate();
      var SHARED_LINK = document.getElementById('shared-link').value;
      var dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN });
      dbx.sharingGetSharedLinkFile({url: SHARED_LINK})
        .then(function(data) {
          var downloadUrl = URL.createObjectURL(data.fileBlob);
          var downloadButton = document.createElement('a');
          downloadButton.setAttribute('href', downloadUrl);
          downloadButton.setAttribute('download', data.name);
          downloadButton.setAttribute('class', 'button');
          downloadButton.innerText = 'Download: ' + data.name;
          document.getElementById('results').appendChild(downloadButton);
        })
        .catch(function(error) {
          console.error(error);
        });
      return false;
    }
  },
  mounted() {
    this.Authenicate();
    console.log("mounted");
  },
};
</script>
