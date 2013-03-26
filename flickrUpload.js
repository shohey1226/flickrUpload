var flickrUpload = {} || flickrUpload;

flickrUpload = (function () {

  // hack sendAsBinary
  XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
       function byteValue(x) {
           return x.charCodeAt(0) & 0xff;
       }
       var ords = Array.prototype.map.call(datastr, byteValue);
       var ui8a = new Uint8Array(ords);
       this.send(ui8a.buffer);
  }

  //private variables
  var boundaryString = Math.floor(Math.random()*32768)+"asodijuuuuuuuu";
  var boundary1 = '--'+boundaryString;
  var boundary2 = '----'+boundaryString;
  var boundary3 = '----'+boundaryString+'--';

  // Create body to send
  function _createBody(oauth_keys, binary){
    var body = "";
    for( var key in oauth_keys){
      body +=_addOAuth(key, oauth_keys[key]);
    }
    body+=boundary2+'\r\n';
    body+='Content-Disposition: form-data; name="photo"; filename="a.jpeg"'+'\r\n'+'Content-Type: image/jpeg'+'\r\n'+  
    '\r\n'+
    binary+'\r\n'+
    boundary3+'\r\n';
    return body;
  }

  // Add OAuth parameters into body
  function _addOAuth(name, value) {
      var c = boundary2 + "\r\n"
      c += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
      c += value + "\r\n";
      return c;
  }

  // XHR Cross browser
  function _createHttpRequest(){
    var obj = null;
    try{ //Safari,Mozilla, Opera, IE 7〜
      obj = new XMLHttpRequest();
    }
    catch(e){
      try{ //IE6
        obj = new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch(e){
        try{ //IE 5,5.5
          obj = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(e){}
      }
    }
    return obj;
  }

  return {
    // Post the photo  
    post: function( oauth_keys, url, binary ) {
      var body = _createBody(oauth_keys, binary);
      var request= _createHttpRequest();
      request.open("POST",url,false);
      request.setRequestHeader("Content-Type","multipart/form-data;boundary="+boundary1);
      request.sendAsBinary(body);
      if(request.readyState == 4) {
        if(request.status == 200 || request.status == 201) {
          var x=request.responseXML.getElementsByTagName("photoid");
          return x[0].childNodes[0].nodeValue;
        } else {
          return "error";  
        }
      }
    }
  };
})();


