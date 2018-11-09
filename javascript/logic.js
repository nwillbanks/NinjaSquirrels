
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
var playlistURL =[]
var trackName =[]
var artistName =[]
var album =[]
var year =[]
var database = firebase.database()
var a = '/connections_'+ Math.floor(Math.random()*1000)
//console.log("random : " + a)
var connectionRef = database.ref(a);
var connectedRef =  database.ref(".info/connected");
var counter=0;
var result;

// connectedRef.on("value", function(snap){
//   if (snap.val()){
//     //var con = connectionRef.push(true);
//     //console.log("this is :" + connectedRef )
//     //con.onDisconnect().remove()
    
//   }
// })

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
     deezerApi = "https://api.deezer.com/search?q=track:"+ '"' + song +'"'

  }
  else if (song === ""){
    // console.log("artist only")
     deezerApi = "https://api.deezer.com/search?q=artist:"+ '"' + artist +'"'
  }
  else {
    // console.log("song & artist")
    // console.log("artist : " + artist)
    // console.log("song : " + song)
   deezerApi = "https://api.deezer.com/search?q=artist:"+ '"' + artist +'"'  +" track:"+ '"' + song +'"' 
  }
  //console.log(deezerApi)
  play(deezerApi, flag)
  
})




// deezer api
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
    if(result == null){
      result = response.data;
      counter = 1;
    }else{
      counter = result.length+1;
      result = result.concat(response.data);
    }
  
    var background = result[0].artist.picture_xl
    $(".bg").css("background-image", 'url(' + background + ')')
    
    playMusic(result, result[counter].preview)
  // console.log (playlistId)
    //connectionRef.remove()
  })

}

function playMusic(result, mp3Path){
  
  music(mp3Path)

  var vid = document.getElementById("myAudio");
  // vid.onplaying = function() {
  //   alert("The video is now playing");
  // };
  vid.onended = function() {
    // alert("The audio has ended");
    //reading data from firebase
    playlistId = result[counter].id
      playlistURL = result[counter].preview
      trackName = result[counter].title
      artistName = result[counter].artist.name
      album = result[counter].album.title
    writeUserData(playlistURL,trackName,artistName,album)
    test(result[counter].title,result[counter].artist.name, result[counter].album.title);
    counter++;
    vid.src=result[counter].preview
  };
}
//insert media player into html
function music(mp3path){
  $('#playDiv').empty()
  // $('#playDiv').append(
  //   "<iframe id='dzplayer' dztype='dzplayer' src='https://www.deezer.com/plugins/player?type=tracks&id=" + playlistId[1] + " &format=classic&color=007FEB&autoplay=true&playlist=true&width=700&height=90' scrolling='no' frameborder='0' style='border:none; overflow:hidden;' width='700' height='90' allowTransparency='true'></iframe>"
  // )
  $('#playDiv').append(
    "<audio id='myAudio' controls autoplay><source src='"+mp3path+"' type='audio/mpeg'>Your browser does not support the audio element.</audio>"
  )

  
}

//define api values to be pulled
function writeUserData(playlistURL,trackName,artist,album){
  connectionRef.push({
    playlistURL :playlistURL,
    trackName : trackName,
    artist : artist,
    album : album,
  })
}

//pulling api values into table
function test(trackName, artist, album) {
  $("#values").prepend(("<tr id='playAgain' data-counter="+counter+" > " +
   " <td > " + trackName +" </td> "+
   " <td> " + artist +" </td> "+
   " <td> " + album +" </td> "
   ));
   $('#playAgain').on('click',function(){
    var vid = document.getElementById("myAudio");
    // vid.onplaying = function() {
    //   alert("The video is now playing");
    // };
      counter= $(this).data("counter")
      console.log("counter is :" + counter)
      //counter =;
      vid.src=result[counter].preview
  
  })
  // $("#values").empty()
  // connectionRef.on("child_added",function(snapshot){
  // $("#values").append(("<tr> " +
  //  " <td> " + snapshot.val().trackName +" </td> "+
  //  " <td> " + snapshot.val().artist +" </td> "+
  //  " <td> " + snapshot.val().album +" </td> "
  //  ));

// });

}






