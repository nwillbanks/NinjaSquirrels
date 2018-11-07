
  var config = {
    apiKey: "AIzaSyDnoIh_ls25YVOg3CkYj2B-OtheE3ds2gg",
    authDomain: "project-1-1ea90.firebaseapp.com",
    databaseURL: "https://project-1-1ea90.firebaseio.com",
    projectId: "project-1-1ea90",
    storageBucket: "",
    messagingSenderId: "37482486000"
  };
  firebase.initializeApp(config);


var playlistId =[]
var trackName =[]
var artistName =[]
var album =[]
var year =[]
var database = firebase.database()
var a = '/connections_'+ Math.floor(Math.random()*1000)
//console.log("random : " + a)
var connectionRef = database.ref(a);
var connectedRef =  database.ref(".info/connected");


connectedRef.on("value", function(snap){
  if (snap.val()){
    var con = connectionRef.push(true);
    //console.log("this is :" + connectedRef )
    con.onDisconnect().remove()
    
  }
})


//grabbing the artist from html
$("#add").on("click",function(event){
  event.preventDefault()
  console.log("here")
  var artist = $("#inputArtist").val()
  var song = $("#inputSong").val()
  var deezerApi; 
  var flag = 0
  if (artist === "" && song === "" ){
    // console.log("no input")
    
  }
  else if (artist === ""){
    // console.log("song only")
     deezerApi = "http://api.deezer.com/search?q=track:"+ '"' + song +'"'
     flag = 1;
  }
  else if (song === ""){
    // console.log("artist only")
     deezerApi = "http://api.deezer.com/search?q=artist:"+ '"' + artist +'"'
     flag = 2;
  }
  else {
    // console.log("song & artist")
    // console.log("artist : " + artist)
    // console.log("song : " + song)
   deezerApi = "http://api.deezer.com/search?q=artist:"+ '"' + artist +'"'  +" track:"+ '"' + song +'"' 
   flag = 3;
  }
  //console.log(deezerApi)
  play(deezerApi, flag)
})


// dezzer api
function play(a , flag){
  
  
  var deezerApi = a
  console.log("play: " + deezerApi)
  var flag = flag;
  console.log(flag)

  $.ajax({
    headers : {"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS"},
    url : deezerApi,
    method: "GET"

  }).then(function(response){
    console.log(response)
    var result = response.data;
    
    for (var i = 0; i < 10; i++){
      playlistId[i] = result[i].id
      console.log ("he :" + playlistId[i])
      trackName[i] = result[i].title
      artistName[i] = result[i].artist.name
      album[i] = result[i].album.title
      writeUserData(playlistId[i],trackName[i],artistName[i],album[i])
      //writeUserData(playlistId[i])
      test();
    }
     // music()
    console.log (playlistId)
    //connectionRef.remove()
  })


}

function music(){
  $('#playDiv').append(
    "<iframe id='dzplayer' dztype='dzplayer' src='https://www.deezer.com/plugins/player?type=tracks&id=" + playlistId[1] + " &format=classic&color=007FEB&autoplay=true&playlist=true&width=700&height=240' scrolling='no' frameborder='0' style='border:none; overflow:hidden;' width='700' height='240' allowTransparency='true'></iframe>"
  )
}


function writeUserData(id,trackName,artist,album){
  connectionRef.push({
    id : id,
    trackName :trackName,
    artist : artist,
    album : album,
  })
}

function test() {
  $("#values").empty()
  connectionRef.on("child_added",function(snapshot){
//need to add #values
  $("#values").append(("<tr> " +
   " <td> " + snapshot.val().id +" </td> "+
   " <td> " + snapshot.val().trackName +" </td> "+
   " <td> " + snapshot.val().artist +" </td> "+
   " <td> " + snapshot.val().album +" </td> "+
   " <td> " + snapshot.val().year + "</td> "));

});

}
