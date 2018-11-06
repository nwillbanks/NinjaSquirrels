/* firebase

  var config = {
    apiKey: "AIzaSyDnoIh_ls25YVOg3CkYj2B-OtheE3ds2gg",
    authDomain: "project-1-1ea90.firebaseapp.com",
    databaseURL: "https://project-1-1ea90.firebaseio.com",
    projectId: "project-1-1ea90",
    storageBucket: "",
    messagingSenderId: "37482486000"
  };
  firebase.initializeApp(config);

  var database = firebase.database()


*/

//grabbing the artist from html
$("#add").on("click",function(event){
  event.preventDefault()
  console.log("here")
  var artist = $("#inputArtist").val()
  var song = $("#inputSong").val()
  var deezerApi; 

  if (artist === "" && song === "" ){
    console.log("no input")
    
  }
  else if (artist === ""){
    console.log("song only")
     deezerApi = "https://api.deezer.com/search?q=track:"+ '"' + song +'"'
  }
  else if (song === ""){
    console.log("artist only")
     deezerApi = "https://api.deezer.com/search?q=artist:"+ '"' + artist +'"'
  }
  else {
    console.log("song & artist")
    console.log("artist : " + artist)
    console.log("song : " + song)
   deezerApi = "https://api.deezer.com/search?q=artist:"+ '"' + artist +'"'  +" track:"+ '"' + song +'"' 
  }
 
  
  console.log(deezerApi)
  play(deezerApi)


})


// dezzer api
function play(a){
  
  
  var deezerApi = a
  console.log("play: " + deezerApi)

  $.ajax({
    headers : {"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS"},
    url : deezerApi,
    method: "GET"

  }).then(function(response){
    console.log(response)
    var link = response.tracklist
    console.log (link)
  })


}

//<iframe id='dzplayer' dztype='dzplayer' src='https://www.deezer.com/plugins/player?type=tracks&id=3135556&format=classic&color=007FEB&autoplay=false&playlist=true&width=700&height=240' scrolling='no' frameborder='0' style='border:none; overflow:hidden;' width='700' height='240' allowTransparency='true'></iframe>
