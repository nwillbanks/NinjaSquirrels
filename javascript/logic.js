
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
var currTrack="";
var currArtist="";

// connectedRef.on("value", function(snap){
//   if (snap.val()){
//     //var con = connectionRef.push(true);
//     //console.log("this is :" + connectedRef )
//     //con.onDisconnect().remove()
    
//   }
// })

getCharts();

function getCharts(){
   $.ajax({
    headers : {"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS"},
    url : "http://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=10&country=us&f_has_lyrics=1&apikey=2538b3b1d406a3ddd6b776c21163d924",
    method: "GET"

  }).then(function(response){
    var respObject = JSON.parse(response)
    var size = respObject.message.body.track_list.length;
    $('#chartsValues').empty()
    for(var i=0; i < size; i++){
      var trackName = respObject.message.body.track_list[i].track.track_name;
      var album_name = respObject.message.body.track_list[i].track.album_name;
       var artist_name = respObject.message.body.track_list[i].track.artist_name;

       $("#chartsValues").append(("<tr> " +
   " <td > " + trackName +" </td> "+
   " <td> " + artist_name +" </td> "+
   " <td> " + album_name +" </td> "
   ));
    }
    

  })

}


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

//grabbing the artist from html
// $("#lyrics-tab").on("click",function(event){
//   event.preventDefault()
  
  
// })


function getLyrics(currArtist, currTrack){
  if(currArtist!=null && currArtist!="" && currTrack!=null && currTrack!=""){
     $.ajax({
    headers : {"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS"},
    url : "http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track="+currTrack+"&q_artist="+currArtist+"&apikey=2538b3b1d406a3ddd6b776c21163d924",
    method: "GET"

  }).then(function(response){
    var respObject = JSON.parse(response)
    var lyrics = respObject.message.body.lyrics.lyrics_body
    console.log (lyrics)
    $('#lyrics_body').empty()
    $('#lyrics_body').append(lyrics)
  })
}
}

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
      result = response.data.slice(1);
      counter = 0;
    }else{
      //newCounter = result.length+1;

      result = result.slice(0, counter).concat(response.data.slice(1)).concat(result.slice(counter));
      counter;
      result = result.concat(response.data);
    }
  
  
    playMusic(result, result[counter].preview)
  // console.log (playlistId)
    //connectionRef.remove()
  })

}

function playMusic(result, mp3Path){
  

  music(mp3Path);

  var vid = document.getElementById("myAudio");
  // vid.onplaying = function() {
  //   alert("The video is now playing");
  // };
  vid.onplaying = function() {
    // alert("The audio has ended");
    //reading data from firebase
      var background = result[counter].artist.picture_xl
    $(".bg").css("background-image", 'url(' + background + ')')
    

      currArtist = result[counter].artist.name;
  currTrack =   result[counter].title;
    getLyrics(currArtist, currTrack);


  };

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






